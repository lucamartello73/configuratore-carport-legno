export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // Simple fetch-based client for basic operations
  return {
    from: (table: string) => ({
      select: (columns = "*") => ({
        order: (column: string, options?: { ascending?: boolean }) => ({
          then: async (resolve: (result: { data: any[]; error: null }) => void) => {
            try {
              const response = await fetch(
                `${supabaseUrl}/rest/v1/${table}?select=${columns}&order=${column}.${options?.ascending ? "asc" : "desc"}`,
                {
                  headers: {
                    apikey: supabaseKey,
                    Authorization: `Bearer ${supabaseKey}`,
                    "Content-Type": "application/json",
                  },
                },
              )
              const data = await response.json()
              resolve({ data: data || [], error: null })
            } catch (error) {
              console.error("Supabase error:", error)
              resolve({ data: [], error: null })
            }
          },
        }),
        then: async (resolve: (result: { data: any[]; error: null }) => void) => {
          try {
            const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=${columns}`, {
              headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`,
                "Content-Type": "application/json",
              },
            })
            const data = await response.json()
            resolve({ data: data || [], error: null })
          } catch (error) {
            console.error("Supabase error:", error)
            resolve({ data: [], error: null })
          }
        },
      }),
      insert: (values: any[]) => ({
        then: async (resolve: (result: { data: any; error: any }) => void) => {
          try {
            const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
              method: "POST",
              headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`,
                "Content-Type": "application/json",
                Prefer: "return=minimal",
              },
              body: JSON.stringify(values[0]),
            })

            if (response.ok) {
              resolve({ data: null, error: null })
            } else {
              const error = await response.text()
              resolve({ data: null, error: { message: error } })
            }
          } catch (error) {
            console.error("Supabase insert error:", error)
            resolve({ data: null, error })
          }
        },
      }),
      update: (values: any) => ({
        eq: (column: string, value: any) => ({
          then: async (resolve: (result: { data: any; error: any }) => void) => {
            try {
              const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${column}=eq.${value}`, {
                method: "PATCH",
                headers: {
                  apikey: supabaseKey,
                  Authorization: `Bearer ${supabaseKey}`,
                  "Content-Type": "application/json",
                  Prefer: "return=minimal",
                },
                body: JSON.stringify(values),
              })

              if (response.ok) {
                resolve({ data: null, error: null })
              } else {
                const error = await response.text()
                resolve({ data: null, error: { message: error } })
              }
            } catch (error) {
              console.error("Supabase update error:", error)
              resolve({ data: null, error })
            }
          },
        }),
      }),
      delete: () => ({
        eq: (column: string, value: any) => ({
          then: async (resolve: (result: { data: any; error: any }) => void) => {
            try {
              const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${column}=eq.${value}`, {
                method: "DELETE",
                headers: {
                  apikey: supabaseKey,
                  Authorization: `Bearer ${supabaseKey}`,
                  "Content-Type": "application/json",
                },
              })

              if (response.ok) {
                resolve({ data: null, error: null })
              } else {
                const error = await response.text()
                resolve({ data: null, error: { message: error } })
              }
            } catch (error) {
              console.error("Supabase delete error:", error)
              resolve({ data: null, error })
            }
          },
        }),
      }),
    }),
    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, file: File) => {
          try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await fetch(`${supabaseUrl}/storage/v1/object/${bucket}/${path}`, {
              method: "POST",
              headers: {
                apikey: supabaseKey,
                Authorization: `Bearer ${supabaseKey}`,
              },
              body: formData,
            })

            if (response.ok) {
              return { data: { path }, error: null }
            } else {
              const error = await response.text()
              return { data: null, error: { message: error } }
            }
          } catch (error) {
            console.error("Storage upload error:", error)
            return { data: null, error }
          }
        },
        getPublicUrl: (path: string) => ({
          data: { publicUrl: `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}` },
        }),
      }),
    },
  }
}
