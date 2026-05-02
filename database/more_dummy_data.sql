USE ration_system;

-- 1. Add 15 more Beneficiaries to ration_cards registry
INSERT INTO ration_cards (ration_card_number, name, aadhaar, rationCardType, family_members, area, phone_number) VALUES
('RC001016', 'Amit Sharma',       '100000000016', 'PHH',  4, 'Bhandup',   '9111111111'),
('RC001017', 'Bhavna Gupta',      '100000000017', 'AAY',  6, 'Kurla',     '8222222222'),
('RC001018', 'Chetan Patil',      '100000000018', 'NPHH', 3, 'Dadar',     '7333333333'),
('RC001019', 'Deepali Varma',     '100000000019', 'PHH',  5, 'Mulund',    '6444444444'),
('RC001020', 'Eshwar Rao',        '100000000020', 'AAY',  4, 'Thane',     '9555555555'),
('RC001021', 'Farhan Khan',       '100000000021', 'PHH',  2, 'Ghatkopar', '8666666666'),
('RC001022', 'Ganesh More',       '100000000022', 'NPHH', 5, 'Bhandup',   '7777777777'),
('RC001023', 'Hema Malini',       '100000000023', 'AAY',  3, 'Kurla',     '6888888888'),
('RC001024', 'Indira Gandhi',     '100000000024', 'PHH',  4, 'Dadar',     '9999999999'),
('RC001025', 'Jatin Das',         '100000000025', 'NPHH', 6, 'Mulund',    '8111111111'),
('RC001026', 'Kiran Bedi',        '100000000026', 'PHH',  3, 'Thane',     '7222222222'),
('RC001027', 'Laxmi Narayan',     '100000000027', 'AAY',  5, 'Ghatkopar', '6333333333'),
('RC001028', 'Manoj Bajpayee',    '100000000028', 'PHH',  2, 'Bhandup',   '9444444444'),
('RC001029', 'Nisha Kothari',     '100000000029', 'NPHH', 4, 'Kurla',     '8555555555'),
('RC001030', 'Om Puri',           '100000000030', 'AAY',  3, 'Dadar',     '7666666666');

-- 2. Add 15 more Shopkeepers to shopkeeper_auth registry
INSERT INTO shopkeeper_auth (shopkeeper_id, aadhaar, name, phone_number) VALUES
('SK-1004', '200000000004', 'Rahul Dravid',   '9100100100'),
('SK-1005', '200000000005', 'Sachin Tendulkar', '8200200200'),
('SK-1006', '200000000006', 'Virat Kohli',    '7300300300'),
('SK-1007', '200000000007', 'MS Dhoni',       '6400400400'),
('SK-1008', '200000000008', 'Rohit Sharma',   '9500500500'),
('SK-1009', '200000000009', 'Hardik Pandya',  '8600600600'),
('SK-1010', '200000000010', 'Jasprit Bumrah', '7700770077'),
('SK-1011', '200000000011', 'KL Rahul',       '6800800800'),
('SK-1012', '200000000012', 'Rishabh Pant',   '9900900900'),
('SK-1013', '200000000013', 'Shikhar Dhawan', '8100100100'),
('SK-1014', '200000000014', 'Ravindra Jadeja', '7200200200'),
('SK-1015', '200000000015', 'Yuvraj Singh',   '6300300300'),
('SK-1016', '200000000016', 'Sourav Ganguly', '9400400400'),
('SK-1017', '200000000017', 'Kapil Dev',      '8500500500'),
('SK-1018', '200000000018', 'Sunil Gavaskar', '7600600600');
