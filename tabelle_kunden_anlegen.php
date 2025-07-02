<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "kundendaten";

// Verbindung zur MySQL-Datenbank herstellen
$conn = new mysqli($servername, $username, $password);

// Prüfen, ob die Verbindung funktioniert
if ($conn->connect_error) {
    die("Verbindung fehlgeschlagen: " . $conn->connect_error);
}

// Datenbank erstellen, falls sie nicht existiert
$sql = "CREATE DATABASE IF NOT EXISTS $dbname";
$conn->query($sql);

// Mit der neuen Datenbank verbinden
$conn->select_db($dbname);

// SQL-Befehl zum Erstellen der Tabelle
$sql = "CREATE TABLE IF NOT EXISTS kunden (
    id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    adresse TEXT,
    firmenname VARCHAR(255)
)";

// Tabelle erstellen
if ($conn->query($sql) === TRUE) {
    echo "Tabelle 'kunden' wurde erfolgreich erstellt oder existiert bereits.";
} else {
    echo "Fehler beim Erstellen der Tabelle: " . $conn->error;
}

$conn->close();
?>