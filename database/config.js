require('dotenv').config();
// Configuration de la base de données MySQL
const mysql = require('mysql2/promise');

// Configuration de la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'wcm2_whatsapp_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Créer le pool de connexions
const pool = mysql.createPool(dbConfig);

// Fonction pour tester la connexion
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connexion à MySQL réussie !');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion à MySQL:', error.message);
    return false;
  }
}

// Fonction pour initialiser la base de données
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Créer la base de données si elle n'existe pas (sans requête préparée)
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.query(`USE ${dbConfig.database}`);
    
    console.log(`✅ Base de données '${dbConfig.database}' initialisée avec succès !`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error.message);
    return false;
  }
}

module.exports = {
  pool,
  dbConfig,
  testConnection,
  initializeDatabase
}; 