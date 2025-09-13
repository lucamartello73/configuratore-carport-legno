"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AdminLayout } from "@/components/admin/admin-layout"
import { sendEmail } from "@/lib/email/sendwith"
import { Mail, Send } from "lucide-react"

export default function EmailsPage() {
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    html: "",
  })
  const [isSending, setIsSending] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSend = async () => {
    if (!emailData.to || !emailData.subject || !emailData.html) {
      alert("Compila tutti i campi")
      return
    }

    setIsSending(true)
    setResult(null)

    try {
      const response = await sendEmail(emailData)

      if (response.success) {
        setResult({ success: true, message: "Email inviata con successo!" })
        setEmailData({ to: "", subject: "", html: "" })
      } else {
        setResult({ success: false, message: response.error || "Errore nell'invio dell'email" })
      }
    } catch (error) {
      setResult({ success: false, message: "Errore nell'invio dell'email" })
    } finally {
      setIsSending(false)
    }
  }

  const emailTemplates = [
    {
      name: "Conferma Configurazione",
      subject: "Configurazione Carport Ricevuta",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 20px; text-align: center;">
            <h1 style="color: #166534; margin: 0;">Configurazione Carport Ricevuta</h1>
          </div>
          <div style="padding: 30px 20px;">
            <p style="color: #374151; font-size: 16px;">Gentile Cliente,</p>
            <p style="color: #374151; font-size: 16px;">
              Grazie per aver configurato il tuo carport personalizzato. Ti contatteremo presto per finalizzare il progetto.
            </p>
          </div>
        </div>
      `,
    },
    {
      name: "Preventivo Pronto",
      subject: "Il tuo preventivo carport è pronto",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 20px; text-align: center;">
            <h1 style="color: #166534; margin: 0;">Preventivo Carport Pronto</h1>
          </div>
          <div style="padding: 30px 20px;">
            <p style="color: #374151; font-size: 16px;">Gentile Cliente,</p>
            <p style="color: #374151; font-size: 16px;">
              Il preventivo per il tuo carport personalizzato è pronto. Contattaci per discutere i dettagli.
            </p>
          </div>
        </div>
      `,
    },
  ]

  const loadTemplate = (template: (typeof emailTemplates)[0]) => {
    setEmailData({
      to: emailData.to,
      subject: template.subject,
      html: template.html,
    })
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Email Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Template Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {emailTemplates.map((template, index) => (
                <div key={index} className="border rounded-lg p-4 bg-green-50">
                  <h3 className="font-semibold text-green-800 mb-2">{template.name}</h3>
                  <p className="text-green-600 text-sm mb-3">{template.subject}</p>
                  <Button
                    size="sm"
                    onClick={() => loadTemplate(template)}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Usa Template
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Send Email Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-800">Invia Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="to">Destinatario</Label>
              <Input
                id="to"
                type="email"
                value={emailData.to}
                onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                placeholder="cliente@email.com"
              />
            </div>
            <div>
              <Label htmlFor="subject">Oggetto</Label>
              <Input
                id="subject"
                value={emailData.subject}
                onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                placeholder="Oggetto dell'email"
              />
            </div>
            <div>
              <Label htmlFor="html">Contenuto HTML</Label>
              <Textarea
                id="html"
                value={emailData.html}
                onChange={(e) => setEmailData({ ...emailData, html: e.target.value })}
                placeholder="Contenuto HTML dell'email"
                rows={10}
              />
            </div>

            {result && (
              <div
                className={`p-4 rounded-lg ${
                  result.success
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {result.message}
              </div>
            )}

            <Button
              onClick={handleSend}
              disabled={isSending}
              className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isSending ? "Invio in corso..." : "Invia Email"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
