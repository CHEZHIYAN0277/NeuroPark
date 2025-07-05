export interface ChargingStation {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distance: string;
  power: string;
  price: string;
  availableSlots: number;
  totalSlots: number;
  amenities: string[];
  status: 'available' | 'busy' | 'offline';
  rating: number;
  reviews: number;
}

// Mock user location (San Francisco)
export const userLocation = {
  lat: 37.7749,
  lng: -122.4194
};

export const chargingStations: ChargingStation[] = [
  {
    id: 'station-1',
    name: 'Grand Plaza Mall - Level P1',
    address: 'North Wing Parking, Level P1, Section A, San Francisco, CA 94102',
    coordinates: { lat: 37.7849, lng: -122.4094 },
    distance: '0.2 miles',
    power: '150kW DC Fast',
    price: '$0.35/kWh',
    availableSlots: 3,
    totalSlots: 8,
    amenities: ['WiFi', 'Food Court', 'Shopping', 'Restroom', 'ATM'],
    status: 'available',
    rating: 4.8,
    reviews: 156
  },
  {
    id: 'station-2',
    name: 'Luxury Mall - VIP Parking',
    address: 'VIP Section, Ground Floor, Near Main Entrance, San Francisco, CA 94108',
    coordinates: { lat: 37.7649, lng: -122.4294 },
    distance: '0.5 miles',
    power: '250kW DC Ultra Fast',
    price: '$0.45/kWh',
    availableSlots: 2,
    totalSlots: 4,
    amenities: ['WiFi', 'Premium Lounge', 'Fine Dining', 'Valet Service', 'Concierge'],
    status: 'available',
    rating: 4.9,
    reviews: 203
  },
  {
    id: 'station-3',
    name: 'City Center Mall - East Wing',
    address: 'East Wing Parking, Level 1, Zone C, San Francisco, CA 94158',
    coordinates: { lat: 37.7549, lng: -122.3994 },
    distance: '0.7 miles',
    power: '200kW DC Fast',
    price: '$0.38/kWh',
    availableSlots: 4,
    totalSlots: 6,
    amenities: ['WiFi', 'Cinema', 'Food Court', 'Shopping', 'Kids Zone'],
    status: 'available',
    rating: 4.7,
    reviews: 124
  },
  {
    id: 'station-4',
    name: 'Metro Mall - Underground',
    address: 'Underground Parking, Level B2, Section D, San Francisco, CA 94111',
    coordinates: { lat: 37.7879, lng: -122.4075 },
    distance: '0.9 miles',
    power: '120kW DC Fast',
    price: '$0.32/kWh',
    availableSlots: 0,
    totalSlots: 5,
    amenities: ['WiFi', 'Shopping', 'Express Cafe'],
    status: 'busy',
    rating: 4.4,
    reviews: 67
  },
  {
    id: 'station-5',
    name: 'Premium Outlets - Rooftop',
    address: 'Rooftop Level, Premium Zone, Slots R1-R6, San Francisco, CA 94133',
    coordinates: { lat: 37.7949, lng: -122.4024 },
    distance: '1.1 miles',
    power: '180kW DC Fast',
    price: '$0.42/kWh',
    availableSlots: 5,
    totalSlots: 6,
    amenities: ['WiFi', 'Sky Lounge', 'Outlet Shopping', 'Spa Services'],
    status: 'available',
    rating: 4.6,
    reviews: 89
  },
  {
    id: 'station-6',
    name: 'Waterfront Mall - Pier View',
    address: 'Pier View Deck, Level 3, Bay Side, San Francisco, CA 94107',
    coordinates: { lat: 37.8079, lng: -122.4094 },
    distance: '1.5 miles',
    power: '150kW DC Fast',
    price: '$0.40/kWh',
    availableSlots: 6,
    totalSlots: 10,
    amenities: ['WiFi', 'Ocean View', 'Seafood Restaurant', 'Aquarium', 'Tourist Info'],
    status: 'available',
    rating: 4.8,
    reviews: 145
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

// Find nearest charging stations
export const findNearestStations = (
  userLat: number,
  userLng: number,
  stations: ChargingStation[] = chargingStations
): ChargingStation[] => {
  return stations
    .map(station => ({
      ...station,
      calculatedDistance: calculateDistance(
        userLat,
        userLng,
        station.coordinates.lat,
        station.coordinates.lng
      )
    }))
    .sort((a, b) => a.calculatedDistance - b.calculatedDistance)
    .map(({ calculatedDistance, ...station }) => ({
      ...station,
      distance: `${calculatedDistance.toFixed(1)} miles`
    }));
};