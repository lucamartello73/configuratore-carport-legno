"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModernAdminWrapper } from "@/components/admin/modern-admin-wrapper"
import { createClient } from "@/lib/supabase/client"
import { Plus, Edit, Trash2 } from "lucide-react"
import bcrypt from "bcryptjs"

interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingUser, setEditingUser] = useState<Partial<AdminUser & { password?: string }>>({})

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("carport_admin_users")
      .select("id, email, name, role, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching users:", error)
    } else {
      setUsers(data || [])
    }
    setLoading(false)
  }

  const handleSave = async () => {
    const supabase = createClient()

    if (editingUser.id) {
      // Update existing user
      const updateData: any = {
        email: editingUser.email,
        name: editingUser.name,
        role: editingUser.role,
        updated_at: new Date().toISOString(),
      }

      // Only update password if provided
      if (editingUser.password) {
        updateData.password_hash = await bcrypt.hash(editingUser.password, 10)
      }

      const { error } = await supabase.from("carport_admin_users").update(updateData).eq("id", editingUser.id)

      if (error) {
        console.error("Error updating user:", error)
        return
      }
    } else {
      // Create new user
      if (!editingUser.password) {
        alert("La password è obbligatoria per i nuovi utenti")
        return
      }

      const passwordHash = await bcrypt.hash(editingUser.password, 10)

      const { error } = await supabase.from("carport_admin_users").insert([
        {
          email: editingUser.email,
          name: editingUser.name,
          role: editingUser.role,
          password_hash: passwordHash,
        },
      ])

      if (error) {
        console.error("Error creating user:", error)
        return
      }
    }

    setIsEditing(false)
    setEditingUser({})
    fetchUsers()
  }

  const handleEdit = (user: AdminUser) => {
    setEditingUser({ ...user, password: "" })
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo utente?")) return

    const supabase = createClient()
    const { error } = await supabase.from("carport_admin_users").delete().eq("id", id)

    if (error) {
      console.error("Error deleting user:", error)
    } else {
      fetchUsers()
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditingUser({})
  }

  if (loading) {
    return (
      <ModernAdminWrapper title="Utenti Admin">
        <div className="text-center py-8 text-gray-600">Caricamento utenti...</div>
      </ModernAdminWrapper>
    )
  }

  return (
    <ModernAdminWrapper title="Utenti Admin">
      <div className="space-y-6">
        {/* Add/Edit Form */}
        {isEditing && (
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">{editingUser.id ? "Modifica Utente" : "Nuovo Utente"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={editingUser.name || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingUser.email || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Ruolo</Label>
                  <Select
                    value={editingUser.role || ""}
                    onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona ruolo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="operator">Operatore</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="password">
                    Password {editingUser.id ? "(lascia vuoto per non modificare)" : "(obbligatoria)"}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={editingUser.password || ""}
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 text-white">
                  Salva
                </Button>
                <Button variant="outline" onClick={handleCancel} className="bg-transparent">
                  Annulla
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900">Utenti Admin ({users.length})</CardTitle>
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nuovo Utente
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="border rounded-lg p-3 bg-white hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{user.name}</h3>
                          <p className="text-gray-700 text-sm">{user.email}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 text-xs">Ruolo:</span>
                          <p className="text-gray-700">{user.role}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900 text-xs">Creato:</span>
                          <p className="text-gray-700 text-sm">
                            {new Date(user.created_at).toLocaleDateString("it-IT")}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(user)} className="bg-transparent">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(user.id)}
                        className="bg-transparent text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ModernAdminWrapper>
  )
}
