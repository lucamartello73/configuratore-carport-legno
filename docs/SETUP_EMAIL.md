# 📧 Setup Sistema Email Gmail

Guida completa per configurare il sistema email del configuratore coperture.

---

## 🎯 Prerequisiti

- Account Gmail aziendale (es: `info@martello1930.net`)
- Accesso a Google Account per generare App Password
- Verifica 2FA attiva su account Gmail

---

## 🔐 STEP 1: Genera Gmail App Password

### 1.1 Accedi a Google Account Security

Vai su: **https://myaccount.google.com/security**

### 1.2 Abilita Verifica in Due Passaggi (se non attiva)

1. Scorri fino a "Verifica in due passaggi"
2. Click "Attiva"
3. Segui le istruzioni

### 1.3 Genera App Password

1. Torna su: **https://myaccount.google.com/security**
2. Scorri fino a sezione "**App passwords**" o "**Password per le app**"
3. Click su "App passwords"
4. Inserisci password account se richiesta
5. Seleziona:
   - **App**: Mail
   - **Device**: Other (Custom name) → scrivi "Vercel Configuratore"
6. Click "**Generate**"
7. **COPIA LA PASSWORD** (16 caratteri, es: `abcd efgh ijkl mnop`)
8. ⚠️ **SALVALA IMMEDIATAMENTE** - non la vedrai più!

---

## ⚙️ STEP 2: Configura Variabili Ambiente su Vercel

### 2.1 Accedi a Vercel Dashboard

Vai su: **https://vercel.com/lucamartello73s-projects/v0-carport**

### 2.2 Apri Settings

1. Click sul progetto `v0-carport`
2. Tab "**Settings**" (icona ingranaggio)
3. Menu laterale: "**Environment Variables**"

### 2.3 Aggiungi GMAIL_USER

1. Click "**Add New**"
2. **Name**: `GMAIL_USER`
3. **Value**: `info@martello1930.net` (tua email Gmail)
4. **Environment**: Seleziona tutte (Production, Preview, Development)
5. Click "**Save**"

### 2.4 Aggiungi GMAIL_APP_PASSWORD

1. Click "**Add New**"
2. **Name**: `GMAIL_APP_PASSWORD`
3. **Value**: La password a 16 caratteri generata (es: `abcd efgh ijkl mnop`)
   - ⚠️ Rimuovi gli spazi! Incolla come: `abcdefghijklmnop`
4. **Environment**: Seleziona tutte (Production, Preview, Development)
5. Click "**Save**"

### 2.5 Redeploy Progetto

1. Torna alla tab "**Deployments**"
2. Click sui 3 puntini (...) dell'ultimo deployment
3. Click "**Redeploy**"
4. Attendi completamento build (2-3 minuti)

---

## ✅ STEP 3: Test Sistema Email

### 3.1 Test Connessione Gmail (GET)

Apri browser e vai su:
```
https://v0-carport.vercel.app/api/send-email
```

**Risposta attesa**:
```json
{
  "success": true,
  "message": "Gmail connection verified"
}
```

**Se errore 503**: Controlla variabili ambiente

### 3.2 Test Invio Email Completo

1. Vai su: **https://v0-carport.vercel.app/legno**
2. Completa configurazione (tutti i 6 step)
3. Step finale: inserisci email reale
4. Click "**Invia Preventivo**"
5. Verifica:
   - ✅ Messaggio conferma su sito
   - ✅ Email ricevuta su casella cliente
   - ✅ Email ricevuta su `info@martello1930.net`

---

## 🐛 Troubleshooting

### Errore: "Gmail credentials not configured"

**Causa**: Variabili ambiente non impostate su Vercel

**Soluzione**:
1. Verifica su Vercel Settings → Environment Variables
2. Controlla `GMAIL_USER` e `GMAIL_APP_PASSWORD` esistano
3. Redeploy progetto

---

### Errore: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Causa**: App Password errata o non generata

**Soluzione**:
1. Rigenera App Password su Google Account
2. Aggiorna `GMAIL_APP_PASSWORD` su Vercel (rimuovi spazi!)
3. Redeploy

---

### Errore: "Gmail connection failed"

**Causa**: 2FA non attiva su Gmail

**Soluzione**:
1. Vai su https://myaccount.google.com/security
2. Abilita "Verifica in due passaggi"
3. Genera nuova App Password
4. Aggiorna su Vercel

---

### Email non arrivano (ma API ritorna success)

**Causa**: Email finisce in Spam

**Soluzione**:
1. Controlla cartella Spam/Posta indesiderata
2. Aggiungi `info@martello1930.net` ai contatti
3. Marca email come "Non spam"

---

## 🔒 Sicurezza

### ✅ Best Practices

- ✅ **NON** condividere App Password
- ✅ **NON** committare password in Git
- ✅ Usa variabili ambiente solo su Vercel
- ✅ Rigenera App Password ogni 6 mesi
- ✅ Revoca vecchie App Password inutilizzate

### ⚠️ Cosa NON Fare

- ❌ **NON** usare password account normale
- ❌ **NON** salvare password in file .env locale
- ❌ **NON** pushare file .env su GitHub
- ❌ **NON** condividere App Password via email/chat

---

## 📊 Monitoraggio

### Log Email Inviate

Vercel Dashboard → Deployments → Click deployment → **Function Logs**

Cerca:
```
✅ Email inviata: [messageId]
```

### Errori Email

Cerca in logs:
```
❌ Errore invio email:
```

---

## 🔄 Revoca e Rigenera App Password

### Quando Rigenerare

- App Password compromessa
- Cambio account Gmail aziendale
- Manutenzione programmata (ogni 6 mesi)
- Sospetto accesso non autorizzato

### Come Rigenerare

1. Vai su https://myaccount.google.com/security
2. Sezione "App passwords"
3. Click sulla App Password attuale
4. Click "**Revoke**" → Conferma
5. Genera nuova App Password (vedi STEP 1)
6. Aggiorna `GMAIL_APP_PASSWORD` su Vercel
7. Redeploy progetto

---

## 📚 Riferimenti

- **Google App Passwords**: https://myaccount.google.com/apppasswords
- **Nodemailer Docs**: https://nodemailer.com/
- **Vercel Environment Variables**: https://vercel.com/docs/environment-variables

---

## ✉️ Supporto

Per problemi con il sistema email:

- 📧 Email: luca@martello1930.net
- 🐛 GitHub Issues: Repository `lucamartello73/v0-carport1`
- 📖 Documentazione Vercel: https://vercel.com/docs

---

**Ultima modifica**: 2025-01-12  
**Versione**: 1.0  
**Sistema**: Martello1930 - Configuratore Coperture
