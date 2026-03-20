#!/usr/bin/env python3
"""
Startup script for Laser Safety Applications
Starts both the Next.js LMS (port 3000) and Streamlit app (port 8501)
"""

import os
import sys
import subprocess
import time
import signal
import socket
import platform
from pathlib import Path
from typing import Optional, List
import atexit

# Configuration
NEXTJS_PORT = 3000
STREAMLIT_PORT = 8501
NEXTJS_DIR = Path("laser-safety-lms")
STREAMLIT_APP = "laser_hazard_app.py"
REQUIREMENTS_FILE = "requirements.txt"

# Global list to track processes for cleanup
processes: List[subprocess.Popen] = []


def print_header(text: str) -> None:
    """Print a formatted header."""
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60)


def print_success(text: str) -> None:
    """Print a success message."""
    print(f"  ✓ {text}")


def print_error(text: str) -> None:
    """Print an error message."""
    print(f"  ✗ {text}", file=sys.stderr)


def print_info(text: str) -> None:
    """Print an info message."""
    print(f"  ℹ {text}")


def check_command(command: List[str]) -> bool:
    """Check if a command is available."""
    try:
        subprocess.run(
            command,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            check=True,
        )
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def check_python() -> bool:
    """Check if Python is available."""
    return check_command([sys.executable, "--version"])


def check_node() -> bool:
    """Check if Node.js/npm is available."""
    return check_command(["node", "--version"]) and check_command(["npm", "--version"])


