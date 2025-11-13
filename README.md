# 🌳 Configuratore Carport Legno - Martello1930

Configuratore standalone per carport, pergole e strutture in legno lamellare.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lucamartello73/configuratore-carport-legno)

---

## 🎯 Caratteristiche

- ✅ **Design System Martello1930** integrato
- ✅ **7 Step di Configurazione** completi e guidati
- ✅ **Supabase Backend** per storage dati
- ✅ **Mobile-First** responsive design
- ✅ **Google Analytics** tracking integrato
- ✅ **Email Notifications** via Gmail SMTP
- ✅ **Admin Panel** per gestione configurazioni

---

## 🚀 Deploy su Vercel

### Quick Deploy (1 click)

1. Click sul badge "Deploy with Vercel" sopra
2. Autorizza GitHub
3. Configura le variabili d'ambiente (vedi sotto)
4. Deploy!

### Deploy Manuale

1. Vai su https://vercel.com/new
2. Import repository: `lucamartello73/configuratore-carport-legno`
3. Framework: **Next.js** (auto-detect)
4. Root Directory: `./`
5. Build Command: `npm run build` (default)
6. Output Directory: `.next` (default)
7. Aggiungi **Environment Variables** (vedi sezione sotto)
8. Click **Deploy**

---

## 🔧 Environment Variables

### Obbligatorie

```env
NEXT_PUBLIC_SUPABASE_URL=https://qeqgvtwkqocnkwckxfon.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<ottieni-da-supabase-dashboard>
NEXT_PUBLIC_APP_URL=https://carport-legno.martello1930.net
NEXT_PUBLIC_CONFIGURATOR_TYPE=legno
```

### Opzionali

```env
# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-8BW6WP9PR1

# Email (solo se usi notifiche email)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password

# Admin Features (solo se usi funzionalità admin)
SUPABASE_SERVICE_ROLE_KEY=<ottieni-da-supabase-dashboard>
```

**Dove trovare le chiavi Supabase**:
1. Vai su https://supabase.com/dashboard
2. Seleziona il progetto: `qeqgvtwkqocnkwckxfon`
3. Settings → API
4. Copia:
   - `anon/public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (opzionale)

---

## 📦 Installazione Locale

```bash
# Clone repository
git clone https://github.com/lucamartello73/configuratore-carport-legno.git
cd configuratore-carport-legno

# Installa dipendenze
npm install

# Copia .env.template e compila
cp .env.template .env.local
# Modifica .env.local con le tue chiavi

# Avvia dev server
npm run dev
```

Apri http://localhost:3000

---

## 📂 Struttura Progetto

```
configuratore-carport-legno/
├── app/
│   ├── page.tsx              # Redirect automatico a /configura
│   ├── configura/            # Main configurator page
│   │   └── page.tsx          # Configuratore principale
│   ├── admin/                # Admin panel
│   ├── api/                  # API routes
│   └── layout.tsx            # Root layout
│
├── components/
│   ├── configurator/
│   │   ├── steps/           # Step 1-7 configuratore legno
│   │   │   ├── step1-structure-type.tsx
│   │   │   ├── step2-model.tsx
│   │   │   ├── step3-dimensions.tsx
│   │   │   ├── step4-coverage.tsx
│   │   │   ├── step5-colors.tsx
│   │   │   ├── step6-surface.tsx
│   │   │   └── step7-package.tsx
│   │   └── shared/          # Header, Progress, Navigation
│   ├── ui/                  # Shadcn UI components
│   └── footer-martello1930.tsx
│
├── lib/
│   ├── supabase/           # Supabase client config
│   └── analytics/          # Google Analytics
│
├── types/
│   └── configuration.ts    # TypeScript types
│
└── public/                 # Static assets
```

---

## 🎨 Design System

Il configuratore utilizza il **Design System Martello1930**:

- **Palette Colori**:
  - Background: `#F5F1E8` (beige/crema)
  - Primary: `#3E2723` (marrone scuro)
  - Accent: `#E91E63` (rosa/magenta)
  - Secondary: `#666666` (grigio testo)

- **Typography**: Geist (fallback Inter)
- **Card Style**: Bordi dashed rosa 2px
- **Header**: Glassmorphism con backdrop-filter
- **Responsive**: Mobile-first (3 col → 2 col → 1 col)

---

## 🔄 Routing

- `/` → Redirect automatico a `/configura`
- `/configura` → Configuratore principale (7 step)
- `/admin` → Admin panel (protetto)
- `/api/*` → API routes

---

## 📊 JSON Output

Il configuratore genera un JSON strutturato:

```json
{
  "tipo": "legno",
  "dimensioni": {
    "larghezza": 300,
    "profondita": 500,
    "altezza": 250
  },
  "copertura_tetto": "tegole_bituminose",
  "trattamento_o_colore": "impregnante_trasparente",
  "accessori": ["grondaie", "pluviali"],
  "porte_finestre": [],
  "note": "Installazione prevista per marzo 2025",
  "created_at": "2025-11-13T10:00:00Z",
  "user_info": {
    "nome": "Mario Rossi",
    "email": "mario@example.com",
    "telefono": "+39 123 456 7890"
  },
  "configurator_source": "carport-legno.martello1930.net"
}
```

---

## 🔗 Backend Condiviso

Questo configuratore condivide il backend Supabase con il [Configuratore Ferro](https://github.com/lucamartello73/configuratore-carport-ferro).

La differenziazione avviene tramite il campo `tipo: "legno"` nel JSON output.

---

## 🛠️ Build e Test

```bash
# Build produzione
npm run build

# Test build localmente
npm run start

# Lint
npm run lint
```

**Build Output**: `.next/` directory

---

## 🌐 Custom Domain

Per configurare il dominio custom `carport-legno.martello1930.net` su Vercel:

1. Vai su **Settings → Domains** nel progetto Vercel
2. Click **Add Domain**
3. Inserisci: `carport-legno.martello1930.net`
4. Segui le istruzioni DNS fornite da Vercel
5. Configura presso il tuo provider DNS:
   - Type: `A`
   - Name: `carport-legno`
   - Value: `76.76.21.21` (Vercel IP)
   - TTL: Auto

---

## 📝 Note Tecniche

- **Framework**: Next.js 14 (App Router)
- **Node Version**: 18.x o superiore
- **Package Manager**: npm
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth (opzionale)
- **Styling**: Tailwind CSS + shadcn/ui
- **Analytics**: Google Analytics 4

---

## 🤝 Repository Correlati

- **Configuratore Ferro**: https://github.com/lucamartello73/configuratore-carport-ferro
- **Progetto Unificato** (deprecato): https://github.com/lucamartello73/v0-carport1

---

## 📄 License

© 2025 Martello1930 - Tutti i diritti riservati

---

## 🆘 Support

Per supporto o domande:
- 📧 Email: info@martello1930.net
- 🌐 Website: https://www.martello1930.net
- 📞 Tel: +39 XXX XXX XXXX

---

**Martello1930** - Artigiani del Legno dal 1930 🌳
