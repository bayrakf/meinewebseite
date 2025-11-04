/**
 * Simple Client-Side Authentication
 * 
 * SECURITY WARNING: This is NOT secure for production use!
 * Client-side password protection can be easily bypassed.
 * 
 * For production, implement:
 * - Server-side authentication (PHP session-based)
 * - .htaccess password protection
 * - OAuth/SSO integration
 */

(function () {
    'use strict';

    // WARNING: This password is visible in the source code
    // For production, use server-side authentication
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
