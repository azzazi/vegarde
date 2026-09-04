#!/usr/bin/env python3
"""Static dev server for the site.

Serves files from the repository root and sends `charset=utf-8` for HTML so the
local preview matches GitHub Pages (which serves `text/html; charset=utf-8`).
Without this, Python's default http.server omits the charset and browsers
mis-decode the UTF-8 Arabic content as mojibake.
"""
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class UTF8Handler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".html": "text/html; charset=utf-8",
        ".htm": "text/html; charset=utf-8",
    }


def main() -> None:
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(root)
    with ThreadingHTTPServer(("0.0.0.0", port), UTF8Handler) as httpd:
        print(f"Serving {root} at http://0.0.0.0:{port} (utf-8)")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
