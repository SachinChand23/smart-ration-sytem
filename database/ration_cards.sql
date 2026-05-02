USE ration_system;

-- 1. Drop and Recreate for absolute consistency
DROP TABLE IF EXISTS ration_cards;

CREATE TABLE ration_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ration_card_number VARCHAR(12) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    aadhaar VARCHAR(12) UNIQUE NOT NULL,
    rationCardType ENUM('AAY', 'PHH', 'NPHH') NOT NULL,
    family_members INT DEFAULT 1,
    area VARCHAR(100),
    phone_number VARCHAR(10) NOT NULL,
    assigned_shop_id INT -- Automatically link user to a specific shop
);

-- 2. Insert with Shop Assignments
-- Shops: 1: Bhandup Main, 2: Bhandup West, 3: Kurla, 4: Nilje Gaon, 5: Dombivli
INSERT INTO ration_cards (ration_card_number, name, aadhaar, rationCardType, family_members, area, phone_number, assigned_shop_id) VALUES
('272000001001', 'Ramesh Kumar', '100000000001', 'AAY', 5, 'Bhandup', '9876543210', 1),
('272000001002', 'Suresh Patil', '100000000002', 'PHH', 4, 'Kurla', '8765432109', 3),
('272000001003', 'Anita Deshmukh', '100000000003', 'NPHH', 3, 'Bhandup', '7654321098', 1),
('272000001004', 'Vijay Singh', '100000000004', 'PHH', 6, 'Dombivli', '6543210987', 5),
('272000001005', 'Meena Kulkarni', '100000000005', 'AAY', 2, 'Nilje gaon', '9123456780', 4),
('272000001006', 'Rahul More', '100000000006', 'PHH', 5, 'Bhandup', '8123456789', 2),
('272000001007', 'Sunita Jadhav', '100000000007', 'NPHH', 4, 'Kurla', '7123456780', 3),
('272000001008', 'Deepak Shinde', '100000000008', 'PHH', 3, 'Dombivli', '6123456781', 5),
('272000001009', 'Priya Gokhale', '100000000009', 'AAY', 7, 'Nilje gaon', '9234567890', 4),
('272000001010', 'Sanjay Pawar', '100000000010', 'PHH', 4, 'Bhandup', '8234567891', 1),
('272000001011', 'Jyoti Sawant', '100000000011', 'NPHH', 2, 'Kurla', '7234567892', 3),
('272000001012', 'Arun Mane', '100000000012', 'PHH', 5, 'Dombivli', '6234567893', 5),
('272000001013', 'Sneha Bhosale', '100000000013', 'AAY', 3, 'Nilje gaon', '9345678901', 4),
('272000001014', 'Vikram Kadam', '100000000014', 'PHH', 4, 'Bhandup', '8345678902', 2),
('272000001015', 'Pallavi Rane', '100000000015', 'NPHH', 6, 'Kurla', '7345678903', 3),
('272000001016', 'Amit Sharma', '100000000016', 'PHH', 4, 'Bhandup', '9111111111', 1),
('272000001017', 'Bhavna Gupta', '100000000017', 'AAY', 6, 'Kurla', '8222222222', 3),
('272000001018', 'Chetan Patil', '100000000018', 'NPHH', 3, 'Dadar', '7333333333', 1),
('272000001019', 'Deepali Varma', '100000000019', 'PHH', 5, 'Mulund', '6444444444', 2),
('272000001020', 'Eshwar Rao', '100000000020', 'AAY', 4, 'Thane', '9555555555', 4),
('272000001021', 'Farhan Khan', '100000000021', 'PHH', 2, 'Ghatkopar', '8666666666', 3),
('272000001022', 'Ganesh More', '100000000022', 'NPHH', 5, 'Bhandup', '7777777777', 1),
('272000001023', 'Hema Malini', '100000000023', 'AAY', 3, 'Kurla', '6888888888', 3),
('272000001024', 'Indira Gandhi', '100000000024', 'PHH', 4, 'Dadar', '9999999999', 1),
('272000001025', 'Jatin Das', '100000000025', 'NPHH', 6, 'Mulund', '8111111111', 2),
('272000001026', 'Kiran Bedi', '100000000026', 'PHH', 3, 'Thane', '7222222222', 4),
('272000001027', 'Laxmi Narayan', '100000000027', 'AAY', 5, 'Ghatkopar', '6333333333', 3),
('272000001028', 'Manoj Bajpayee', '100000000028', 'PHH', 2, 'Bhandup', '9444444444', 1),
('272000001029', 'Nisha Kothari', '100000000029', 'NPHH', 4, 'Kurla', '8555555555', 3),
('272000001030', 'Om Puri', '100000000030', 'AAY', 3, 'Dadar', '7666666666', 1);
