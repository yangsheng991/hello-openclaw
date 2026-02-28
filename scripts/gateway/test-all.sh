#!/bin/bash
# Full Gateway Test Suite
# Usage: bash scripts/gateway/test-all.sh

echo "╔═══════════════════════════════════════════════════╗"
echo "║   OpenClaw Gateway - Full Test Suite             ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname $(dirname $SCRIPT_DIR))"

cd $PROJECT_DIR

# Test 1: Health Check
echo "┌───────────────────────────────────────────────────┐"
echo "│ Test 1: Gateway Health Check                      │"
echo "└───────────────────────────────────────────────────┘"
node src/gateway/health-check.js
HEALTH_RESULT=$?
echo ""

# Test 2: RPC Test
echo "┌───────────────────────────────────────────────────┐"
echo "│ Test 2: RPC Connection Test                       │"
echo "└───────────────────────────────────────────────────┘"
node src/gateway/rpc-test.js
RPC_RESULT=$?
echo ""

# Test 3: Application Test
echo "┌───────────────────────────────────────────────────┐"
echo "│ Test 3: Application Test                          │"
echo "└───────────────────────────────────────────────────┘"
npm test
APP_RESULT=$?
echo ""

# Summary
echo "╔═══════════════════════════════════════════════════╗"
echo "║                  Test Summary                      ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

if [ $HEALTH_RESULT -eq 0 ]; then
    echo "  ✅ Gateway Health:    PASS"
else
    echo "  ❌ Gateway Health:    FAIL"
fi

if [ $RPC_RESULT -eq 0 ]; then
    echo "  ✅ RPC Connection:    PASS"
else
    echo "  ❌ RPC Connection:    FAIL"
fi

if [ $APP_RESULT -eq 0 ]; then
    echo "  ✅ Application:       PASS"
else
    echo "  ❌ Application:       FAIL"
fi

echo ""

if [ $HEALTH_RESULT -eq 0 ] && [ $RPC_RESULT -eq 0 ] && [ $APP_RESULT -eq 0 ]; then
    echo "🎉 ALL TESTS PASSED!"
    exit 0
else
    echo "⚠️  SOME TESTS FAILED"
    exit 1
fi
