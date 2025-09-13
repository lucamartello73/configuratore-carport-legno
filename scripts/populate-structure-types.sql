-- Populate carport_structure_types table with default data
INSERT INTO carport_structure_types (
  name, 
  description, 
  image, 
  structure_category, 
  material_type, 
  features, 
  is_active
) VALUES 
(
  'Addossato Acciaio',
  'Carport appoggiato alla parete esistente con struttura in acciaio zincato, ideale per ottimizzare lo spazio',
  '/carport-addossato-parete.jpg',
  'addossato',
  'acciaio',
  '["Facile installazione", "Ottimizza lo spazio", "Soluzione compatta", "Resistente alla corrosione"]',
  true
),
(
  'Addossato Legno',
  'Carport appoggiato alla parete esistente con struttura in legno lamellare, naturale ed elegante',
  '/carport-addossato-legno.jpg',
  'addossato',
  'legno',
  '["Facile installazione", "Ottimizza lo spazio", "Materiale naturale", "Estetica elegante"]',
  true
),
(
  'Autoportante Acciaio',
  'Carport indipendente con struttura completa in acciaio, massima flessibilità di posizionamento',
  '/carport-autoportante-indipendente.jpg',
  'autoportante',
  'acciaio',
  '["Massima flessibilità", "Struttura robusta", "Posizionamento libero", "Lunga durata"]',
  true
),
(
  'Autoportante Legno',
  'Carport indipendente con struttura completa in legno lamellare, elegante e naturale',
  '/carport-autoportante-legno.jpg',
  'autoportante',
  'legno',
  '["Massima flessibilità", "Struttura robusta", "Materiale naturale", "Isolamento termico"]',
  true
);
