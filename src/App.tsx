import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FisheriesDashboard from "./pages/FisheriesDashboard";
import ScientistsDashboard from "./pages/ScientistsDashboard";
import OceanMap from "./pages/OceanMap";
import SOSAlerts from "./pages/SOSAlerts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/fisheries" element={<FisheriesDashboard />} />
          <Route path="/scientists" element={<ScientistsDashboard />} />
          <Route path="/ocean-map" element={<OceanMap />} />
          <Route path="/sos" element={<SOSAlerts />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
