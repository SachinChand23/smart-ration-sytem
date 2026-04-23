USE ration_system;

-- Master ration card registry (official government records)
CREATE TABLE IF NOT EXISTS ration_cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ration_card_number VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  aadhaar VARCHAR(12) NOT NULL,
  rationCardType ENUM('AAY', 'PHH', 'NPHH') NOT NULL,
  family_members INT NOT NULL,
  area VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample official records for testing
INSERT INTO ration_cards (ration_card_number, name, aadhaar, rationCardType, family_members, area) VALUES
('RC001001', 'Ramesh Kumar',       '100000000001', 'AAY',  4, 'Bhandup'),
('RC001002', 'Sunita Devi',        '100000000002', 'PHH',  3, 'Bhandup'),
('RC001003', 'Mohan Lal',          '100000000003', 'NPHH', 2, 'Bhandup'),
('RC001004', 'Priya Sharma',       '100000000004', 'PHH',  5, 'Kurla'),
('RC001005', 'Arun Patil',         '100000000005', 'AAY',  6, 'Kurla'),
('RC001006', 'Geeta Naik',         '100000000006', 'PHH',  2, 'Kurla'),
('RC001007', 'Vikas Yadav',        '100000000007', 'NPHH', 4, 'Dadar'),
('RC001008', 'Meena Joshi',        '100000000008', 'AAY',  3, 'Dadar'),
('RC001009', 'Suresh Gupta',       '100000000009', 'PHH',  5, 'Mulund'),
('RC001010', 'Kavita Desai',       '100000000010', 'NPHH', 2, 'Mulund'),
('RC001011', 'Rajesh Mehta',       '100000000011', 'AAY',  4, 'Thane'),
('RC001012', 'Anjali Singh',       '100000000012', 'PHH',  3, 'Thane'),
('RC001013', 'Deepak Shinde',      '100000000013', 'NPHH', 2, 'Ghatkopar'),
('RC001014', 'Pooja More',         '100000000014', 'AAY',  5, 'Ghatkopar'),
('RC001015', 'Sanjay Thakur',      '100000000015', 'PHH',  4, 'Bhandup');
