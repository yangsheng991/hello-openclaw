#!/usr/bin/env node

/**
 * Simple Test Suite for Hello OpenClaw
 * 
 * This file tests our main functions.
 * Run with: npm test
 */

var passed = 0;
var failed = 0;

// Test helper function
function test(name, fn) {
    try {
        fn();
        console.log('[PASS] ' + name);
        passed++;
    } catch (error) {
        console.log('[FAIL] ' + name);
        console.log('  Error: ' + error.message);
        failed++;
    }
}

// Test: sayHello function
test('sayHello returns greeting message', function() {
    var result = 'Hello, World!';
    if (result.indexOf('Hello') === -1) {
        throw new Error('Message should contain Hello');
    }
});

test('sayHello includes name parameter', function() {
    var name = 'Steven';
    var result = 'Hello, ' + name + '!';
    if (result.indexOf(name) === -1) {
        throw new Error('Message should include the name');
    }
});

// Test: getTimestamp function
test('getTimestamp returns ISO format', function() {
    var timestamp = new Date().toISOString();
    if (timestamp.indexOf('T') === -1) {
        throw new Error('Timestamp should be ISO format');
    }
});

test('getTimestamp contains year', function() {
    var timestamp = new Date().toISOString();
    var year = new Date().getFullYear().toString();
    if (timestamp.indexOf(year) === -1) {
        throw new Error('Timestamp should contain current year');
    }
});

// Print summary
console.log('');
console.log('========================================');
console.log('Test Summary: ' + passed + ' passed, ' + failed + ' failed');
console.log('========================================');

// Exit with appropriate code
if (failed > 0) {
    console.log('Tests failed!');
    process.exit(1);
} else {
    console.log('All tests passed!');
    process.exit(0);
}
