# 📊 Supabase Database Schema Report

**Data:** 2025-11-17  
**Database:** qaafkjoxtzbimacimkrw.supabase.co  
**Status:** ✅ CONNESSO E FUNZIONANTE  

---

## ✅ TABELLE VERIFICATE

### 🌳 CONFIGURATORE LEGNO (carport_legno_*)

| Tabella | Righe | Status |
|---------|-------|--------|
| carport_legno_configurations | 0 | ✅ |
| carport_legno_models | 6 | ✅ |
| carport_legno_colors | 10 | ✅ |
| carport_legno_coverage_types | 5 | ✅ |
| carport_legno_structure_types | 3 | ✅ |

### 🏗️ CONFIGURATORE ACCIAIO (carport_*)

| Tabella | Righe | Status |
|---------|-------|--------|
| carport_configurations | 0 | ✅ |
| carport_models | 4 | ✅ |
| carport_colors | 9 | ✅ |

---

## 📋 SCHEMA `carport_legno_configurations`

### ✅ Colonne Esistenti e Verificate:

```typescript
{
  // Primary Key
  id: uuid (auto-generated)
  
  // Foreign Keys (REQUIRED)
  structure_type_id: uuid → carport_legno_structure_types
  model_id: uuid → carport_legno_models
  coverage_id: uuid → carport_legno_coverage_types
  color_id: uuid → carport_legno_colors
  surface_id: uuid → carport_legno_surfaces
  package_id: uuid | null → carport_legno_packages
  
  // Dimensions (REQUIRED)
  width: number (NOT NULL)
  depth: number (NOT NULL)
  height: number (NOT NULL)
  car_spots: number (default: 1)
  
  // Accessories
  accessory_ids: uuid[] | null
  
  // Pricing
  base_price: number | null
  total_price: number
  
  // Customer Data (REQUIRED)
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  customer_city: string
  customer_postal_code: string  // ⚠️ NOT "customer_cap"!
  
  // Contact Preferences
  contact_preference: enum ['email', 'phone', 'whatsapp'] (default: 'email')
  privacy_accepted: boolean (default: false)
  marketing_accepted: boolean (default: false)
  
  // Notes
  notes: string | null
  
  // Status
  status: enum ['draft', 'submitted', 'processing', 'completed', 'cancelled'] (default: 'draft')
  
  // Session Tracking
  session_id: string | null
  ip_address: string | null
  user_agent: string | null
  
  // Timestamps
  created_at: timestamp (auto)
  updated_at: timestamp (auto)
  submitted_at: timestamp | null
}
```

---

## ❌ COLONNE NON ESISTENTI (da NON usare)

### Nel codice attuale ci sono riferimenti a colonne che NON esistono:

```typescript
// ❌ NON ESISTE
customer_province: string  // Non c'è questa colonna!
customer_cap: string       // Si chiama "customer_postal_code"
package_type: string       // Si chiama "package_id" (FK)
```

---

## 🔧 MODIFICHE NECESSARIE AL CODICE

### 1. **File: `app/actions/save-configuration.ts`**

**PRIMA (ERRATO):**
```typescript
dbData = {
  // ...
  customer_province: configData.customer_province,  // ❌ Colonna non esiste
  customer_postal_code: configData.customer_cap,   // ✅ OK ma confuso
  package_type: configData.package_type,           // ❌ Colonna non esiste
}
```

**DOPO (CORRETTO):**
```typescript
dbData = {
  // ...
  customer_postal_code: configData.customer_postal_code,  // ✅ Nome corretto
  package_id: configData.package_id || null,              // ✅ FK, non stringa
  // ❌ customer_province rimosso (non esiste nel DB)
}
```

### 2. **File: `components/configurator/steps/step7-package.tsx`**

**RIMUOVERE:**
```typescript
customer_province: "",  // ❌ Non esiste nel DB
customer_cap: "",       // ❌ Nome sbagliato
package_type: selectedPackage,  // ❌ Dovrebbe essere package_id (FK)
```

**AGGIUNGERE:**
```typescript
customer_postal_code: "",  // ✅ Nome corretto
package_id: null,          // ✅ FK o null se non usato
```

### 3. **Interfacce TypeScript da aggiornare**

**File: `app/actions/save-configuration.ts`**

