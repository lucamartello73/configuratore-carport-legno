# 🏗️ Piano Separazione Configuratori - ACCIAIO vs LEGNO

**Data:** 2025-11-17  
**Obiettivo:** Separare dati tra configuratore CARPORT LEGNO e PERGOLE FERRO (ACCIAIO)  
**Database:** Condiviso su Supabase  

---

## 📊 ANALISI SITUAZIONE ATTUALE

### ✅ **GIÀ IMPLEMENTATO:**

Il sistema è **GIÀ SEPARATO CORRETTAMENTE** a livello di database!

#### Struttura Tabelle Esistente:

**CONFIGURATORE ACCIAIO (Pergole Ferro):**
```
carport_configurations
carport_models
carport_colors
carport_coverage_types
carport_structure_types
carport_surfaces
carport_pricing_rules
```

**CONFIGURATORE LEGNO (Carport Legno):**
```
carport_legno_configurations
carport_legno_models
carport_legno_colors
carport_legno_coverage_types
carport_legno_structure_types
carport_legno_accessories
carport_legno_packages
carport_legno_surfaces
```

#### Gestione Intelligente:

Il file `/lib/supabase/tables.ts` ha una funzione `getTableName()` che:
- **Riceve:** `configuratorType` ('acciaio' o 'legno')
- **Ritorna:** Il nome corretto della tabella

**Esempio:**
```typescript
getTableName('acciaio', 'configurations') → 'carport_configurations'
getTableName('legno', 'configurations')   → 'carport_legno_configurations'
```

### ✅ **Step7 GIÀ GESTISCE ENTRAMBI I CONFIGURATORI:**

Il componente Step7 (`step7-package.tsx`) ha logica condizionale:

```typescript
if (configuratorType === 'acciaio') {
  // Salva in carport_configurations
  configurationData.structure_color = configuration.structureColor
  configurationData.coverage_color = configuration.coverageColor
} else if (configuratorType === 'legno') {
  // Salva in carport_legno_configurations
  configurationData.color_id = configuration.colorId
  configurationData.surface_id = configuration.surfaceId
}
```

---

## 🎯 COSA SERVE FARE

### 1. ⚙️ **Configurare Environment Variables**

Attualmente mancano le credenziali Supabase. Dobbiamo creare `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://qaafkjoxtzbimacimkrw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhYWZram94dHpiaW1hY2lta3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NTI3NzUsImV4cCI6MjA3MzIyODc3NX0.7hl170u4a1UFlisxTolfFABjYZ5gzYidHVjWyb4L3CA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhYWZram94dHpiaW1hY2lta3J3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzY1Mjc3NSwiZXhwIjoyMDczMjI4Nzc1fQ.Wzye3lJszxwS6D5dRwJsic244SugPZwh68zWNC8W_pQ
```

### 2. 🔍 **Verificare Struttura Database Supabase**

Dobbiamo controllare che esistano TUTTE le tabelle necessarie:

**Tabelle ACCIAIO (già dovrebbero esistere per pergole ferro):**
- ✅ `carport_configurations`
- ✅ `carport_models`
- ✅ `carport_colors`
- ✅ `carport_coverage_types`
- ✅ `carport_structure_types`
- ✅ `carport_surfaces`

**Tabelle LEGNO (questo progetto):**
- ✅ `carport_legno_configurations`
- ✅ `carport_legno_models`
- ✅ `carport_legno_colors`
- ✅ `carport_legno_coverage_types`
- ✅ `carport_legno_structure_types`
- ✅ `carport_legno_accessories`
- ✅ `carport_legno_packages`
- ✅ `carport_legno_surfaces`

### 3. 📝 **Verificare Schema Tabella Configurations**

Le tabelle `carport_configurations` e `carport_legno_configurations` devono avere **colonne diverse**:

**`carport_configurations` (ACCIAIO):**
```sql
- id (uuid, primary key)
- structure_type (text)
- structure_color_id (uuid, FK → carport_colors)
- coverage_color_id (uuid, FK → carport_colors, nullable)
- model_id (uuid)
- coverage_id (uuid)
- surface_id (uuid, nullable)
- customer_name, customer_email, customer_phone
- customer_address, customer_city, customer_cap, customer_province
- width, depth, height (numeric)
- package_type, contact_preference
- total_price (numeric)
- status (text)
- created_at (timestamp)
```

**`carport_legno_configurations` (LEGNO):**
```sql
- id (uuid, primary key)
- structure_type_id (uuid, FK → carport_legno_structure_types)
- color_id (uuid, FK → carport_legno_colors)
- surface_id (uuid, FK → carport_legno_surfaces) ⚠️ OBBLIGATORIO
- model_id (uuid, FK → carport_legno_models)
- coverage_id (uuid, FK → carport_legno_coverage_types)
- customer_name, customer_email, customer_phone
- customer_address, customer_city, customer_postal_code, customer_province
- width, depth, height (numeric)
- package_type, contact_preference
- total_price (numeric)
- status (text)
- created_at (timestamp)
```

**⚠️ DIFFERENZE CHIAVE:**
- ACCIAIO usa `customer_cap` / LEGNO usa `customer_postal_code`
- ACCIAIO ha `structure_color_id` + `coverage_color_id` / LEGNO ha solo `color_id`
- LEGNO ha `surface_id` obbligatorio / ACCIAIO opzionale

