export interface ParkingSlot {
  id: string;
  slotNumber: string;
  floor: string;
  section: string;
  distance: string;
  power: string;
  price: string;
  status: 'available' | 'busy' | 'offline';
  amenities: string[];
  rating: number;
  reviews: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Mall Information
export const mallInfo = {
  name: "Grand Plaza Mall",
  address: "123 Shopping Boulevard, Downtown, CA 94102",
  totalSlots: 45,
  availableSlots: 28,
  floors: ["P1", "P2", "Ground Floor", "Rooftop"],
  sections: ["A", "B", "C", "D", "VIP"]
};

// User location within the mall
export const userLocation = {
  lat: 37.7749,
  lng: -122.4194
};

export const parkingSlots: ParkingSlot[] = [
  // Level P1 - Section A
  {
    id: 'slot-p1-a1',
    slotNumber: 'A1',
    floor: 'P1',
    section: 'A',
    distance: '50m',
    power: '150kW DC Fast',
    price: '$0.35/kWh',
    status: 'available',
    amenities: ['WiFi', 'Food Court', 'Restroom'],
    rating: 4.8,
    reviews: 45,
    coordinates: { lat: 37.7749, lng: -122.4190 }
  },
  {
    id: 'slot-p1-a2',
    slotNumber: 'A2',
    floor: 'P1',
    section: 'A',
    distance: '52m',
    power: '150kW DC Fast',
    price: '$0.35/kWh',
    status: 'available',
    amenities: ['WiFi', 'Food Court', 'Restroom'],
    rating: 4.8,
    reviews: 32,
    coordinates: { lat: 37.7750, lng: -122.4191 }
  },
  {
    id: 'slot-p1-a3',
    slotNumber: 'A3',
    floor: 'P1',
    section: 'A',
    distance: '55m',
    power: '150kW DC Fast',
    price: '$0.35/kWh',
    status: 'busy',
    amenities: ['WiFi', 'Food Court', 'Restroom'],
    rating: 4.7,
    reviews: 28,
    coordinates: { lat: 37.7751, lng: -122.4192 }
  },
  // Level P1 - Section B
  {
    id: 'slot-p1-b1',
    slotNumber: 'B1',
    floor: 'P1',
    section: 'B',
    distance: '75m',
    power: '200kW DC Fast',
    price: '$0.38/kWh',
    status: 'available',
    amenities: ['WiFi', 'Shopping', 'ATM'],
    rating: 4.9,
    reviews: 67,
    coordinates: { lat: 37.7748, lng: -122.4195 }
  },
  {
    id: 'slot-p1-b2',
    slotNumber: 'B2',
    floor: 'P1',
    section: 'B',
    distance: '78m',
    power: '200kW DC Fast',
    price: '$0.38/kWh',
    status: 'available',
    amenities: ['WiFi', 'Shopping', 'ATM'],
    rating: 4.8,
    reviews: 54,
    coordinates: { lat: 37.7747, lng: -122.4196 }
  },
  // VIP Section
  {
    id: 'slot-vip-1',
    slotNumber: 'VIP1',
    floor: 'Ground Floor',
    section: 'VIP',
    distance: '30m',
    power: '250kW DC Ultra Fast',
    price: '$0.45/kWh',
    status: 'available',
    amenities: ['WiFi', 'Premium Lounge', 'Valet Service', 'Concierge'],
    rating: 4.9,
    reviews: 89,
    coordinates: { lat: 37.7752, lng: -122.4188 }
  },
  {
    id: 'slot-vip-2',
    slotNumber: 'VIP2',
    floor: 'Ground Floor',
    section: 'VIP',
    distance: '32m',
    power: '250kW DC Ultra Fast',
    price: '$0.45/kWh',
    status: 'available',
    amenities: ['WiFi', 'Premium Lounge', 'Valet Service', 'Concierge'],
    rating: 4.9,
    reviews: 76,
    coordinates: { lat: 37.7753, lng: -122.4189 }
  },
  // Rooftop Level
  {
    id: 'slot-roof-1',
    slotNumber: 'R1',
    floor: 'Rooftop',
    section: 'A',
    distance: '120m',
    power: '180kW DC Fast',
    price: '$0.42/kWh',
    status: 'available',
    amenities: ['WiFi', 'Sky Lounge', 'City View', 'Fresh Air'],
    rating: 4.6,
    reviews: 34,
    coordinates: { lat: 37.7755, lng: -122.4185 }
  },
  {
    id: 'slot-roof-2',
    slotNumber: 'R2',
    floor: 'Rooftop',
    section: 'A',
    distance: '125m',
    power: '180kW DC Fast',
    price: '$0.42/kWh',
    status: 'available',
    amenities: ['WiFi', 'Sky Lounge', 'City View', 'Fresh Air'],
    rating: 4.5,
    reviews: 28,
    coordinates: { lat: 37.7756, lng: -122.4186 }
  },
  // Level P2
  {
    id: 'slot-p2-c1',
    slotNumber: 'C1',
    floor: 'P2',
    section: 'C',
    distance: '95m',
    power: '120kW DC Fast',
    price: '$0.32/kWh',
    status: 'available',
    amenities: ['WiFi', 'Cinema Access', 'Game Zone'],
    rating: 4.4,
    reviews: 42,
    coordinates: { lat: 37.7745, lng: -122.4198 }
  },
  {
    id: 'slot-p2-c2',
    slotNumber: 'C2',
    floor: 'P2',
    section: 'C',
    distance: '98m',
    power: '120kW DC Fast',
    price: '$0.32/kWh',
    status: 'offline',
    amenities: ['WiFi', 'Cinema Access', 'Game Zone'],
    rating: 4.3,
    reviews: 38,
    coordinates: { lat: 37.7744, lng: -122.4199 }
  }
];

// Calculate distance between two coordinates (simplified)
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Find nearest parking slots
export const findNearestSlots = (
  userLat: number,
  userLng: number,
  slots: ParkingSlot[] = parkingSlots
): ParkingSlot[] => {
  return slots
    .map(slot => ({
      ...slot,
      calculatedDistance: calculateDistance(
        userLat,
        userLng,
        slot.coordinates.lat,
        slot.coordinates.lng
      )
    }))
    .sort((a, b) => a.calculatedDistance - b.calculatedDistance)
    .map(({ calculatedDistance, ...slot }) => slot);
};