import fortniteImg from "@/assets/categories/fortnite.jpg";
import robloxImg from "@/assets/categories/roblox.jpg";
import minecraftImg from "@/assets/categories/minecraft.jpg";
import freefireImg from "@/assets/categories/freefire.jpg";
import lolImg from "@/assets/categories/lol.jpg";
import valorantImg from "@/assets/categories/valorant.jpg";
import codImg from "@/assets/categories/cod.jpg";
import genshinImg from "@/assets/categories/genshin.jpg";

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  count: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  categorySlug: string;
  seller: {
    name: string;
    avatar: string;
    rating: number;
    sales: number;
  };
  image: string;
  type: "conta" | "item" | "gift-card" | "gold" | "servico";
  featured: boolean;
  createdAt: string;
  tags: string[];
}

export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  product: string;
  date: string;
}

export const categories: Category[] = [
  { id: "1", name: "Fortnite", slug: "fortnite", image: fortniteImg, count: 1243 },
  { id: "2", name: "Roblox", slug: "roblox", image: robloxImg, count: 892 },
  { id: "3", name: "Minecraft", slug: "minecraft", image: minecraftImg, count: 654 },
  { id: "4", name: "Free Fire", slug: "free-fire", image: freefireImg, count: 2105 },
  { id: "5", name: "League of Legends", slug: "league-of-legends", image: lolImg, count: 1567 },
  { id: "6", name: "Valorant", slug: "valorant", image: valorantImg, count: 987 },
  { id: "7", name: "Call of Duty", slug: "call-of-duty", image: codImg, count: 743 },
  { id: "8", name: "Genshin Impact", slug: "genshin-impact", image: genshinImg, count: 1102 },
];

