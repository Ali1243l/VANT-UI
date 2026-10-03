import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseUrl !== 'MY_SUPABASE_URL'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Format price with Western numerals and configurable currency (e.g. "95,000 د.ع" or "95,000 IQD")
 */
export function formatPrice(price: number, currency: string = 'د.ع'): string {
  if (typeof price !== 'number' || isNaN(price)) return `0 ${currency}`;
  const normalizedCurrency = currency === 'ar' ? 'د.ع' : currency === 'en' ? 'IQD' : (currency || 'د.ع');
  const formattedNumber = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(price);

  return `${formattedNumber} ${normalizedCurrency}`;
}
