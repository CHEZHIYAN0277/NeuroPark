import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "@/components/ThemeToggle";
import ChatInterface from "@/components/ChatInterface";
import { 
  Zap, 
  MapPin, 
  Star, 
  Navigation,
  Clock,
  DollarSign,
  Car,
  Wifi,
  Coffee,
  ShoppingBag,
  Users,
  MessageCircle,
  Building2
} from "lucide-react";
import { parkingSlots, mallInfo, findNearestSlots, userLocation, type ParkingSlot } from "@/data/parkingSlots";

const Index = () => {
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [filterFloor, setFilterFloor] = useState<string>('all');
  const [filterSection, setFilterSection] = useState<string>('all');

  const handleSlotSelect = (slot: ParkingSlot) => {
    setSelectedSlot(slot);
  };

  const handleBookNow = () => {
    if (selectedSlot) {
      navigate("/booking", { state: { selectedSlot } });
    }
  };

  // Filter slots based on selected filters
  const filteredSlots = parkingSlots.filter(slot => {
    const floorMatch = filterFloor === 'all' || slot.floor === filterFloor;
    const sectionMatch = filterSection === 'all' || slot.section === filterSection;
    return floorMatch && sectionMatch;
  }).filter(slot => slot.status !== 'offline');

  // AI Recommendation - find the nearest available slot
  const nearestSlots = findNearestSlots(userLocation.lat, userLocation.lng, filteredSlots.filter(slot => slot.status === 'available'));
  const recommendedSlot = nearestSlots[0];

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="h-4 w-4" />;
      case 'cafe': case 'food court': case 'restaurant': return <Coffee className="h-4 w-4" />;
      case 'shopping': return <ShoppingBag className="h-4 w-4" />;
      case 'restroom': return <Users className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-glow/5 to-secondary/10">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold bg-gradient-electric bg-clip-text text-transparent mb-2">
                {mallInfo.name}
              </h1>
              <p className="text-muted-foreground text-lg flex items-center justify-center gap-2">
                <Building2 className="h-5 w-5" />
                EV Charging Hub - {mallInfo.availableSlots} of {mallInfo.totalSlots} slots available
              </p>
              <p className="text-sm text-muted-foreground mt-1">{mallInfo.address}</p>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsChatOpen(true)}
                className="relative"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Controls */}
        <Card className="shadow-energy mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Floor:</label>
                <select 
                  value={filterFloor} 
                  onChange={(e) => setFilterFloor(e.target.value)}
                  className="px-3 py-1 border rounded-md bg-background text-foreground"
                >
                  <option value="all">All Floors</option>
                  {mallInfo.floors.map(floor => (
                    <option key={floor} value={floor}>{floor}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Section:</label>
                <select 
                  value={filterSection} 
                  onChange={(e) => setFilterSection(e.target.value)}
                  className="px-3 py-1 border rounded-md bg-background text-foreground"
                >
                  <option value="all">All Sections</option>
                  {mallInfo.sections.map(section => (
                    <option key={section} value={section}>Section {section}</option>
                  ))}
                </select>
              </div>
              <Badge className="bg-primary/10 text-primary">
                {filteredSlots.length} slots available
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendation */}
        {recommendedSlot && (
          <Card className="shadow-glow border-primary/20 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Zap className="h-5 w-5" />
                AI Recommendation - Closest Available Slot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Car className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Slot {recommendedSlot.slotNumber}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {recommendedSlot.floor} - Section {recommendedSlot.section} • {recommendedSlot.distance}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-secondary text-secondary-foreground">Available</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs">{recommendedSlot.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{recommendedSlot.power} • {recommendedSlot.price}</span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => handleSlotSelect(recommendedSlot)}
                  className="bg-gradient-electric hover:shadow-glow"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Select This Slot
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Parking Slots Grid */}
          <div className="xl:col-span-3">
            <Card className="shadow-electric">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  Available Parking Slots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSlots.map((slot) => (
                    <Card 
                      key={slot.id} 
                      className={`cursor-pointer transition-all duration-200 hover:shadow-energy ${
                        selectedSlot?.id === slot.id ? 'ring-2 ring-primary shadow-electric' : ''
                      }`}
                      onClick={() => handleSlotSelect(slot)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <Car className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{slot.slotNumber}</h3>
                                <p className="text-xs text-muted-foreground">{slot.floor} - Section {slot.section}</p>
                              </div>
                            </div>
                            <Badge className={
                              slot.status === 'available' ? 'bg-secondary text-secondary-foreground' :
                              slot.status === 'busy' ? 'bg-yellow-500 text-yellow-50' :
                              'bg-destructive text-destructive-foreground'
                            }>
                              {slot.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="text-muted-foreground">Distance</p>
                              <p className="font-medium">{slot.distance}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Power</p>
                              <p className="font-medium">{slot.power}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Price</p>
                              <p className="font-medium">{slot.price}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-400 fill-current" />
                              <span className="text-xs">{slot.rating}</span>
                            </div>
                          </div>

                          <div className="flex gap-1 flex-wrap">
                            {slot.amenities.slice(0, 3).map((amenity, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs px-1 py-0">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Slot Details */}
          <div className="space-y-6">
            {selectedSlot ? (
              <Card className="shadow-glow border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-primary" />
                    Selected Slot
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg">Slot {selectedSlot.slotNumber}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {selectedSlot.floor} - Section {selectedSlot.section}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge 
                      className={
                        selectedSlot.status === 'available' ? 'bg-secondary text-secondary-foreground' :
                        selectedSlot.status === 'busy' ? 'bg-yellow-500 text-yellow-50' :
                        'bg-destructive text-destructive-foreground'
                      }
                    >
                      {selectedSlot.status}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{selectedSlot.rating}</span>
                      <span className="text-sm text-muted-foreground">({selectedSlot.reviews})</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Distance</p>
                      <p className="font-medium">{selectedSlot.distance}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Power</p>
                      <p className="font-medium">{selectedSlot.power}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-medium">{selectedSlot.price}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Floor</p>
                      <p className="font-medium text-secondary">{selectedSlot.floor}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedSlot.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded">
                          {getAmenityIcon(amenity)}
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={handleBookNow}
                    className="w-full bg-gradient-electric hover:shadow-glow transition-all duration-300"
                    size="lg"
                    disabled={selectedSlot.status !== 'available'}
                  >
                    <Car className="h-4 w-4 mr-2" />
                    {selectedSlot.status === 'available' ? 'Book This Slot' : 'Unavailable'}
                  </Button>

                  {selectedSlot.status === 'available' && (
                    <p className="text-xs text-center text-muted-foreground">
                      Premium location with easy mall access
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-electric">
                <CardContent className="p-6 text-center">
                  <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="font-semibold mb-2">Select a Parking Slot</h3>
                  <p className="text-sm text-muted-foreground">
                    Click on any slot to view details and proceed with booking
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="shadow-energy">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/payment")}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Payment & Billing
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setIsChatOpen(true)}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat Support
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate("/navigation")}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  AR Navigation
                </Button>
              </CardContent>
            </Card>

            {/* Mall Features */}
            <Card className="shadow-energy">
              <CardHeader>
                <CardTitle className="text-lg">Mall Features</CardTitle>
              </CardHeader>  
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Premium Mall Location</p>
                    <p className="text-xs text-muted-foreground">Charge while you shop & dine</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-accent/10 rounded-full flex items-center justify-center mt-0.5">
                    <Zap className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Fast Charging</p>
                    <p className="text-xs text-muted-foreground">Up to 250kW ultra-fast charging</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 bg-secondary/10 rounded-full flex items-center justify-center mt-0.5">
                    <MessageCircle className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">24/7 Support</p>
                    <p className="text-xs text-muted-foreground">AI assistant & mall authority</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <ChatInterface 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};

export default Index;
