USE ration_system;
ALTER TABLE users CHANGE ration_category rationCardType ENUM('AAY', 'PHH', 'NPHH');
