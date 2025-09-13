export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  // Simple fetch-based client for server operations
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
    }),
  }
}
