import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-password",
};

// Allowed tables and the columns the admin may write on each.
const WRITABLE: Record<string, string[]> = {
  editorial_projects: ["slug", "title", "subtitle", "thumbnail", "year", "sort_order", "published"],
  editorial_images: ["project_slug", "src", "src_large", "aspect_ratio", "sort_order", "name", "copyright"],
  journey_projects: ["slug", "title", "thumbnail", "sort_order", "published"],
  journey_images: ["project_slug", "src", "src_large", "aspect_ratio", "sort_order", "name", "copyright"],
  notes_images: ["src", "src_large", "aspect_ratio", "year", "sort_order", "name", "copyright"],
  landing_images: ["src", "aspect_ratio", "layout", "name", "year", "sort_order", "published", "copyright"],
  site_settings: ["value"],
};

class BadRequest extends Error {}

function pick(table: string, row: unknown): Record<string, unknown> {
  if (!row || typeof row !== "object" || Array.isArray(row)) throw new BadRequest("Invalid data");
  const allowed = WRITABLE[table];
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row as Record<string, unknown>)) {
    if (!allowed.includes(k)) throw new BadRequest(`Field not allowed: ${k}`);
    out[k] = v;
  }
  return out;
}

const validId = (v: unknown) => Number.isInteger(v) && (v as number) > 0;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const expected = Deno.env.get("ADMIN_PASSWORD");
  const password = req.headers.get("x-admin-password");
  if (!expected || password !== expected) {
    return err("Unauthorized", 401);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { action, table, data, id, ids, updates } = await req.json();

    if (action === "ping") return json({ ok: true });

    if (action === "signed_upload") {
      const path = String(data?.path || "");
      if (!/^[a-z0-9._-]{1,200}\.webp$/.test(path)) return err("Invalid path", 400);
      const { data: result, error } = await supabase.storage.from("images").createSignedUploadUrl(path);
      if (error) throw error;
      return json(result);
    }

    if (typeof table !== "string" || !(table in WRITABLE)) return err("Invalid table", 400);

    switch (action) {
      case "insert": {
        if (table === "site_settings") return err("Invalid action", 400);
        const rows = Array.isArray(data) ? data.map((r) => pick(table, r)) : pick(table, data);
        const { data: result, error } = await supabase.from(table).insert(rows).select();
        if (error) throw error;
        return json(result);
      }

      case "update": {
        if (table === "site_settings") {
          if (typeof id !== "string" || !/^[a-z_]{1,64}$/.test(id)) return err("Invalid key", 400);
          const clean = pick(table, data);
          const { data: result, error } = await supabase
            .from(table).upsert({ key: id, ...clean }, { onConflict: "key" }).select();
          if (error) throw error;
          return json(result);
        }
        if (!validId(id)) return err("Invalid id", 400);
        const { data: result, error } = await supabase.from(table).update(pick(table, data)).eq("id", id).select();
        if (error) throw error;
        return json(result);
      }

      case "delete": {
        if (table === "site_settings" || !validId(id)) return err("Invalid request", 400);
        const { error } = await supabase.from(table).delete().eq("id", id);
        if (error) throw error;
        return json({ success: true });
      }

      case "reorder": {
        if (table === "site_settings" || !Array.isArray(ids) || !ids.every(validId)) return err("Invalid ids", 400);
        for (let i = 0; i < ids.length; i++) {
          const { error } = await supabase.from(table).update({ sort_order: i }).eq("id", ids[i]);
          if (error) throw error;
        }
        return json({ success: true });
      }

      case "bulk_update": {
        if (table === "site_settings" || !Array.isArray(updates)) return err("Invalid updates", 400);
        for (const u of updates) {
          if (!validId(u?.id)) return err("Invalid id", 400);
          const { error } = await supabase.from(table).update(pick(table, u.data)).eq("id", u.id);
          if (error) throw error;
        }
        return json({ success: true });
      }

      default:
        return err("Unknown action", 400);
    }
  } catch (e) {
    if (e instanceof BadRequest) return err(e.message, 400);
    console.error(e);
    return err("Request failed", 500);
  }

  function json(data: unknown) {
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  function err(message: string, status: number) {
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
