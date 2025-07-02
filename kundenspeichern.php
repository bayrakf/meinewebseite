
<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "kundendaten";

// Verbindung herstellen
$conn = new mysqli($servername, $username, $password, $dbname);

// Verbindung prüfen
if ($conn->connect_error) {
    die("Verbindung fehlgeschlagen: " . $conn->connect_error);
}

// Daten aus Formular holen
$name = $_POST["name"];
$email = $_POST["email"];
$adresse = $_POST["adresse"];
$firmenname = $_POST["firmenname"];

// SQL zum Einfügen
$sql = "INSERT INTO kunden (name, email, adresse, firmenname) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssss", $name, $email, $adresse, $firmenname);

if ($stmt->execute()) {
    echo "Kunde gespeichert!";
} else {
    echo "Fehler: " . $conn->error;
}

$stmt->close();
$conn->close();
?>