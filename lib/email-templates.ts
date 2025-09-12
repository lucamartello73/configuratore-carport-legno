import type { CustomerData, ConfigurationData } from "./database"

export function generateCustomerEmailText(
  customerData: CustomerData,
  configuration: ConfigurationData,
  configurationId: string,
): string {
  return `
MARTELLO 1930 - Conferma Richiesta Preventivo

Gentile ${customerData.firstName} ${customerData.lastName},

Grazie per aver utilizzato il nostro configuratore! Abbiamo ricevuto la sua richiesta di preventivo per una pergola personalizzata.

ID RICHIESTA: ${configurationId.slice(0, 8).toUpperCase()}
(Conservi questo codice per future comunicazioni)

DETTAGLI CONFIGURAZIONE:
- Dimensioni: ${configuration.width} × ${configuration.depth} × ${configuration.height} cm
- Superficie: ${((configuration.width * configuration.depth) / 10000).toFixed(1)} m²
- Colore: ${configuration.color_name}
- Tipo Servizio: ${configuration.service_type === "chiavi-in-mano" ? "Chiavi in Mano" : "Fai da Te"}
${
  configuration.accessories && configuration.accessories.length > 0
    ? `- Accessori: ${configuration.accessories.length} selezionati`
    : ""
}

PROSSIMI PASSI:
1. Elaborazione: Il nostro team tecnico analizzerà la sua richiesta
2. Contatto: La contatteremo entro 24 ore per discutere i dettagli
3. Preventivo: Riceverà un preventivo dettagliato personalizzato
4. Sopralluogo: Se necessario, organizzeremo un sopralluogo gratuito

CONTATTI:
Email: info@martello1930.it
Telefono: +39 0123 456 789
WhatsApp: +39 333 123 4567
Orari: Lun-Ven 8:00-18:00, Sab 8:00-12:00

Cordiali saluti,
Il Team MARTELLO 1930

---
Questa email è stata generata automaticamente dal configuratore MARTELLO 1930.
© 2024 MARTELLO 1930 - Pergole in Legno Artigianali dal 1930
  `
}

export function generateAdminEmailText(
  customerData: CustomerData,
  configuration: ConfigurationData,
  configurationId: string,
): string {
  return `
🚨 NUOVA RICHIESTA PREVENTIVO - AZIONE RICHIESTA

ID Richiesta: ${configurationId.slice(0, 8).toUpperCase()}
Data: ${new Date().toLocaleString("it-IT")}

DATI CLIENTE:
Nome: ${customerData.firstName} ${customerData.lastName}
Email: ${customerData.email}
Telefono: ${customerData.phone}
Indirizzo: ${customerData.address}
Preferenza Contatto: ${configuration.contact_preference}

CONFIGURAZIONE:
Dimensioni: ${configuration.width} × ${configuration.depth} × ${configuration.height} cm
Superficie: ${((configuration.width * configuration.depth) / 10000).toFixed(1)} m²
Colore: ${configuration.color_name}
Tipo Servizio: ${configuration.service_type === "chiavi-in-mano" ? "Chiavi in Mano" : "Fai da Te"}
${
  configuration.accessories && configuration.accessories.length > 0
    ? `Accessori: ${configuration.accessories.length} selezionati`
    : "Accessori: Nessuno"
}

AZIONI RICHIESTE:
1. Contattare il cliente entro 24 ore
2. Preparare preventivo dettagliato
3. Valutare necessità sopralluogo

---
Sistema Configuratore MARTELLO 1930
  `
}

// WhatsApp message template
export function generateWhatsAppMessage(customerData: CustomerData, configurationId: string): string {
  return `Ciao ${customerData.firstName}! 👋

Grazie per aver configurato la tua pergola con MARTELLO 1930! 

🏷️ ID Richiesta: ${configurationId.slice(0, 8).toUpperCase()}

Il nostro team sta preparando il tuo preventivo personalizzato. Ti contatteremo entro 24 ore per discutere tutti i dettagli.

Hai domande? Rispondi pure a questo messaggio!

🏠 MARTELLO 1930 - Dal 1930 creiamo pergole artigianali`
}
