"use client"

import type React from "react"
import { useRouter } from "next/navigation"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Package, Palette, Shield, BarChart3, Eye, Edit, Trash2, Plus, LogOut } from "lucide-react"
import { getAdminAuthenticated, setAdminAuthenticated } from "@/lib/localStorage"
import {
  getStructureTypes,
  getCoverageTypes,
  getAccessories,
  getColors,
  type StructureType,
  type CoverageType,
  type AccessoryType,
  type ColorType,
} from "@/lib/database"
import { ConfigurationDetailsModal } from "@/components/admin/configuration-details-modal"
import { ImageUpload } from "@/components/admin/image-upload"

interface EditModalState {
  isOpen: boolean
  type: "structure" | "coverage" | "accessory" | "color" | null
  mode: "create" | "edit"
  item: any
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [activeTab, setActiveTab] = useState("dashboard")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Data states
  const [stats, setStats] = useState({
    structures: 0,
    coverages: 0,
    accessories: 0,
    colors: 0,
    configurations: 0,
  })
  const [structures, setStructures] = useState<StructureType[]>([])
  const [coverages, setCoverages] = useState<CoverageType[]>([])
  const [accessories, setAccessories] = useState<AccessoryType[]>([])
  const [colors, setColors] = useState<ColorType[]>([])
  const [configurations, setConfigurations] = useState<any[]>([])

