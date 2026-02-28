#!/usr/bin/env node

/**
 * RPC Connection Test
 * 
 * Tests RPC connectivity to OpenClaw Gateway
 * Usage: node src/gateway/rpc-test.js
 */

const net = require('net');
const { execSync } = require('child_process');

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

const GATEWAY_HOST = '127.0.0.1';
const GATEWAY_PORT = 18789;

function testRPC() {
    log(colors.cyan, '═══════════════════════════════════════════════════');
    log(colors.cyan, '   OpenClaw RPC Connection Test');
    log(colors.cyan, '═══════════════════════════════════════════════════');
    console.log('');
    console.log('Target: ws://' + GATEWAY_HOST + ':' + GATEWAY_PORT);
    console.log('');

    // Test 1: TCP Connection
    log(colors.blue, '[Test 1] TCP Connection Test...');
    
    const socket = new net.Socket();
    socket.setTimeout(5000);

    socket.on('connect', () => {
        log(colors.green, '  ✅ PASS: TCP connection established');
        console.log('    Local Address: ' + socket.localAddress + ':' + socket.localPort);
        console.log('    Remote Address: ' + socket.remoteAddress + ':' + socket.remotePort);
        socket.destroy();
        
        // Test 2: Gateway Status
        setTimeout(() => {
            testGatewayStatus();
        }, 500);
    });

    socket.on('error', (err) => {
        log(colors.red, '  ❌ FAIL: Cannot connect to gateway');
        log(colors.red, '  Error: ' + err.message);
        console.log('');
        log(colors.yellow, 'Possible causes:');
        console.log('  • Gateway not running');
        console.log('  • Wrong port (check ~/.openclaw/openclaw.json)');
        console.log('  • Firewall blocking connection');
        console.log('');
        process.exit(1);
    });

    socket.on('timeout', () => {
        log(colors.red, '  ❌ FAIL: Connection timeout');
        socket.destroy();
        process.exit(1);
    });

    socket.connect(GATEWAY_PORT, GATEWAY_HOST);
}

function testGatewayStatus() {
    console.log('');
    log(colors.blue, '[Test 2] Gateway Status Command...');
    
    try {
        const status = execSync('openclaw gateway status', { encoding: 'utf8' });
        log(colors.green, '  ✅ PASS: Gateway status retrieved');
        console.log('');
        
        // Parse and display key info
        const lines = status.split('\n');
        lines.forEach(line => {
            if (line.trim()) {
                console.log('  ' + line);
            }
        });
        
        console.log('');
        log(colors.green, '✅ RPC layer is functional!');
        console.log('');
        
    } catch (error) {
        log(colors.red, '  ❌ FAIL: Cannot get gateway status');
        log(colors.red, '  Error: ' + error.message);
        process.exit(1);
    }
}

// Run the test
testRPC();
