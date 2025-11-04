<?php
/**
 * Database Setup Script
 * Creates database and customer table if they don't exist
 * 
 * SECURITY WARNING: This file should be deleted or protected after initial setup!
 * It exposes database structure and could be abused in production.
 */

require_once __DIR__ . '/config/environment.php';

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "kundendaten";

try {
    // Connect to MySQL server (without database)
    $conn = new mysqli($servername, $username, $password);
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Verbindung fehlgeschlagen: " . $conn->connect_error);
    }
    
    // Set charset
    $conn->set_charset("utf8mb4");
    
    // Create database if not exists
    $sql = "CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
    if (!$conn->query($sql)) {
        throw new Exception("Fehler beim Erstellen der Datenbank: " . $conn->error);
    }
    
    // Select database
    if (!$conn->select_db($dbname)) {
        throw new Exception("Fehler beim Auswählen der Datenbank: " . $conn->error);
    }
    
    // Create table if not exists
    $sql = "CREATE TABLE IF NOT EXISTS `kunden` (
        `id` INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        `name` VARCHAR(255) NOT NULL,
        `email` VARCHAR(255) NOT NULL,
        `adresse` TEXT,
        `firmenname` VARCHAR(255),
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX `idx_email` (`email`),
        INDEX `idx_name` (`name`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    if (!$conn->query($sql)) {
        throw new Exception("Fehler beim Erstellen der Tabelle: " . $conn->error);
    }
    
    $conn->close();
    
    // Success response
    ?>
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Datenbank Setup - Rechnify</title>
        <link rel="stylesheet" href="styles/main.css">
    </head>
    <body>
        <div class="container" style="margin-top: 2rem;">
            <h1 style="color: #27ae60;">✓ Setup erfolgreich!</h1>
            <p>Die Datenbank und Tabelle 'kunden' wurden erfolgreich erstellt oder existieren bereits.</p>
            <div class="button-group">
                <a href="kunde.html" class="button-link">Kunde anlegen</a>
                <a href="index.html" class="button-link">Zur Startseite</a>
            </div>
        </div>
    </body>
    </html>
    <?php
    
} catch (Exception $e) {
    // Error response
    ?>
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Setup Fehler - Rechnify</title>
        <link rel="stylesheet" href="styles/main.css">
    </head>
    <body>
        <div class="container" style="margin-top: 2rem;">
            <h1 style="color: #e74c3c;">⚠ Setup Fehler</h1>
            <p><?php echo htmlspecialchars($e->getMessage()); ?></p>
            <div class="button-group">
                <a href="index.html" class="button-link">Zur Startseite</a>
            </div>
        </div>
    </body>
    </html>
    <?php
}
?>