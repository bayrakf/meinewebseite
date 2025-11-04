<?php
/**
 * Environment Configuration
 * 
 * This file controls environment-specific settings.
 * Set ENVIRONMENT to 'production' for live deployments.
 */

// Set environment: 'development' or 'production'
define('ENVIRONMENT', 'development');

// Configure error reporting based on environment
if (ENVIRONMENT === 'production') {
    ini_set('display_errors', 0);
    error_reporting(0);
} else {
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
}

// Other environment-specific settings can go here
