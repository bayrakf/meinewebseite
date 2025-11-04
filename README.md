# Rechnify - Rechnungsverwaltung

Ein smarter Einstieg in Verwaltung und Kalkulation für Rechnungen.

## ⚠️ WICHTIG: Vor Produktiveinsatz lesen!

**KRITISCHE Sicherheitshinweise für Production:**
1. 🔴 Client-Side Passwort in `js/auth.js` durch Server-Auth ersetzen
2. 🔴 Umgebung auf 'production' in `config/environment.php` setzen
3. 🔴 Starke Datenbank-Passwörter in `config/database.php` setzen
4. 🔴 Google API Domain-Beschränkungen konfigurieren
5. 🔴 HTTPS aktivieren
6. 🔴 Setup-Script `tabelle_kunden_anlegen.php` löschen

Siehe Abschnitt "Sicherheitshinweise" unten für Details.

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
✅ **Umgebungskonfiguration**: Separate Einstellungen für Entwicklung/Produktion

### KRITISCH - Vor Produktiveinsatz zu implementieren:

🔴 **CLIENT-SIDE PASSWORT (HÖCHSTE PRIORITÄT)**
   - **Problem**: Das Passwort in `js/auth.js` ist im Browser-Code sichtbar und bietet KEINE echte Sicherheit
   - **Lösung 1 (Empfohlen)**: Server-seitige PHP-Authentifizierung mit Session
     ```php
     // Beispiel: login.php mit session_start(), password_verify()
     session_start();
     if (!isset($_SESSION['authenticated'])) {
         header('Location: login.php');
         exit;
     }
     ```
   - **Lösung 2**: Apache .htaccess Passwortschutz
     ```apache
     AuthType Basic
     AuthName "Geschützter Bereich"
     AuthUserFile /pfad/zu/.htpasswd
     Require valid-user
     ```
   - **Lösung 3**: OAuth/SSO Integration (z.B. Google Workspace)

🔴 **UMGEBUNGSKONFIGURATION**
   - In `config/environment.php` auf `'production'` setzen
   - Dadurch werden Fehlerausgaben automatisch deaktiviert

⚠️ **Google API Credentials**
   - Client-ID in `js/invoice.js` ist sichtbar (normale OAuth-Praxis)
   - **WICHTIG**: In Google Cloud Console konfigurieren:
     - Autorisierte JavaScript-Ursprünge beschränken
     - API-Nutzungskontingente setzen
     - Nur erforderliche Scopes gewähren

⚠️ **HTTPS verwenden**
   - Für Produktivumgebung ZWINGEND HTTPS aktivieren
   - Schützt Datenübertragung und Passwörter
   - Erforderlich für moderne Web-APIs und OAuth

⚠️ **Datenbank-Credentials**
   - `config/database.php` sollte außerhalb des Web-Root liegen
   - Oder zusätzlich mit .htaccess schützen (bereits vorhanden)
   - **UNBEDINGT**: Starke Passwörter verwenden (nicht leer!)
   - Separate Datenbankbenutzer mit minimalen Rechten erstellen

⚠️ **Setup-Script entfernen**
   - `tabelle_kunden_anlegen.php` nach einmaligem Ausführen LÖSCHEN
   - Oder mit .htaccess schützen
   - Exponiert sonst Datenbankstruktur

⚠️ **Weitere Produktions-Checkliste**
   - [ ] PHP-Version aktuell halten
   - [ ] Regelmäßige Backups der Datenbank
   - [ ] Log-Dateien überwachen
   - [ ] File-Upload-Validierung bei Logo-Upload verstärken
   - [ ] Rate-Limiting für API-Anfragen implementieren
   - [ ] Content Security Policy (CSP) Header setzen

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
