# 🌳 Configuratore Carport Legno - Martello1930

Configuratore standalone per carport, pergole e strutture in legno.

## 🎯 Caratteristiche

- **Design System Martello1930** integrato
- **7 Step di Configurazione** completi
- **Supabase Backend** condiviso
- **Mobile-First** responsive
- **Google Analytics** tracking

## 🚀 Deployment

- **URL Produzione**: https://carport-legno.martello1930.net
- **Percorso Configuratore**: `/configura`
- **Framework**: Next.js 14 (App Router)

## 📦 Installazione

```bash
npm install
cp .env.local.example .env.local
# Configura le variabili d'ambiente
npm run dev
```

## 🔧 Variabili d'Ambiente

```env
# Supabase (condiviso)
NEXT_PUBLIC_SUPABASE_URL=https://qeqgvtwkqocnkwckxfon.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key

# App Config
NEXT_PUBLIC_APP_URL=https://carport-legno.martello1930.net
NEXT_PUBLIC_CONFIGURATOR_TYPE=legno

# Gmail SMTP
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-8BW6WP9PR1
```

## 📂 Struttura

```
app/
├── page.tsx              # Redirect a /configura
├── configura/            # Main configurator
├── admin/                # Admin panel
└── api/                  # API routes

components/
├── configurator/
│   ├── steps/           # Step 1-7 configuratore legno
│   └── shared/          # Header, Progress, Navigation
└── ui/                  # Componenti UI Shadcn

lib/
├── supabase/            # Supabase client
└── analytics/           # Google Analytics
```

## 🎨 Design System

- **Palette**: Beige (#F5F1E8), Rosa (#E91E63), Marrone (#3E2723)
- **Font**: Geist (fallback Inter)
- **Card**: Bordi dashed rosa 2px
- **Header**: Glassmorphism con backdrop-filter

## 📊 JSON Output

```json
{
  "tipo": "legno",
  "dimensioni": {...},
  "copertura_tetto": "...",
  "trattamento_o_colore": "...",
  "accessori": [],
  "note": "",
  "created_at": "2025-11-13T10:00:00Z"
}
```

## 🔗 Repository Correlati

- **Configuratore Ferro**: https://github.com/lucamartello73/configuratore-carport-ferro
- **Progetto Unificato** (deprecato): https://github.com/lucamartello73/v0-carport1

## 📝 Note

- Backend Supabase condiviso con configuratore ferro
- Differenziazione dati tramite campo `tipo: "legno"`
- Deploy automatico su Vercel via GitHub hook

---

**Martello1930** - Artigiani del Legno dal 1930
