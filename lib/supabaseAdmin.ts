import { createClient } from "@supabase/supabase-js";

const supabaseUrl: string = process.env.SUPABASE_URL || "";
const supabaseServiceKey: string = process.env.SUPABASE_SERVICE_KEY || "";
// const supabaseClientKey: string = process.env.SUPABASE_CLIENT_KEY || "";

const SupabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export { SupabaseAdmin };
