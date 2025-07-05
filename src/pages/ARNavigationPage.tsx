import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Zap, 
  CheckCircle,
  ArrowRight,
  Smartphone,
  Camera,
  Volume2,
  VolumeX,
  Mic,
  MicOff
} from "lucide-react";

const ARNavigationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [isArrived, setIsArrived] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [currentInstruction, setCurrentInstruction] = useState("");
  const [navigationSteps, setNavigationSteps] = useState([
    { instruction: "Head north on Main Street", distance: "0.2 miles", completed: false },
    { instruction: "Turn right onto Electric Avenue", distance: "0.1 miles", completed: false },
    { instruction: "Destination will be on your left", distance: "0.05 miles", completed: false }
  ]);

  const { selectedSlot, bookingData, bookingId } = location.state || {};

  // Voice assistance functions
  const speakInstruction = (text: string) => {
    if (!isVoiceEnabled || !('speechSynthesis' in window)) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.volume = 0.8;
    speechSynthesis.speak(utterance);
  };

  const toggleVoiceNavigation = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    if (!isVoiceEnabled) {
      speakInstruction("Voice navigation enabled");
    }
  };

  const startVoiceCommands = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      handleVoiceCommand(command);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleVoiceCommand = (command: string) => {
    if (command.includes('repeat') || command.includes('again')) {
      speakInstruction(currentInstruction);
    } else if (command.includes('status') || command.includes('progress')) {
      speakInstruction(`You are ${Math.round(progress)}% of the way to your destination`);
    } else if (command.includes('destination') || command.includes('where')) {
      speakInstruction(`Your destination is ${selectedSlot?.slotNumber} in ${selectedSlot?.section} section`);
    } else if (command.includes('help')) {
      speakInstruction("Say repeat to hear instructions again, status for progress, or destination for slot details");
    }
  };

  useEffect(() => {
    if (!selectedSlot) return;

    // Initial voice announcement
    if (isVoiceEnabled) {
      speakInstruction(`Navigation started to parking slot ${selectedSlot.slotNumber} in section ${selectedSlot.section}`);
      setCurrentInstruction("Navigation started");
    }

    // Simulate navigation progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          setIsArrived(true);
          speakInstruction("You have arrived at your destination!");
          clearInterval(interval);
        }
        
        // Update completed steps based on progress
        setNavigationSteps(steps => 
          steps.map((step, index) => {
            const isNowCompleted = newProgress > (index + 1) * 33;
            const wasCompleted = step.completed;
            
            // Speak instruction when step becomes active
            if (!wasCompleted && !isNowCompleted && newProgress > index * 33) {
              setCurrentInstruction(step.instruction);
              speakInstruction(step.instruction);
            }
            
            return {
              ...step,
              completed: isNowCompleted
            };
          })
        );
        
        return Math.min(newProgress, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [selectedSlot, isVoiceEnabled]);

  if (!selectedSlot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No booking found</p>
            <Button onClick={() => navigate("/")}>Back to Map</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/10">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Navigation className="h-6 w-6 text-primary animate-pulse-glow" />
              <div>
                <h1 className="text-xl font-bold">AR Navigation</h1>
                <p className="text-sm text-muted-foreground">Booking ID: {bookingId}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-gradient-electric">
              {isArrived ? "Arrived" : "Navigating"}
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Voice Control Panel */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleVoiceNavigation}
                    className={`${isVoiceEnabled ? 'bg-primary text-primary-foreground' : ''}`}
                  >
                    {isVoiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={startVoiceCommands}
                    className={`${isListening ? 'bg-accent text-accent-foreground animate-pulse' : ''}`}
                    disabled={!isVoiceEnabled}
                  >
                    {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                </div>
                <div>
                  <p className="font-medium text-sm">Voice Assistant</p>
                  <p className="text-xs text-muted-foreground">
                    {isListening ? "Listening..." : isVoiceEnabled ? "Say 'help' for commands" : "Voice disabled"}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className={isVoiceEnabled ? "text-primary" : "text-muted-foreground"}>
                {isVoiceEnabled ? "Active" : "Inactive"}
              </Badge>
            </div>
            {currentInstruction && (
              <div className="mt-3 p-3 bg-background/50 rounded-lg">
                <p className="text-sm font-medium">Current Instruction:</p>
                <p className="text-sm text-muted-foreground">{currentInstruction}</p>
              </div>
            )}
          </CardContent>
        </Card>
        {/* AR Camera View Simulation */}
        <Card className="mb-6 shadow-electric">
          <CardContent className="p-0">
            <div className="relative h-64 md:h-80 bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-lg overflow-hidden">
              {/* Simulated AR overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Camera className="h-12 w-12 mx-auto mb-4 opacity-60" />
                  <p className="text-lg font-medium mb-2">AR Camera View</p>
                  <p className="text-sm opacity-80">Point your device towards the charging station</p>
                </div>
              </div>
              
              {/* AR Direction Indicator */}
              {!isArrived && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium animate-pulse-glow">
                    <ArrowRight className="inline h-4 w-4 mr-2" />
                    {selectedSlot.distance} ahead
                  </div>
                </div>
              )}

              {/* Arrival Indicator */}
              {isArrived && (
                <div className="absolute inset-0 bg-secondary/20 flex items-center justify-center">
                  <div className="text-center text-white">
                    <CheckCircle className="h-16 w-16 mx-auto mb-4 text-secondary animate-pulse-glow" />
                    <p className="text-xl font-bold">You've Arrived!</p>
                    <p className="text-sm opacity-80">Charging station is now visible</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Navigation Progress */}
          <Card className="shadow-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Navigation Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to destination</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="space-y-3">
                {navigationSteps.map((step, index) => (
                  <div key={index} className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                    step.completed ? 'bg-secondary/20' : 'bg-muted/50'
                  }`}>
                    <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-secondary text-secondary-foreground' : 'bg-muted'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <span className="text-xs font-bold">{index + 1}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${step.completed ? 'text-secondary' : ''}`}>
                        {step.instruction}
                      </p>
                      <p className="text-sm text-muted-foreground">{step.distance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Destination Info */}
          <Card className="shadow-energy">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-accent" />
                Destination Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedSlot.name}</h3>
                <p className="text-muted-foreground">{selectedSlot.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Vehicle</p>
                  <p className="font-medium">{bookingData?.vehicleModel}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Power</p>
                  <p className="font-medium">{selectedSlot.power}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">{bookingData?.chargingDuration}h</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Time</p>
                  <p className="font-medium">{bookingData?.selectedTime}</p>
                </div>
              </div>

              {isArrived && (
                <div className="pt-4">
                  <Button 
                    onClick={() => navigate("/feedback", { state: { selectedSlot, bookingData, bookingId } })}
                    className="w-full bg-gradient-charge hover:shadow-glow transition-all duration-300"
                    size="lg"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete & Leave Feedback
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mt-6 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Smartphone className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">AR Navigation Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Keep your device steady and pointed forward</li>
                  <li>• Follow the AR directional indicators</li>
                  <li>• Look for the charging station logo when you arrive</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ARNavigationPage;