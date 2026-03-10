

# Phase 2 - Payblox Full-Stack Implementation Plan

## Overview
Transform Payblox from a static frontend into a fully functional marketplace with real authentication, seller stores, Mercado Pago payments with PIX auto-detection, admin panel, and refund system.

---

## Step 1: Enable Lovable Cloud & Database Schema

Enable Lovable Cloud and create the following tables:

```text
profiles          → user data (name, avatar, bio)
user_roles        → admin roles (secure, separate table)
stores            → seller stores (name, description, pix_key, logo, status)
store_products    → products listed by stores
orders            → purchase records (buyer, seller, product, status, payment_id)
order_disputes    → refund/return requests
categories        → game categories (seeded from mock data)
reviews           → product reviews
cart_items        → user cart persistence
```

All tables with RLS policies. Admin access via `has_role()` security definer function.

## Step 2: Authentication (Login + Cadastro + Google)

- **LoginPage** rewrite with Supabase Auth:
  - Email/password signup with name field
  - Email/password login
  - Google OAuth sign-in
  - Password reset flow with `/reset-password` page
  - Auto-create profile on signup via database trigger
- **AuthContext** provider wrapping the app
- Protected routes for: `/anunciar`, `/carrinho`, `/minha-loja`, `/admin`

## Step 3: Seller Store System

New pages and flows:

- **CreateStorePage** (`/criar-loja`): Name, description, logo upload, PIX key registration (CPF/CNPJ/email/phone/random key)
- **MyStorePage** (`/minha-loja`): Dashboard showing store products, sales, earnings
- **CreateListingPage** update: Only accessible if user has a store; posts product to `store_products` table
- **Store public page** (`/loja/:id`): Public view of a store with its products and ratings
- Seller must register PIX key so buyers' payments go to them

## Step 4: Mercado Pago Payment Integration

- Edge function `create-payment`: Creates Mercado Pago PIX payment via API, returns QR code + copia-e-cola code
- Edge function `check-payment`: Polls Mercado Pago for payment status (approved/pending/rejected)
- Edge function `mercadopago-webhook`: Receives IPN notifications for real-time payment confirmation
- **PaymentPage** rewrite:
  - Calls `create-payment` to get real PIX QR code
  - Polls `check-payment` every 5 seconds until confirmed
  - Only confirms when Mercado Pago reports `approved`
  - Creates order record on confirmation
  - Shows real QR code image from Mercado Pago API
- Mercado Pago Access Token stored as Supabase secret

## Step 5: Refund & Dispute System

- **OrdersPage** (`/meus-pedidos`): List of user's purchases with status
- **OrderDetailPage** (`/pedido/:id`): Order details with option to open dispute
- Dispute flow: buyer requests refund → admin reviews → approve/reject
- Statuses: `pending`, `paid`, `delivered`, `dispute_open`, `refunded`, `completed`
- Edge function to process refunds via Mercado Pago API

## Step 6: Admin Panel

- **AdminLoginPage** (`/admin`): Secure login (uses Supabase auth + `user_roles` table check)
- **Admin Dashboard** (`/admin/dashboard`):
  - Overview: total users, stores, products, orders, revenue
  - **Users tab**: list all users, view details, ban/unban, modify permissions
  - **Stores tab**: list all stores, approve/reject, suspend, edit details
  - **Products tab**: list all products, remove, edit, feature/unfeature
  - **Orders tab**: list all orders, view payment status, manage disputes
  - **Categories tab**: add/edit/remove categories
  - **Disputes tab**: review refund requests, approve/reject
- All admin actions write to database → visible to all users immediately
- Admin role assigned via `user_roles` table (not hardcoded credentials)

## Step 7: Integration & Polish

- Update Navbar: show user avatar when logged in, link to store/orders
- Cart persistence in database (logged-in users)
- Product pages pull from database instead of mock data
- Seed initial categories from mock data
- Search page queries database

---

## Technical Architecture

```text
Frontend (React)
  ├── AuthContext (Supabase Auth)
  ├── Pages (public + protected)
  └── API calls via supabase.functions.invoke()

Lovable Cloud (Supabase)
  ├── Auth (email + Google OAuth)
  ├── Database (Postgres + RLS)
  ├── Storage (product images, store logos)
  └── Edge Functions
       ├── create-payment (Mercado Pago API)
       ├── check-payment (poll status)
       ├── mercadopago-webhook (IPN)
       └── process-refund

Mercado Pago API
  ├── PIX QR Code generation
  ├── Payment status polling
  └── Refund processing
```

## Implementation Order

1. Enable Lovable Cloud + create all tables/RLS
2. Auth system (login, signup, Google, context)
3. Store system (create store, PIX key, manage products)
4. Mercado Pago edge functions + payment page
5. Orders & refund/dispute system
6. Admin panel (all tabs functional)
7. Wire everything together, remove mock data dependency

## Security Notes

- Admin role stored in `user_roles` table with `has_role()` security definer function
- No hardcoded admin credentials
- All RLS policies enforce user ownership
- Mercado Pago secret stored as edge function secret
- Input validation with Zod on all forms

