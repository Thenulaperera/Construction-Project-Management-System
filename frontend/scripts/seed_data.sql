-- Insert sample data for WorksiteX Construction Management System

-- Insert sample users
INSERT INTO users (id, name, email, password_hash, role) VALUES
('client_001', 'John Client', 'john.client@email.com', '$2b$10$hashedpassword1', 'client'),
('client_002', 'Sarah Johnson', 'sarah.johnson@email.com', '$2b$10$hashedpassword2', 'client'),
('admin_001', 'Admin User', 'admin@worksitex.com', '$2b$10$hashedpassword3', 'admin'),
('admin_002', 'Project Manager', 'pm@worksitex.com', '$2b$10$hashedpassword4', 'admin');

-- Insert sample projects
INSERT INTO projects (id, name, description, client_id, status, progress, start_date, expected_completion, budget, spent, location, contractor) VALUES
('PRJ-001', 'Downtown Office Complex', 'Modern 15-story office building with retail space', 'client_001', 'in-progress', 65, '2024-01-15', '2024-08-15', 2500000.00, 1625000.00, 'Downtown District', 'BuildCorp Ltd.'),
('PRJ-002', 'Residential Tower A', 'Luxury residential tower with 200 units', 'client_001', 'planning', 15, '2024-03-01', '2024-12-01', 3200000.00, 480000.00, 'North Side', 'Skyline Construction'),
('PRJ-003', 'Shopping Center Phase 2', 'Extension of existing shopping center', 'client_002', 'in-progress', 85, '2023-10-01', '2024-04-01', 1800000.00, 1530000.00, 'West Mall District', 'Retail Builders Inc.');

-- Insert project milestones
INSERT INTO project_milestones (project_id, name, status, target_date, completion_date) VALUES
('PRJ-001', 'Foundation', 'completed', '2024-02-15', '2024-02-12'),
('PRJ-001', 'Structure', 'in-progress', '2024-05-15', NULL),
('PRJ-001', 'Interior', 'pending', '2024-07-15', NULL),
('PRJ-001', 'Finishing', 'pending', '2024-08-15', NULL),
('PRJ-002', 'Planning', 'in-progress', '2024-03-15', NULL),
('PRJ-002', 'Foundation', 'pending', '2024-05-01', NULL),
('PRJ-002', 'Structure', 'pending', '2024-09-01', NULL),
('PRJ-002', 'Completion', 'pending', '2024-12-01', NULL),
('PRJ-003', 'Foundation', 'completed', '2023-11-01', '2023-10-28'),
('PRJ-003', 'Structure', 'completed', '2024-01-15', '2024-01-10'),
('PRJ-003', 'Interior', 'in-progress', '2024-03-15', NULL),
('PRJ-003', 'Final Inspection', 'pending', '2024-04-01', NULL);

-- Insert sample transactions
INSERT INTO transactions (project_id, type, description, amount, category, transaction_date, created_by) VALUES
('PRJ-001', 'expense', 'Cement and Concrete Materials', -25000.00, 'Materials', '2024-01-15', 'admin_001'),
('PRJ-001', 'income', 'Phase 1 Payment', 150000.00, 'Payment', '2024-01-10', 'admin_001'),
('PRJ-002', 'expense', 'Equipment Rental - Excavator', -8500.00, 'Equipment', '2024-01-12', 'admin_001'),
('PRJ-003', 'expense', 'Worker Wages - Week 3', -32000.00, 'Labor', '2024-01-20', 'admin_001'),
('PRJ-002', 'income', 'Milestone Payment', 75000.00, 'Payment', '2024-01-25', 'admin_001'),
('PRJ-001', 'expense', 'Steel Reinforcement', -45000.00, 'Materials', '2024-02-01', 'admin_001'),
('PRJ-003', 'expense', 'Electrical Installation', -28000.00, 'Labor', '2024-02-05', 'admin_001'),
('PRJ-001', 'income', 'Progress Payment', 200000.00, 'Payment', '2024-02-10', 'admin_001');

-- Insert sample resources
INSERT INTO resources (project_id, name, type, quantity, unit, cost_per_unit, total_cost, status) VALUES
('PRJ-001', 'Tower Crane', 'equipment', 2, 'units', 5000.00, 10000.00, 'in-use'),
('PRJ-001', 'Concrete Mixer', 'equipment', 3, 'units', 800.00, 2400.00, 'in-use'),
('PRJ-001', 'Steel Rebar', 'material', 500, 'tons', 120.00, 60000.00, 'available'),
('PRJ-002', 'Excavator', 'equipment', 1, 'units', 3000.00, 3000.00, 'in-use'),
('PRJ-002', 'Construction Workers', 'labor', 15, 'workers', 200.00, 3000.00, 'available'),
('PRJ-003', 'Forklift', 'equipment', 2, 'units', 150.00, 300.00, 'available'),
('PRJ-003', 'Drywall Materials', 'material', 200, 'sheets', 25.00, 5000.00, 'available');
