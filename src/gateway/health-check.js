#!/usr/bin/env node

/**
 * Gateway Health Check
 * 
 * Tests if OpenClaw Gateway is running and healthy
 * Usage: node src/gateway/health-check.js [port]
 * Default port: 18790 (learning gateway)
 */

const { execSync } = require('child_process');

// Gateway port - can be overridden via command line
const GATEWAY_PORT = process.argv[2] || '18790';

// Colors for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
};

function log(color, message) {
    console.log(color + message + colors.reset);
}

function runHealthCheck() {
    log(colors.cyan, '═══════════════════════════════════════════════════');
    log(colors.magenta, '   OpenClaw Learning Gateway Health Check');
    log(colors.cyan, '═══════════════════════════════════════════════════');
    console.log('');
    log(colors.blue, 'Target Port: ' + GATEWAY_PORT);
    log(colors.blue, 'Note: Production gateway runs on 18789');
    console.log('');

    let allPassed = true;

    // Test 1: Check if gateway process is running
    log(colors.blue, '[Test 1] Checking gateway process...');
    try {
        const pgrep = execSync('pgrep -f "openclaw-gateway"', { encoding: 'utf8' });
        const pids = pgrep.trim().split('\n');
        log(colors.green, '  ✅ PASS: Gateway processes found (' + pids.length + ' running)');
        pids.forEach((pid, i) => {
            if (i < 3) { // Show first 3
                try {
                    const ps = execSync('ps -p ' + pid + ' -o pid,cmd --no-headers', { encoding: 'utf8' });
                    console.log('    ' + ps.trim());
                } catch (e) {}
            }
        });
        if (pids.length > 3) {
            console.log('    ... and ' + (pids.length - 3) + ' more');
        }
    } catch (error) {
        log(colors.red, '  ❌ FAIL: No gateway processes found');
        log(colors.yellow, '  Hint: Run "openclaw gateway start"');
        allPassed = false;
    }
    console.log('');

    // Test 2: Check port binding
    log(colors.blue, '[Test 2] Checking port ' + GATEWAY_PORT + '...');
    try {
        const ss = execSync('ss -tlnp | grep ' + GATEWAY_PORT, { encoding: 'utf8' });
        log(colors.green, '  ✅ PASS: Port ' + GATEWAY_PORT + ' is listening');
        const lines = ss.trim().split('\n');
        lines.forEach(line => {
            console.log('    ' + line);
        });
    } catch (error) {
        log(colors.red, '  ❌ FAIL: Port ' + GATEWAY_PORT + ' not listening');
        allPassed = false;
    }
    console.log('');

    // Test 3: Check configuration
    log(colors.blue, '[Test 3] Checking learning gateway config...');
    try {
        const fs = require('fs');
        const configPath = '/home/steven/.openclaw/learning-gateway/openclaw.json';
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        
        if (config.gateway && config.gateway.port) {
            log(colors.green, '  ✅ PASS: Learning gateway config found');
            console.log('    Config: ' + configPath);
            console.log('    Port: ' + config.gateway.port);
            console.log('    Mode: ' + config.gateway.mode);
            console.log('    Bind: ' + config.gateway.bind);
            console.log('    Auth: ' + config.gateway.auth.mode);
            
            if (config.gateway.port.toString() !== GATEWAY_PORT) {
                log(colors.yellow, '  ⚠️  WARNING: Config port (' + config.gateway.port + ') != Test port (' + GATEWAY_PORT + ')');
            }
        } else {
            log(colors.red, '  ❌ FAIL: Gateway config invalid');
            allPassed = false;
        }
    } catch (error) {
        log(colors.red, '  ❌ FAIL: Cannot read learning gateway config');
        log(colors.red, '  Error: ' + error.message);
        allPassed = false;
    }
    console.log('');

    // Summary
    log(colors.cyan, '═══════════════════════════════════════════════════');
    if (allPassed) {
        log(colors.green, '  ✅ ALL TESTS PASSED - Learning gateway is healthy!');
    } else {
        log(colors.red, '  ❌ SOME TESTS FAILED - Check gateway status');
    }
    log(colors.cyan, '═══════════════════════════════════════════════════');
    console.log('');
    log(colors.blue, 'Gateway Instances:');
    console.log('  • Production: Port 18789 (System gateway)');
    console.log('  • Learning:   Port ' + GATEWAY_PORT + ' (Our project)');
    console.log('');

    process.exit(allPassed ? 0 : 1);
}

// Run the health check
runHealthCheck();
