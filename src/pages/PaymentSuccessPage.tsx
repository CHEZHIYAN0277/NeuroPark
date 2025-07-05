import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  Navigation, 
  Download, 
  MessageCircle,
  Calendar,
  MapPin,
  Zap
} from "lucide-react";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { bookingData, selectedSlot, bookingId, paymentMethod } = location.state || {};

  useEffect(() => {
    // Auto-redirect if no booking data
    if (!bookingData || !selectedSlot) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [bookingData, selectedSlot, navigate]);

  if (!bookingData || !selectedSlot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No booking data found</p>
            <p className="text-sm text-muted-foreground">Redirecting to home...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const startNavigation = () => {
    navigate("/navigation", { 
      state: { 
        selectedSlot, 
        bookingData, 
        bookingId 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 via-background to-primary/10">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Success Header */}
          <Card className="shadow-electric border-secondary/20">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <CheckCircle2 className="h-16 w-16 text-secondary mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-secondary mb-2">Payment Successful!</h1>
                <p className="text-muted-foreground">Your EV charging slot has been booked</p>
              </div>
              
              <div className="flex items-center justify-center gap-4 mb-6">
                <Badge variant="secondary" className="bg-gradient-electric">
                  Booking ID: {bookingId}
                </Badge>
                <Badge variant="outline">
                  {paymentMethod ? paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1) : 'Payment'} Completed
                </Badge>
              </div>

              <Button 
                onClick={startNavigation}
                size="lg"
                className="bg-gradient-charge hover:shadow-glow transition-all duration-300"
              >
                <Navigation className="h-4 w-4 mr-2" />
                Start Navigation
              </Button>
            </CardContent>
          </Card>

          {/* Booking Details */}
          <Card className="shadow-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-semibold">{selectedSlot.slotNumber}</p>
                  <p className="text-sm text-muted-foreground">{selectedSlot.section} Section, {selectedSlot.floor}</p>
                  <p className="text-sm text-muted-foreground">{selectedSlot.distance} away</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Vehicle</p>
                  <p className="font-medium">{bookingData.vehicleModel}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Power</p>
                  <p className="font-medium">{selectedSlot.power}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{bookingData.chargingDuration}h</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date & Time</p>
                  <p className="font-medium">{bookingData.selectedDate} at {bookingData.selectedTime}</p>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Paid</span>
                <span className="text-lg font-bold text-primary">₹{bookingData.totalCost || '299'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-glow transition-all duration-200">
              <CardContent className="p-4 text-center">
                <Download className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium mb-1">Download Receipt</h3>
                <p className="text-xs text-muted-foreground">Get payment confirmation</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-glow transition-all duration-200">
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-accent" />
                <h3 className="font-medium mb-1">Add to Calendar</h3>
                <p className="text-xs text-muted-foreground">Set charging reminder</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-glow transition-all duration-200">
              <CardContent className="p-4 text-center">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-secondary" />
                <h3 className="font-medium mb-1">Need Help?</h3>
                <p className="text-xs text-muted-foreground">Contact support</p>
              </CardContent>
            </Card>
          </div>

          {/* Important Information */}
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardContent className="p-4">
              <h4 className="font-medium mb-3">Important Information</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Please arrive 10 minutes before your scheduled time</li>
                <li>• Bring your charging cable if not provided</li>
                <li>• Use the navigation feature to find your exact slot</li>
                <li>• Contact support if you need to modify your booking</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;