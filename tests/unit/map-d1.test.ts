import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { handleRequest, type Env } from "../../cloudflare/worker";
import { exportD1 } from "../../scripts/export-d1";

const env: Env = {
  CLOUDFLARE_ACCOUNT_ID: "account",
  CLOUDFLARE_D1_DATABASE_ID: "database",
  CLOUDFLARE_API_TOKEN: "server-secret",
  ALLOWED_ORIGINS: "https://map.example.com",
};
const d1Response = (results: unknown[] = []) =>
  Response.json({
    success: true,
    result: [{ success: true, results }],
  });
afterEach(() => vi.unstubAllGlobals());

describe("D1 map API", () => {
  it("lists public notes using the server-side D1 REST token", async () => {
    const notes = [
      { hex_id: "0101", title: "Camp", content: "Safe", category: "news" },
    ];
    const fetchMock = vi.fn().mockResolvedValue(d1Response(notes));
    vi.stubGlobal("fetch", fetchMock);
    const response = await handleRequest(
      new Request("https://api.example.com/notes", {
        headers: { Origin: "https://map.example.com" },
      }),
      env,
    );
    expect(await response.json()).toEqual(notes);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
      "https://map.example.com",
    );
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.cloudflare.com/client/v4/accounts/account/d1/database/database/query",
    );
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe(
      "Bearer server-secret",
    );
  });

  it("binds note content as parameters, not SQL", async () => {
    const fetchMock = vi.fn().mockResolvedValue(d1Response());
    vi.stubGlobal("fetch", fetchMock);
    const response = await handleRequest(
      new Request("https://api.example.com/notes/0101", {
        method: "PUT",
        body: JSON.stringify({
          title: "Camp",
          content: "'); DROP TABLE hex_notes; --",
          category: "news",
        }),
      }),
      env,
    );
    expect(response.status).toBe(200);
    const query = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(query.sql).not.toContain("DROP TABLE");
    expect(query.params.slice(0, 4)).toEqual([
      "0101",
      "Camp",
      "'); DROP TABLE hex_notes; --",
      "news",
    ]);
  });

  it("rejects invalid categories and overlong notes before querying D1", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    for (const data of [
      { title: "Camp", content: "Safe", category: "invalid" },
      { title: "Camp", content: "x".repeat(10001), category: "news" },
      { title: "x".repeat(201), content: "Safe", category: "news" },
    ]) {
      const response = await handleRequest(
        new Request("https://api.example.com/notes/0101", {
          method: "PUT",
          body: JSON.stringify(data),
        }),
        env,
      );
      expect(response.status).toBe(400);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("deletes only the requested hex", async () => {
    const fetchMock = vi.fn().mockResolvedValue(d1Response());
    vi.stubGlobal("fetch", fetchMock);
    expect(
      (
        await handleRequest(
          new Request("https://api.example.com/notes/0101", {
            method: "DELETE",
          }),
          env,
        )
      ).status,
    ).toBe(200);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      sql: "DELETE FROM hex_notes WHERE hex_id = ?",
      params: ["0101"],
    });
  });

  it("retires private data endpoints without querying any service", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    for (const method of ["GET", "PUT"]) {
      const response = await handleRequest(
        new Request("https://api.example.com/user-data", { method }),
        env,
      );
      expect(response.status).toBe(404);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects disallowed origins", async () => {
    expect(
      (
        await handleRequest(
          new Request("https://api.example.com/notes", {
            headers: { Origin: "https://other.example.com" },
          }),
          env,
        )
      ).status,
    ).toBe(403);
  });

  it("does not expose upstream errors or secrets", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          Response.json({ success: false, errors: [{ message: "secret" }] }),
        ),
    );
    const logger = vi.spyOn(console, "error").mockImplementation(() => {});
    const response = await handleRequest(
      new Request("https://api.example.com/notes"),
      env,
    );
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ error: "Database request failed" });
    logger.mockRestore();
  });

  it("handles CORS preflight without accessing the database", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await handleRequest(
      new Request("https://api.example.com/notes/0101", {
        method: "OPTIONS",
        headers: { Origin: "https://map.example.com" },
      }),
      env,
    );
    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Headers")).toContain(
      "Content-Type",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON before querying D1", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const response = await handleRequest(
      new Request("https://api.example.com/notes/0101", {
        method: "PUT",
        body: "{",
      }),
      env,
    );
    expect(response.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("D1 schema and data migration", () => {
  it("imports only notes without changing IDs, text, or timestamps", () => {
    const db = new DatabaseSync(":memory:");
    try {
      db.exec(
        readFileSync(
          new URL("../../cloudflare/schema.sql", import.meta.url),
          "utf8",
        ),
      );
      const notes = [
        {
          hex_id: "0101",
          title: "Referee's camp",
          content: "'); DROP TABLE hex_notes; --",
          category: "news",
          updated_at: "2026-02-22T12:00:00Z",
        },
      ];
      const sql = exportD1(notes);
      db.exec(sql);
      db.exec(sql);
      expect(db.prepare("SELECT * FROM hex_notes").all()).toEqual([
        { ...notes[0], updated_at: "2026-02-22T12:00:00.000Z" },
      ]);
      expect(
        db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all(),
      ).toEqual([{ name: "hex_notes" }]);
      expect(() =>
        db
          .prepare(
            "INSERT INTO hex_notes (hex_id, content, category) VALUES (?, ?, ?)",
          )
          .run("0102", "x", "invalid"),
      ).toThrow();
    } finally {
      db.close();
    }
  });
});
