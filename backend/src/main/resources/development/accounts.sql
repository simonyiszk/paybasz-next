INSERT INTO accounts (id, name, email, phone, card, balance, active) VALUES (3, 'Example Elemér', null, '69-420-13-37', null, 0, true) ON CONFLICT DO NOTHING;
INSERT INTO accounts (id, name, email, phone, card, balance, active) VALUES (1, 'Horváth István', 'isti@simonyi.bme.hu', '+123456789', '72:b2:29:4b', 5000, true) ON CONFLICT DO NOTHING;
INSERT INTO accounts (id, name, email, phone, card, balance, active) VALUES (2, 'Példa Petra', 'petra@gmail.com', null, '78:48:69:4a', 3500, true) ON CONFLICT DO NOTHING;
