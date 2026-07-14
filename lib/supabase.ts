import { createClient } from "@supabase/supabase-js";

function getEnvVariable(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing ${name} in .env.local.`);
  }

  return value;
}

export function getSupabaseServerClient() {
  return createClient(
    getEnvVariable("NEXT_PUBLIC_SUPABASE_URL"),
    getEnvVariable("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    {
      auth: {
        persistSession: false,
      },
    },
  );
}
