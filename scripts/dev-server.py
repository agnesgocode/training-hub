#!/usr/bin/env python3
"""Local server for previewing the Training Hub.

Automatically finds a free port (starting from 8731) and runs a static server
on 127.0.0.1 only. Used via: npm run dev
"""
import http.server
import socket
import socketserver
import os
import sys

HOST = "127.0.0.1"
START_PORT = 8731
MAX_TRIES = 50  # check 8731..8780


def port_free(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            s.bind((HOST, port))
            return True
        except OSError:
            return False


def find_port() -> int:
    for p in range(START_PORT, START_PORT + MAX_TRIES):
        if port_free(p):
            return p
    print(f"No free port in {START_PORT}..{START_PORT + MAX_TRIES - 1}", file=sys.stderr)
    sys.exit(1)


def main() -> None:
    # Serve from the project folder (one level above the scripts/ folder)
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(root)

    port = find_port()
    print(f"[dev] free port found: {port}", flush=True)
    class Handler(http.server.SimpleHTTPRequestHandler):
        # Don't cache during development: the browser often uses old files
        # (empty sidebar / plain view) after the code changes.
        def end_headers(self):
            self.send_header("Cache-Control", "no-store, max-age=0")
            super().end_headers()

    handler = Handler

    with socketserver.ThreadingTCPServer((HOST, port), handler) as httpd:
        url = f"http://{HOST}:{port}/"
        print("", flush=True)
        print("  EAC Training Hub - local server running", flush=True)
        print(f"  Open in your browser:  {url}", flush=True)
        print("  Press Ctrl+C to stop.", flush=True)
        print("", flush=True)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")


if __name__ == "__main__":
    main()