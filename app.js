/* Noveco — MVP scaffold. Dependency-free. */
(function () {
  'use strict';

  var slice = function (nl) { return Array.prototype.slice.call(nl); };

  /* ---------------------------------------------------------
     i18n — language layer
     UI strings live in T[lang][key]; data-driven content
     (scorecard, measures) carries per-language fields inline.
     German is the source and the no-JS fallback (see index.html).
     To add French later: add 'fr' to LANGS and fill each block.
     --------------------------------------------------------- */
  var LANGS = [
    { code: 'de', label: 'DE', name: 'Deutsch' },
    { code: 'en', label: 'EN', name: 'English' }
  ];
  var STORE_KEY = 'noveco-lang';

  var T = {
    de: {
      'lang.aria': 'Sprache',
      'nav.aria': 'Ansichten',

      'tab.composite': 'Komposit',
      'tab.scorecard': 'Scorecard',
      'tab.measures': 'Maßnahmen',
      'tab.concept': 'Konzept',

      'composite.title': 'Erholung in einem Bild',
      'composite.sub': 'Drei Jahre nach dem Brand, auf Rot · Grün · Blau gelegt. Die Farbe erzählt den Erholungspfad jedes Pixels — grau = unverändert, Farbe = zeitversetztes Ergrünen.',
      'composite.canvasAria': 'Prozedurales Erholungs-Komposit der Brandfläche Jüterbog (Platzhalter)',
      'composite.badge': 'Platzhalter — echte Sentinel-2-Kachel folgt',
      'composite.channelsAria': 'Jahre den Farbkanälen zuordnen',
      'channel.r': 'Rot',
      'channel.g': 'Grün',
      'channel.b': 'Blau',
      'legend.aria': 'Legende',
      'legend.grey': 'Grau — unverändert / unverbrannt',
      'legend.warm': 'Warm — frühe Erholung',
      'legend.green': 'Grün — mittlere Erholung',
      'legend.cool': 'Kühl — späte Erholung',

      'scorecard.title': 'Novel vs. Novel',
      'scorecard.sub': 'Kein Sieger-Loblied — ein Raster, auf dem jede Seite Achsen gewinnt und verliert.',
      'scorecard.pine': 'Kulturkiefernforst',
      'scorecard.neo': 'Neophyten-Sukzession',
      'scorecard.note': 'Die Achse <strong>Biodiversität</strong> kippt je nach Fläche — der Angelpunkt, den das Werkzeug sichtbar macht.',
      'side.pine': 'Kiefer',
      'side.neo': 'Neophyt',
      'verdict.neo': 'Neophyt',
      'verdict.pine': 'Kiefer',
      'verdict.split': 'Geteilt',
      'verdict.ctx': 'Kontextabhängig',

      'measures.title': 'Maßnahmen',
      'measures.sub': 'Struktur, nicht Art, ist die billigste Maßnahme: Wind bremsen, Schatten und Tau schaffen, Samen fangen — und weil Stein und Totholz nicht brennen, ist es reburn-resilient.',
      'measures.filterAria': 'Nach Akteur filtern',
      'measures.principle': 'Prinzip:',
      'actor.all': 'Alle',
      'actor.ind': 'Einzelperson',
      'actor.kom': 'Kommune',
      'actor.forst': 'Forstbetrieb',
      'tag.Wind': 'Wind',
      'tag.Schatten': 'Schatten',
      'tag.Tau': 'Tau',
      'tag.Streu': 'Streu',
      'tag.Feuer': 'Feuer',
      'tag.Kohlenstoff': 'Kohlenstoff',

      'concept.title': 'Das Konzept',
      'concept.kicker': 'Was es ist',
      'concept.define': 'Ein offenes Werkzeug, das eine Waldbrandfläche danach lesbar macht, welche Wiederbewaldung dort zugleich <strong>klimaangepasst, wirtschaftlich zukunftsfähig und kohlenstoff-wirksam</strong> ist.',
      'concept.thesis': 'Der Wert einer Sukzession ist keine Eigenschaft der <em>Pflanze</em> — sondern der <em>Fläche</em>.',
      'concept.hsec1': 'Robuster Kern, optionale Verstärkung',
      'concept.core.h': 'Kern — garantiert',
      'concept.core.1': 'Sentinel-2 (offen)',
      'concept.core.2': 'Eigene Bodenwahrheit (Bestensee)',
      'concept.core.3': 'GALK — Funktion statt Herkunft',
      'concept.amp.h': 'Verstärkung — optional',
      'concept.amp.1': 'Eddy-Covariance-Flüsse (Sonnentag)',
      'concept.amp.2': 'Bezahl-Fernerkundung (AWI)',
      'concept.amp.3': 'Kohlenstoff nach GHG-Protocol-LSR',
      'concept.hsec2': 'Wertekanon',
      'concept.canon.1': '<strong>Vorurteilsfrei.</strong> Bewertet wird Funktion, nicht Herkunft.',
      'concept.canon.2': '<strong>Kontext vor Dogma.</strong> Derselbe Baum ist Retter oder Verdränger — je nach Fläche.',
      'concept.canon.3': '<strong>Ehrlich über Grenzen.</strong> Permanenz, Homogenisierung, schwächster Datenpunkt offen.',
      'concept.canon.4': '<strong>Bewerten, nicht entscheiden.</strong> Das Werkzeug zeigt den Zielkonflikt; entscheiden Mensch und Fläche.'
    },
    en: {
      'lang.aria': 'Language',
      'nav.aria': 'Views',

      'tab.composite': 'Composite',
      'tab.scorecard': 'Scorecard',
      'tab.measures': 'Measures',
      'tab.concept': 'Concept',

      'composite.title': 'Recovery in a single image',
      'composite.sub': 'Three years after the fire, mapped onto Red · Green · Blue. The colour tells each pixel’s recovery path — grey = unchanged, colour = greening offset in time.',
      'composite.canvasAria': 'Procedural recovery composite of the Jüterbog burn area (placeholder)',
      'composite.badge': 'Placeholder — real Sentinel-2 tile to follow',
      'composite.channelsAria': 'Assign years to colour channels',
      'channel.r': 'Red',
      'channel.g': 'Green',
      'channel.b': 'Blue',
      'legend.aria': 'Legend',
      'legend.grey': 'Grey — unchanged / unburned',
      'legend.warm': 'Warm — early recovery',
      'legend.green': 'Green — mid recovery',
      'legend.cool': 'Cool — late recovery',

      'scorecard.title': 'Novel vs. Novel',
      'scorecard.sub': 'No winner’s anthem — a grid where each side wins and loses axes.',
      'scorecard.pine': 'Cultivated pine forest',
      'scorecard.neo': 'Neophyte succession',
      'scorecard.note': 'The <strong>biodiversity</strong> axis flips depending on the site — the pivot the tool makes visible.',
      'side.pine': 'Pine',
      'side.neo': 'Neophyte',
      'verdict.neo': 'Neophyte',
      'verdict.pine': 'Pine',
      'verdict.split': 'Split',
      'verdict.ctx': 'Context-dependent',

      'measures.title': 'Measures',
      'measures.sub': 'Structure, not species, is the cheapest measure: slow the wind, make shade and dew, catch seed — and because stone and deadwood don’t burn, it’s reburn-resilient.',
      'measures.filterAria': 'Filter by actor',
      'measures.principle': 'Principle:',
      'actor.all': 'All',
      'actor.ind': 'Individual',
      'actor.kom': 'Municipality',
      'actor.forst': 'Forestry operation',
      'tag.Wind': 'Wind',
      'tag.Schatten': 'Shade',
      'tag.Tau': 'Dew',
      'tag.Streu': 'Litter',
      'tag.Feuer': 'Fire',
      'tag.Kohlenstoff': 'Carbon',

      'concept.title': 'The concept',
      'concept.kicker': 'What it is',
      'concept.define': 'An open tool that makes a wildfire site legible by which reforestation there is at once <strong>climate-adapted, economically future-proof and carbon-effective</strong>.',
      'concept.thesis': 'The value of a succession is not a property of the <em>plant</em> — but of the <em>site</em>.',
      'concept.hsec1': 'Robust core, optional amplification',
      'concept.core.h': 'Core — guaranteed',
      'concept.core.1': 'Sentinel-2 (open)',
      'concept.core.2': 'Own ground truth (Bestensee)',
      'concept.core.3': 'GALK — function over origin',
      'concept.amp.h': 'Amplification — optional',
      'concept.amp.1': 'Eddy-covariance fluxes (Sonnentag)',
      'concept.amp.2': 'Paid remote sensing (AWI)',
      'concept.amp.3': 'Carbon per GHG Protocol LSR',
      'concept.hsec2': 'Canon of values',
      'concept.canon.1': '<strong>Free of prejudice.</strong> What is assessed is function, not origin.',
      'concept.canon.2': '<strong>Context over dogma.</strong> The same tree is saviour or invader — depending on the site.',
      'concept.canon.3': '<strong>Honest about limits.</strong> Permanence, homogenisation, weakest data point kept open.',
      'concept.canon.4': '<strong>Assess, don’t decide.</strong> The tool shows the trade-off; people and the site decide.'
    }
  };

  function supported(code) {
    for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === code) return true;
    return false;
  }
  function initialLang() {
    try {
      var saved = localStorage.getItem(STORE_KEY);
      if (saved && supported(saved)) return saved;
    } catch (e) {}
    var nav = (navigator.language || 'de').toLowerCase().slice(0, 2);
    return supported(nav) ? nav : 'de';
  }

  var LANG = initialLang();
  function t(key) {
    var tbl = T[LANG] || T.de;
    return (key in tbl) ? tbl[key] : T.de[key];
  }
  function pick(field) {
    // field is a per-language map, e.g. { de: '…', en: '…' }
    return (field && (field[LANG] != null ? field[LANG] : field.de)) || '';
  }

  function applyI18n() {
    slice(document.querySelectorAll('[data-i18n]')).forEach(function (el) {
      var v = t(el.getAttribute('data-i18n'));
      if (v != null) el.textContent = v;
    });
    slice(document.querySelectorAll('[data-i18n-html]')).forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-html'));
      if (v != null) el.innerHTML = v;
    });
    slice(document.querySelectorAll('[data-i18n-aria]')).forEach(function (el) {
      var v = t(el.getAttribute('data-i18n-aria'));
      if (v != null) el.setAttribute('aria-label', v);
    });
  }

  function buildSwitcher() {
    var box = document.getElementById('langsw');
    if (!box) return;
    box.textContent = '';
    LANGS.forEach(function (l) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'lang-btn';
      b.setAttribute('data-lang', l.code);
      b.setAttribute('lang', l.code);
      b.setAttribute('title', l.name);
      b.textContent = l.label;
      b.addEventListener('click', function () { setLang(l.code); });
      box.appendChild(b);
    });
  }

  function setLang(code) {
    if (!supported(code)) return;
    LANG = code;
    try { localStorage.setItem(STORE_KEY, code); } catch (e) {}
    document.documentElement.lang = code;
    slice(document.querySelectorAll('#langsw .lang-btn')).forEach(function (b) {
      var on = b.getAttribute('data-lang') === code;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    applyI18n();
    renderScorecard();
    renderMeasures(curActor);
  }

  /* ---------------------------------------------------------
     Navigation (bottom tabs)
     --------------------------------------------------------- */
  var tabs = slice(document.querySelectorAll('.tab'));
  var views = {
    composite: document.getElementById('view-composite'),
    scorecard: document.getElementById('view-scorecard'),
    measures: document.getElementById('view-measures'),
    concept: document.getElementById('view-concept')
  };

  function show(target) {
    Object.keys(views).forEach(function (k) {
      views[k].hidden = (k !== target);
    });
    tabs.forEach(function (t2) {
      var on = t2.dataset.target === target;
      t2.classList.toggle('is-active', on);
      t2.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    if (target === 'composite') renderComposite();
    if (target === 'measures') renderMeasures(curActor);
  }

  tabs.forEach(function (t2) {
    t2.addEventListener('click', function () { show(t2.dataset.target); });
  });

  /* ---------------------------------------------------------
     Scorecard data + render
     Translatable fields are per-language maps ({ de, en }).
     `v` is a language-neutral verdict code (see verdict.* keys).
     --------------------------------------------------------- */
  var AXES = [
    { v: 'neo',
      axis: { de: 'Tempo der Resilienz', en: 'Pace of resilience' },
      pine: { de: 'Jahrzehnte bis Kronenschluss, Kühlung und Bodenschutz.',
              en: 'Decades to canopy closure, cooling and soil protection.' },
      neo: { de: 'Pionier: Deckung, Kühlung und Stickstoff schon in wenigen Jahren.',
             en: 'Pioneer: cover, cooling and nitrogen within just a few years.' } },
    { v: 'neo',
      axis: { de: 'Trocken- & Klimastress', en: 'Drought & climate stress' },
      pine: { de: 'Flachwurzler, auf Sand zunehmend hitzegestresst.',
              en: 'Shallow-rooted, increasingly heat-stressed on sand.' },
      neo: { de: 'Robinie: tiefwurzelnd, stickstofffixierend, hitzetolerant.',
             en: 'Black locust: deep-rooted, nitrogen-fixing, heat-tolerant.' } },
    { v: 'neo',
      axis: { de: 'Kühlung & Brandrisiko', en: 'Cooling & fire risk' },
      pine: { de: 'Harzreiche Monokultur — hochbrandgefährdet, Teil des Problems.',
              en: 'Resin-rich monoculture — highly fire-prone, part of the problem.' },
      neo: { de: 'Laub-Unterwuchs, feuchteres Mikroklima — senkt die Brandlast.',
             en: 'Broadleaf understorey, moister microclimate — lowers the fire load.' } },
    { v: 'split',
      axis: { de: 'Wirtschaftl. Verwertung', en: 'Economic use' },
      pine: { de: 'Große Holzmengen, etablierte Kette, Harz.',
              en: 'Large timber volumes, established supply chain, resin.' },
      neo: { de: 'Dauerhaftestes Holz Europas (Nische), Honig, Energieholz, Gerbstoff.',
             en: 'Europe’s most durable timber (niche), honey, fuelwood, tannin.' } },
    { v: 'split',
      axis: { de: 'Kohlenstoff-Wirksamkeit', en: 'Carbon effectiveness' },
      pine: { de: 'Langsamer Aufbau, aber Boden-C und Beständigkeit — solange kein Brand.',
              en: 'Slow build-up, but soil carbon and permanence — as long as it doesn’t burn.' },
      neo: { de: 'Schnelle Biomasse (Robinie), aber Permanenz durch Reburn-Risiko fragil.',
             en: 'Fast biomass (black locust), but permanence made fragile by reburn risk.' } },
    { v: 'pine',
      axis: { de: 'Statur & Holzvolumen', en: 'Stature & timber volume' },
      pine: { de: 'Höher, mehr Stammvolumen, langlebiger Kronenraum.',
              en: 'Taller, more stem volume, longer-lived canopy.' },
      neo: { de: 'Kleiner, geringeres Volumen — nicht in allem überlegen.',
             en: 'Smaller, less volume — not superior in everything.' } },
    { v: 'ctx',
      axis: { de: 'Biodiversität', en: 'Biodiversity' },
      pine: { de: 'Artenarm — aber nach Brand Trägerin von Totholz-Spezialisten.',
              en: 'Species-poor — but after fire a host for deadwood specialists.' },
      neo: { de: 'Auf Ödland ein Gewinn; auf Schutz-Magerland verdrängt der N-Eintrag die Spezialisten.',
             en: 'On wasteland a gain; on protected nutrient-poor land the nitrogen input crowds out the specialists.' } }
  ];

  function renderScorecard() {
    var list = document.getElementById('scorecard-list');
    if (!list) return;
    list.textContent = '';
    AXES.forEach(function (a) {
      var li = document.createElement('li');
      li.className = 'scard';
      li.innerHTML =
        '<div class="scard-top"><span class="scard-axis"></span>' +
        '<span class="verdict v-' + a.v + '"></span></div>' +
        '<div class="scard-rows">' +
        '<div class="scrow pine"><span class="side"></span><span class="txt-p"></span></div>' +
        '<div class="scrow neo"><span class="side"></span><span class="txt-n"></span></div>' +
        '</div>';
      li.querySelector('.scard-axis').textContent = pick(a.axis);
      li.querySelector('.verdict').textContent = t('verdict.' + a.v);
      li.querySelector('.scrow.pine .side').textContent = t('side.pine');
      li.querySelector('.scrow.neo .side').textContent = t('side.neo');
      li.querySelector('.txt-p').textContent = pick(a.pine);
      li.querySelector('.txt-n').textContent = pick(a.neo);
      list.appendChild(li);
    });
  }

  /* ---------------------------------------------------------
     Recovery composite (procedural placeholder)
     Three years mapped to R/G/B. Unburned pixels stay grey;
     burn scar shows recovery-timing as false colour.
     --------------------------------------------------------- */
  var FIRE_YEAR = 2019;
  var YEARS = [2019, 2020, 2021, 2022, 2023, 2024, 2025];
  var selR = document.getElementById('year-r');
  var selG = document.getElementById('year-g');
  var selB = document.getElementById('year-b');

  function fillYears(sel, val) {
    YEARS.forEach(function (y) {
      var o = document.createElement('option');
      o.value = String(y); o.textContent = String(y);
      if (y === val) o.selected = true;
      sel.appendChild(o);
    });
    sel.addEventListener('change', renderComposite);
  }
  fillYears(selR, 2020);
  fillYears(selG, 2022);
  fillYears(selB, 2024);

  function hash(x, y) {
    var n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return n - Math.floor(n);
  }
  function smooth(x, y) {
    var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    var a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
  }
  function fbm(x, y) {
    var t2 = 0, amp = 0.5, f = 1;
    for (var i = 0; i < 4; i++) { t2 += amp * smooth(x * f, y * f); f *= 2; amp *= 0.5; }
    return t2;
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function nbr(nx, ny, year) {
    var t2 = Math.max(0, year - FIRE_YEAR);
    var scar = fbm(nx * 3 + 10, ny * 3 + 4);
    if (scar <= 0.52) return 0.72 + (fbm(nx * 8, ny * 8) - 0.5) * 0.12; // unburned, stable
    var interior = clamp((scar - 0.52) / 0.35, 0, 1);      // 0 edge .. 1 core
    var neo = fbm(nx * 6 - 3, ny * 6 + 7);                 // neophyte patchiness
    var rate = 0.35 + (1 - interior) * 0.6 + (neo > 0.62 ? 0.6 : 0);
    return clamp((1 - Math.exp(-rate * t2 * 0.55)) * 0.85 + 0.05, 0, 1);
  }

  var canvas = document.getElementById('composite-canvas');
  var off = document.createElement('canvas');
  var RW = 200, RH = Math.round(RW * canvas.height / canvas.width);
  off.width = RW; off.height = RH;

  function renderComposite() {
    if (!canvas || views.composite.hidden) return;
    var yr = +selR.value, yg = +selG.value, yb = +selB.value;
    var octx = off.getContext('2d');
    var img = octx.createImageData(RW, RH);
    var px = img.data;
    for (var y = 0; y < RH; y++) {
      for (var x = 0; x < RW; x++) {
        var nx = x / RW, ny = y / RH, i = (y * RW + x) * 4;
        px[i]     = Math.round(Math.pow(nbr(nx, ny, yr), 0.85) * 255);
        px[i + 1] = Math.round(Math.pow(nbr(nx, ny, yg), 0.85) * 255);
        px[i + 2] = Math.round(Math.pow(nbr(nx, ny, yb), 0.85) * 255);
        px[i + 3] = 255;
      }
    }
    octx.putImageData(img, 0, 0);
    var ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
  }

  /* ---------------------------------------------------------
     Measures (Maßnahmen) — filterable by actor
     `a` (actor) and `tags` are language-neutral codes;
     `t` (text) is a per-language map.
     --------------------------------------------------------- */
  var MEAS = [
    { a: 'ind', tags: ['Streu', 'Schatten'],
      t: { de: 'Harke weglassen, Gras stehen lassen — Streu, Moos und Humus bauen sich auf.',
           en: 'Skip the rake, let the grass stand — litter, moss and humus build up.' } },
    { a: 'ind', tags: ['Schatten', 'Tau', 'Streu'],
      t: { de: 'Totholz- und Reisighaufen als Ammenstrukturen: Schatten, Feuchtinseln, Habitat.',
           en: 'Deadwood and brush piles as nurse structures: shade, moisture islands, habitat.' } },
    { a: 'ind', tags: ['Schatten', 'Tau'],
      t: { de: 'Steine und Stämme auf offenen Sand legen — Schatten- und Tau-Tropfkanten als Startpunkte.',
           en: 'Lay stones and logs on open sand — shade and dew-drip edges as starting points.' } },
    { a: 'ind', tags: ['Wind', 'Tau'],
      t: { de: 'Kleine Reisig-/Stroh-Raster auf offenen Sandflecken (Gobi-Prinzip im Kleinen).',
           en: 'Small brush/straw grids on open sand patches (the Gobi principle, scaled down).' } },
    { a: 'ind', tags: ['Streu'],
      t: { de: 'Mulchen statt gießen; Freiwillige (Robinie, Eichhörnchen-Saat) kuratieren statt Exoten pflanzen.',
           en: 'Mulch instead of watering; curate volunteers (black locust, squirrel-sown seed) rather than planting exotics.' } },

    { a: 'kom', tags: ['Tau', 'Schatten'],
      t: { de: 'Leitplanken, Lärmwände, Mauern als Tau-Kondensatoren und Schattenlinien für grüne Randstreifen nutzen.',
           en: 'Use guardrails, noise barriers and walls as dew condensers and shade lines for green verges.' } },
    { a: 'kom', tags: ['Schatten', 'Feuer'],
      t: { de: 'Brandschutzstreifen als feuchte Laub-Grünriegel — Feuerpuffer und Biotop zugleich.',
           en: 'Firebreaks as moist broadleaf green strips — fire buffer and biotope at once.' } },
    { a: 'kom', tags: ['Wind', 'Tau'],
      t: { de: 'Offene Sand-/Heideflächen: Reisig-/Stroh-Raster plus Biokrusten-Förderung gegen Winderosion.',
           en: 'Open sand/heath: brush/straw grids plus biocrust promotion against wind erosion.' } },
    { a: 'kom', tags: ['Schatten', 'Streu'],
      t: { de: 'Kommunalwald nach Brand: Totholz belassen, strukturbasiert erholen statt räumen-und-aufforsten.',
           en: 'Municipal forest after fire: leave deadwood, recover by structure rather than clear-and-replant.' } },
    { a: 'kom', tags: ['Tau', 'Kohlenstoff'],
      t: { de: 'Regenwasser in Baumgruben leiten (Schwammstadt); Erholung und Kohlenstoff tracken.',
           en: 'Channel rainwater into tree pits (sponge city); track recovery and carbon.' } },

    { a: 'forst', tags: ['Wind', 'Schatten'],
      t: { de: 'Totholz stehend/liegend als Ammenstruktur, Windbremse und Schatten lassen — nicht kahlräumen.',
           en: 'Leave deadwood standing or lying as nurse structure, windbreak and shade — don’t clear-cut.' } },
    { a: 'forst', tags: ['Wind', 'Streu'],
      t: { de: 'Schlagreisig flächig auslegen (lop-and-scatter): Wind bremsen, Feuchte halten, Natursaat fangen.',
           en: 'Spread slash across the area (lop-and-scatter): slow the wind, hold moisture, catch natural seed.' } },
    { a: 'forst', tags: ['Schatten', 'Streu'],
      t: { de: 'Zwei-Phasen: Pionier-Naturverjüngung (Birke/Zitterpappel) als Amme, Zielbaumart darunter etablieren.',
           en: 'Two-phase: pioneer natural regeneration (birch/aspen) as nurse, establish the target species beneath.' } },
    { a: 'forst', tags: ['Feuer', 'Schatten'],
      t: { de: 'Weg vom Kiefern-Reinbestand → Mischung/Laub: geringeres Brandrisiko, kühler, nasser.',
           en: 'Away from pure pine stands → mixed/broadleaf: lower fire risk, cooler, wetter.' } },
    { a: 'forst', tags: ['Wind', 'Kohlenstoff'],
      t: { de: 'Erosionsgefährdete Brandnarben mit Stroh-/Geotextil-Rastern fixieren; Kohlenstoff nach LSR bewerten.',
           en: 'Fix erosion-prone burn scars with straw/geotextile grids; assess carbon per LSR.' } }
  ];
  var TAGCLASS = { Wind: 'p', Schatten: 'p', Tau: 'n', Streu: 'n', Feuer: 'a', Kohlenstoff: 'a' };
  var curActor = 'all';

  function renderMeasures(actor) {
    curActor = actor || 'all';
    var list = document.getElementById('measures-list');
    if (!list) return;
    list.textContent = '';
    MEAS.filter(function (m) { return curActor === 'all' || m.a === curActor; })
      .forEach(function (m) {
        var li = document.createElement('li');
        li.className = 'measure';
        var tags = m.tags.map(function (tg) {
          return '<span class="mtag ' + (TAGCLASS[tg] || 'p') + '">' + t('tag.' + tg) + '</span>';
        }).join('');
        li.innerHTML = '<span class="m-actor"></span><p></p><div class="m-tags">' + tags + '</div>';
        li.querySelector('.m-actor').textContent = t('actor.' + m.a);
        li.querySelector('p').textContent = pick(m.t);
        list.appendChild(li);
      });
  }

  slice(document.querySelectorAll('.seg-btn')).forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.seg-btn').forEach(function (x) { x.classList.remove('is-on'); });
      b.classList.add('is-on');
      renderMeasures(b.dataset.actor);
    });
  });

  /* ---------------------------------------------------------
     Init
     --------------------------------------------------------- */
  buildSwitcher();
  setLang(LANG);          // applies translations + renders scorecard/measures
  renderComposite();
})();
