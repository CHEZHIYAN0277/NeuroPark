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
  Building2,
  Bot
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
            <Card className="shadow-glow border-primary/10 bg-gradient-to-br from-card to-card/80 backdrop-blur">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl bg-gradient-electric bg-clip-text text-transparent flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <Button 
                    variant="outline" 
                    className="group w-full justify-start h-12 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                    onClick={() => navigate("/payment")}
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors">
                      <DollarSign className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Payment & Billing</p>
                      <p className="text-xs text-muted-foreground">Manage your payments</p>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="group w-full justify-start h-12 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                    onClick={() => setIsChatOpen(true)}
                  >
                    <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center mr-3 group-hover:bg-accent/20 transition-colors">
                      <MessageCircle className="h-4 w-4 text-accent" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">AI Assistant</p>
                      <p className="text-xs text-muted-foreground">Get instant help</p>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="group w-full justify-start h-12 border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300"
                    onClick={() => navigate("/navigation")}
                  >
                    <div className="h-8 w-8 rounded-lg bg-secondary/10 flex items-center justify-center mr-3 group-hover:bg-secondary/20 transition-colors">
                      <Navigation className="h-4 w-4 text-secondary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">AR Navigation</p>
                      <p className="text-xs text-muted-foreground">Find your way easily</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Mall Features */}
            <Card className="shadow-electric border-secondary/10 bg-gradient-to-br from-card to-secondary/5 backdrop-blur">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl bg-gradient-energy bg-clip-text text-transparent flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-secondary" />
                  Mall Features
                </CardTitle>
              </CardHeader>  
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="group p-4 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 hover:shadow-glow transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center shadow-lg">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-base mb-1">Premium Mall Location</p>
                        <p className="text-sm text-muted-foreground">Charge while you shop, dine & relax</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">5 Floors</Badge>
                          <Badge variant="secondary" className="text-xs">200+ Stores</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group p-4 rounded-xl bg-gradient-to-r from-accent/5 to-accent/10 border border-accent/20 hover:shadow-energy transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-accent to-yellow-400 rounded-xl flex items-center justify-center shadow-lg">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-base mb-1">Ultra-Fast Charging</p>
                        <p className="text-sm text-muted-foreground">Up to 250kW DC fast charging</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">10-80% in 30min</Badge>
                          <Badge variant="secondary" className="text-xs">24/7 Available</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group p-4 rounded-xl bg-gradient-to-r from-secondary/5 to-secondary/10 border border-secondary/20 hover:shadow-glow transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 bg-gradient-to-br from-secondary to-purple-400 rounded-xl flex items-center justify-center shadow-lg">
                        <MessageCircle className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-base mb-1">Smart Support System</p>
                        <p className="text-sm text-muted-foreground">AI assistant & live mall authority</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">Instant Response</Badge>
                          <Badge variant="secondary" className="text-xs">Multi-language</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>

      {/* Floating AI Assistant Button */}
      <Button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-electric hover:shadow-glow shadow-electric transition-all duration-300 animate-pulse-glow z-40 group"
        size="icon"
      >
        <Bot className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
        <span className="sr-only">Open AI Assistant</span>
      </Button>

      {/* Chat Interface */}
      <ChatInterface 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};

export default Index;
