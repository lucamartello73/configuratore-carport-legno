-- Insert initial pergola types
INSERT INTO configuratorelegno_pergola_types (name, description, image) VALUES
('Pergola Addossata', 'Perfetta per terrazzi e spazi adiacenti alla casa. Struttura elegante che si appoggia alla parete esistente.', '/placeholder.svg?height=300&width=400'),
('Pergola Libera', 'Struttura indipendente ideale per giardini. Crea uno spazio ombreggiato ovunque tu voglia.', '/placeholder.svg?height=300&width=400'),
('Pergola Bioclimatica', 'Tecnologia avanzata con lamelle orientabili per il controllo ottimale di luce e ventilazione.', '/placeholder.svg?height=300&width=400');

-- Insert coverage types
INSERT INTO configuratorelegno_coverage_types (name, description, image) VALUES
('Tenda da Sole', 'Tessuto tecnico resistente agli agenti atmosferici, retrattile e disponibile in vari colori.', '/placeholder.svg?height=200&width=300'),
('Policarbonato', 'Pannelli trasparenti resistenti che garantiscono luminosità e protezione dalla pioggia.', '/placeholder.svg?height=200&width=300'),
('Vetro Temperato', 'Eleganza e protezione totale. Soluzione premium per un comfort superiore.', '/placeholder.svg?height=200&width=300'),
('Lamelle Orientabili', 'Sistema innovativo per controllo preciso di luce e ventilazione. Solo per pergole bioclimatiche.', '/placeholder.svg?height=200&width=300');

-- Insert accessories
INSERT INTO configuratorelegno_accessories (name, icon, image) VALUES
('Illuminazione LED', '💡', '/placeholder.svg?height=150&width=200'),
('Sensore Vento', '🌪️', '/placeholder.svg?height=150&width=200'),
('Tende Laterali', '🎭', '/placeholder.svg?height=150&width=200'),
('Sensore Pioggia', '🌧️', '/placeholder.svg?height=150&width=200'),
('Riscaldatori', '🔥', '/placeholder.svg?height=150&width=200');

-- Insert colors
INSERT INTO configuratorelegno_colors (category, name, hex_value) VALUES
-- Smalto colors
('smalto', 'Bianco Puro', '#FFFFFF'),
('smalto', 'Nero Elegante', '#1A1A1A'),
('smalto', 'Grigio Antracite', '#2F2F2F'),
('smalto', 'Verde Bosco', '#1B4332'),
('smalto', 'Blu Navy', '#1E3A8A'),
-- Impregnante legno colors
('impregnante-legno', 'Naturale', '#D2B48C'),
('impregnante-legno', 'Noce', '#8B4513'),
('impregnante-legno', 'Teak', '#B8860B'),
('impregnante-legno', 'Mogano', '#C04000'),
('impregnante-legno', 'Wengé', '#645452'),
-- Impregnante pastello colors
('impregnante-pastello', 'Azzurro Cielo', '#87CEEB'),
('impregnante-pastello', 'Verde Salvia', '#9CAF88'),
('impregnante-pastello', 'Rosa Antico', '#FADADD'),
('impregnante-pastello', 'Giallo Sole', '#FFE135'),
('impregnante-pastello', 'Lavanda', '#E6E6FA');
