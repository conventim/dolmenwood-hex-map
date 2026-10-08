export interface Env {
  CLOUDFLARE_ACCOUNT_ID: string;
  CLOUDFLARE_D1_DATABASE_ID: string;
  CLOUDFLARE_API_TOKEN: string;
  ALLOWED_ORIGINS: string;
}

interface QueryResult {
  success: boolean;
  results?: unknown[];
}

async function query(env: Env, sql: string, params: string[] = []) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(env.CLOUDFLARE_ACCOUNT_ID)}/d1/database/${encodeURIComponent(env.CLOUDFLARE_D1_DATABASE_ID)}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
    },
  );
  const body = (await response.json()) as {
    success: boolean;
    result?: QueryResult[];
  };
  if (!response.ok || !body.success || !body.result?.[0]?.success) {
    throw new Error("D1 query failed");
  }
  return body.result[0].results ?? [];
}

export async function handleRequest(
  request: Request,
  env: Env,
): Promise<Response> {
  const origin = request.headers.get("Origin");
  const allowed = env.ALLOWED_ORIGINS.split(",").map((value) => value.trim());
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    Vary: "Origin",
  };
  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers });
  if (origin && !allowed.includes(origin))
    return json({ error: "Origin not allowed" }, 403);
  if (origin) headers["Access-Control-Allow-Origin"] = origin;
  headers["Access-Control-Allow-Methods"] = "GET, PUT, DELETE, OPTIONS";
  headers["Access-Control-Allow-Headers"] = "Content-Type";
  if (request.method === "OPTIONS")
    return new Response(null, { status: 204, headers });

  try {
    const path = new URL(request.url).pathname.replace(/\/$/, "");
    if (path === "/notes" && request.method === "GET") {
      return json(
        await query(
          env,
          "SELECT hex_id, title, content, category FROM hex_notes",
        ),
      );
    }
    const note = /^\/notes\/(\d{4})$/.exec(path);
    if (note && request.method === "DELETE") {
      await query(env, "DELETE FROM hex_notes WHERE hex_id = ?", [note[1]]);
      return json({ success: true });
    }
    if (note && request.method === "PUT") {
      if (Number(request.headers.get("Content-Length")) > 100000)
        return json({ error: "Request too large" }, 413);
      const body = await request.text();
      if (body.length > 100000)
        return json({ error: "Request too large" }, 413);
      const data = JSON.parse(body) as Record<string, unknown> | null;
      if (
        !data ||
        typeof data.title !== "string" ||
        Array.from(data.title).length > 200 ||
        typeof data.content !== "string" ||
        Array.from(data.content).length > 10000 ||
        typeof data.category !== "string" ||
        !["explored", "news", "useful_places"].includes(data.category)
      )
        return json({ error: "Invalid note" }, 400);
      await query(
        env,
        "INSERT INTO hex_notes (hex_id, title, content, category, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(hex_id) DO UPDATE SET title = excluded.title, content = excluded.content, category = excluded.category, updated_at = excluded.updated_at",
        [
          note[1],
          data.title,
          data.content,
          data.category,
          new Date().toISOString(),
        ],
      );
      return json({ success: true });
    }
    return json({ error: "Not found" }, 404);
  } catch (error) {
    if (error instanceof SyntaxError)
      return json({ error: "Invalid JSON" }, 400);
    console.error("Map API request failed", error);
    return json({ error: "Database request failed" }, 502);
  }
}

export default { fetch: handleRequest };
