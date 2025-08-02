-- Schéma de base de données pour la plateforme de gestion de campagnes WhatsApp
-- WCM2 - WhatsApp Campaign Management

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role ENUM('admin', 'manager', 'operator') DEFAULT 'operator',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des contacts
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100),
    company VARCHAR(100),
    tags JSON,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des groupes de contacts
CREATE TABLE IF NOT EXISTS contact_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Table de liaison contacts-groupes
CREATE TABLE IF NOT EXISTS contact_group_members (
    contact_id INT,
    group_id INT,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (contact_id, group_id),
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES contact_groups(id) ON DELETE CASCADE
);

-- Table des campagnes
CREATE TABLE IF NOT EXISTS campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    message_template TEXT NOT NULL,
    status ENUM('draft', 'scheduled', 'active', 'paused', 'completed', 'cancelled') DEFAULT 'draft',
    target_type ENUM('individual', 'group') DEFAULT 'individual',
    target_group_id INT,
    scheduled_at TIMESTAMP NULL,
    started_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (target_group_id) REFERENCES contact_groups(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Table des messages envoyés
CREATE TABLE IF NOT EXISTS sent_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT,
    contact_id INT,
    message_content TEXT NOT NULL,
    status ENUM('pending', 'sent', 'delivered', 'read', 'failed') DEFAULT 'pending',
    whatsapp_message_id VARCHAR(100),
    sent_at TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    read_at TIMESTAMP NULL,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);

-- Table des réponses reçues
CREATE TABLE IF NOT EXISTS received_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contact_id INT,
    message_content TEXT NOT NULL,
    whatsapp_message_id VARCHAR(100),
    message_type ENUM('text', 'image', 'video', 'audio', 'document', 'location') DEFAULT 'text',
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_processed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
);

-- Table des statistiques de campagnes
CREATE TABLE IF NOT EXISTS campaign_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT,
    total_contacts INT DEFAULT 0,
    messages_sent INT DEFAULT 0,
    messages_delivered INT DEFAULT 0,
    messages_read INT DEFAULT 0,
    messages_failed INT DEFAULT 0,
    responses_received INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
);

-- Table des paramètres de l'application
CREATE TABLE IF NOT EXISTS app_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des logs d'activité
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insertion des paramètres par défaut
INSERT IGNORE INTO app_settings (setting_key, setting_value, description) VALUES
('whatsapp_api_url', '', 'URL de l\'API WhatsApp Business'),
('whatsapp_api_token', '', 'Token d\'authentification WhatsApp Business'),
('max_messages_per_minute', '30', 'Nombre maximum de messages par minute'),
('campaign_auto_start', 'false', 'Démarrer automatiquement les campagnes programmées'),
('notification_email', '', 'Email pour les notifications système');

-- Création d'un utilisateur administrateur par défaut (mot de passe à changer)
INSERT IGNORE INTO users (username, email, password_hash, first_name, last_name, role) VALUES
('admin', 'admin@wcm2.com', '$2b$10$default_hash_change_me', 'Administrateur', 'Système', 'admin'); 