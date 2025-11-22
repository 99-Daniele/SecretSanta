import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const EventContext = createContext({});

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setEvents(data || []);
      return { data, error: null };
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Fetch event by ID
  const fetchEventById = async (eventId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (error) throw error;

      setCurrentEvent(data);
      return { data, error: null };
    } catch (err) {
      console.error('Error fetching event:', err);
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Fetch event by code (for participants)
  const fetchEventByCode = async (eventCode) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('event_code', eventCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (err) {
      console.error('Error fetching event by code:', err);
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Create new event
  const createEvent = async (eventData) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;

      setEvents([data, ...events]);
      setCurrentEvent(data);
      return { data, error: null };
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Update event
  const updateEvent = async (eventId, updates) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', eventId)
        .select()
        .single();

      if (error) throw error;

      setCurrentEvent(data);
      setEvents(events.map(e => e.id === eventId ? data : e));
      return { data, error: null };
    } catch (err) {
      console.error('Error updating event:', err);
      setError(err.message);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  // Delete event
  const deleteEvent = async (eventId) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      setEvents(events.filter(e => e.id !== eventId));
      if (currentEvent?.id === eventId) {
        setCurrentEvent(null);
      }
      return { error: null };
    } catch (err) {
      console.error('Error deleting event:', err);
      setError(err.message);
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentEvent,
    setCurrentEvent,
    events,
    loading,
    error,
    fetchEvents,
    fetchEventById,
    fetchEventByCode,
    createEvent,
    updateEvent,
    deleteEvent,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

export default EventContext;
