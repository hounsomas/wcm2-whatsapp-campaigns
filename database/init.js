require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { pool, testConnection, initializeDatabase } = require('./config');

async function initializeTables() {
  try {
    console.log('🔄 Initialisation des tables de la base de données...');
    
    // Lire le fichier de schéma SQL
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    // Diviser le script en requêtes individuelles
    const queries = schemaSQL
      .split(';')
      .map(query => query.trim())
      .filter(query => query.length > 0 && !query.startsWith('--'));
    
    const connection = await pool.getConnection();
    
    // Exécuter chaque requête
    for (const query of queries) {
      if (query.trim()) {
        try {
          await connection.query(query);
          console.log('✅ Requête exécutée avec succès');
        } catch (error) {
          if (error.code === 'ER_DUP_ENTRY') {
            console.log('ℹ️  Entrée déjà existante (ignorée)');
          } else {
            console.error('❌ Erreur lors de l\'exécution de la requête:', error.message);
          }
        }
      }
    }
    
    connection.release();
    console.log('✅ Initialisation des tables terminée avec succès !');
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des tables:', error.message);
    return false;
  }
}

async function createSampleData() {
  try {
    console.log('🔄 Création des données d\'exemple...');
    
    const connection = await pool.getConnection();
    
    // Insérer des contacts d'exemple
    const sampleContacts = [
      ['+33612345678', 'Jean', 'Dupont', 'jean.dupont@email.com', 'Entreprise A'],
      ['+33687654321', 'Marie', 'Martin', 'marie.martin@email.com', 'Entreprise B'],
      ['+33611223344', 'Pierre', 'Durand', 'pierre.durand@email.com', 'Entreprise C']
    ];
    
    for (const contact of sampleContacts) {
      try {
        await connection.query(
          'INSERT IGNORE INTO contacts (phone_number, first_name, last_name, email, company) VALUES (?, ?, ?, ?, ?)',
          contact
        );
      } catch (error) {
        if (error.code !== 'ER_DUP_ENTRY') {
          console.error('Erreur lors de l\'insertion du contact:', error.message);
        }
      }
    }
    
    // Créer un groupe d'exemple
    await connection.query(
      'INSERT IGNORE INTO contact_groups (name, description) VALUES (?, ?)',
      ['Clients Premium', 'Groupe des clients premium pour les campagnes spéciales']
    );
    
    connection.release();
    console.log('✅ Données d\'exemple créées avec succès !');
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des données d\'exemple:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Démarrage de l\'initialisation de la base de données...\n');
  
  // Tester la connexion
  const connectionOk = await testConnection();
  if (!connectionOk) {
    console.error('❌ Impossible de se connecter à la base de données. Vérifiez vos paramètres de connexion.');
    process.exit(1);
  }
  
  // Initialiser la base de données
  const dbInitialized = await initializeDatabase();
  if (!dbInitialized) {
    console.error('❌ Impossible d\'initialiser la base de données.');
    process.exit(1);
  }
  
  // Créer les tables
  const tablesCreated = await initializeTables();
  if (!tablesCreated) {
    console.error('❌ Impossible de créer les tables.');
    process.exit(1);
  }
  
  // Créer les données d'exemple
  await createSampleData();
  
  console.log('\n🎉 Initialisation de la base de données terminée avec succès !');
  console.log('📊 Votre base de données est maintenant prête pour la plateforme WCM2.');
  console.log('🔑 Compte administrateur par défaut : admin@wcm2.com (changez le mot de passe !)');
  
  process.exit(0);
}

// Exécuter le script si appelé directement
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Erreur fatale:', error.message);
    process.exit(1);
  });
}

module.exports = {
  initializeTables,
  createSampleData
}; 