  const [modal, setModal] = useState<EditModalState>({
    isOpen: false,
    type: null,
    mode: "create",
    item: null,
  })
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    hex_value: "",
    category: "smalto",
    image: "",
  })

  const [configDetailsModal, setConfigDetailsModal] = useState({
    isOpen: false,
    configuration: null,
  })

  useEffect(() => {
    // Check if already authenticated
    const authenticated = getAdminAuthenticated()
    if (authenticated) {
      setIsAuthenticated(true)
      loadAdminData()
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple password check (in production, use proper authentication)
    if (password === "admin123") {
      setIsAuthenticated(true)
      setAdminAuthenticated(true)
      setLoginError("")
      loadAdminData()
    } else {
      setLoginError("Password non corretta")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setAdminAuthenticated(false)
    setPassword("")
    router.push("/")
  }

  const loadAdminData = async () => {
    setLoading(true)
    try {
      // Load all data
      const [structureData, coverageData, accessoryData, colorData] = await Promise.all([
        getStructureTypes(),
        getCoverageTypes(),
        getAccessories(),
        getColors(),
      ])

      setStructures(structureData)
      setCoverages(coverageData)
      setAccessories(accessoryData)
      setColors(colorData)

      try {
        const configResponse = await fetch("/api/admin/configurations")
        if (configResponse.ok) {
          const configResult = await configResponse.json()
          const configData = configResult.success ? configResult.data : []
          setConfigurations(configData)

          // Update stats with correct configurations count
          setStats({
            structures: structureData.length,
            coverages: coverageData.length,
            accessories: accessoryData.length,
            colors: colorData.length,
            configurations: configData.length,
          })
        }
      } catch (error) {
        console.error("Error loading configurations:", error)
        setConfigurations([])

        // Update stats without configurations
        setStats({
          structures: structureData.length,
          coverages: coverageData.length,
          accessories: accessoryData.length,
          colors: colorData.length,
          configurations: 0,
        })
      }
    } catch (error) {
      console.error("Error loading admin data:", error)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (type: EditModalState["type"], mode: EditModalState["mode"], item?: any) => {
    setModal({ isOpen: true, type, mode, item })
    if (mode === "edit" && item) {
      setFormData({
        name: item.name || "",
        description: item.description || "",
        icon: item.icon || "",
        hex_value: item.hex_value || "",
        category: item.category || "smalto",
        image: item.image || "",
      })
    } else {
      setFormData({ name: "", description: "", icon: "", hex_value: "", category: "smalto", image: "" })
    }
  }

  const closeModal = () => {
    setModal({ isOpen: false, type: null, mode: "create", item: null })
    setFormData({ name: "", description: "", icon: "", hex_value: "", category: "smalto", image: "" })
  }

  const openConfigDetailsModal = (configuration: any) => {
    setConfigDetailsModal({ isOpen: true, configuration })
  }

  const closeConfigDetailsModal = () => {
    setConfigDetailsModal({ isOpen: false, configuration: null })
  }

  const handleSave = async () => {
    try {
      const endpoint = `/api/admin/${modal.type}s`
      const method = modal.mode === "create" ? "POST" : "PUT"

      const body = modal.mode === "edit" ? { id: modal.item.id, ...formData } : formData

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        closeModal()
        loadAdminData() // Reload data
      } else {
        const error = await response.json()
        alert(error.error || "Errore durante il salvataggio")
      }
    } catch (error) {
      console.error("Error saving:", error)
      alert("Errore di connessione")
    }
  }

  const handleDelete = async (type: string, id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo elemento?")) return

    try {
      const response = await fetch(`/api/admin/${type}s?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        loadAdminData() // Reload data
      } else {
        const error = await response.json()
        alert(error.error || "Errore durante l'eliminazione")
      }
    } catch (error) {
      console.error("Error deleting:", error)
      alert("Errore di connessione")
    }
  }

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-emerald-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">MARTELLO 1930</CardTitle>
            <CardDescription>Pannello Amministrazione</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Inserisci la password admin"
                  className="mt-2"
                />
              </div>
              {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                Accedi
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento pannello admin...</p>
        </div>
      </div>
    )
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-emerald-700 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600">MARTELLO 1930</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Esci
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="configurations">Richieste</TabsTrigger>
            <TabsTrigger value="structures">Strutture</TabsTrigger>
            <TabsTrigger value="coverages">Coperture</TabsTrigger>
            <TabsTrigger value="accessories">Accessori</TabsTrigger>
            <TabsTrigger value="colors">Colori</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Configurazioni</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.configurations}</div>
                    <p className="text-xs text-muted-foreground">Richieste totali</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Strutture</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.structures}</div>
                    <p className="text-xs text-muted-foreground">Tipi disponibili</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Coperture</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.coverages}</div>
                    <p className="text-xs text-muted-foreground">Opzioni disponibili</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Accessori</CardTitle>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.accessories}</div>
                    <p className="text-xs text-muted-foreground">Accessori disponibili</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Colori</CardTitle>
                    <Palette className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.colors}</div>
                    <p className="text-xs text-muted-foreground">Colori disponibili</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Configurations Tab */}
          <TabsContent value="configurations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Richieste Configurazioni</h2>
            </div>

            <div className="grid gap-6">
              {configurations.length > 0 ? (
                configurations.map((config) => (
                  <Card key={config.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {config.contact_data?.firstName} {config.contact_data?.lastName}
                          </h3>
                          <p className="text-gray-600">
                            {config.configuratorelegno_pergola_types?.name} - {config.width}x{config.depth}x
                            {config.height}cm
                          </p>
                          <p className="text-sm text-gray-500">
                            Email: {config.contact_data?.email} | Tel: {config.contact_data?.phone}
                          </p>
                          <p className="text-sm text-gray-500">
                            Servizio: {config.service_type} | Data:{" "}
                            {new Date(config.created_at).toLocaleDateString("it-IT")}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={() => openConfigDetailsModal(config)}>
                            <Eye className="w-4 h-4 mr-2" />
                            Dettagli
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                            onClick={() => handleDelete("configuration", config.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Elimina
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600 text-center py-8">Nessuna richiesta di configurazione al momento.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Structures Tab */}
          <TabsContent value="structures" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Gestione Strutture</h2>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => openModal("structure", "create")}>
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi Struttura
              </Button>
            </div>

            <div className="grid gap-6">
              {structures.map((structure) => (
                <Card key={structure.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                          {structure.image ? (
                            <img
                              src={structure.image || "/placeholder.svg"}
                              alt={structure.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{structure.name}</h3>
                          <p className="text-gray-600">{structure.description}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Creato: {new Date(structure.created_at).toLocaleDateString("it-IT")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openModal("structure", "edit", structure)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Modifica
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 bg-transparent"
                          onClick={() => handleDelete("structure", structure.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Elimina
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Coverages Tab */}
          <TabsContent value="coverages" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Gestione Coperture</h2>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => openModal("coverage", "create")}>
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi Copertura
              </Button>
            </div>

            <div className="grid gap-6">
              {coverages.map((coverage) => (
                <Card key={coverage.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                          {coverage.image ? (
                            <img
                              src={coverage.image || "/placeholder.svg"}
                              alt={coverage.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Shield className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{coverage.name}</h3>
                          <p className="text-gray-600">{coverage.description}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Creato: {new Date(coverage.created_at).toLocaleDateString("it-IT")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openModal("coverage", "edit", coverage)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Modifica
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 bg-transparent"
                          onClick={() => handleDelete("coverage", coverage.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Elimina
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Accessories Tab */}
          <TabsContent value="accessories" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Gestione Accessori</h2>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => openModal("accessory", "create")}>
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi Accessorio
              </Button>
            </div>

            <div className="grid gap-6">
              {accessories.map((accessory) => (
                <Card key={accessory.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                          {accessory.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{accessory.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Creato: {new Date(accessory.created_at).toLocaleDateString("it-IT")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => openModal("accessory", "edit", accessory)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Modifica
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 bg-transparent"
                          onClick={() => handleDelete("accessory", accessory.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Elimina
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value="colors" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Gestione Colori</h2>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => openModal("color", "create")}>
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi Colore
              </Button>
            </div>

            {/* Colors by Category */}
            {["smalto", "impregnante-legno", "impregnante-pastello"].map((category) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="capitalize">{category.replace("-", " ")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {colors
                      .filter((color) => color.category === category)
                      .map((color) => (
                        <div key={color.id} className="border rounded-lg p-3">
                          <div
                            className="w-full h-12 rounded-md mb-2 border"
                            style={{ backgroundColor: color.hex_value }}
                          />
                          <p className="text-sm font-medium text-gray-900 truncate">{color.name}</p>
                          <p className="text-xs text-gray-500">{color.hex_value}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs bg-transparent"
                              onClick={() => openModal("color", "edit", color)}
                            >
                              <Edit className="w-3 h-3 mr-1" />
                              Modifica
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs text-red-600 bg-transparent"
                              onClick={() => handleDelete("color", color.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <Dialog open={modal.isOpen} onOpenChange={closeModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {modal.mode === "create" ? "Aggiungi" : "Modifica"}{" "}
                {modal.type === "structure"
                  ? "Struttura"
                  : modal.type === "coverage"
                    ? "Copertura"
                    : modal.type === "accessory"
                      ? "Accessorio"
                      : modal.type === "color"
                        ? "Colore"
                        : ""}
              </DialogTitle>
              <DialogDescription>
                {modal.mode === "create" ? "Crea un nuovo elemento" : "Modifica l'elemento selezionato"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {(modal.type === "structure" || modal.type === "coverage") && (
                <ImageUpload
                  value={formData.image}
                  onChange={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
                  label="Immagine"
                />
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                />
              </div>

              {(modal.type === "structure" || modal.type === "coverage") && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Descrizione
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              )}

              {modal.type === "accessory" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="icon" className="text-right">
                    Icona
                  </Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="col-span-3"
                    placeholder="🔥"
                  />
                </div>
              )}

              {modal.type === "color" && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="category" className="text-right">
                      Categoria
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smalto">Smalto</SelectItem>
                        <SelectItem value="impregnante-legno">Impregnante Legno</SelectItem>
                        <SelectItem value="impregnante-pastello">Impregnante Pastello</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="hex_value" className="text-right">
                      Colore
                    </Label>
                    <Input
                      id="hex_value"
                      type="color"
                      value={formData.hex_value}
                      onChange={(e) => setFormData({ ...formData, hex_value: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closeModal}>
                Annulla
              </Button>
              <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                {modal.mode === "create" ? "Crea" : "Salva"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ConfigurationDetailsModal
          isOpen={configDetailsModal.isOpen}
          onClose={closeConfigDetailsModal}
          configuration={configDetailsModal.configuration}
        />
      </main>
    </div>
  )
}
