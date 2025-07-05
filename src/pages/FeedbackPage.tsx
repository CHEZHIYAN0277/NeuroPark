import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  CheckCircle, 
  MessageSquare, 
  Zap, 
  MapPin,
  Clock,
  ThumbsUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FeedbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { selectedSlot, bookingData, bookingId } = location.state || {};
  
  const [feedback, setFeedback] = useState({
    overallRating: "",
    chargingSpeedRating: "",
    navigationRating: "",
    comments: "",
    wouldRecommend: "",
    improvements: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate feedback submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Thank you for your feedback!",
      description: "Your review helps us improve our service.",
    });

    setIsSubmitting(false);
    
    // Navigate back to home after a delay
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const StarRating = ({ value, onChange, name }: { value: string; onChange: (value: string) => void; name: string }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star.toString())}
          className={`h-8 w-8 rounded transition-colors ${
            parseInt(value) >= star 
              ? 'text-yellow-400 hover:text-yellow-500' 
              : 'text-muted-foreground hover:text-yellow-300'
          }`}
        >
          <Star className="h-6 w-6 fill-current" />
        </button>
      ))}
    </div>
  );

  if (!selectedSlot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No booking found</p>
            <Button onClick={() => navigate("/")}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-accent/10">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-secondary" />
              <div>
                <h1 className="text-xl font-bold">Charging Complete!</h1>
                <p className="text-sm text-muted-foreground">Share your experience</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-gradient-charge">
              Session Complete
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Session Summary */}
          <Card className="shadow-electric">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Session Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-1">
                  {bookingData?.chargingDuration || 2}h
                </div>
                <p className="text-sm text-muted-foreground">Charging Duration</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{selectedSlot.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedSlot.address}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">
                      {bookingData?.selectedDate} at {bookingData?.selectedTime}
                    </p>
                    <p className="text-xs text-muted-foreground">Booking Time</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{selectedSlot.power}</p>
                    <p className="text-xs text-muted-foreground">Charging Speed</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="text-center">
                <p className="text-sm text-muted-foreground">Booking ID</p>
                <p className="font-mono text-sm font-medium">{bookingId}</p>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Share Your Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Overall Rating */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Overall Experience</Label>
                    <StarRating 
                      value={feedback.overallRating}
                      onChange={(value) => setFeedback({...feedback, overallRating: value})}
                      name="overall"
                    />
                  </div>

                  {/* Specific Ratings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Charging Speed</Label>
                      <StarRating 
                        value={feedback.chargingSpeedRating}
                        onChange={(value) => setFeedback({...feedback, chargingSpeedRating: value})}
                        name="charging"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">AR Navigation</Label>
                      <StarRating 
                        value={feedback.navigationRating}
                        onChange={(value) => setFeedback({...feedback, navigationRating: value})}
                        name="navigation"
                      />
                    </div>
                  </div>

                  {/* Would Recommend */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">Would you recommend our service?</Label>
                    <RadioGroup 
                      value={feedback.wouldRecommend} 
                      onValueChange={(value) => setFeedback({...feedback, wouldRecommend: value})}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="rec-yes" />
                        <Label htmlFor="rec-yes" className="flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4 text-secondary" />
                          Yes, definitely!
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="maybe" id="rec-maybe" />
                        <Label htmlFor="rec-maybe">Maybe</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="rec-no" />
                        <Label htmlFor="rec-no">No, not really</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Comments */}
                  <div className="space-y-2">
                    <Label htmlFor="comments">Additional Comments</Label>
                    <Textarea
                      id="comments"
                      placeholder="Tell us about your experience..."
                      value={feedback.comments}
                      onChange={(e) => setFeedback({...feedback, comments: e.target.value})}
                      rows={4}
                    />
                  </div>

                  {/* Improvements */}
                  <div className="space-y-2">
                    <Label htmlFor="improvements">How can we improve?</Label>
                    <Textarea
                      id="improvements"
                      placeholder="Any suggestions for improvement..."
                      value={feedback.improvements}
                      onChange={(e) => setFeedback({...feedback, improvements: e.target.value})}
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full bg-gradient-electric hover:shadow-glow transition-all duration-300"
                    disabled={isSubmitting || !feedback.overallRating}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full"></div>
                        Submitting Feedback...
                      </div>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Submit Feedback
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;