def is_port_in_use(port: int) -> bool:
    """Check if a port is already in use."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(("localhost", port))
            return False
        except socket.error:
            return True


def wait_for_port(port: int, timeout: int = 60, interval: float = 0.5) -> bool:
    """Wait for a port to become available."""
    start_time = time.time()
    while time.time() - start_time < timeout:
        if is_port_in_use(port):
            return True
        time.sleep(interval)
    return False


def install_python_dependencies() -> bool:
    """Install Python dependencies from requirements.txt."""
    print_info("Installing Python dependencies...")
    try:
        result = subprocess.run(
            [sys.executable, "-m", "pip", "install", "-r", REQUIREMENTS_FILE],
            capture_output=True,
            text=True,
            check=True,
        )
        print_success("Python dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print_error(f"Failed to install Python dependencies: {e}")
        print(e.stderr)
        return False


def install_npm_dependencies() -> bool:
    """Install npm dependencies in the Next.js directory."""
    print_info("Installing npm dependencies...")
    try:
        result = subprocess.run(
            ["npm", "install"],
            cwd=NEXTJS_DIR,
            capture_output=True,
            text=True,
            check=True,
        )
        print_success("npm dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print_error(f"Failed to install npm dependencies: {e}")
        print(e.stderr)
        return False


def check_python_deps_installed() -> bool:
    """Check if Python dependencies are already installed."""
    required_packages = ["streamlit", "anthropic", "openpyxl", "reportlab", "pymupdf"]
    for package in required_packages:
        try:
            __import__(package.replace("pymupdf", "fitz").replace("-", "_"))
        except ImportError:
            return False
    return True


def check_npm_deps_installed() -> bool:
    """Check if npm dependencies are already installed."""
    node_modules = NEXTJS_DIR / "node_modules"
    return node_modules.exists() and any(node_modules.iterdir())


def start_nextjs() -> Optional[subprocess.Popen]:
    """Start the Next.js development server."""
    print_info(f"Starting Next.js dev server on port {NEXTJS_PORT}...")
    
    # Set environment variable for port
    env = os.environ.copy()
    env["PORT"] = str(NEXTJS_PORT)
    
    # Use shell=True on Windows for better process handling
    use_shell = platform.system() == "Windows"
    
    try:
        if use_shell:
            process = subprocess.Popen(
                f"npm run dev",
                cwd=NEXTJS_DIR,
                env=env,
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if platform.system() == "Windows" else 0,
            )
        else:
            process = subprocess.Popen(
                ["npm", "run", "dev"],
                cwd=NEXTJS_DIR,
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                preexec_fn=os.setsid if platform.system() != "Windows" else None,
            )
        
        processes.append(process)
        return process
    except Exception as e:
        print_error(f"Failed to start Next.js: {e}")
        return None


def start_streamlit() -> Optional[subprocess.Popen]:
    """Start the Streamlit app."""
    print_info(f"Starting Streamlit app on port {STREAMLIT_PORT}...")
    
    try:
        use_shell = platform.system() == "Windows"
        
        if use_shell:
            process = subprocess.Popen(
                f"{sys.executable} -m streamlit run {STREAMLIT_APP} --server.port={STREAMLIT_PORT}",
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                creationflags=subprocess.CREATE_NEW_PROCESS_GROUP if platform.system() == "Windows" else 0,
            )
        else:
            process = subprocess.Popen(
                [sys.executable, "-m", "streamlit", "run", STREAMLIT_APP, f"--server.port={STREAMLIT_PORT}"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                preexec_fn=os.setsid if platform.system() != "Windows" else None,
            )
        
        processes.append(process)
        return process
    except Exception as e:
        print_error(f"Failed to start Streamlit: {e}")
        return None


def cleanup_processes() -> None:
    """Clean up all running processes."""
    print("\n")
    print_header("Shutting down services...")
    
    for process in processes:
        try:
            if process.poll() is None:  # Process is still running
                if platform.system() == "Windows":
                    # On Windows, terminate the process
                    process.terminate()
                    try:
                        process.wait(timeout=5)
                    except subprocess.TimeoutExpired:
                        process.kill()
                else:
                    # On Unix, kill the process group
                    try:
                        os.killpg(os.getpgid(process.pid), signal.SIGTERM)
                    except (ProcessLookupError, OSError):
                        process.terminate()
                        try:
                            process.wait(timeout=5)
                        except subprocess.TimeoutExpired:
                            process.kill()
        except Exception as e:
            print_error(f"Error cleaning up process: {e}")
    
    processes.clear()
    print_success("All services stopped")


def print_urls() -> None:
    """Print the URLs for both apps."""
    print("\n")
    print_header("Applications are running!")
    print("")
    print(f"  🚀 Next.js LMS:       http://localhost:{NEXTJS_PORT}")
    print(f"  📊 Streamlit App:     http://localhost:{STREAMLIT_PORT}")
    print("")
    print("  Press Ctrl+C to stop both services")
    print("=" * 60)


def signal_handler(signum, frame) -> None:
    """Handle interrupt signals."""
    cleanup_processes()
    sys.exit(0)


def main() -> int:
    """Main entry point."""
    print_header("Laser Safety Applications Launcher")
    
    # Register signal handlers
    signal.signal(signal.SIGINT, signal_handler)
    if hasattr(signal, "SIGTERM"):
        signal.signal(signal.SIGTERM, signal_handler)
    
    # Register cleanup on exit
    atexit.register(cleanup_processes)
    
    # Check Python
    print("\n📋 Checking dependencies...")
    if not check_python():
        print_error("Python is not installed or not in PATH")
        return 1
    print_success(f"Python: {sys.version.split()[0]}")
    
    # Check Node.js
    if not check_node():
        print_error("Node.js/npm is not installed or not in PATH")
        print_info("Please install Node.js from https://nodejs.org/")
        return 1
    
    # Get Node and npm versions
    try:
        node_version = subprocess.run(["node", "--version"], capture_output=True, text=True, check=True).stdout.strip()
        npm_version = subprocess.run(["npm", "--version"], capture_output=True, text=True, check=True).stdout.strip()
        print_success(f"Node.js: {node_version}")
        print_success(f"npm: {npm_version}")
    except Exception:
        pass
    
    # Check ports
    print("\n📋 Checking ports...")
    if is_port_in_use(NEXTJS_PORT):
        print_error(f"Port {NEXTJS_PORT} is already in use")
        print_info("Please stop the service running on this port or change the port")
        return 1
    print_success(f"Port {NEXTJS_PORT} is available")
    
    if is_port_in_use(STREAMLIT_PORT):
        print_error(f"Port {STREAMLIT_PORT} is already in use")
        print_info("Please stop the service running on this port or change the port")
        return 1
    print_success(f"Port {STREAMLIT_PORT} is available")
    
    # Install dependencies if needed
    print("\n📦 Checking dependencies...")
    
    if not check_npm_deps_installed():
        if not install_npm_dependencies():
            return 1
    else:
        print_success("npm dependencies already installed")
    
    if not check_python_deps_installed():
        if not install_python_dependencies():
            return 1
    else:
        print_success("Python dependencies already installed")
    
    # Start Next.js
    print("\n🚀 Starting services...")
    nextjs_process = start_nextjs()
    if not nextjs_process:
        return 1
    
    # Wait for Next.js to be ready
    print_info("Waiting for Next.js to be ready...")
    if not wait_for_port(NEXTJS_PORT, timeout=60):
        print_error("Next.js failed to start within 60 seconds")
        cleanup_processes()
        return 1
    time.sleep(2)  # Give it a bit more time to fully initialize
    print_success(f"Next.js is ready on port {NEXTJS_PORT}")
    
    # Start Streamlit
    streamlit_process = start_streamlit()
    if not streamlit_process:
        cleanup_processes()
        return 1
    
    # Wait for Streamlit to be ready
    print_info("Waiting for Streamlit to be ready...")
    if not wait_for_port(STREAMLIT_PORT, timeout=60):
        print_error("Streamlit failed to start within 60 seconds")
        cleanup_processes()
        return 1
    time.sleep(2)  # Give it a bit more time to fully initialize
    print_success(f"Streamlit is ready on port {STREAMLIT_PORT}")
    
    # Print URLs
    print_urls()
    
    # Monitor processes
    try:
        while True:
            # Check if either process has exited
            if nextjs_process.poll() is not None:
                print_error("Next.js process exited unexpectedly")
                cleanup_processes()
                return 1
            
            if streamlit_process.poll() is not None:
                print_error("Streamlit process exited unexpectedly")
                cleanup_processes()
                return 1
            
            time.sleep(1)
    
    except KeyboardInterrupt:
        signal_handler(signal.SIGINT, None)
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
