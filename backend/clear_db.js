require('dotenv').config();
const mysql = require('mysql2/promise');

async function clearDb() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log("Connected to database. Clearing beneficiary data...");

    // Clear transactions
    await connection.execute('DELETE FROM transactions');
    console.log("Transactions cleared.");

    // Clear complaints (if table exists, using a catch block just in case)
    try {
      await connection.execute('DELETE FROM complaints');
      console.log("Complaints cleared.");
    } catch (err) {
      // Ignore if table doesn't exist
    }

    // Clear users where role is 'user'
    const [result] = await connection.execute('DELETE FROM users WHERE role = "user"');
    console.log(`Deleted ${result.affectedRows} beneficiary user(s).`);

    console.log("Database cleared successfully.");
    await connection.end();
  } catch (error) {
    console.error("Error clearing database:", error);
  }
}

clearDb();
