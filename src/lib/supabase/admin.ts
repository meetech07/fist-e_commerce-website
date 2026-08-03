/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@supabase/supabase-js";

let admin: ReturnType<typeof createClient<any, "public", "public">> | null = null;

export function createAdminClient() {
  if (admin) return admin;
  admin = createClient<any, "public", "public">(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
  return admin;
}
