import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// Make sure to use a reliable and versioned import for bcryptjs
// Example: esm.sh is a popular CDN for ES modules.
// Always vet your import sources for security and stability.
import bcrypt from "https://esm.sh/bcryptjs@2.4.3";

// CORS headers - adjust origin to your app's deployed URL for production
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Or "https://your-app-domain.com"
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

console.log("Edge function 'verify-cost-builder-password' is up and running!");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { password: attemptedPassword } = await req.json();

    if (!attemptedPassword) {
      return new Response(
        JSON.stringify({ error: "Password is required" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Retrieve the stored hashed password from environment variables
    const storedHashedPassword = Deno.env.get("COST_BUILDER_HASHED_PASSWORD");

    if (!storedHashedPassword) {
      console.error("COST_BUILDER_HASHED_PASSWORD environment variable not set.");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    // Compare the attempted password with the stored hash
    const isValid = bcrypt.compareSync(attemptedPassword, storedHashedPassword);

    if (isValid) {
      return new Response(
        JSON.stringify({ authenticated: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
      );
    } else {
      return new Response(
        JSON.stringify({ authenticated: false, error: "Invalid password" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 },
      );
    }
  } catch (error) {
    console.error("Error in Edge Function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
