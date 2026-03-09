import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import SearchPage from "./pages/SearchPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import CreateListingPage from "./pages/CreateListingPage";
import PaymentPage from "./pages/PaymentPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/categorias" element={<CategoriesPage />} />
          <Route path="/categoria/:slug" element={<CategoryPage />} />
          <Route path="/produto/:id" element={<ProductPage />} />
          <Route path="/buscar" element={<SearchPage />} />
          <Route path="/como-funciona" element={<HowItWorksPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/carrinho" element={<CartPage />} />
          <Route path="/anunciar" element={<CreateListingPage />} />
          <Route path="/pagamento/:id" element={<PaymentPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
