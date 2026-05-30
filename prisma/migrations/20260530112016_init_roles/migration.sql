-- Insert roles if they don't exist
INSERT INTO "roles" (id, description) VALUES ('admin', 'Administrator') ON CONFLICT (id) DO NOTHING;
INSERT INTO "roles" (id, description) VALUES ('premium', 'Premium User') ON CONFLICT (id) DO NOTHING;

-- Insert user 09134313741 if they don't exist
INSERT INTO "users" (id, phone, created_at, updated_at)
VALUES (gen_random_uuid()::text, '09134313741', NOW(), NOW())
ON CONFLICT (phone) DO NOTHING;

-- Assign admin role to 09134313741
INSERT INTO "user_roles" (user_id, role_id)
SELECT id, 'admin' FROM "users" WHERE phone = '09134313741'
ON CONFLICT (user_id, role_id) DO NOTHING;