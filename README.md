# Rechnify - Rechnungsverwaltung

Ein smarter Einstieg in Verwaltung und Kalkulation für Rechnungen.

## Funktionen

- Professioneller Rechnungs-Generator
- Kundendatenverwaltung
- Google Drive Integration
- PDF-Export von Rechnungen

## Dateien

- `index.html` - Startseite
- `kontakt.html` - Kontaktseite
- `kunde.html` - Formular zum Anlegen neuer Kunden
- `geheim.html` - Geschützter Rechnungs-Generator
- `kundenspeichern.php` - Backend zum Speichern von Kundendaten
- `tabelle_kunden_anlegen.php` - Datenbank-Setup Script
- `styles/main.css` - Gemeinsames Stylesheet
- `config/database.php` - Datenbankkonfiguration

## Installation

1. Dateien auf Webserver hochladen
2. Datenbank einrichten: `tabelle_kunden_anlegen.php` aufrufen
3. Datenbankzugangsdaten in `config/database.php` anpassen (falls erforderlich)

## Sicherheitshinweise

### Wichtige Verbesserungen bereits implementiert:

✅ **Eingabevalidierung**: Alle Benutzereingaben werden validiert und sanitiert
✅ **SQL Injection Schutz**: Verwendung von Prepared Statements
✅ **XSS Schutz**: Ausgaben werden mit htmlspecialchars() escaped
✅ **Fehlerbehandlung**: Ordnungsgemäße Fehlerbehandlung ohne sensible Daten preiszugeben
✅ **Konfigurationstrennung**: Datenbankzugangsdaten in separater Config-Datei
✅ **Config-Schutz**: .htaccess schützt config-Verzeichnis

### Noch zu implementieren für Produktionsumgebung:

⚠️ **Passwortschutz**: Das Passwort in `geheim.html` ist im Client-sichtbar
   - **Empfehlung**: Serverseitige Authentifizierung implementieren
   - **Alternative**: .htaccess Passwortschutz verwenden

⚠️ **Google API Credentials**: Client-ID ist im Code sichtbar
   - **Hinweis**: Normale Praxis für OAuth, aber Zugriff sollte über Berechtigungen eingeschränkt werden
   - **Empfehlung**: API-Schlüssel-Beschränkungen in Google Cloud Console setzen

⚠️ **HTTPS**: Für Produktivumgebung unbedingt HTTPS verwenden
   - Schützt Datenübertragung
   - Erforderlich für viele moderne Web-APIs

⚠️ **Datenbank-Credentials**: 
   - `config/database.php` sollte außerhalb des Web-Root liegen
   - Starke Passwörter verwenden (nicht leer lassen)
   - Separate Datenbankbenutzer mit minimalen Rechten

⚠️ **Setup-Script**: 
   - `tabelle_kunden_anlegen.php` nach Setup löschen oder schützen

⚠️ **Fehlerausgabe**: 
   - `display_errors` auf 0 setzen in Produktion
   - Fehler nur in Log-Dateien speichern

## Code-Verbesserungen

### Implementierte Verbesserungen:

- ✅ CSS in externe Datei ausgelagert (styles/main.css)
- ✅ Konsistentes Styling über alle Seiten
- ✅ Responsive Design verbessert
- ✅ Formularvalidierung hinzugefügt
- ✅ Accessibility-Verbesserungen (ARIA-Labels, required-Attribute)
- ✅ Bessere Fehlerbehandlung in PHP
- ✅ Code-Dokumentation hinzugefügt
- ✅ Semantisches HTML verwendet

## Browser-Kompatibilität

- Chrome/Edge (neueste Versionen)
- Firefox (neueste Versionen)
- Safari (neueste Versionen)
- Mobile Browser (iOS Safari, Chrome Mobile)

## Lizenz

Privates Projekt
