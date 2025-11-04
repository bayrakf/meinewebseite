/**
 * Simple Client-Side Authentication
 * 
 * ⚠️ CRITICAL SECURITY WARNING ⚠️
 * 
 * This client-side password protection provides ZERO real security!
 * Anyone can bypass this by:
 * - Viewing the source code to see the password
 * - Disabling JavaScript
 * - Removing the script tag
 * - Directly accessing the page content
 * 
 * FOR PRODUCTION USE, IMPLEMENT ONE OF THESE SOLUTIONS:
 * 
 * 1. SERVER-SIDE AUTHENTICATION (RECOMMENDED):
 *    - Use PHP sessions with proper login/logout
 *    - Store hashed passwords in database
 *    - Example: session_start(), password_hash(), password_verify()
 * 
 * 2. APACHE .htaccess PASSWORD PROTECTION:
 *    - AuthType Basic
 *    - AuthName "Protected Area"
 *    - AuthUserFile /path/to/.htpasswd
 *    - Require valid-user
 * 
 * 3. OAUTH/SSO INTEGRATION:
 *    - Use Google Workspace, Azure AD, etc.
 *    - Leverage existing authentication systems
 * 
 * This implementation is ONLY acceptable for:
 * - Development/testing environments
 * - Public demos with no sensitive data
 * - Preventing accidental access (not malicious access)
 */

(function () {
    'use strict';

    // ⚠️ WARNING: This password is visible in the source code!
    // This provides NO security against anyone who can view page source
    const PROTECTED_PASSWORD = 'Teufeline2028!!!';

    function checkAuth() {
        const pass = prompt("Passwort eingeben:");
        if (pass !== PROTECTED_PASSWORD) {
            window.location.href = "index.html";
            return false;
        }
        return true;
    }

    // Run authentication check
    checkAuth();
})();
