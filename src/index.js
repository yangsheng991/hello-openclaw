#!/usr/bin/env node

/**
 * Hello OpenClaw - My First Project
 * 
 * This is a simple Hello World application to learn:
 * - Node.js project structure
 * - Git version control
 * - GitHub integration
 * - CI/CD with GitHub Actions
 */

// Main greeting function
function sayHello(name = 'World') {
    const message = `Hello, ${name}! 🤖`;
    console.log(message);
    return message;
}

// Get current timestamp
function getTimestamp() {
    return new Date().toISOString();
}

// Main entry point
function main() {
    console.log('🚀 OpenClaw Hello World Project');
    console.log('=' .repeat(40));
    console.log(`⏰ Time: ${getTimestamp()}`);
    console.log('');
    
    // Say hello
    sayHello('OpenClaw Learner');
    
    console.log('');
    console.log('✅ Project is running successfully!');
    console.log('📚 Next: Check tests/ to see how testing works');
}

// Run the application
main();
