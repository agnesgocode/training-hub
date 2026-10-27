#!/usr/bin/env python3
"""Server lokal untuk preview Training Hub.

Otomatis mencari port kosong (mulai dari 8731) lalu menyalakan static server
di 127.0.0.1 saja. Dipakai lewat: npm run dev
"""
import http.server
import socket
import socketserver
import os
import sys

HOST = "127.0.0.1"
START_PORT = 8731
MAX_TRIES = 50  # cek 8731..8780


def port_kosong(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            s.bind((HOST, port))
            return True
        except OSError:
            return False


def cari_port() -> int:
    for p in range(START_PORT, START_PORT + MAX_TRIES):
        if port_kosong(p):
            return p
    print(f"Tidak ada port kosong di {START_PORT}..{START_PORT + MAX_TRIES - 1}", file=sys.stderr)
    sys.exit(1)


def main() -> None:
    # Layani dari folder proyek (satu tingkat di atas folder scripts/)
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(root)

    port = cari_port()
    print(f"[dev] port kosong ditemukan: {port}", flush=True)
    handler = http.server.SimpleHTTPRequestHandler

    with socketserver.TCPServer((HOST, port), handler) as httpd:
        url = f"http://{HOST}:{port}/"
        print("", flush=True)
        print("  EAC Training Hub - server lokal aktif", flush=True)
        print(f"  Buka di browser:  {url}", flush=True)
        print("  Tekan Ctrl+C untuk berhenti.", flush=True)
        print("", flush=True)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer dihentikan.")


if __name__ == "__main__":
    main()
