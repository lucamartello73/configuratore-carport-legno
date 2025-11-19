import { createClient } from "@/lib/supabase/server"

export default async function DataPage() {
  const supabase = await createClient()

  const { data: configurations, error } = await supabase
    .from("carport_configurations")
    .select(`
      *,
      carport_models(name, description),
      carport_surfaces(name, description),
      carport_coverage_types(name, description),
      carport_colors!carport_configurations_structure_color_id_fkey(name, hex_value),
      coverage_color:carport_colors!carport_configurations_coverage_color_id_fkey(name, hex_value)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching configurations:", error)
    return <div className="p-8">Errore nel caricamento dei dati: {error.message}</div>
  }

  console.log("[v0] Admin configurations data:", JSON.stringify(configurations?.slice(0, 1), null, 2))

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Dati Configurazioni Carport</h1>

      <div className="mb-4">
        <p className="text-lg">
          <strong>Totale configurazioni salvate:</strong> {configurations?.length || 0}
        </p>
      </div>

      {configurations && configurations.length > 0 ? (
        <div className="grid gap-6">
          {configurations.map((config) => (
            <div key={config.id} className="border rounded-lg p-6 bg-white shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Cliente</h3>
                  <p>
                    <strong>Nome:</strong> {config.customer_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {config.customer_email}
                  </p>
                  <p>
                    <strong>Telefono:</strong> {config.customer_phone}
                  </p>
                  <p>
                    <strong>Indirizzo:</strong> {config.customer_address}
                  </p>
                  <p>
                    <strong>Città:</strong> {config.customer_city} ({config.customer_cap})
                  </p>
                  <p>
                    <strong>Provincia:</strong> {config.customer_province}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Configurazione</h3>
                  <div className="bg-blue-50 p-3 rounded mb-3">
                    <p className="font-medium text-blue-900">
                      <strong>🏗️ Modello Struttura:</strong>{" "}
                      {config.carport_models?.name || `ID: ${config.model_id}` || "Non specificato"}
                    </p>
                    <p className="font-medium text-blue-900">
                      <strong>📐 Tipo Struttura:</strong> {config.structure_type || "Non specificato"}
                    </p>
                  </div>
                  <p>
                    <strong>Dimensioni:</strong> {config.width}x{config.depth}x{config.height}cm
                  </p>
                  <p>
                    <strong>Superficie:</strong> {config.carport_surfaces?.name || "Non specificato"}
                  </p>
                  <p>
                    <strong>Copertura:</strong> {config.carport_coverage_types?.name || "Non specificato"}
                  </p>
                  <p>
                    <strong>Pacchetto:</strong> {config.package_type}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Dettagli</h3>
                  <p>
                    <strong>Prezzo totale:</strong> €{config.total_price}
                  </p>
                  <p>
                    <strong>Status:</strong> {config.status}
                  </p>
                  <p>
                    <strong>Preferenza contatto:</strong> {config.contact_preference}
                  </p>
                  <p>
                    <strong>Data creazione:</strong> {new Date(config.created_at).toLocaleDateString("it-IT")}
                  </p>

                  <div className="mt-2">
                    <p>
                      <strong>Colore struttura:</strong>
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: config.carport_colors?.hex_value }}
                      ></div>
                      <span>{config.carport_colors?.name}</span>
                    </div>
                  </div>

                  <div className="mt-2">
                    <p>
                      <strong>Colore copertura:</strong>
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: config.coverage_color?.hex_value }}
                      ></div>
                      <span>{config.coverage_color?.name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">Nessuna configurazione salvata ancora.</p>
        </div>
      )}
    </div>
  )
}
