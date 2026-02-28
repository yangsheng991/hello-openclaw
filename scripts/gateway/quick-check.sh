#!/bin/bash
# Quick Gateway Status Check
# Usage: bash scripts/gateway/quick-check.sh

echo "🔍 OpenClaw Gateway Quick Check"
echo ""

# Check process
if pgrep -f "openclaw-gateway" > /dev/null 2>&1; then
    PID=$(pgrep -f "openclaw-gateway" | head -1)
    echo "✅ Process: Running (PID: $PID)"
else
    echo "❌ Process: Not running"
    exit 1
fi

# Check port
if ss -tlnp 2>/dev/null | grep -q 18789; then
    echo "✅ Port: 18789 listening"
else
    echo "❌ Port: 18789 not listening"
    exit 1
fi

# Check RPC
if openclaw gateway status 2>/dev/null | grep -q "RPC probe: ok"; then
    echo "✅ RPC: OK"
else
    echo "❌ RPC: Failed"
    exit 1
fi

echo ""
echo "✅ Gateway is healthy!"
exit 0
