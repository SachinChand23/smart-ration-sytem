UPDATE users SET ration_card_number = CONCAT(ration_card_number, '-', id) WHERE id IN (
  SELECT * FROM (
    SELECT id FROM users u1 WHERE EXISTS (
      SELECT 1 FROM users u2 WHERE u1.ration_card_number = u2.ration_card_number AND u1.id > u2.id
    )
  ) AS t
);
ALTER TABLE users ADD UNIQUE(ration_card_number);
