#!/bin/bash

# Laser Safety Applications Launcher
# Starts both the Next.js LMS (port 3000) and Streamlit app (port 8501)

set -e

NEXTJS_PORT=3000
STREAMLIT_PORT=8501
NEXTJS_DIR="laser-safety-lms"
STREAMLIT_APP="laser_hazard_app.py"
REQUIREMENTS_FILE="requirements.txt"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_header() {
    echo ""
    echo "============================================================"
    echo "  $1"
    echo "============================================================"
}

print_success() {
    echo -e "  ${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "  ${RED}✗${NC} $1" >&2
}

print_info() {
    echo -e "  ${YELLOW}ℹ${NC} $1"
}

# Cleanup function
cleanup() {
    echo ""
    print_header "Shutting down services..."
    
    if [ -n "$NEXTJS_PID" ]; then
        kill $NEXTJS_PID 2>/dev/null || true
        print_success "Next.js stopped"
    fi
    
    if [ -n "$STREAMLIT_PID" ]; then
        kill $STREAMLIT_PID 2>/dev/null || true
        print_success "Streamlit stopped"
    fi
    
    exit 0
}

# Trap signals
trap cleanup SIGINT SIGTERM

# Check if port is in use
is_port_in_use() {
    local port=$1
    if command -v lsof &> /dev/null; then
        lsof -i :$port &> /dev/null
        return $?
    elif command -v netstat &> /dev/null; then
        netstat -tuln 2>/dev/null | grep -q ":$port "
        return $?
    else
        # Fallback: try to connect
        (echo > /dev/tcp/localhost/$port) 2>/dev/null
        return $?
    fi
}

# Wait for port to be ready
wait_for_port() {
    local port=$1
    local timeout=$2
    local counter=0
    
    while [ $counter -lt $timeout ]; do
        if is_port_in_use $port; then
            return 0
        fi
        sleep 1
        counter=$((counter + 1))
    done
    return 1
}

# Main script
print_header "Laser Safety Applications Launcher"

echo ""
echo "Checking dependencies..."

# Check Python
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    print_error "Python is not installed or not in PATH"
    exit 1
fi

PYTHON_CMD=$(command -v python3 || command -v python)
print_success "Python: $($PYTHON_CMD --version)"

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed or not in PATH"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
print_success "Node.js: $(node --version)"

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed or not in PATH"
    exit 1
fi
print_success "npm: $(npm --version)"

# Check ports
echo ""
echo "Checking ports..."

if is_port_in_use $NEXTJS_PORT; then
    print_error "Port $NEXTJS_PORT is already in use"
    exit 1
fi
print_success "Port $NEXTJS_PORT is available"

if is_port_in_use $STREAMLIT_PORT; then
    print_error "Port $STREAMLIT_PORT is already in use"
    exit 1
fi
print_success "Port $STREAMLIT_PORT is available"

# Check/Install dependencies
echo ""
echo "Checking dependencies..."

if [ ! -d "$NEXTJS_DIR/node_modules" ] || [ -z "$(ls -A $NEXTJS_DIR/node_modules)" ]; then
    print_info "Installing npm dependencies..."
    (cd "$NEXTJS_DIR" && npm install)
    print_success "npm dependencies installed"
else
    print_success "npm dependencies already installed"
fi

if ! $PYTHON_CMD -c "import streamlit" 2>/dev/null; then
    print_info "Installing Python dependencies..."
    $PYTHON_CMD -m pip install -r "$REQUIREMENTS_FILE"
    print_success "Python dependencies installed"
else
    print_success "Python dependencies already installed"
fi

# Start services
echo ""
print_header "Starting services..."

# Start Next.js
print_info "Starting Next.js on port $NEXTJS_PORT..."
(cd "$NEXTJS_DIR" && PORT=$NEXTJS_PORT npm run dev &)
NEXTJS_PID=$!

print_info "Waiting for Next.js to be ready..."
if ! wait_for_port $NEXTJS_PORT 60; then
    print_error "Next.js failed to start within 60 seconds"
    cleanup
fi
sleep 2
print_success "Next.js is ready on port $NEXTJS_PORT"

# Start Streamlit
print_info "Starting Streamlit on port $STREAMLIT_PORT..."
$PYTHON_CMD -m streamlit run "$STREAMLIT_APP" --server.port=$STREAMLIT_PORT &
STREAMLIT_PID=$!

print_info "Waiting for Streamlit to be ready..."
if ! wait_for_port $STREAMLIT_PORT 60; then
    print_error "Streamlit failed to start within 60 seconds"
    cleanup
fi
sleep 2
print_success "Streamlit is ready on port $STREAMLIT_PORT"

# Print URLs
echo ""
print_header "Applications are running!"
echo ""
echo "  🚀 Next.js LMS:       http://localhost:$NEXTJS_PORT"
echo "  📊 Streamlit App:     http://localhost:$STREAMLIT_PORT"
echo ""
echo "  Press Ctrl+C to stop both services"
echo "============================================================"
echo ""

# Wait for both processes
wait
