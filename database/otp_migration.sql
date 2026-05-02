USE ration_system;

-- 1. Update ration_cards table
ALTER TABLE ration_cards ADD COLUMN phone_number VARCHAR(10);

UPDATE ration_cards SET phone_number = '9876543210' WHERE ration_card_number = 'RC001001';
UPDATE ration_cards SET phone_number = '8765432109' WHERE ration_card_number = 'RC001002';
UPDATE ration_cards SET phone_number = '7654321098' WHERE ration_card_number = 'RC001003';
UPDATE ration_cards SET phone_number = '6543210987' WHERE ration_card_number = 'RC001004';
UPDATE ration_cards SET phone_number = '9988776655' WHERE ration_card_number = 'RC001005';
UPDATE ration_cards SET phone_number = '8877665544' WHERE ration_card_number = 'RC001006';
UPDATE ration_cards SET phone_number = '7766554433' WHERE ration_card_number = 'RC001007';
UPDATE ration_cards SET phone_number = '6655443322' WHERE ration_card_number = 'RC001008';
UPDATE ration_cards SET phone_number = '9123456789' WHERE ration_card_number = 'RC001009';
UPDATE ration_cards SET phone_number = '8123456789' WHERE ration_card_number = 'RC001010';
UPDATE ration_cards SET phone_number = '7123456789' WHERE ration_card_number = 'RC001011';
UPDATE ration_cards SET phone_number = '6123456789' WHERE ration_card_number = 'RC001012';
UPDATE ration_cards SET phone_number = '9000000000' WHERE ration_card_number = 'RC001013';
UPDATE ration_cards SET phone_number = '8000000000' WHERE ration_card_number = 'RC001014';
UPDATE ration_cards SET phone_number = '7000000000' WHERE ration_card_number = 'RC001015';

-- 2. Update shopkeeper_auth table
ALTER TABLE shopkeeper_auth ADD COLUMN phone_number VARCHAR(10);

UPDATE shopkeeper_auth SET phone_number = '9900990099' WHERE shopkeeper_id = 'SK-1001';
UPDATE shopkeeper_auth SET phone_number = '8800880088' WHERE shopkeeper_id = 'SK-1002';
UPDATE shopkeeper_auth SET phone_number = '7700770077' WHERE shopkeeper_id = 'SK-1003';

-- 3. Create otp_verifications table
CREATE TABLE IF NOT EXISTS otp_verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aadhaar VARCHAR(12) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  UNIQUE(aadhaar)
);
