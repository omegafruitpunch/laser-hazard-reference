#!/bin/bash

# Laser Safety LMS Launcher
# Starts the Next.js LMS on port 3000

NEXTJS_PORT=3000
NEXTJS_DIR="laser-safety-lms"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_header() {
    echo ""
    echo "============================================================"
    echo "  $1"
    echo "============================================================"
}

print_success() { echo -e "  ${GREEN}✓${NC} $1"; }
print_error()   { echo -e "  ${RED}✗${NC} $1" >&2; }
print_info()    { echo -e "  ${YELLOW}ℹ${NC} $1"; }

cleanup() {
    echo ""
    print_header "Shutting down..."
    [ -n "$NEXTJS_PID" ] && kill $NEXTJS_PID 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM

is_port_in_use() {
    local port=$1
    if command -v lsof &> /dev/null; then
        lsof -i :$port &> /dev/null; return $?
    elif command -v netstat &> /dev/null; then
        netstat -tuln 2>/dev/null | grep -q ":$port "; return $?
    else
        (echo > /dev/tcp/localhost/$port) 2>/dev/null; return $?
    fi
}

wait_for_port() {
    local port=$1 timeout=$2 counter=0
    while [ $counter -lt $timeout ]; do
        is_port_in_use $port && return 0
        sleep 1; counter=$((counter + 1))
    done
    return 1
}

print_header "Laser Safety LMS Launcher"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Install from https://nodejs.org/"
    exit 1
fi
print_success "Node.js: $(node --version)"

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi
print_success "npm: $(npm --version)"

# Check port
if is_port_in_use $NEXTJS_PORT; then
    print_error "Port $NEXTJS_PORT is already in use"
    exit 1
fi
print_success "Port $NEXTJS_PORT is available"

# Install npm deps if needed
if [ ! -d "$NEXTJS_DIR/node_modules" ] || [ -z "$(ls -A $NEXTJS_DIR/node_modules)" ]; then
    print_info "Installing npm dependencies..."
    (cd "$NEXTJS_DIR" && npm install)
    print_success "Dependencies installed"
else
    print_success "Dependencies already installed"
fi

# Start Next.js
print_header "Starting Next.js LMS..."
(cd "$NEXTJS_DIR" && PORT=$NEXTJS_PORT npm run dev) &
NEXTJS_PID=$!

print_info "Waiting for server to be ready..."
if ! wait_for_port $NEXTJS_PORT 60; then
    print_error "Next.js failed to start within 60 seconds"
    cleanup
fi
sleep 2

print_header "Laser Safety LMS is running!"
echo ""
echo "  http://localhost:$NEXTJS_PORT"
echo ""
echo "  Press Ctrl+C to stop"
echo "============================================================"
echo ""

wait
