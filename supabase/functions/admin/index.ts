import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-password",
};

const ADMIN_PASSWORD = "jankhur2024";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Check admin password
  const password = req.headers.get("x-admin-password");
  if (password !== ADMIN_PASSWORD) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { action, table, data, id, ids, updates } = await req.json();

    switch (action) {
      case "insert": {
        const { data: result, error } = await supabase
          .from(table)
          .insert(data)
          .select();
        if (error) throw error;
        return json(result);
      }

      case "update": {
        const { data: result, error } = await supabase
          .from(table)
          .update(data)
          .eq("id", id)
          .select();
        if (error) throw error;
        return json(result);
      }

      case "delete": {
        const { error } = await supabase.from(table).delete().eq("id", id);
        if (error) throw error;
        return json({ success: true });
      }

      case "reorder": {
        // ids is an array of IDs in the new order
        for (let i = 0; i < ids.length; i++) {
          const { error } = await supabase
            .from(table)
            .update({ sort_order: i })
            .eq("id", ids[i]);
          if (error) throw error;
        }
        return json({ success: true });
      }

      case "bulk_update": {
        // updates is an array of { id, data } objects
        for (const u of updates) {
          const { error } = await supabase
            .from(table)
            .update(u.data)
            .eq("id", u.id);
          if (error) throw error;
        }
        return json({ success: true });
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  function json(data: unknown) {
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
