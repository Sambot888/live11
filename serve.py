#!/usr/bin/env python3
"""Simple static server for Binance Odyssey prototype."""

from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import os

HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", "8000"))


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), SimpleHTTPRequestHandler)
    print(f"Serving Binance Odyssey prototype on http://{HOST}:{PORT}")
    print("Tip: open http://localhost:8000 in your browser if running locally.")
    server.serve_forever()


if __name__ == "__main__":
    main()
