import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Editorial from "./pages/Editorial.tsx";
import EditorialGallery from "./pages/EditorialGallery.tsx";
import Journey from "./pages/Journey.tsx";
import JourneyGallery from "./pages/JourneyGallery.tsx";
import Notes from "./pages/Notes.tsx";
import NotFound from "./pages/NotFound.tsx";
import Admin from "./pages/Admin.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/editorial" element={<Editorial />} />
          <Route path="/editorial/arild" element={<EditorialArild />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/journey/:slug" element={<JourneyGallery />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
