import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet, 
  Banknote,
  ArrowLeft,
  Shield,
  Clock,
  CheckCircle2
} from "lucide-react";

const PaymentMethodsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  
  const { bookingData, selectedSlot, bookingId } = location.state || {};

  const paymentMethods = [
    {
      id: "cards",
      title: "Debit & Credit Cards",
      description: "Visa, Mastercard, RuPay, American Express",
      icon: CreditCard,
      popular: true,
      processingTime: "Instant"
    },
    {
      id: "upi",
      title: "UPI",
      description: "Google Pay, PhonePe, Paytm, BHIM UPI",
      icon: Smartphone,
      popular: true,
      processingTime: "Instant"
    },
    {
      id: "netbanking",
      title: "Net Banking",
      description: "All major banks supported",
      icon: Building2,
      popular: false,
      processingTime: "1-2 minutes"
    },
    {
      id: "wallets",
      title: "Digital Wallets",
      description: "Paytm, Mobikwik, Amazon Pay",
      icon: Wallet,
      popular: false,
      processingTime: "Instant"
    },
    {
      id: "cash",
      title: "Cash Payment",
      description: "Pay at the charging station",
      icon: Banknote,
      popular: false,
      processingTime: "On arrival"
    }
  ];

  const handlePaymentSelection = (methodId: string) => {
    setSelectedMethod(methodId);
    // TODO: Implement actual payment processing
    console.log("Selected payment method:", methodId);
  };

  const proceedToPayment = () => {
    if (!selectedMethod) return;
    
    // TODO: Navigate to actual payment processing
    // For now, simulate payment completion
    navigate("/payment-success", { 
      state: { 
        bookingData, 
        selectedSlot, 
        bookingId,
        paymentMethod: selectedMethod
      } 
    });
  };

  if (!bookingData || !selectedSlot) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-primary/10">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Choose Payment Method</h1>
                <p className="text-sm text-muted-foreground">Booking ID: {bookingId}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-gradient-electric">
              Secure Payment
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">All payments are secured with 256-bit SSL encryption</span>
            </div>

            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;
              
              return (
                <Card 
                  key={method.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-glow ${
                    isSelected ? 'ring-2 ring-primary shadow-electric' : ''
                  }`}
                  onClick={() => handlePaymentSelection(method.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{method.title}</h3>
                            {method.popular && (
                              <Badge variant="secondary" className="text-xs">Popular</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{method.processingTime}</span>
                          </div>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <Card className="shadow-energy">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">{selectedSlot.slotNumber}</h3>
                  <p className="text-sm text-muted-foreground">{selectedSlot.section} Section, {selectedSlot.floor}</p>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Vehicle:</span>
                    <span>{bookingData.vehicleModel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{bookingData.chargingDuration}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Power:</span>
                    <span>{selectedSlot.power}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate:</span>
                    <span>{selectedSlot.price}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-primary">₹{bookingData.totalCost}</span>
                </div>

                <Button 
                  onClick={proceedToPayment}
                  disabled={!selectedMethod}
                  className="w-full bg-gradient-charge hover:shadow-glow transition-all duration-300"
                  size="lg"
                >
                  Proceed to Pay ₹{bookingData.totalCost}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By proceeding, you agree to our terms and conditions
                </p>
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security Features
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 256-bit SSL encryption</li>
                  <li>• PCI DSS compliant</li>
                  <li>• No card details stored</li>
                  <li>• Instant refund support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsPage;