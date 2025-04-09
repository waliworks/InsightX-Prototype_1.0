
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://qtmggatfngtldfeeqjxc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0bWdnYXRmbmd0bGRmZWVxanhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNjQ3ODgsImV4cCI6MjA1OTc0MDc4OH0.qC0TZf6heOxyajvqX-o6a-sWQPDTce6qAwZ_TgZ_1P0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
