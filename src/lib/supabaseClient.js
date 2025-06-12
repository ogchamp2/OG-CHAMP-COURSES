import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://psdpnkxmvqshdpkjiwaf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZHBua3htdnFzaGRwa2ppd2FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2NDE2NTQsImV4cCI6MjA2NTIxNzY1NH0.XQE9xnRmSdvvB9voQlrHwpsK0-L9xOdUeWShGp9XKPo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);