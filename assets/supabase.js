const { createClient } = supabase;

const SUPABASE_URL = "https://blxgqdfjzuajonxovlaa.supabase.co";
const SUPABASE_KEY = "sb_publishable_Bx16YWPtI1zRdyH9kNG--w_R652NzsV";

const supabaseClient = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);