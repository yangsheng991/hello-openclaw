# Gateway Setup Guide

## 🎯 Two Gateway Instances

We now have **TWO separate OpenClaw gateways** running:

| Instance | Port | PID | Purpose | Config Location |
|----------|------|-----|---------|-----------------|
| **Production** | 18789 | 56084 | System/Production gateway | `~/.openclaw/openclaw.json` |
| **Learning** | 18790 | 89250 | Our learning project | `~/.openclaw/learning-gateway/openclaw.json` |

---

## 🚀 Testing the Learning Gateway

### Quick Health Check
```bash
cd /home/steven/ws/hello-openclaw

# Quick check (5 seconds)
npm run gateway:quick

# Or with custom port
bash scripts/gateway/quick-check.sh 18790
```

**Output:**
```
🔍 OpenClaw Gateway Quick Check

Target Port: 18790
Note: Production gateway on 18789

✅ Process: 2 gateway(s) running
  56084 openclaw-gateway
  89250 openclaw-gateway

✅ Port: 18790 listening

✅ Gateway on port 18790 is healthy!

Gateway Instances:
  • Production: Port 18789
  • Learning:   Port 18790
```

### Full Health Check
```bash
npm run gateway:health

# Or with custom port
node src/gateway/health-check.js 18790
```

---

## 📁 Learning Gateway Configuration

**Location:** `/home/steven/.openclaw/learning-gateway/openclaw.json`

**Key Settings:**
```json
{
  "gateway": {
    "port": 18790,
    "mode": "local",
    "bind": "loopback",
    "auth": {
      "mode": "token",
      "token": "learning-token-abc123xyz789"
    }
  },
  "agents": {
    "defaults": {
      "workspace": "/home/steven/ws/hello-openclaw"
    }
  }
}
```

---

## 🔧 Managing the Learning Gateway

### Start
```bash
cd /home/steven/.openclaw/learning-gateway
OPENCLAW_GATEWAY_PORT=18790 nohup openclaw gateway --port 18790 --bind loopback --auth token --token learning-token-abc123xyz789 > gateway.log 2>&1 &
```

### Stop
```bash
# Find the PID
pgrep -f "18790"

# Kill it
kill <PID>
```

### Check Status
```bash
# Check if running
ss -tlnp | grep 18790

# View logs
tail -f /home/steven/.openclaw/learning-gateway/gateway.log
```

---

## ⚠️ Important Notes

1. **Don't confuse the ports!**
   - Production: 18789 (system gateway)
   - Learning: 18790 (our project)

2. **Separate configs**
   - Each gateway has its own config file
   - Changes to one don't affect the other

3. **Independent operation**
   - You can stop/start learning gateway without affecting production
   - Safe for experimentation!

---

## 🎓 Learning Exercises

1. **Start/Stop Practice**
   ```bash
   # Stop learning gateway
   kill $(pgrep -f "18790")
   
   # Verify it's stopped
   npm run gateway:quick  # Should fail
   
   # Start it again
   # (see start command above)
   ```

2. **Port Comparison**
   ```bash
   # Check both ports
   ss -tlnp | grep -E "18789|18790"
   ```

3. **Log Analysis**
   ```bash
   # Watch learning gateway logs
   tail -f /home/steven/.openclaw/learning-gateway/gateway.log
   ```

---

_This setup allows safe experimentation without affecting the production gateway!_
