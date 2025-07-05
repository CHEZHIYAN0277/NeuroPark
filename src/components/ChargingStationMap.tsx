import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Zap, 
  Star, 
  Navigation,
  Clock,
  DollarSign,
  Wifi,
  Coffee,
  ShoppingBag,
  Car
} from "lucide-react";
import { chargingStations, findNearestStations, userLocation, type ChargingStation } from "@/data/chargingStations";

interface ChargingStationMapProps {
  onStationSelect: (station: ChargingStation) => void;
  selectedStation?: ChargingStation | null;
}

const ChargingStationMap = ({ onStationSelect, selectedStation }: ChargingStationMapProps) => {
  const [sortBy, setSortBy] = useState<'distance' | 'price' | 'power'>('distance');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const filteredStations = chargingStations
    .filter(station => !showAvailableOnly || station.status === 'available')
    .sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        case 'price':
          return parseFloat(a.price.replace('$', '').replace('/kWh', '')) - 
                 parseFloat(b.price.replace('$', '').replace('/kWh', ''));
        case 'power':
          return parseInt(b.power.replace('kW', '')) - parseInt(a.power.replace('kW', ''));
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-secondary text-secondary-foreground';
      case 'busy': return 'bg-yellow-500 text-yellow-50';
      case 'offline': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="h-3 w-3" />;
      case 'cafe': case 'food court': case 'restaurant': return <Coffee className="h-3 w-3" />;
      case 'shopping': return <ShoppingBag className="h-3 w-3" />;
      default: return null;
    }
  };

  const nearestStation = findNearestStations(userLocation.lat, userLocation.lng)[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Map Section */}
      <div className="lg:col-span-2">
        <Card className="shadow-electric">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Charging Station Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Simulated Map */}
            <div className="relative h-96 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden border-2 border-border">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZGRkIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
              
              {/* User Location */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="h-4 w-4 bg-primary rounded-full border-2 border-white shadow-lg animate-pulse-glow"></div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium bg-primary text-primary-foreground px-2 py-1 rounded">
                    You
                  </div>
                </div>
              </div>

              {/* Charging Stations */}
              {filteredStations.slice(0, 6).map((station, index) => {
                const positions = [
                  { top: '20%', left: '70%' },
                  { top: '40%', left: '25%' },
                  { top: '70%', left: '80%' },
                  { top: '30%', left: '85%' },
                  { top: '80%', left: '30%' },
                  { top: '15%', left: '40%' }
                ];
                
                const position = positions[index] || { top: '50%', left: '50%' };
                
                return (
                  <div
                    key={station.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    style={{ top: position.top, left: position.left }}
                    onClick={() => onStationSelect(station)}
                  >
                    <div className={`relative group ${selectedStation?.id === station.id ? 'z-10' : ''}`}>
                      <div className={`h-6 w-6 rounded-full border-2 border-white shadow-lg transition-all duration-200 ${
                        station.status === 'available' ? 'bg-secondary' :
                        station.status === 'busy' ? 'bg-yellow-500' : 'bg-destructive'
                      } ${selectedStation?.id === station.id ? 'scale-125 animate-pulse-glow' : 'group-hover:scale-110'}`}>
                        <Zap className="h-3 w-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-card border rounded-lg p-2 shadow-lg min-w-max z-20">
                        <p className="text-xs font-medium">{station.name}</p>
                        <p className="text-xs text-muted-foreground">{station.distance}</p>
                        <p className="text-xs text-secondary">{station.availableSlots} slots</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map Controls */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant={sortBy === 'distance' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('distance')}
              >
                <Navigation className="h-4 w-4 mr-1" />
                Distance
              </Button>
              <Button
                variant={sortBy === 'price' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('price')}
              >
                <DollarSign className="h-4 w-4 mr-1" />
                Price
              </Button>
              <Button
                variant={sortBy === 'power' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('power')}
              >
                <Zap className="h-4 w-4 mr-1" />
                Power
              </Button>
              <Button
                variant={showAvailableOnly ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowAvailableOnly(!showAvailableOnly)}
              >
                Available Only
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stations List */}
      <div className="space-y-4">
        {/* AI Recommendation */}
        {nearestStation && (
          <Card className="shadow-glow border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
                <Zap className="h-4 w-4" />
                AI Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <p className="font-semibold">{nearestStation.name}</p>
                <p className="text-sm text-muted-foreground">{nearestStation.distance} away</p>
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-electric hover:shadow-glow"
                  onClick={() => onStationSelect(nearestStation)}
                >
                  Select Nearest
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stations List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredStations.map((station) => (
            <Card 
              key={station.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-energy ${
                selectedStation?.id === station.id ? 'ring-2 ring-primary shadow-electric' : ''
              }`}
              onClick={() => onStationSelect(station)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{station.name}</h3>
                      <p className="text-xs text-muted-foreground">{station.address}</p>
                    </div>
                    <Badge className={getStatusColor(station.status)} variant="secondary">
                      {station.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <Navigation className="h-3 w-3 text-muted-foreground" />
                      <span>{station.distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-muted-foreground" />
                      <span>{station.power}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      <span>{station.price}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Car className="h-3 w-3 text-muted-foreground" />
                      <span>{station.availableSlots}/{station.totalSlots}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span className="text-xs">{station.rating}</span>
                      <span className="text-xs text-muted-foreground">({station.reviews})</span>
                    </div>
                    <div className="flex gap-1">
                      {station.amenities.slice(0, 3).map((amenity, idx) => (
                        <div key={idx} className="text-muted-foreground" title={amenity}>
                          {getAmenityIcon(amenity)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChargingStationMap;