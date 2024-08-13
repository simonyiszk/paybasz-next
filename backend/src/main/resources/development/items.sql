INSERT INTO items (id, name, alias, cost, stock, enabled) VALUES (3, 'Unicum', 'fuj', 999, 0, true) ON CONFLICT DO NOTHING;
INSERT INTO items (id, name, alias, cost, stock, enabled) VALUES (4, 'Unicum Barista', null, 999, 100000, false) ON CONFLICT DO NOTHING;
INSERT INTO items (id, name, alias, cost, stock, enabled) VALUES (2, 'Somersby Apple', 'alma', 500, 99998, true) ON CONFLICT DO NOTHING;
INSERT INTO items (id, name, alias, cost, stock, enabled) VALUES (1, 'Sör', null, 400, 99997, true) ON CONFLICT DO NOTHING;
