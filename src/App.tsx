
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Stocks from "./pages/Stocks";
import AIAdvisor from "./pages/AIAdvisor";
import FinancialNarrative from "./pages/FinancialNarrative";
import FinanceJourney from "./pages/FinanceJourney";
import { VoiceAssistant } from "./components/VoiceAssistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/ai-advisor" element={<AIAdvisor />} />
          <Route path="/financial-narrative" element={<FinancialNarrative />} />
          <Route path="/finance-journey" element={<FinanceJourney />} />
          <Route path="/etfs" element={<NotFound />} />
          <Route path="/crypto" element={<NotFound />} />
          <Route path="/savings" element={<NotFound />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <VoiceAssistant />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
