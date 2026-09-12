import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dgjromtddlvifasmbqin.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_i9ZZX4KGxM7sMrWRL5nUSg_vNwV9HNJ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

