export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  // Simple fetch-based admin client
  return {
    from: (table: string) => ({
      select: (columns = "*") => ({
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
            console.error("Supabase admin error:", error)
            resolve({ data: [], error: null })
          }
        },
      }),
    }),
  }
}
