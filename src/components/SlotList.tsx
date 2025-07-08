// src/components/SlotList.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLiveSlotUpdates } from '@/hooks/useLiveSlotUpdates';

interface Slot {
  _id: string;
  slotNumber: string;
  floor: string;
  section: string;
  power: string;
  price: string;
  status: 'available' | 'busy' | 'offline';
}

export const SlotList = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const { liveSlots } = useLiveSlotUpdates();

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await axios.get<Slot[]>('http://localhost:5000/api/slots');
        setSlots(response.data);
      } catch (error) {
        console.error('Error fetching slots:', error);
      }
    };

    fetchSlots();
  }, []);

  useEffect(() => {
    if (liveSlots.length > 0) {
      setSlots((prevSlots) =>
        prevSlots.map((slot) => {
          const updated = liveSlots.find((s) => s._id === slot._id);
          return updated ? updated : slot;
        })
      );
    }
  }, [liveSlots]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {slots.map((slot) => (
        <div
          key={slot._id}
          className={`border rounded-lg p-4 shadow ${
            slot.status === 'available'
              ? 'bg-green-100'
              : slot.status === 'busy'
              ? 'bg-yellow-100'
              : 'bg-gray-300'
          }`}
        >
          <h3 className="text-xl font-bold">Slot {slot.slotNumber}</h3>
          <p><strong>Status:</strong> {slot.status}</p>
          <p><strong>Floor:</strong> {slot.floor}</p>
          <p><strong>Section:</strong> {slot.section}</p>
          <p><strong>Power:</strong> {slot.power}</p>
          <p><strong>Price:</strong> {slot.price}</p>
        </div>
      ))}
    </div>
  );
};