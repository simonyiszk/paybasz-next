INSERT INTO vouchers (id, account_id, item_id, count) VALUES (1, 2, 3, 100) ON CONFLICT DO NOTHING;
INSERT INTO vouchers (id, account_id, item_id, count) VALUES (2, 1, 1, 1) ON CONFLICT DO NOTHING;
