<?php
/**
 * Customer Data Save Handler
 * Processes and saves customer information to database
 */

require_once __DIR__ . '/config/environment.php';
require_once __DIR__ . '/config/database.php';

// Start output buffering
ob_start();

try {
    // Validate request method
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Ungültige Anfragemethode.");
    }
    
    // Validate and sanitize input
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $adresse = isset($_POST['adresse']) ? trim($_POST['adresse']) : '';
    $firmenname = isset($_POST['firmenname']) ? trim($_POST['firmenname']) : '';
    
    // Validate required fields
    if (empty($name)) {
        throw new Exception("Name ist erforderlich.");
    }
    
    if (empty($email)) {
        throw new Exception("E-Mail ist erforderlich.");
    }
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Ungültige E-Mail-Adresse.");
    }
    
    // Validate length constraints
    if (strlen($name) > 255) {
        throw new Exception("Name ist zu lang (max. 255 Zeichen).");
    }
    
    if (strlen($email) > 255) {
        throw new Exception("E-Mail ist zu lang (max. 255 Zeichen).");
    }
    
    if (strlen($firmenname) > 255) {
        throw new Exception("Firmenname ist zu lang (max. 255 Zeichen).");
    }
    
    // Get database connection
    $conn = getDatabaseConnection();
    
    // Prepare SQL statement
    $sql = "INSERT INTO kunden (name, email, adresse, firmenname) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    
    if (!$stmt) {
        throw new Exception("Datenbankfehler. Bitte versuchen Sie es später erneut.");
    }
    
    // Bind parameters
    $stmt->bind_param("ssss", $name, $email, $adresse, $firmenname);
    
    // Execute statement
    if (!$stmt->execute()) {
        // Log technical details for debugging (only visible to server admins)
        $errorId = uniqid('db_error_', true);
        error_log("Database insert failed [$errorId]: " . $stmt->error);
        throw new Exception("Fehler beim Speichern der Daten. Bitte versuchen Sie es später erneut. (Error ID: $errorId)");
    }
    
    $customerId = $stmt->insert_id;
    
    // Close statement and connection
    $stmt->close();
    $conn->close();
    
    // Clear output buffer
    ob_end_clean();
    
    // Success response
    ?>
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Erfolgreich gespeichert - Rechnify</title>
        <link rel="stylesheet" href="styles/main.css">
    </head>
    <body>
        <div class="container" style="margin-top: 2rem;">
            <h1 style="color: #27ae60;">✓ Erfolgreich gespeichert!</h1>
            <p>Die Kundendaten wurden erfolgreich gespeichert.</p>
            <p><strong>Kunde-ID:</strong> <?php echo htmlspecialchars($customerId); ?></p>
            <div class="button-group">
                <a href="kunde.html" class="button-link">Neuen Kunden anlegen</a>
                <a href="index.html" class="button-link">Zur Startseite</a>
            </div>
        </div>
    </body>
    </html>
    <?php
    
} catch (Exception $e) {
    // Clear output buffer
    ob_end_clean();
    
    // Error response
    ?>
    <!DOCTYPE html>
    <html lang="de">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Fehler - Rechnify</title>
        <link rel="stylesheet" href="styles/main.css">
    </head>
    <body>
        <div class="container" style="margin-top: 2rem;">
            <h1 style="color: #e74c3c;">⚠ Fehler</h1>
            <p><?php echo htmlspecialchars($e->getMessage()); ?></p>
            <div class="button-group">
                <a href="kunde.html" class="button-link">Zurück zum Formular</a>
                <a href="index.html" class="button-link">Zur Startseite</a>
            </div>
        </div>
    </body>
    </html>
    <?php
}
?>