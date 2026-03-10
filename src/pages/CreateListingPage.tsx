import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const productTypes = [
  { value: "account", label: "Conta" },
  { value: "item", label: "Item" },
  { value: "currency", label: "Gold/Moedas" },
  { value: "giftcard", label: "Gift Card" },
  { value: "service", label: "Serviço" },
  { value: "other", label: "Outro" },
];

const deliveryMethods = [
  { value: "manual", label: "Entrega Manual" },
  { value: "auto", label: "Entrega Automática" },
  { value: "email", label: "Via Email" },
];

const CreateListingPage = () => {
  const { user, store } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [productType, setProductType] = useState("account");
  const [deliveryMethod, setDeliveryMethod] = useState("manual");
  const [deliveryData, setDeliveryData] = useState("");
  const [stock, setStock] = useState("1");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (!store) { navigate("/criar-loja"); return; }
    supabase.from("categories").select("*").eq("is_active", true).then(({ data }) => setCategories(data || []));
  }, [user, store]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) {
      toast({ title: "Erro", description: "Título e preço são obrigatórios", variant: "destructive" });
      return;
    }
    if (!store) return;
    setLoading(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `${store.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("product-images").upload(path, imageFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("store_products").insert({
        store_id: store.id,
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price),
        original_price: originalPrice ? parseFloat(originalPrice) : null,
        category_id: categoryId || null,
        product_type: productType,
        delivery_method: deliveryMethod,
        delivery_data: deliveryData.trim() || null,
        stock: parseInt(stock) || 1,
        image_url: imageUrl || null,
      });

      if (error) throw error;
      toast({ title: "Produto criado!", description: "Seu produto foi publicado com sucesso." });
      navigate("/minha-loja");
    } catch (err: any) {
      toast({ title: "Erro ao criar produto", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">Anunciar Produto</h1>
        <p className="text-muted-foreground mb-8">Preencha os dados do seu produto digital</p>

        <div className="gradient-card rounded-xl border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Título *</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Conta Fortnite - 200+ Skins" maxLength={100} className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Descrição</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva seu produto..." rows={4} maxLength={2000} className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Preço (R$) *</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="number" step="0.01" min="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className="w-full pl-10 pr-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Preço Original</label>
                <input type="number" step="0.01" min="0" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="Opcional" className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Categoria</label>
                <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Selecionar...</option>
                  {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Tipo</label>
                <select value={productType} onChange={(e) => setProductType(e.target.value)} className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  {productTypes.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Entrega</label>
                <select value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value)} className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  {deliveryMethods.map((d) => (<option key={d.value} value={d.value}>{d.label}</option>))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Estoque</label>
                <input type="number" min="1" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
            </div>

            {deliveryMethod === "auto" && (
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Dados de Entrega Automática</label>
                <textarea value={deliveryData} onChange={(e) => setDeliveryData(e.target.value)} placeholder="Ex: login e senha, código, link de download..." rows={3} className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Imagem do Produto</label>
              <label className="flex items-center gap-3 px-4 py-3 bg-secondary border border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{imageFile ? imageFile.name : "Escolher imagem..."}</span>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="hidden" />
              </label>
            </div>

            <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground shadow-glow hover:opacity-90 py-5">
              {loading ? "Publicando..." : "Publicar Produto"}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateListingPage;
