import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import Preloader from "./components/Preloader";
import Index from "./pages/Index";
import Bizzy from "./pages/Bizzy";
import Artie from "./pages/Artie";
import Mak from "./pages/Mak";
import Vira from "./pages/Vira";
import MyStartup from "./pages/MyStartup";
import NotFound from "./pages/NotFound";
import ProfilePage from "./pages/ProfilePage";

const queryClient = new QueryClient();

const App = () => {
  const [showPreloader, setShowPreloader] = useState(true);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="productica-ui-theme">
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            {showPreloader && <Preloader onComplete={handlePreloaderComplete} />}
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/bizzy" element={<Bizzy />} />
                <Route path="/artie" element={<Artie />} />
                <Route path="/mak" element={<Mak />} />
                <Route path="/vira" element={<Vira />} />
                <Route path="/my-startup" element={<MyStartup />} />
                <Route path="/profile" element={<ProfilePage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
