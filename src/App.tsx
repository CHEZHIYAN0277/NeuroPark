import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BookingPage from "./pages/BookingPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentMethodsPage from "./pages/PaymentMethodsPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import ARNavigationPage from "./pages/ARNavigationPage";
import FeedbackPage from "./pages/FeedbackPage";
import LoginPage from "./pages/LoginPage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import SlotLiveList from "./components/SlotLiveList";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment-methods" element={<PaymentMethodsPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/navigation" element={<ARNavigationPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
          <Route path="/slots" element={<SlotLiveList />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
