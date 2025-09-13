export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // Simple fetch-based client for basic operations
  return {
    from: (table: string) => ({
      select: (columns = "*") => ({
        ilike: (column: string, pattern: string) => ({
          maybeSingle: () => ({
            then: async (resolve: (result: { data: any | null; error: any }) => void) => {
              try {
                const encodedPattern = encodeURIComponent(pattern)
                const response = await fetch(
                  `${supabaseUrl}/rest/v1/${table}?select=${columns}&${column}=ilike.${encodedPattern}`,
                  {
                    headers: {
                      apikey: supabaseKey,
                      Authorization: `Bearer ${supabaseKey}`,
                      "Content-Type": "application/json",
                    },
                  },
                )
                const data = await response.json()
                // maybeSingle returns the first item or null if no items found
                resolve({ data: data && data.length > 0 ? data[0] : null, error: null })
              } catch (error) {
                console.error("Supabase ilike error:", error)
                resolve({ data: null, error })
              }
            },
          }),
          then: async (resolve: (result: { data: any[]; error: null }) => void) => {
            try {
              const encodedPattern = encodeURIComponent(pattern)
              const response = await fetch(
                `${supabaseUrl}/rest/v1/${table}?select=${columns}&${column}=ilike.${encodedPattern}`,
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
              console.error("Supabase ilike error:", error)
              resolve({ data: [], error: null })
            }
          },
        }),
        eq: (column: string, value: any) => ({
          order: (orderColumn: string, options?: { ascending?: boolean }) => ({
            then: async (resolve: (result: { data: any[]; error: null }) => void) => {
              try {
                const response = await fetch(
                  `${supabaseUrl}/rest/v1/${table}?select=${columns}&${column}=eq.${value}&order=${orderColumn}.${options?.ascending ? "asc" : "desc"}`,
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
              const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=${columns}&${column}=eq.${value}`, {
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
      insert: (values: any) => ({
        select: (columns = "*") => ({
          single: () => ({
            then: async (resolve: (result: { data: any; error: any }) => void) => {
              try {
                const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
                  method: "POST",
                  headers: {
                    apikey: supabaseKey,
                    Authorization: `Bearer ${supabaseKey}`,
                    "Content-Type": "application/json",
                    Prefer: "return=representation",
                  },
                  body: JSON.stringify(values),
                })

                if (response.ok) {
                  const data = await response.json()
                  resolve({ data: data && data.length > 0 ? data[0] : null, error: null })
                } else {
                  const errorText = await response.text()
                  let errorObj
                  try {
                    errorObj = JSON.parse(errorText)
                  } catch {
                    errorObj = { message: errorText }
                  }
                  resolve({ data: null, error: errorObj })
                }
              } catch (error) {
                console.error("Supabase insert error:", error)
                resolve({ data: null, error })
              }
            },
          }),
          then: async (resolve: (result: { data: any[]; error: any }) => void) => {
            try {
              const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
                method: "POST",
                headers: {
                  apikey: supabaseKey,
                  Authorization: `Bearer ${supabaseKey}`,
                  "Content-Type": "application/json",
                  Prefer: "return=representation",
                },
                body: JSON.stringify(values),
              })

              if (response.ok) {
                const data = await response.json()
                resolve({ data: data || [], error: null })
              } else {
                const errorText = await response.text()
                let errorObj
                try {
                  errorObj = JSON.parse(errorText)
                } catch {
                  errorObj = { message: errorText }
                }
                resolve({ data: [], error: errorObj })
              }
            } catch (error) {
              console.error("Supabase insert error:", error)
              resolve({ data: [], error })
            }
          },
        }),
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
              body: JSON.stringify(values),
            })

            if (response.ok) {
              resolve({ data: null, error: null })
            } else {
              const errorText = await response.text()
              let errorObj
              try {
                errorObj = JSON.parse(errorText)
              } catch {
                errorObj = { message: errorText }
              }
              resolve({ data: null, error: errorObj })
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
                const errorText = await response.text()
                let errorObj
                try {
                  errorObj = JSON.parse(errorText)
                } catch {
                  errorObj = { message: errorText }
                }
                resolve({ data: null, error: errorObj })
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
                const errorText = await response.text()
                let errorObj
                try {
                  errorObj = JSON.parse(errorText)
                } catch {
                  errorObj = { message: errorText }
                }
                resolve({ data: null, error: errorObj })
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
