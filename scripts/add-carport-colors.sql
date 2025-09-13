-- Adding color data for RAL colors and wood finishes
INSERT INTO carport_colors (id, name, hex_value, category, price_modifier, created_at, updated_at) VALUES
-- RAL Colors for Steel Structures
(gen_random_uuid(), 'RAL 9006 - Alluminio Bianco', '#A5A5A5', 'ral', 0, now(), now()),
(gen_random_uuid(), 'RAL 7016 - Grigio Antracite', '#383E42', 'ral', 0, now(), now()),
(gen_random_uuid(), 'RAL 6005 - Verde Muschio', '#2F4538', 'ral', 0, now(), now()),
(gen_random_uuid(), 'RAL 3009 - Rosso Ossido', '#642424', 'ral', 0, now(), now()),
(gen_random_uuid(), 'RAL 5010 - Blu Genziana', '#0E294B', 'ral', 0, now(), now()),

-- Smalto Coprente for Wood Structures
(gen_random_uuid(), 'Bianco Opaco', '#FFFFFF', 'smalto', 0, now(), now()),
(gen_random_uuid(), 'Grigio Chiaro', '#D3D3D3', 'smalto', 0, now(), now()),
(gen_random_uuid(), 'Verde Salvia', '#9CAF88', 'smalto', 0, now(), now()),
(gen_random_uuid(), 'Blu Pastello', '#AED6F1', 'smalto', 0, now(), now()),
(gen_random_uuid(), 'Beige Sabbia', '#F5E6D3', 'smalto', 0, now(), now()),

-- Impregnanti Legno Classici
(gen_random_uuid(), 'Noce', '#8B4513', 'impregnante_classico', 0, now(), now()),
(gen_random_uuid(), 'Mogano', '#C04000', 'impregnante_classico', 0, now(), now()),
(gen_random_uuid(), 'Frassino', '#F5DEB3', 'impregnante_classico', 0, now(), now()),
(gen_random_uuid(), 'Rovere', '#DAA520', 'impregnante_classico', 0, now(), now()),
(gen_random_uuid(), 'Teak', '#CD853F', 'impregnante_classico', 0, now(), now()),

-- Impregnanti Colore Pastello
(gen_random_uuid(), 'Rosa Pastello', '#FFB6C1', 'impregnante_pastello', 0, now(), now()),
(gen_random_uuid(), 'Azzurro Pastello', '#E0F6FF', 'impregnante_pastello', 0, now(), now()),
(gen_random_uuid(), 'Verde Pastello', '#F0FFF0', 'impregnante_pastello', 0, now(), now()),
(gen_random_uuid(), 'Giallo Pastello', '#FFFFE0', 'impregnante_pastello', 0, now(), now()),
(gen_random_uuid(), 'Lilla Pastello', '#E6E6FA', 'impregnante_pastello', 0, now(), now())

ON CONFLICT (name) DO NOTHING;
