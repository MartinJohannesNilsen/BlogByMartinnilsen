import { createClient } from "@supabase/supabase-js";

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey: string =
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY || "";
// const supabaseClientKey: string = process.env.NEXT_PUBLIC_SUPABASE_CLIENT_KEY || "";

const SupabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export { SupabaseAdmin };
