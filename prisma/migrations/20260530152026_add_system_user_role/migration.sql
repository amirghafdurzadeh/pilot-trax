-- Insert system_user role
INSERT INTO "roles" (id, description) VALUES ('system_user', 'System User - can manage admin roles') ON CONFLICT (id) DO NOTHING;

-- Ensure user 09134313741 exists
INSERT INTO "users" (id, phone, created_at, updated_at)
VALUES (gen_random_uuid()::text, '09134313741', NOW(), NOW())
ON CONFLICT (phone) DO NOTHING;

-- Assign system_user role to 09134313741
INSERT INTO "user_roles" (user_id, role_id)
SELECT id, 'system_user' FROM "users" WHERE phone = '09134313741'
ON CONFLICT (user_id, role_id) DO NOTHING;