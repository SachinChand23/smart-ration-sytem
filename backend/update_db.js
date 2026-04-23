const mysql = require('mysql2');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'oracle',
  database: 'ration_system',
  multipleStatements: true
});
const q = `
ALTER TABLE users CHANGE city area VARCHAR(100);
TRUNCATE TABLE shops;
INSERT INTO shops (name, location) VALUES ('Bhandup Main Store', 'Bhandup'), ('Bhandup West Branch', 'Bhandup'), ('Kurla Depot Shop', 'Kurla'), ('Nilje Gaon Plaza', 'Nilje gaon'), ('Dombivli Ration Center', 'Dombivli');
`;
db.query(q, (err, res) => {
  if (err) console.error(err);
  else console.log('Database updated successfully');
  process.exit();
});
