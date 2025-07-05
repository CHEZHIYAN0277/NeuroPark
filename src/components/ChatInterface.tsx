import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Phone, 
  X,
  Minimize2,
  Maximize2
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'ai' | 'authority';
  content: string;
  timestamp: Date;
  sender?: string;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatInterface = ({ isOpen, onClose }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your EV charging assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatMode, setChatMode] = useState<'ai' | 'authority'>('ai');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate AI/Authority response
    setTimeout(() => {
      const responses = {
        ai: [
          "I can help you find the best charging slot for your needs. What's your vehicle model?",
          "Based on your location, I recommend slots A1 or VIP1 for fastest charging.",
          "The current wait time for premium slots is approximately 15 minutes.",
          "I can help you optimize your charging schedule for the best rates.",
          "Would you like me to calculate the estimated charging time for your vehicle?"
        ],
        authority: [
          "This is Mall Security. How can I assist you today?",
          "I've received your request. A technician will be dispatched to your location within 10 minutes.",
          "Thank you for reporting the issue. We're investigating the charging station malfunction.",
          "For emergency assistance, please call our hotline at (555) 123-4567.",
          "Your concern has been escalated to the facility manager. You'll receive an update shortly."
        ]
      };

      const responseOptions = responses[chatMode];
      const randomResponse = responseOptions[Math.floor(Math.random() * responseOptions.length)];

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: chatMode,
        content: randomResponse,
        timestamp: new Date(),
        sender: chatMode === 'authority' ? 'Mall Authority' : 'AI Assistant'
      };

      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`shadow-glow transition-all duration-300 ${
        isMinimized ? 'w-80 h-14' : 'w-80 h-96'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary" />
            {chatMode === 'ai' ? 'AI Assistant' : 'Mall Authority'}
            <Badge variant={chatMode === 'ai' ? 'default' : 'secondary'} className="text-xs">
              {chatMode === 'ai' ? 'Online' : 'Available'}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onClose}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-4 pt-0 h-full flex flex-col">
            {/* Chat Mode Toggle */}
            <div className="flex gap-2 mb-3">
              <Button
                variant={chatMode === 'ai' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChatMode('ai')}
                className="flex-1"
              >
                <Bot className="h-3 w-3 mr-1" />
                AI Chat
              </Button>
              <Button
                variant={chatMode === 'authority' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChatMode('authority')}
                className="flex-1"
              >
                <Phone className="h-3 w-3 mr-1" />
                Authority
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type !== 'user' && (
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                        message.type === 'ai' 
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      }`}>
                        {message.type === 'ai' ? (
                          <Bot className="h-3 w-3" />
                        ) : (
                          <Phone className="h-3 w-3" />
                        )}
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[70%] p-2 rounded-lg text-sm ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : message.type === 'ai'
                          ? 'bg-muted text-muted-foreground'
                          : 'bg-secondary/20 text-secondary-foreground'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>

                    {message.type === 'user' && (
                      <div className="h-6 w-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center">
                        <User className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="flex gap-2 mt-3">
              <Input
                placeholder={`Message ${chatMode === 'ai' ? 'AI Assistant' : 'Mall Authority'}...`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChatInterface;