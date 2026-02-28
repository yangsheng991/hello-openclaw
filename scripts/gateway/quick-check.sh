#!/bin/bash
# Quick Gateway Status Check
# Usage: bash scripts/gateway/quick-check.sh [port]
# Default: 18790 (learning gateway)

PORT=${1:-18790}

echo "🔍 OpenClaw Gateway Quick Check"
echo ""
echo "Target Port: $PORT"
echo "Note: Production gateway on 18789"
echo ""

# Check process
if pgrep -f "openclaw-gateway" > /dev/null 2>&1; then
    COUNT=$(pgrep -f "openclaw-gateway" | wc -l)
    echo "✅ Process: $COUNT gateway(s) running"
    pgrep -f "openclaw-gateway" | head -2 | xargs -I {} ps -p {} -o pid,cmd --no-headers
else
    echo "❌ Process: No gateway running"
    exit 1
fi

echo ""

# Check port
if ss -tlnp 2>/dev/null | grep -q $PORT; then
    echo "✅ Port: $PORT listening"
else
    echo "❌ Port: $PORT not listening"
    exit 1
fi

echo ""
echo "✅ Gateway on port $PORT is healthy!"
echo ""
echo "Gateway Instances:"
echo "  • Production: Port 18789"
echo "  • Learning:   Port $PORT"
exit 0
