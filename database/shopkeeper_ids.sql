-- Authorized Shopkeeper Registry
-- These shopkeeper IDs must be used during registration along with the linked Aadhaar.

CREATE TABLE IF NOT EXISTS shopkeeper_auth (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shopkeeper_id VARCHAR(50) UNIQUE NOT NULL,
    aadhaar VARCHAR(12) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(10) NOT NULL -- Official phone number for OTP verification
);

-- Reset and Insert 18 official shopkeepers
TRUNCATE TABLE shopkeeper_auth;

INSERT INTO shopkeeper_auth (shopkeeper_id, aadhaar, name, phone_number) VALUES
('SK-1001', '200000000001', 'Rajesh Gupta', '9900990099'),
('SK-1002', '200000000002', 'Sunil Deshmukh', '8877665544'),
('SK-1003', '200000000003', 'Amitabh Bachchan', '9888877777'),
('SK-1004', '200000000004', 'Rahul Dravid', '9100100100'),
('SK-1005', '200000000005', 'Sachin Tendulkar', '8200200200'),
('SK-1006', '200000000006', 'Virat Kohli', '7300300300'),
('SK-1007', '200000000007', 'MS Dhoni', '6400400400'),
('SK-1008', '200000000008', 'Rohit Sharma', '9500500500'),
('SK-1009', '200000000009', 'Hardik Pandya', '8600600600'),
('SK-1010', '200000000010', 'Jasprit Bumrah', '7700770077'),
('SK-1011', '200000000011', 'KL Rahul', '6800800800'),
('SK-1012', '200000000012', 'Rishabh Pant', '9900900900'),
('SK-1013', '200000000013', 'Shikhar Dhawan', '8100100100'),
('SK-1014', '200000000014', 'Ravindra Jadeja', '7200200200'),
('SK-1015', '200000000015', 'Yuvraj Singh', '6300300300'),
('SK-1016', '200000000016', 'Sourav Ganguly', '9400400400'),
('SK-1017', '200000000017', 'Kapil Dev', '8500500500'),
('SK-1018', '200000000018', 'Sunil Gavaskar', '7600600600');
