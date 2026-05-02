const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runSql(fileName) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  const sql = fs.readFileSync(path.join(__dirname, `../database/${fileName}`), 'utf8');
  await connection.query(sql);
  console.log(`${fileName} executed successfully.`);
  await connection.end();
}

const file = process.argv[2];
if (!file) {
    console.error("Please provide a file name");
    process.exit(1);
}

runSql(file).catch(console.error);
