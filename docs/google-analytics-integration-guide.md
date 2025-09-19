# Guida Integrazione Google Analytics 4 - Configuratore Carport

## Modifiche Effettuate

### 1. Layout Principale (`app/layout.tsx`)
- **MODIFICA**: Aggiornato l'ID Google Analytics da `G-XXXXXXXXXX` a `G-8BW6WP9PR1`
- **POSIZIONE**: Script gtag.js nel `<head>` del layout
- **FUNZIONE**: Inizializzazione automatica di GA4 al caricamento della pagina

### 2. Pagina Configuratore (`app/configuratore/page.tsx`)
- **MODIFICA**: Aggiornato l'ID nel parametro `initializeGoogleAnalytics("G-8BW6WP9PR1")`
- **POSIZIONE**: Hook `useEffect` di inizializzazione
- **FUNZIONE**: Tracking automatico di ogni step del configuratore

### 3. Libreria Analytics (`lib/analytics/gtag.ts`)
- **MODIFICA**: Aggiornato l'ID di default da `G-XXXXXXXXXX` a `G-8BW6WP9PR1`
- **MODIFICA**: Aggiunti controlli di sicurezza per evitare errori se gtag non è disponibile
- **MODIFICA**: Migliorati i log di debug con `console.log("[v0] ...")`
- **POSIZIONE**: Funzioni `initializeGoogleAnalytics`, `trackConfiguratorStep`, `trackConfiguratorSubmit`, `trackConfiguratorAbandon`

### 4. Step Finale (`components/configurator/step7-package.tsx`)
- **STATO**: Già integrato correttamente con `trackConfiguratorSubmit`
- **FUNZIONE**: Tracking dell'invio configurazione con parametri dettagliati

## Eventi Tracciati

### 1. `configurator_step`
- **QUANDO**: Ad ogni cambio step del configuratore
- **PARAMETRI**:
  - `configurator_name`: "coperture_auto"
  - `step_name`: "step_1_modello", "step_2_tipo_struttura", ecc.
  - `traffic_source`: UTM source o dominio referrer
  - `traffic_medium`: UTM medium o "referral"
  - `previous_step`: Step precedente (numero)
  - `configuration_progress`: Percentuale completamento (0-100)

### 2. `configurator_form_submit`
- **QUANDO**: Invio configurazione completata
- **PARAMETRI**:
  - `configurator_name`: "coperture_auto"
  - `step_name`: "form_submit"
  - `traffic_source`: UTM source o dominio referrer
  - `traffic_medium`: UTM medium o "referral"
  - `package_type`: "chiavi-in-mano" o "fai-da-te"
  - `contact_preference`: "email", "whatsapp", "telefono"
  - `customer_city`: Città del cliente
  - `customer_province`: Provincia del cliente
  - `structure_type`: Tipo struttura selezionata
  - `has_dimensions`: Boolean se dimensioni specificate

### 3. `configurator_abandon`
- **QUANDO**: Abbandono pagina o nascondimento tab
- **PARAMETRI**:
  - `configurator_name`: "coperture_auto"
  - `step_name`: Step corrente al momento dell'abbandono
  - `traffic_source`: UTM source o dominio referrer
  - `traffic_medium`: UTM medium o "referral"
  - `abandon_type`: "page_unload" o "tab_hidden"

## Funzionalità di Sicurezza

- **Controllo `window.gtag`**: Tutti gli eventi verificano che gtag sia disponibile prima dell'invio
- **Fallback graceful**: Se GA4 non è caricato, il configuratore continua a funzionare normalmente
- **Log di debug**: Tutti gli eventi sono loggati in console per debugging
- **Cleanup automatico**: Event listeners rimossi automaticamente per evitare memory leak

## Verifica Funzionamento

1. **Console Browser**: Verificare i log `[v0] Google Analytics initialized` e `[v0] Tracking configurator step`
2. **Google Analytics**: Eventi visibili in tempo reale nella dashboard GA4
3. **Network Tab**: Richieste a `google-analytics.com/g/collect` ad ogni evento

## ID Google Analytics
- **Measurement ID**: `G-8BW6WP9PR1`
- **Configurato in**: `app/layout.tsx`, `app/configuratore/page.tsx`, `lib/analytics/gtag.ts`
