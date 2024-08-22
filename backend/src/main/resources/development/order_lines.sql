INSERT INTO order_lines (id, order_id, item_id, item_count, message, used_voucher, paid_amount) VALUES (1, 1, 2, 2, null, false, 1000) ON CONFLICT DO NOTHING;
INSERT INTO order_lines (id, order_id, item_id, item_count, message, used_voucher, paid_amount) VALUES (2, 1, 1, 1, null, false, 400) ON CONFLICT DO NOTHING;
INSERT INTO order_lines (id, order_id, item_id, item_count, message, used_voucher, paid_amount) VALUES (3, 1, null, 1, 'Ropi', false, 200) ON CONFLICT DO NOTHING;
INSERT INTO order_lines (id, order_id, item_id, item_count, message, used_voucher, paid_amount) VALUES (4, 15, 1, 1, null, true, 0) ON CONFLICT DO NOTHING;
INSERT INTO order_lines (id, order_id, item_id, item_count, message, used_voucher, paid_amount) VALUES (5, 18, 1, 1, null, false, 400) ON CONFLICT DO NOTHING;
