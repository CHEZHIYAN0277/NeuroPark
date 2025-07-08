// src/pages/Slots.tsx
import { useSlots } from "@/hooks/useSlots";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Slots() {
  const { slots, loading, refetch } = useSlots();

  if (loading) return <div className="text-center mt-10">Loading slots...</div>;

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {slots.map((slot: any) => (
        <Card key={slot._id} className="bg-white shadow-md border border-gray-200">
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold">{slot.slotNumber}</h2>
            <p>Floor: {slot.floor}</p>
            <p>Section: {slot.section}</p>
            <p>Price: ₹{slot.price}</p>
            <p>Status: <span className={`font-bold ${slot.status === 'available' ? 'text-green-600' : 'text-red-600'}`}>{slot.status}</span></p>
            <Button className="mt-4" disabled={slot.status !== 'available'}>
              Book Slot
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
