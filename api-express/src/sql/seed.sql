-- Seed a default user
INSERT INTO users (email, password_hash)
VALUES ('admin@example.com', 'changeme')
ON CONFLICT (email) DO NOTHING;

-- Sample project
INSERT INTO projects (name, owner_id)
SELECT 'demo', id FROM users WHERE email = 'admin@example.com'
ON CONFLICT DO NOTHING;

