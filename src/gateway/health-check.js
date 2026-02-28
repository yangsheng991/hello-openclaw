#!/usr/bin/env node

/**
 * Gateway Health Check
 * 
 * Tests if OpenClaw Gateway is running and healthy
 * Usage: node src/gateway/health-check.js
 */

const { execSync } = require('child_process');

// Colors for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(color, message) {
    console.log(color + message + colors.reset);
}

function runHealthCheck() {
    log(colors.cyan, '═══════════════════════════════════════════════════');
    log(colors.cyan, '   OpenClaw Gateway Health Check');
    log(colors.cyan, '═══════════════════════════════════════════════════');
    console.log('');

    let allPassed = true;

    // Test 1: Check if gateway process is running
    log(colors.blue, '[Test 1] Checking gateway process...');
    try {
        const pgrep = execSync('pgrep -f "openclaw-gateway"', { encoding: 'utf8' });
        const pids = pgrep.trim().split('\n');
        const pid = pids[0]; // Use first PID
        log(colors.green, '  ✅ PASS: Gateway is running (PID: ' + pid + ')');
        
        // Get more process info
        const ps = execSync('ps -p ' + pid + ' -o pid,etimes,cmd', { encoding: 'utf8' });
        console.log('  ' + ps.trim());
    } catch (error) {
        log(colors.red, '  ❌ FAIL: Gateway process not found');
        log(colors.yellow, '  Hint: Run "openclaw gateway start"');
        allPassed = false;
    }
    console.log('');

    // Test 2: Check port binding
    log(colors.blue, '[Test 2] Checking port 18789...');
    try {
        const ss = execSync('ss -tlnp | grep 18789', { encoding: 'utf8' });
        log(colors.green, '  ✅ PASS: Port 18789 is listening');
        const lines = ss.trim().split('\n');
        lines.forEach(line => {
            console.log('    ' + line);
        });
    } catch (error) {
        log(colors.red, '  ❌ FAIL: Port 18789 not listening');
        allPassed = false;
    }
    console.log('');

    // Test 3: RPC probe
    log(colors.blue, '[Test 3] Testing RPC connection...');
    try {
        const status = execSync('openclaw gateway status', { encoding: 'utf8' });
        if (status.includes('RPC probe: ok')) {
            log(colors.green, '  ✅ PASS: RPC probe successful');
        } else {
            log(colors.yellow, '  ⚠️  WARNING: RPC probe returned unexpected result');
            allPassed = false;
        }
    } catch (error) {
        log(colors.red, '  ❌ FAIL: RPC probe failed');
        log(colors.red, '  Error: ' + error.message);
        allPassed = false;
    }
    console.log('');

    // Test 4: Check configuration
    log(colors.blue, '[Test 4] Validating configuration...');
    try {
        const fs = require('fs');
        const config = JSON.parse(fs.readFileSync('/home/steven/.openclaw/openclaw.json', 'utf8'));
        
        if (config.gateway && config.gateway.port) {
            log(colors.green, '  ✅ PASS: Configuration valid');
            console.log('    Port: ' + config.gateway.port);
            console.log('    Mode: ' + config.gateway.mode);
            console.log('    Bind: ' + config.gateway.bind);
            console.log('    Auth: ' + config.gateway.auth.mode);
        } else {
            log(colors.red, '  ❌ FAIL: Gateway config missing');
            allPassed = false;
        }
    } catch (error) {
        log(colors.red, '  ❌ FAIL: Cannot read configuration');
        log(colors.red, '  Error: ' + error.message);
        allPassed = false;
    }
    console.log('');

    // Summary
    log(colors.cyan, '═══════════════════════════════════════════════════');
    if (allPassed) {
        log(colors.green, '  ✅ ALL TESTS PASSED - Gateway is healthy!');
    } else {
        log(colors.red, '  ❌ SOME TESTS FAILED - Check gateway status');
    }
    log(colors.cyan, '═══════════════════════════════════════════════════');

    process.exit(allPassed ? 0 : 1);
}

// Run the health check
runHealthCheck();
