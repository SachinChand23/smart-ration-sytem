USE ration_system;

-- Rename 'city' column to 'area'
ALTER TABLE users CHANGE city area VARCHAR(100);

-- Add UNIQUE constraint on mobile_number
ALTER TABLE users ADD CONSTRAINT unique_mobile UNIQUE (mobile_number);
