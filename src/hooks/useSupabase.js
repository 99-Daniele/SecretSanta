import { useState, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';

/**
 * Custom hook for Supabase database operations
 * Provides generic CRUD operations with loading and error states
 */
export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generic SELECT query
  const select = useCallback(async (table, options = {}) => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from(table).select(options.select || '*');

      // Apply filters
      if (options.eq) {
        Object.entries(options.eq).forEach(([column, value]) => {
          query = query.eq(column, value);
        });
      }

      if (options.order) {
        query = query.order(options.order.column, { 
          ascending: options.order.ascending ?? true 
        });
      }

      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.single) {
        const { data, error } = await query.single();
        if (error) throw error;
        return { data, error: null };
      }

      const { data, error } = await query;
      if (error) throw error;

      return { data, error: null };
    } catch (err) {
      console.error(`Error selecting from ${table}:`, err);
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  // Generic INSERT query
  const insert = useCallback(async (table, data) => {
    try {
      setLoading(true);
      setError(null);

      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select();

      if (error) throw error;

      return { data: result, error: null };
    } catch (err) {
      console.error(`Error inserting into ${table}:`, err);
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  // Generic UPDATE query
  const update = useCallback(async (table, id, updates) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;

      return { data, error: null };
    } catch (err) {
      console.error(`Error updating ${table}:`, err);
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  // Generic DELETE query
  const remove = useCallback(async (table, id) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { error: null };
    } catch (err) {
      console.error(`Error deleting from ${table}:`, err);
      setError(err.message);
      return { error: err };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    select,
    insert,
    update,
    remove,
  };
};
