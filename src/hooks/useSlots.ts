// src/hooks/useSlots.ts
import { useEffect, useState } from 'react';

export function useSlots() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSlots = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/slots/available');
      const data = await res.json();
      setSlots(data);
    } catch (err) {
      console.error('Failed to fetch slots', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  return { slots, loading, refetch: fetchSlots };
}
