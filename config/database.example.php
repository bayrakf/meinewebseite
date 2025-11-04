<?php
/**
 * Database Configuration File - EXAMPLE
 * 
 * Copy this file to database.php and update with your actual credentials
 * 
 * SECURITY NOTE: This file should be placed outside the web root in production
 * or protected via .htaccess to prevent direct access.
 */

define('DB_HOST', 'localhost');
define('DB_USER', 'your_database_user');
define('DB_PASS', 'your_secure_password');
define('DB_NAME', 'kundendaten');

/**
 * Get database connection
 * 
 * @return mysqli Database connection object
 * @throws Exception If connection fails
 */
function getDatabaseConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        error_log("Database connection failed: " . $conn->connect_error);
        throw new Exception("Verbindungsfehler. Bitte versuchen Sie es später erneut.");
    }
    
    $conn->set_charset("utf8mb4");
    return $conn;
}
