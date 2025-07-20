import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AppStateProvider } from "@/contexts/AppStateContext";

// Import all pages
import { Home } from "./pages/Home";
import { PublicMode } from "./pages/PublicMode";
import { MedicVerification } from "./pages/MedicVerification";
import { MedicMode } from "./pages/MedicMode";
import { SupplyRequest } from "./pages/SupplyRequest";
import { FirstAid } from "./pages/FirstAid";
import { SavedCases } from "./pages/SavedCases";
import { BluetoothStatus } from "./pages/BluetoothStatus";
import { ConsultQueue } from "./pages/ConsultQueue";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AppStateProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/public" element={<PublicMode />} />
              <Route path="/medic-verification" element={<MedicVerification />} />
              <Route path="/medic" element={<MedicMode />} />
              <Route path="/supply-request" element={<SupplyRequest />} />
              <Route path="/first-aid" element={<FirstAid />} />
              <Route path="/saved-cases" element={<SavedCases />} />
              <Route path="/bluetooth-status" element={<BluetoothStatus />} />
              <Route path="/consult-queue" element={<ConsultQueue />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppStateProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
