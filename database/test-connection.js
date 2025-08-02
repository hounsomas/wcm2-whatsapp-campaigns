require('dotenv').config();
const { testConnection, initializeDatabase } = require('./config');

async function testMySQLConnection() {
  console.log('🔍 Test de connexion à MySQL...\n');
  
  console.log('📋 Paramètres de connexion :');
  console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`   Port: ${process.env.DB_PORT || 3306}`);
  console.log(`   User: ${process.env.DB_USER || 'root'}`);
  console.log(`   Database: ${process.env.DB_NAME || 'wcm2_whatsapp_db'}`);
  console.log(`   Password: ${process.env.DB_PASSWORD ? '***' : '(non défini)'}\n`);
  
  try {
    // Tester la connexion
    const connectionOk = await testConnection();
    
    if (connectionOk) {
      console.log('✅ Connexion MySQL réussie !');
      
      // Tenter d'initialiser la base de données
      console.log('\n🔄 Test d\'initialisation de la base de données...');
      const dbInitialized = await initializeDatabase();
      
      if (dbInitialized) {
        console.log('✅ Base de données initialisée avec succès !');
        console.log('\n🎉 Configuration MySQL terminée avec succès !');
        console.log('📝 Vous pouvez maintenant exécuter : npm run init-db');
      } else {
        console.log('❌ Erreur lors de l\'initialisation de la base de données.');
      }
    } else {
      console.log('❌ Échec de la connexion MySQL.');
      console.log('\n🔧 Vérifiez :');
      console.log('   1. Que MySQL est installé et en cours d\'exécution');
      console.log('   2. Vos paramètres de connexion dans le fichier .env');
      console.log('   3. Que l\'utilisateur a les droits nécessaires');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test de connexion:', error.message);
    console.log('\n🔧 Solutions possibles :');
    console.log('   1. Vérifiez que MySQL est installé');
    console.log('   2. Vérifiez que le service MySQL est démarré');
    console.log('   3. Vérifiez vos paramètres de connexion');
    console.log('   4. Créez un fichier .env avec vos paramètres MySQL');
  }
  
  process.exit(0);
}

// Exécuter le test si appelé directement
if (require.main === module) {
  testMySQLConnection();
}

module.exports = { testMySQLConnection }; 