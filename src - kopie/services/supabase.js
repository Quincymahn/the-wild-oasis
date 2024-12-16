import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://zuepnemyqvjvtfydtmsk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1ZXBuZW15cXZqdnRmeWR0bXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5NjY0NDMsImV4cCI6MjA0ODU0MjQ0M30.qK8b4_1zMAi5aU-Q9W9kbochl6rxrswl6AlI1IiTDig";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
