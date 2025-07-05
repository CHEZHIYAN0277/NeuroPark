import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Clock, MapPin, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const selectedSlot = location.state?.selectedSlot;
  
  const [bookingData, setBookingData] = useState({
    vehicleModel: "",
    phoneNumber: "",
    email: "",
    chargingDuration: "1",
    selectedDate: new Date().toISOString().split('T')[0],
    selectedTime: "09:00"
  });

  if (!selectedSlot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No slot selected</p>
            <Button onClick={() => navigate("/")}>Back to Map</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate booking API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Booking Confirmed!",
      description: "Your EV charging slot has been successfully booked.",
    });

    navigate("/payment-methods", { 
      state: { 
        selectedSlot, 
        bookingData,
        bookingId: `EVBOOK${Date.now()}`
      } 
    });
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-glow/5 to-secondary/10">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-electric bg-clip-text text-transparent">
              Complete Your Booking
            </h1>
            <Button variant="ghost" onClick={() => navigate("/")}>
              Back to Map
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Slot Details */}
          <Card className="shadow-electric">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Selected Charging Slot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{selectedSlot.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedSlot.address}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Distance</p>
                  <p className="font-medium">{selectedSlot.distance}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Power Rating</p>
                  <p className="font-medium">{selectedSlot.power}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">{selectedSlot.price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Available Slots</p>
                  <p className="font-medium text-secondary">{selectedSlot.availableSlots}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card className="shadow-glow">
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBooking} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="vehicleModel">Vehicle Model</Label>
                  <Input
                    id="vehicleModel"
                    placeholder="e.g., Tesla Model 3"
                    value={bookingData.vehicleModel}
                    onChange={(e) => setBookingData({...bookingData, vehicleModel: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={bookingData.email}
                      onChange={(e) => setBookingData({...bookingData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={bookingData.phoneNumber}
                      onChange={(e) => setBookingData({...bookingData, phoneNumber: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={bookingData.selectedDate}
                      onChange={(e) => setBookingData({...bookingData, selectedDate: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Time
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={bookingData.selectedTime}
                      onChange={(e) => setBookingData({...bookingData, selectedTime: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (hours)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      max="8"
                      value={bookingData.chargingDuration}
                      onChange={(e) => setBookingData({...bookingData, chargingDuration: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-electric hover:shadow-glow transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
                      Processing Booking...
                    </div>
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;