### 4. 🎨 **Applicare Visual Improvements anche al Configuratore ACCIAIO**

Il progetto PERGOLE FERRO (acciaio) dovrebbe avere:
- File separato: `/configuratore-pergole-ferro/components/steps/step7-package.tsx`
- Stesso design con badge, gradienti, colored boxes
- Stesso database Supabase, tabelle diverse

**AZIONE NECESSARIA:**
Se hai accesso al repository pergole-ferro, dobbiamo:
1. Copiare le visual improvements
2. Adattare per configuratorType='acciaio'
3. Mantenere stessa UX

---

## 🚀 AZIONI IMMEDIATE

### Fase 1: Environment Setup (ORA)
1. ✅ Creare `.env.local` con credenziali Supabase
2. ✅ Riavviare dev server
3. ✅ Verificare connessione database

### Fase 2: Verifica Database (DOPO FASE 1)
1. Connessione a Supabase con service_role_key
2. Query per verificare esistenza tabelle
3. Verifica schema colonne `configurations`
4. Verifica presenza dati di test

### Fase 3: Test Salvataggio (DOPO FASE 2)
1. Compilare configurazione LEGNO completa (Step 1-7)
2. Inviare dati Step7
3. Verificare salvataggio in `carport_legno_configurations`
4. Verificare email inviate correttamente

### Fase 4: Sincronizzazione Progetto ACCIAIO (OPZIONALE)
Se hai accesso al repo pergole-ferro:
1. Applicare stesso design Step7
2. Verificare salvataggio in `carport_configurations`
3. Test end-to-end entrambi i configuratori

---

## 📁 FILE DA MODIFICARE

### 1. **Creare `.env.local`** (PRIORITY 1)
```env
NEXT_PUBLIC_SUPABASE_URL=https://qaafkjoxtzbimacimkrw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...CA
SUPABASE_SERVICE_ROLE_KEY=eyJ...pQ
NEXT_PUBLIC_APP_URL=https://carport-legno.martello1930.net
```

### 2. **Verificare `lib/supabase/client.ts`** (CHECK)
Dovrebbe usare `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. **Verificare `lib/supabase/server.ts`** (CHECK)
Dovrebbe usare `SUPABASE_SERVICE_ROLE_KEY` per operazioni server-side

### 4. **NO MODIFICHE NECESSARIE AI FILE:**
- ✅ `lib/supabase/tables.ts` → GIÀ PERFETTO
- ✅ `app/actions/save-configuration.ts` → GIÀ GESTISCE ENTRAMBI
- ✅ `components/configurator/steps/step7-package.tsx` → GIÀ CONDIZIONALE

---

## 🔍 QUERY DI VERIFICA SUPABASE

Una volta connessi, eseguire queste query per verificare:

```sql
-- 1. Verifica esistenza tabelle LEGNO
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'carport_legno_%';

-- 2. Verifica esistenza tabelle ACCIAIO
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name LIKE 'carport_%'
  AND table_name NOT LIKE 'carport_legno_%';

-- 3. Verifica schema carport_legno_configurations
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'carport_legno_configurations'
ORDER BY ordinal_position;

-- 4. Verifica schema carport_configurations
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'carport_configurations'
ORDER BY ordinal_position;

-- 5. Conta configurazioni esistenti
SELECT 
  'LEGNO' as tipo,
  COUNT(*) as totale,
  COUNT(CASE WHEN status = 'submitted' THEN 1 END) as submitted,
  MAX(created_at) as ultima_configurazione
FROM carport_legno_configurations

UNION ALL

SELECT 
  'ACCIAIO' as tipo,
  COUNT(*) as totale,
  COUNT(CASE WHEN status = 'submitted' THEN 1 END) as submitted,
  MAX(created_at) as ultima_configurazione
FROM carport_configurations;
```

---

## ⚠️ POTENZIALI PROBLEMI

### Problema 1: Tabelle Non Esistenti
**Sintomo:** Query fallisce con "table does not exist"  
**Soluzione:** Creare tabelle mancanti con migration SQL

### Problema 2: Schema Colonne Diverso
**Sintomo:** Errore "column does not exist" durante INSERT  
**Soluzione:** Allineare schema con ALTER TABLE

### Problema 3: Foreign Key Constraints
**Sintomo:** Errore "violates foreign key constraint"  
**Soluzione:** Popolare tabelle riferite (models, colors, etc.)

### Problema 4: RLS (Row Level Security) Policies
**Sintomo:** INSERT fallisce anche con credenziali corrette  
**Soluzione:** Disabilitare RLS o configurare policies corrette

---

## 📞 PROSSIMI PASSI

**ADESSO:**
1. ✅ Creo `.env.local` con le credenziali fornite
2. ✅ Riavvio dev server
3. ✅ Testo connessione Supabase
4. ✅ Verifico tabelle esistenti

**DOPO:**
- Query struttura database
- Test salvataggio configurazione
- Documentazione discrepanze
- Fix eventuali problemi
- Deploy con credenziali su Vercel

---

**Procedo con Fase 1?** ✅
