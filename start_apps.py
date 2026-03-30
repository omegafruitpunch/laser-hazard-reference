#!/usr/bin/env python3
"""Laser Safety LMS Launcher — starts the Next.js app on port 3000."""

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

NEXTJS_PORT = 3000
NEXTJS_DIR = Path("laser-safety-lms")

processes: List[subprocess.Popen] = []


def print_header(text: str) -> None:
    print("\n" + "=" * 60)
    print(f"  {text}")
    print("=" * 60)


def print_success(text: str) -> None:
    print(f"  ✓ {text}")


def print_error(text: str) -> None:
    print(f"  ✗ {text}", file=sys.stderr)


def print_info(text: str) -> None:
    print(f"  ℹ {text}")


def check_command(command: List[str]) -> bool:
    try:
        subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False


def is_port_in_use(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(("localhost", port))
            return False
        except socket.error:
            return True


def wait_for_port(port: int, timeout: int = 60) -> bool:
    start = time.time()
    while time.time() - start < timeout:
        if is_port_in_use(port):
            return True
        time.sleep(0.5)
    return False


def install_npm_dependencies() -> bool:
    print_info("Installing npm dependencies...")
    try:
        subprocess.run(["npm", "install"], cwd=NEXTJS_DIR, check=True)
        print_success("Dependencies installed")
        return True
    except subprocess.CalledProcessError as e:
        print_error(f"npm install failed: {e}")
        return False


def start_nextjs() -> Optional[subprocess.Popen]:
    print_info(f"Starting Next.js LMS on port {NEXTJS_PORT}...")
    env = os.environ.copy()
    env["PORT"] = str(NEXTJS_PORT)
    use_shell = platform.system() == "Windows"

    try:
        kwargs = dict(cwd=NEXTJS_DIR, env=env)
        if use_shell:
            process = subprocess.Popen("npm run dev", shell=True,
                creationflags=subprocess.CREATE_NEW_PROCESS_GROUP, **kwargs)
        else:
            process = subprocess.Popen(["npm", "run", "dev"],
                preexec_fn=os.setsid, **kwargs)
        processes.append(process)
        return process
    except Exception as e:
        print_error(f"Failed to start Next.js: {e}")
        return None


def cleanup() -> None:
    print_header("Shutting down...")
    for process in processes:
        try:
            if process.poll() is None:
                if platform.system() == "Windows":
                    process.terminate()
                else:
                    try:
                        os.killpg(os.getpgid(process.pid), signal.SIGTERM)
                    except (ProcessLookupError, OSError):
                        process.terminate()
        except Exception:
            pass
    processes.clear()
    print_success("Server stopped")


def signal_handler(signum, frame) -> None:
    cleanup()
    sys.exit(0)


def main() -> int:
    print_header("Laser Safety LMS Launcher")

    signal.signal(signal.SIGINT, signal_handler)
    if hasattr(signal, "SIGTERM"):
        signal.signal(signal.SIGTERM, signal_handler)
    atexit.register(cleanup)

    # Check Node.js
    if not (check_command(["node", "--version"]) and check_command(["npm", "--version"])):
        print_error("Node.js/npm not found. Install from https://nodejs.org/")
        return 1

    node_ver = subprocess.run(["node", "--version"], capture_output=True, text=True).stdout.strip()
    npm_ver = subprocess.run(["npm", "--version"], capture_output=True, text=True).stdout.strip()
    print_success(f"Node.js: {node_ver}  |  npm: {npm_ver}")

    # Check port
    if is_port_in_use(NEXTJS_PORT):
        print_error(f"Port {NEXTJS_PORT} is already in use")
        return 1
    print_success(f"Port {NEXTJS_PORT} is available")

    # Install deps if needed
    node_modules = NEXTJS_DIR / "node_modules"
    if not node_modules.exists() or not any(node_modules.iterdir()):
        if not install_npm_dependencies():
            return 1
    else:
        print_success("Dependencies already installed")

    # Start
    process = start_nextjs()
    if not process:
        return 1

    print_info("Waiting for server to be ready...")
    if not wait_for_port(NEXTJS_PORT, timeout=60):
        print_error("Next.js failed to start within 60 seconds")
        cleanup()
        return 1
    time.sleep(2)

    print_header("Laser Safety LMS is running!")
    print(f"\n  http://localhost:{NEXTJS_PORT}\n")
    print("  Press Ctrl+C to stop")
    print("=" * 60)

    try:
        while True:
            if process.poll() is not None:
                print_error("Server exited unexpectedly")
                cleanup()
                return 1
            time.sleep(1)
    except KeyboardInterrupt:
        signal_handler(signal.SIGINT, None)

    return 0


if __name__ == "__main__":
    sys.exit(main())
