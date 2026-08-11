#!/usr/bin/env python3
"""
Lokaler Vorschau-Server, der sich wie GitHub Pages verhält.

`python3 -m http.server` liefert bei unbekannten Pfaden seine eigene
404-Seite. Echte Routen wie /adoption-scenarios/scenarios gibt es aber als
Datei nicht — auf GitHub Pages fängt 404.html sie ab und schreibt den Pfad
per ?p= zurück (Muster s. 404.html). Dieser Server macht dasselbe, damit
lokal und live dieselben Adressen funktionieren.

    python3 scripts/serve.py [port]
"""
import functools
import http.server
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class PagesHandler(http.server.SimpleHTTPRequestHandler):
    def send_error(self, code, message=None, explain=None):
        # Nur echte Seitenaufrufe umleiten. Fehlende Assets sollen weiterhin
        # als 404 auffallen, sonst bekommt ein Tippfehler im Bildpfad HTML
        # zurück und der Fehler bleibt unbemerkt.
        if code == 404 and '.' not in os.path.basename(self.path.split('?')[0]):
            self.path = '/404.html'
            try:
                super().do_GET()
                return
            except Exception:
                pass
        super().send_error(code, message, explain)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8772
    handler = functools.partial(PagesHandler, directory=ROOT)
    with http.server.ThreadingHTTPServer(('', port), handler) as httpd:
        print(f'Fire on the Land → http://localhost:{port}/  (404-Fallback wie GitHub Pages)')
        httpd.serve_forever()


if __name__ == '__main__':
    main()
