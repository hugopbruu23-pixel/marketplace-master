import { useState } from "react";
import { Upload, Tag, DollarSign, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { categories } from "@/data/mockData";

const CreateListingPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Criar Anúncio</h1>
          <p className="text-muted-foreground mb-8">Preencha os dados abaixo para criar seu anúncio.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="gradient-card rounded-xl border border-border p-6">
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" />
                Título do Anúncio
              </label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Conta Fortnite com 200+ skins raras" className="w-full mt-2 px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="gradient-card rounded-xl border border-border p-6">
                <label className="text-sm font-medium text-foreground mb-2 block">Categoria</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mt-2 px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Selecione...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="gradient-card rounded-xl border border-border p-6">
                <label className="text-sm font-medium text-foreground mb-2 block">Tipo</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full mt-2 px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Selecione...</option>
                  <option value="conta">Conta</option>
                  <option value="item">Item</option>
                  <option value="gift-card">Gift Card</option>
                  <option value="gold">Gold/Moedas</option>
                  <option value="servico">Serviço</option>
                </select>
              </div>
            </div>

            <div className="gradient-card rounded-xl border border-border p-6">
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Descrição
              </label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva seu produto em detalhes..." rows={5} className="w-full mt-2 px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
            </div>

            <div className="gradient-card rounded-xl border border-border p-6">
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                Preço (R$)
              </label>
              <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" className="w-full mt-2 px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <div className="gradient-card rounded-xl border border-border p-6">
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Upload className="h-4 w-4 text-primary" />
                Imagens
              </label>
              <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Arraste imagens ou clique para enviar</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG até 5MB</p>
              </div>
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground shadow-glow hover:opacity-90 py-6 text-lg">
              Publicar Anúncio
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateListingPage;
