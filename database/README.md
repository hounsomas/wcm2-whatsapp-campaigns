# Configuration de la Base de Données MySQL

## Vue d'ensemble

Cette section contient tous les fichiers nécessaires pour configurer et initialiser la base de données MySQL pour la plateforme WCM2.

## Structure des fichiers

```
database/
├── config.js          # Configuration de connexion MySQL
├── schema.sql         # Schéma de la base de données
├── init.js           # Script d'initialisation
├── test-connection.js # Script de test de connexion
└── README.md         # Ce fichier
```

## Étapes de configuration

### 1. Installation de MySQL

Assurez-vous que MySQL est installé sur votre système :

**Windows :**
- Téléchargez MySQL depuis [mysql.com](https://dev.mysql.com/downloads/mysql/)
- Ou utilisez XAMPP/WAMP

**Linux :**
```bash
sudo apt-get install mysql-server
```

**macOS :**
```bash
brew install mysql
```

### 2. Configuration des variables d'environnement

1. Copiez le fichier `env.example` vers `.env` :
```bash
cp env.example .env
```

2. Modifiez le fichier `.env` avec vos paramètres MySQL :
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=wcm2_whatsapp_db
```

### 3. Test de connexion

Testez votre connexion MySQL :
```bash
npm run test-db
```

### 4. Initialisation de la base de données

Une fois la connexion testée avec succès, initialisez la base de données :
```bash
npm run init-db
```

## Tables créées

Le script d'initialisation crée les tables suivantes :

- **users** : Utilisateurs de la plateforme
- **contacts** : Contacts pour les campagnes
- **contact_groups** : Groupes de contacts
- **contact_group_members** : Liaison contacts-groupes
- **campaigns** : Campagnes WhatsApp
- **sent_messages** : Messages envoyés
- **received_messages** : Messages reçus
- **campaign_stats** : Statistiques des campagnes
- **app_settings** : Paramètres de l'application
- **activity_logs** : Logs d'activité

## Compte administrateur par défaut

Un compte administrateur est créé automatiquement :
- **Email** : admin@wcm2.com
- **Mot de passe** : À changer après la première connexion

## Données d'exemple

Le script d'initialisation crée également :
- 3 contacts d'exemple
- 1 groupe de contacts "Clients Premium"
- Paramètres par défaut de l'application

## Dépannage

### Erreur de connexion
- Vérifiez que MySQL est démarré
- Vérifiez vos paramètres de connexion
- Vérifiez les droits de l'utilisateur MySQL

### Erreur de permissions
```sql
GRANT ALL PRIVILEGES ON wcm2_whatsapp_db.* TO 'votre_user'@'localhost';
FLUSH PRIVILEGES;
```

### Erreur de base de données inexistante
Le script crée automatiquement la base de données si elle n'existe pas.

## Commandes utiles

```bash
# Test de connexion
npm run test-db

# Initialisation complète
npm run init-db

# Redémarrage de MySQL (Windows)
net stop mysql
net start mysql

# Redémarrage de MySQL (Linux)
sudo systemctl restart mysql
``` 