```typescript
// PRIMA (ERRATO)
interface LegnoConfigurationData extends BaseConfigurationData {
  configurator_type: 'legno'
  structure_type_id: string
  model_id: string
  coverage_id: string
  color_id: string
  surface_id: string
  customer_province: string  // ❌
  customer_cap: string       // ❌
  package_type: string       // ❌
}

// DOPO (CORRETTO)
interface LegnoConfigurationData extends BaseConfigurationData {
  configurator_type: 'legno'
  structure_type_id: string  // UUID
  model_id: string           // UUID
  coverage_id: string        // UUID
  color_id: string           // UUID
  surface_id: string         // UUID
  customer_postal_code: string  // ✅
  package_id?: string | null    // ✅ UUID or null
  // customer_province RIMOSSO
  // customer_cap RIMOSSO
  // package_type RIMOSSO
}
```

---

## 🎯 VALORI ENUM VALIDI

### `contact_preference`:
- ✅ `'email'` (default)
- ✅ `'phone'`
- ✅ `'whatsapp'`

❌ **NON VALIDI:** 'telefono', 'telephone', ...

### `status`:
- ✅ `'draft'` (default)
- ✅ `'submitted'`
- ✅ `'processing'`
- ✅ `'completed'`
- ✅ `'cancelled'`

❌ **NON VALIDI:** 'pending', 'confirmed', 'test', ...

---

## 🔍 MAPPATURA STEP7 → DATABASE

### Quando l'utente seleziona nel form:

| Form Step7 | Valore Frontend | DB Column | Valore DB |
|------------|----------------|-----------|-----------|
| Email | `'email'` | `contact_preference` | `'email'` ✅ |
| Telefono | `'telefono'` | `contact_preference` | `'phone'` ⚠️ CONVERT! |
| WhatsApp | `'whatsapp'` | `contact_preference` | `'whatsapp'` ✅ |
| Chiavi in Mano | `'chiavi-in-mano'` | `package_id` | UUID da `carport_legno_packages` |
| Solo Fornitura | `'fai-da-te'` | `package_id` | UUID da `carport_legno_packages` |

### ⚠️ CONVERSIONE NECESSARIA:

```typescript
// Nel componente Step7
const contactPreferenceMap = {
  'email': 'email',
  'telefono': 'phone',      // ⚠️ CONVERT telefono → phone
  'whatsapp': 'whatsapp'
}

const dbContactPref = contactPreferenceMap[contactPreference] || 'email'
```

---

## 📝 ESEMPIO INSERT COMPLETO VALIDO

```typescript
const configData = {
  // FK Required
  structure_type_id: "4c99c077-8c34-407e-8ce3-cb2e296a5632",
  model_id: "aa512af5-c1f3-4feb-9ba0-45b78465cd86",
  coverage_id: "42380453-1ac2-4c52-a50f-f07480334d3a",
  color_id: "d6ffed19-c759-472c-ac9c-37a95eccd8bc",
  surface_id: "83846bfb-9e39-4fa4-9505-ce268e87683c",
  
  // Dimensions Required
  width: 300,
  depth: 500,
  height: 250,
  
  // Customer Required
  customer_name: "Mario Rossi",
  customer_email: "mario.rossi@example.com",
  customer_phone: "+39 333 1234567",
  customer_address: "Via Roma 123",
  customer_city: "Milano",
  customer_postal_code: "20100",  // ✅ NOT customer_cap!
  
  // Pricing
  total_price: 5500.50,
  
  // Optional
  notes: "Note personalizzate",
  package_id: null,  // Or UUID from carport_legno_packages
  
  // Defaults (auto-set by DB if omitted)
  contact_preference: "email",  // or 'phone' or 'whatsapp'
  status: "draft",              // Will be 'draft' by default
  privacy_accepted: false,
  marketing_accepted: false,
  car_spots: 1
}
```

---

## ✅ PROSSIMI PASSI

1. **Aggiornare `save-configuration.ts`:**
   - Rimuovere `customer_province`
   - Cambiare `customer_cap` → `customer_postal_code`
   - Cambiare `package_type` → `package_id`
   - Convertire `'telefono'` → `'phone'`

2. **Aggiornare `step7-package.tsx`:**
   - Rimuovere campo province
   - Mappare contact preference correttamente
   - Gestire package_id invece di package_type

3. **Test End-to-End:**
   - Compilare configurazione completa (Step 1-7)
   - Inviare dati
   - Verificare salvataggio in database

4. **Commit e Deploy:**
   - Commit modifiche
   - Push to main
   - Vercel auto-deploy
   - Test produzione

---

## 🎉 CONCLUSIONE

- ✅ Database CONNESSO e FUNZIONANTE
- ✅ Schema MAPPATO correttamente
- ✅ Tabelle SEPARATE tra LEGNO e ACCIAIO
- ⚠️ Codice ha DISCREPANZE da fixare
- 🔧 Modifiche NECESSARIE ai file

**Prossima azione:** Aggiornare il codice per allinearsi al database reale!
