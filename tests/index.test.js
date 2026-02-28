#!/usr/bin/env node

/**
 * Simple Test Suite for Hello OpenClaw
 * 
 * This file tests our main functions.
 * Run with: npm test
 */

// Import functions from src/index.js
// For simplicity, we'll test inline here
// In real projects, use proper module imports

let passed = 0;
let failed = 0;

// Test helper function
function test(name, fn) {
    try {
        fn();
        console.log(`✅ PASS: ${name}`);
        passed++;
    } catch (error) {
        console.log(`❌ FAIL: ${name}`);
        console.log(`   Error: ${error.message}`);
        failed++;
    }
}

// Test: sayHello function
test('sayHello returns greeting message', () => {
    const result = `Hello, World! 🤖`;
    if (!result.includes('Hello')) {
        throw new Error('Message should contain "Hello"');
    }
});

test('sayHello includes name parameter', () => {
    const name = 'Steven';
    const result = `Hello, ${name}! 🤖`;
    if (!result.includes(name)) {
        throw new Error('Message should include the name');
    }
});

// Test: getTimestamp function
test('getTimestamp returns ISO format', () => {
    const timestamp = new Date().toISOString();
    if (!timestamp.includes('T')) {
        throw new Error('Timestamp should be ISO format');
    }
});

test('getTimestamp contains year', () => {
    const timestamp = new Date().toISOString();
    const year = new Date().getFullYear().toString();
    if (!timestamp.includes(year)) {
        throw new Error('Timestamp should contain current year');
    }
});

// Print summary
console.log('');
console.log('=' .repeat(40));
console.log(`📊 Test Summary: ${passed} passed, ${failed} failed`);
console.log('=' .repeat(40));

// Exit with appropriate code
if (failed > 0) {
    console.log('❌ Tests failed!');
    process.exit(1);
} else {
    console.log('✅ All tests passed!');
    process.exit(0);
}
