// Configurazione Supabase per Configuratore Legno
export const SUPABASE_CONFIG = {
  tables: {
    models: "carport_legno_models",
    structures: "carport_legno_structure_types",
    surfaces: "carport_legno_surfaces",
    colors: "carport_legno_colors",
    coverages: "carport_legno_coverage_types",
    accessories: "carport_legno_accessories",
    packages: "carport_legno_packages",
    configurations: "carport_legno_configurations"
  },
  configuratorType: "legno" as const
};
