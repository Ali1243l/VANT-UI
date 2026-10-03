import { useEffect, useState, useCallback } from 'react';
import type { Product } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MOCK_PRODUCTS } from '../data/mockProducts';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLiveDatabase, setIsLiveDatabase] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setProducts(MOCK_PRODUCTS);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: sbError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (sbError) {
        console.warn('Supabase query error, falling back to mock catalog:', sbError.message);
        setProducts(MOCK_PRODUCTS);
        setIsLiveDatabase(false);
      } else if (data && data.length > 0) {
        setProducts(data as Product[]);
        setIsLiveDatabase(true);
      } else {
        // Table exists but is empty
        setProducts(MOCK_PRODUCTS);
        setIsLiveDatabase(true);
      }
    } catch (err: unknown) {
      console.warn('Failed to load products from remote database:', err);
      setProducts(MOCK_PRODUCTS);
      setIsLiveDatabase(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    isLiveDatabase,
    refresh: fetchProducts,
  };
}