export const products: Product[] = [
  {
    id: "1",
    title: "Conta Fortnite - 200+ Skins Raras",
    description: "Conta com mais de 200 skins incluindo Renegade Raider, Black Knight, e muitas mais. Todas as temporadas completas.",
    price: 349.90,
    originalPrice: 499.90,
    category: "Fortnite",
    categorySlug: "fortnite",
    seller: { name: "ProGamer_BR", avatar: "PG", rating: 4.9, sales: 234 },
    image: fortniteImg,
    type: "conta",
    featured: true,
    createdAt: "2026-03-08",
    tags: ["skins raras", "battle pass", "save the world"],
  },
  {
    id: "2",
    title: "1000 Robux - Entrega Imediata",
    description: "1000 Robux para sua conta Roblox. Entrega em até 5 minutos após confirmação do pagamento.",
    price: 49.90,
    category: "Roblox",
    categorySlug: "roblox",
    seller: { name: "RobuxKing", avatar: "RK", rating: 4.8, sales: 1502 },
    image: robloxImg,
    type: "gold",
    featured: true,
    createdAt: "2026-03-07",
    tags: ["robux", "entrega rápida"],
  },
  {
    id: "3",
    title: "Conta Minecraft Premium Java + Bedrock",
    description: "Conta Minecraft com Java Edition e Bedrock. Acesso completo a todos os servidores e modos de jogo.",
    price: 29.90,
    originalPrice: 59.90,
    category: "Minecraft",
    categorySlug: "minecraft",
    seller: { name: "MCStore", avatar: "MC", rating: 4.7, sales: 876 },
    image: minecraftImg,
    type: "conta",
    featured: true,
    createdAt: "2026-03-06",
    tags: ["java", "bedrock", "premium"],
  },
  {
    id: "4",
    title: "Conta Free Fire - Angelical + Todas Evoluções",
    description: "Conta com todas as skins Angelicais e evoluções completas. Nível máximo e muitos diamantes.",
    price: 199.90,
    category: "Free Fire",
    categorySlug: "free-fire",
    seller: { name: "FFMaster", avatar: "FF", rating: 4.6, sales: 432 },
    image: freefireImg,
    type: "conta",
    featured: true,
    createdAt: "2026-03-05",
    tags: ["angelical", "evoluções", "diamantes"],
  },
  {
    id: "5",
    title: "Conta LoL - Challenger S15",
    description: "Conta League of Legends Challenger na Season 15. Mais de 150 campeões e 300+ skins.",
    price: 599.90,
    originalPrice: 899.90,
    category: "League of Legends",
    categorySlug: "league-of-legends",
    seller: { name: "LoLPro", avatar: "LP", rating: 5.0, sales: 89 },
    image: lolImg,
    type: "conta",
    featured: true,
    createdAt: "2026-03-04",
    tags: ["challenger", "skins", "ranked"],
  },
  {
    id: "6",
    title: "VP Valorant 5350 - Código Digital",
    description: "5350 Valorant Points para comprar skins, battle pass e muito mais. Código enviado por email.",
    price: 159.90,
    category: "Valorant",
    categorySlug: "valorant",
    seller: { name: "VPStore", avatar: "VP", rating: 4.9, sales: 2341 },
    image: valorantImg,
    type: "gift-card",
    featured: false,
    createdAt: "2026-03-03",
    tags: ["valorant points", "código digital"],
  },
  {
    id: "7",
    title: "Conta COD MW3 - Dark Aether + Orion",
    description: "Conta com todas as camuflagens Dark Aether e Orion desbloqueadas. Prestige máximo.",
    price: 249.90,
    category: "Call of Duty",
    categorySlug: "call-of-duty",
    seller: { name: "CODKing", avatar: "CK", rating: 4.5, sales: 156 },
    image: codImg,
    type: "conta",
    featured: false,
    createdAt: "2026-03-02",
    tags: ["dark aether", "orion", "prestige"],
  },
  {
    id: "8",
    title: "Conta Genshin - AR 60 + 40 Personagens 5★",
    description: "Conta Adventure Rank 60 com 40 personagens 5 estrelas. Armas 5 estrelas R5 incluídas.",
    price: 899.90,
    originalPrice: 1299.90,
    category: "Genshin Impact",
    categorySlug: "genshin-impact",
    seller: { name: "GenshinPro", avatar: "GP", rating: 4.8, sales: 312 },
    image: genshinImg,
    type: "conta",
    featured: true,
    createdAt: "2026-03-01",
    tags: ["ar60", "5 estrelas", "armas r5"],
  },
  {
    id: "9",
    title: "Gift Card PlayStation R$100",
    description: "Gift Card PSN Brasil R$100. Código digital enviado instantaneamente.",
    price: 89.90,
    category: "Gift Cards",
    categorySlug: "gift-cards",
    seller: { name: "GiftPro", avatar: "GP", rating: 4.9, sales: 5432 },
    image: valorantImg,
    type: "gift-card",
    featured: false,
    createdAt: "2026-03-01",
    tags: ["psn", "playstation", "gift card"],
  },
  {
    id: "10",
    title: "Boost Valorant - Imortal para Radiante",
    description: "Serviço de boost profissional. Jogadores Radiantes irão subir sua conta com segurança.",
    price: 399.90,
    category: "Valorant",
    categorySlug: "valorant",
    seller: { name: "BoostPro", avatar: "BP", rating: 4.7, sales: 678 },
    image: valorantImg,
    type: "servico",
    featured: false,
    createdAt: "2026-02-28",
    tags: ["boost", "radiante", "ranked"],
  },
];

export const reviews: Review[] = [
  { id: "1", user: "Lucas M.", avatar: "LM", rating: 5, comment: "Entrega super rápida! Conta exatamente como descrita. Recomendo demais!", product: "Conta Fortnite - 200+ Skins Raras", date: "2026-03-08" },
  { id: "2", user: "Ana P.", avatar: "AP", rating: 5, comment: "Melhor loja para comprar Robux. Já comprei 5 vezes e sempre foi perfeito.", product: "1000 Robux - Entrega Imediata", date: "2026-03-07" },
  { id: "3", user: "Pedro S.", avatar: "PS", rating: 4, comment: "Conta boa, vendedor atencioso. Só demorou um pouco na entrega.", product: "Conta Minecraft Premium", date: "2026-03-06" },
  { id: "4", user: "Maria L.", avatar: "ML", rating: 5, comment: "Perfeito! Todas as skins estavam lá. Melhor compra que já fiz.", product: "Conta Free Fire - Angelical", date: "2026-03-05" },
  { id: "5", user: "João R.", avatar: "JR", rating: 5, comment: "Conta Challenger incrível! Vendedor muito profissional.", product: "Conta LoL - Challenger S15", date: "2026-03-04" },
  { id: "6", user: "Rafaela C.", avatar: "RC", rating: 5, comment: "Código chegou em 2 minutos! Incrível a velocidade.", product: "VP Valorant 5350", date: "2026-03-03" },
];

export const typeLabels: Record<string, string> = {
  conta: "Conta",
  item: "Item",
  "gift-card": "Gift Card",
  gold: "Gold/Moedas",
  servico: "Serviço",
};
