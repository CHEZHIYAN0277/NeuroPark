import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, CreditCard, MapPin, Zap, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const bookingData = location.state?.bookingData;
  const selectedSlot = location.state?.selectedSlot;
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    inTime: new Date().toISOString().slice(0, 16),
    outTime: "",
    totalCost: 0,
    chargingTime: 0
  });

  // Calculate cost based on in/out time
  useEffect(() => {
    if (paymentData.inTime && paymentData.outTime) {
      const inTime = new Date(paymentData.inTime);
      const outTime = new Date(paymentData.outTime);
      
      if (outTime > inTime) {
        const timeDiffMs = outTime.getTime() - inTime.getTime();
        const timeDiffHours = timeDiffMs / (1000 * 60 * 60);
        
        // Extract price per kWh from slot data
        const pricePerKwh = selectedSlot ? parseFloat(selectedSlot.price.replace('$', '').replace('/kWh', '')) : 0.35;
        
        // Assume average consumption of 50kW per hour
        const kWhConsumed = timeDiffHours * 50;
        const totalCost = kWhConsumed * pricePerKwh;
        
        setPaymentData(prev => ({
          ...prev,
          chargingTime: timeDiffHours,
          totalCost: totalCost
        }));
      }
    }
  }, [paymentData.inTime, paymentData.outTime, selectedSlot]);

  if (!selectedSlot || !bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No booking data found</p>
            <Button onClick={() => navigate("/")}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    toast({
      title: "Payment Successful!",
      description: `Your EV charging session has been paid. Total: $${paymentData.totalCost.toFixed(2)}`,
    });

    navigate("/", { 
      state: { 
        paymentComplete: true,
        paymentId: `PAY${Date.now()}`
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
              Payment & Charging Details
            </h1>
            <Button variant="ghost" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <Card className="shadow-electric">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Charging Session Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{selectedSlot.slotNumber} - {selectedSlot.floor}</p>
                  <p className="text-sm text-muted-foreground">Section {selectedSlot.section}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle</p>
                  <p className="font-medium">{bookingData.vehicleModel}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Power Rating</p>
                  <p className="font-medium">{selectedSlot.power}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rate</p>
                  <p className="font-medium">{selectedSlot.price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Distance</p>
                  <p className="font-medium">{selectedSlot.distance}</p>
                </div>
              </div>

              <Separator />

              {/* Time Selection */}
              <div className="space-y-4">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Charging Schedule
                </Label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inTime">Check-in Time</Label>
                    <Input
                      id="inTime"
                      type="datetime-local"
                      value={paymentData.inTime}
                      onChange={(e) => setPaymentData({...paymentData, inTime: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outTime">Check-out Time</Label>
                    <Input
                      id="outTime"
                      type="datetime-local"
                      value={paymentData.outTime}
                      onChange={(e) => setPaymentData({...paymentData, outTime: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Cost Calculation */}
              {paymentData.chargingTime > 0 && (
                <Card className="bg-gradient-energy/10 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Calculator className="h-4 w-4 text-primary" />
                      <Label className="font-semibold">Cost Calculation</Label>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Charging Duration:</span>
                        <span className="font-medium">{paymentData.chargingTime.toFixed(1)} hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated kWh:</span>
                        <span className="font-medium">{(paymentData.chargingTime * 50).toFixed(1)} kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rate per kWh:</span>
                        <span className="font-medium">{selectedSlot.price}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total Cost:</span>
                        <Badge className="bg-secondary text-secondary-foreground text-lg px-3 py-1">
                          ${paymentData.totalCost.toFixed(2)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card className="shadow-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={paymentData.cardName}
                    onChange={(e) => setPaymentData({...paymentData, cardName: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={paymentData.cardNumber}
                    onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                    maxLength={19}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={paymentData.expiryDate}
                      onChange={(e) => setPaymentData({...paymentData, expiryDate: e.target.value})}
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={paymentData.cvv}
                      onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Amount to Pay:</span>
                    <span className="text-2xl font-bold text-primary">
                      ${paymentData.totalCost.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This amount will be charged to your card immediately
                  </p>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-electric hover:shadow-glow transition-all duration-300"
                  disabled={isLoading || paymentData.totalCost <= 0}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay ${paymentData.totalCost.toFixed(2)}
                    </>
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

export default PaymentPage;