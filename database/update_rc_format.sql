USE ration_system;

-- 1. Clear existing user accounts (to avoid format mismatch)
DELETE FROM users WHERE role = 'user';

-- 2. Update ration_cards with 12-digit Maharashtra format (Starting with 27 - State Code)
-- First 15 records
UPDATE ration_cards SET ration_card_number = '272000001001' WHERE id = 1;
UPDATE ration_cards SET ration_card_number = '272000001002' WHERE id = 2;
UPDATE ration_cards SET ration_card_number = '272000001003' WHERE id = 3;
UPDATE ration_cards SET ration_card_number = '272000001004' WHERE id = 4;
UPDATE ration_cards SET ration_card_number = '272000001005' WHERE id = 5;
UPDATE ration_cards SET ration_card_number = '272000001006' WHERE id = 6;
UPDATE ration_cards SET ration_card_number = '272000001007' WHERE id = 7;
UPDATE ration_cards SET ration_card_number = '272000001008' WHERE id = 8;
UPDATE ration_cards SET ration_card_number = '272000001009' WHERE id = 9;
UPDATE ration_cards SET ration_card_number = '272000001010' WHERE id = 10;
UPDATE ration_cards SET ration_card_number = '272000001011' WHERE id = 11;
UPDATE ration_cards SET ration_card_number = '272000001012' WHERE id = 12;
UPDATE ration_cards SET ration_card_number = '272000001013' WHERE id = 13;
UPDATE ration_cards SET ration_card_number = '272000001014' WHERE id = 14;
UPDATE ration_cards SET ration_card_number = '272000001015' WHERE id = 15;

-- The newer 15 records (added in last turn)
UPDATE ration_cards SET ration_card_number = '272000001016' WHERE ration_card_number = 'RC001016';
UPDATE ration_cards SET ration_card_number = '272000001017' WHERE ration_card_number = 'RC001017';
UPDATE ration_cards SET ration_card_number = '272000001018' WHERE ration_card_number = 'RC001018';
UPDATE ration_cards SET ration_card_number = '272000001019' WHERE ration_card_number = 'RC001019';
UPDATE ration_cards SET ration_card_number = '272000001020' WHERE ration_card_number = 'RC001020';
UPDATE ration_cards SET ration_card_number = '272000001021' WHERE ration_card_number = 'RC001021';
UPDATE ration_cards SET ration_card_number = '272000001022' WHERE ration_card_number = 'RC001022';
UPDATE ration_cards SET ration_card_number = '272000001023' WHERE ration_card_number = 'RC001023';
UPDATE ration_cards SET ration_card_number = '272000001024' WHERE ration_card_number = 'RC001024';
UPDATE ration_cards SET ration_card_number = '272000001025' WHERE ration_card_number = 'RC001025';
UPDATE ration_cards SET ration_card_number = '272000001026' WHERE ration_card_number = 'RC001026';
UPDATE ration_cards SET ration_card_number = '272000001027' WHERE ration_card_number = 'RC001027';
UPDATE ration_cards SET ration_card_number = '272000001028' WHERE ration_card_number = 'RC001028';
UPDATE ration_cards SET ration_card_number = '272000001029' WHERE ration_card_number = 'RC001029';
UPDATE ration_cards SET ration_card_number = '272000001030' WHERE ration_card_number = 'RC001030';
