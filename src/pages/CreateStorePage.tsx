import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store, Key, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const pixKeyTypes = [
  { value: "cpf", label: "CPF" },
  { value: "cnpj", label: "CNPJ" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Telefone" },
  { value: "random", label: "Chave Aleatória" },
];

const CreateStorePage = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [pixKeyType, setPixKeyType] = useState("cpf");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !pixKey.trim()) {
      toast({ title: "Erro", description: "Nome da loja e chave PIX são obrigatórios", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      let logoUrl = "";
      if (logoFile) {
        const ext = logoFile.name.split(".").pop();
        const path = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from("store-logos").upload(path, logoFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from("store-logos").getPublicUrl(path);
        logoUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("stores").insert({
        user_id: user.id,
        name: name.trim(),
        description: description.trim(),
        pix_key: pixKey.trim(),
        pix_key_type: pixKeyType,
        logo_url: logoUrl || null,
      });

      if (error) throw error;
      await refreshProfile();
      toast({ title: "Loja criada!", description: "Sua loja foi criada com sucesso. Agora você pode anunciar produtos!" });
      navigate("/minha-loja");
    } catch (err: any) {
      toast({ title: "Erro ao criar loja", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
            <Store className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Criar Sua Loja</h1>
          <p className="text-muted-foreground">Configure sua loja para começar a vender produtos digitais</p>
        </div>

        <div className="gradient-card rounded-xl border border-border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Nome da Loja *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: ProGamer Store" maxLength={50} className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Descrição</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva sua loja..." rows={3} maxLength={500} className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Logo da Loja</label>
              <label className="flex items-center gap-3 px-4 py-3 bg-secondary border border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{logoFile ? logoFile.name : "Escolher imagem..."}</span>
                <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} className="hidden" />
              </label>
            </div>

            <div className="border-t border-border pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Key className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold text-foreground">Chave PIX para Recebimento *</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">Cadastre sua chave PIX para receber os pagamentos das vendas.</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Tipo da Chave</label>
                  <select value={pixKeyType} onChange={(e) => setPixKeyType(e.target.value)} className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                    {pixKeyTypes.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Chave PIX</label>
                  <input type="text" value={pixKey} onChange={(e) => setPixKey(e.target.value)} placeholder={pixKeyType === "email" ? "seu@email.com" : pixKeyType === "phone" ? "+5511999999999" : "Sua chave"} className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full gradient-primary text-primary-foreground shadow-glow hover:opacity-90 py-5">
              {loading ? "Criando..." : "Criar Loja"}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateStorePage;
