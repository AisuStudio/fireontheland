# Fire on the Land

Eine **Graphic Novel** und ein **Recherche-Werkzeug** zum selben Gegenstand: Der Wissenschaftler
Oliver Sonnentag baut seinen Messturm an der Scotty-Creek-Forschungsstation wieder auf — Kanadas
erster indigen geführter Forschungsstation, 2022 abgebrannt. Begleiter und Ko-Autor ist Dieter Cazon
von der Liidlii Kue First Nation.

Live: **[fireontheland.org](https://fireontheland.org/)**

## Die drei Bereiche

- **Graphic Novel** — Character Studies, Skript (v.2), Storyboards, Presse. Work in Progress.
- **Font · AS Dehcho** — handgezeichneter Comic-Display-Font für dieses Projekt, trägt die
  Dene-Orthografie der Dehcho-Region (ą́ ę́ ł ʔ ǫ́ ų́) und Sprechblasen-Lettering in einer Familie.
  Früher Testbuild, nutzbar, aktuell nicht in aktiver Arbeit.
- **Adoption Scenarios** (Beta) — das Werkzeug: **post-fire novel ecosystems** nach Funktion lesen,
  nicht nach Herkunft.

  > Welche Wiederbewaldungs-Trajektorie nach einem Waldbrand ist zugleich **klimaangepasst,
  > wirtschaftlich zukunftsfähig und kohlenstoff-wirksam** — und wie macht man das trackbar?

  Leitsatz: **Bewerten, nicht entscheiden.** Ankerfläche: Jüterbog (Brandenburg), ~800 ha
  Brandnarbe von 2019. CO₂-Anschluss über GHG-Protocol-LSR (Scope 1–3), optional funktions-geerdet
  über Eddy-Covariance-Flüsse.

## Daten

Das **Erholungs-Zeitkomposit** ist echt: NBR-Kacheln (Normalized Burn Ratio) aus **Sentinel-2 L2A**,
bezogen über die Process-API des **Copernicus Data Space Ecosystem** für 2020 / 2022 / 2024 und als
statische PNGs in `assets/` abgelegt. Drei Jahre auf Rot · Grün · Blau gelegt: grau = unverändert,
Farbe = zeitversetztes Ergrünen.

`scripts/fetch-sentinel.mjs` holt die Kacheln neu (AOI und Rezept siehe `BRIEFING.md`, Anhang A).
Der Client-Secret liegt in `.env`, verlässt den Prozess nie und wird nicht committet — nur die
resultierenden PNGs.

```bash
node scripts/fetch-sentinel.mjs        # NBR-Kacheln neu ziehen (braucht .env)
node scripts/fetch-species-images.mjs  # Artenbilder aktualisieren
python3 scripts/serve.py               # lokal servieren (Routing wie auf Pages)
```

## Stand

Statisches HTML/CSS/JS, **kein Build-Schritt**. Öffnen: `index.html` (bzw. `scripts/serve.py`,
damit die absoluten Asset-Pfade und das Routing stimmen).

- **Zweisprachig** DE/EN, umschaltbar zur Laufzeit (`data-i18n`).
- **Routing** über die History API mit sprechenden Pfaden (`/graphic-novel`, `/font`,
  `/adoption-scenarios/…`). GitHub Pages kann nicht serverseitig routen, deshalb schiebt
  `404.html` den Pfad nach `?p=` und der Shim im `<head>` von `index.html` setzt ihn per
  `replaceState` zurück, bevor `app.js` routet (Muster: spa-github-pages). Direktlinks landen
  damit korrekt — liefern aber weiterhin den Status 404, sind für Crawler und Link-Previews
  also unsichtbar.
- **Design-Sprache:** waffle. Alle Tokens gekapselt in `app.css` (Block `WAFFLE TOKEN LAYER`) —
  Werte 1:1 durch waffle-Output ersetzbar, ohne die Komponenten anzufassen.

## Struktur

- `index.html` — App-Shell, drei Bereiche als Tabs
- `app.css` — Token-Schicht (waffle) + Komponenten, mobile-first
- `app.js` — Routing, i18n, Komposit-Renderer (Canvas), Szenarien, Arten
- `assets/` — NBR-Kacheln, Artenbilder · `fonts/` — AS Dehcho, Public Sans, Stoke
- `scripts/` — Sentinel-Abruf, Artenbilder, lokaler Server
- `concept.html`, `legal.html` — Konzeptseite, Impressum & Datenschutz

## Deploy

GitHub Pages aus `main`, Custom Domain via `CNAME` (fireontheland.org).
