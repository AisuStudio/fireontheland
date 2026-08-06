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
      'tab.species': 'Arten',
      'tab.concept': 'Konzept',

      'composite.kicker': 'Was Noveco ist',
      'composite.title': 'Erholung in einem Bild',
      'composite.sub': 'Ein offenes Werkzeug, das eine Waldbrandfläche danach lesbar macht, welche Wiederbewaldung dort <strong>klimaangepasst, wirtschaftlich zukunftsfähig und kohlenstoffwirksam</strong> ist. Los geht’s mit der Erholung selbst: drei Jahre nach dem Brand auf Rot · Grün · Blau gelegt — grau = unverändert, Farbe = zeitversetztes Ergrünen.',
      'composite.canvasAria': 'Sentinel-2-NBR-Erholungskomposit der Brandfläche Jüterbog',
      'composite.badge': 'Sentinel-2 L2A · NBR · Copernicus Data Space Ecosystem',
      'composite.channelsAria': 'Jahre den Farbkanälen zuordnen',
      'channel.r': 'Rot',
      'channel.g': 'Grün',
      'channel.b': 'Blau',
      'legend.aria': 'Legende',
      'legend.grey': 'Grau — unverändert / unverbrannt',
      'legend.warm': 'Warm — frühe Erholung',
      'legend.green': 'Grün — mittlere Erholung',
      'legend.cool': 'Kühl — späte Erholung',

      'scorecard.title': 'Kiefern-Kulturwald oder Neophyten?',
      'scorecard.sub': 'Zwei neue Ökosysteme im Vergleich',
      'scorecard.history': 'Brandenburgs Kiefernwälder sind selbst eine menschengemachte Kultur: nach Übernutzung im 19. Jahrhundert auf kargem Sand angepflanzt, weil dort kaum etwas anderes wuchs. Genau diese Monokultur brennt heute leicht — wie 2019 bei Jüterbog oder 2018 und erneut 2022 bei Treuenbrietzen. Auf den Brandflächen etabliert sich oft ein zweites, ebenso neues Ökosystem schneller: Neophyten wie die Robinie. Im Klimawandel stehen beide unter Druck — und die Scorecard unten vergleicht sie ehrlich: kein Sieger-Loblied, sondern ein Raster, auf dem jede Seite Achsen gewinnt und verliert.',
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
      'tag.Trockenheit': 'Trockenheit',
      'tag.Sandboden': 'Sandboden',
      'tag.Pionier': 'Pionier',
      'tag.Stickstoff': 'Stickstoff',
      'tag.Bestaeuber': 'Bestäuber',

      'species.title': 'Arten',
      'species.sub': 'Stresstolerante Pionierarten für Sand, Trockenheit und die Zeit nach dem Brand.',
      'crit.aria': 'Kriterium wählen',
      'crit.Wind': 'Wind stabilisieren',
      'crit.Stickstoff': 'Stickstoff aufbauen',
      'crit.Bestaeuber': 'Bestäuber fördern',
      'crit.Pionier': 'Schnelle Pionierbesiedlung',
      'origin.native': 'Einheimisch',
      'origin.neo': 'Neophyten',
      'origin.archaeo': 'Archäophyten',
      'mix.rationale': 'Für {criteria} empfiehlt Noveco diese Mischung: {parts}.',
      'mix.baseline': 'Standardmischung für die gesamte Fläche',
      'unit.native.one': 'einheimischer Pionier',
      'unit.native.many': 'einheimische Pioniere',
      'unit.neo.one': 'Neophyt',
      'unit.neo.many': 'Neophyten',
      'unit.archaeo.one': 'Archäophyt',
      'unit.archaeo.many': 'Archäophyten',
      'list.allTitle': 'Alle Arten',

      'concept.title': 'Das Konzept',
      'concept.kicker': 'Was es ist',
      'concept.define': 'Ein offenes Werkzeug, das eine Waldbrandfläche danach lesbar macht, welche Wiederbewaldung dort zugleich <strong>klimaangepasst, wirtschaftlich zukunftsfähig und kohlenstoff-wirksam</strong> ist.',
      'concept.thesis': 'Der Wert einer Sukzession ist keine Eigenschaft der <em>Pflanze</em> — sondern der <em>Fläche</em>.',
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
      'tab.species': 'Species',
      'tab.concept': 'Concept',

      'composite.kicker': 'What Noveco is',
      'composite.title': 'Recovery in a single image',
      'composite.sub': 'An open tool that makes a wildfire site legible by which reforestation there is at once <strong>climate-adapted, economically future-proof and carbon-effective</strong>. It starts with recovery itself: three years after the fire, mapped onto Red · Green · Blue — grey = unchanged, colour = greening offset in time.',
      'composite.canvasAria': 'Sentinel-2 NBR recovery composite of the Jüterbog burn area',
      'composite.badge': 'Sentinel-2 L2A · NBR · Copernicus Data Space Ecosystem',
      'composite.channelsAria': 'Assign years to colour channels',
      'channel.r': 'Red',
      'channel.g': 'Green',
      'channel.b': 'Blue',
      'legend.aria': 'Legend',
      'legend.grey': 'Grey — unchanged / unburned',
      'legend.warm': 'Warm — early recovery',
      'legend.green': 'Green — mid recovery',
      'legend.cool': 'Cool — late recovery',

      'scorecard.title': 'Cultivated pine forest or neophytes?',
      'scorecard.sub': 'Two novel ecosystems compared',
      'scorecard.history': 'Brandenburg’s pine forests are themselves a human-made culture: planted on poor sand in the 19th century after overuse, because little else would grow there. That same monoculture now burns easily — as it did in 2019 near Jüterbog, and in 2018 and again in 2022 near Treuenbrietzen. On the burn scars, a second, equally new ecosystem often establishes itself faster: neophytes like the black locust. Both are under pressure from climate change — and the scorecard below compares them honestly: no winner’s anthem, just a grid where each side wins and loses axes.',
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
      'tag.Trockenheit': 'Drought',
      'tag.Sandboden': 'Sandy soil',
      'tag.Pionier': 'Pioneer',
      'tag.Stickstoff': 'Nitrogen',
      'tag.Bestaeuber': 'Pollinator',

      'species.title': 'Species',
      'species.sub': 'Stress-tolerant pioneer species for sand, drought and the time after the fire.',
      'crit.aria': 'Choose a criterion',
      'crit.Wind': 'Stabilize wind',
      'crit.Stickstoff': 'Build nitrogen',
      'crit.Bestaeuber': 'Support pollinators',
      'crit.Pionier': 'Fast pioneer colonization',
      'origin.native': 'Native',
      'origin.neo': 'Neophytes',
      'origin.archaeo': 'Archaeophytes',
      'mix.rationale': 'For {criteria}, Noveco suggests this mix: {parts}.',
      'mix.baseline': 'Default mix for the whole site',
      'unit.native.one': 'native pioneer',
      'unit.native.many': 'native pioneers',
      'unit.neo.one': 'neophyte',
      'unit.neo.many': 'neophytes',
      'unit.archaeo.one': 'archaeophyte',
      'unit.archaeo.many': 'archaeophytes',
      'list.allTitle': 'All species',

      'concept.title': 'The concept',
      'concept.kicker': 'What it is',
      'concept.define': 'An open tool that makes a wildfire site legible by which reforestation there is at once <strong>climate-adapted, economically future-proof and carbon-effective</strong>.',
      'concept.thesis': 'The value of a succession is not a property of the <em>plant</em> — but of the <em>site</em>.',
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
    renderSpecies();
    renderSpeciesMix();
  }

  /* ---------------------------------------------------------
     Navigation (bottom tabs)
     --------------------------------------------------------- */
  var tabs = slice(document.querySelectorAll('.tab'));
  var views = {
    composite: document.getElementById('view-composite'),
    scorecard: document.getElementById('view-scorecard'),
    measures: document.getElementById('view-measures'),
    species: document.getElementById('view-species'),
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
    if (target === 'species') { renderSpecies(); renderSpeciesMix(); }
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
     Recovery composite — real Sentinel-2 NBR tiles (Jüterbog)
     Three years mapped to R/G/B. Tiles are pre-fetched PNGs
     (scripts/fetch-sentinel.mjs, recipe in BRIEFING.md Anhang A) —
     only years with an actual tile in assets/ are selectable.
     --------------------------------------------------------- */
  var TILE_YEARS = [2020, 2022, 2024];
  var selR = document.getElementById('year-r');
  var selG = document.getElementById('year-g');
  var selB = document.getElementById('year-b');

  function fillYears(sel, val) {
    TILE_YEARS.forEach(function (y) {
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

  var canvas = document.getElementById('composite-canvas');
  var tileCache = {};   // year -> ImageData (grayscale NBR, canvas-sized)
  var tilesReady = false;

  function loadTile(year) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        var off = document.createElement('canvas');
        off.width = canvas.width; off.height = canvas.height;
        var octx = off.getContext('2d');
        octx.drawImage(img, 0, 0, canvas.width, canvas.height);
        tileCache[year] = octx.getImageData(0, 0, canvas.width, canvas.height);
        resolve();
      };
      img.onerror = reject;
      img.src = './assets/nbr-' + year + '.png';
    });
  }

  function renderComposite() {
    if (!canvas || views.composite.hidden || !tilesReady) return;
    var yr = +selR.value, yg = +selG.value, yb = +selB.value;
    var r = tileCache[yr].data, g = tileCache[yg].data, b = tileCache[yb].data;
    var ctx = canvas.getContext('2d');
    var out = ctx.createImageData(canvas.width, canvas.height);
    var px = out.data;
    for (var i = 0; i < px.length; i += 4) {
      px[i]     = r[i];   // grayscale NBR PNG → R=G=B=value at index i
      px[i + 1] = g[i];
      px[i + 2] = b[i];
      px[i + 3] = 255;
    }
    ctx.putImageData(out, 0, 0);
  }

  Promise.all(TILE_YEARS.map(loadTile)).then(function () {
    tilesReady = true;
    renderComposite();
  }).catch(function (err) {
    console.error('Sentinel-Kacheln konnten nicht geladen werden', err);
  });

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
  var TAGCLASS = { Wind: 'p', Schatten: 'p', Tau: 'n', Streu: 'n', Feuer: 'a', Kohlenstoff: 'a',
    Trockenheit: 'p', Sandboden: 'p', Pionier: 'n', Stickstoff: 'n', Bestaeuber: 'a' };
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

  slice(document.querySelectorAll('.seg-btn[data-actor]')).forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.seg-btn[data-actor]').forEach(function (x) { x.classList.remove('is-on'); });
      b.classList.add('is-on');
      renderMeasures(b.dataset.actor);
    });
  });

  /* ---------------------------------------------------------
     Species (Arten) — curated pioneer species + a rule-based
     post-fire mix generator. `origin` (native/neo/archaeo) is
     purely informational: never used to score/rank, only to
     group the generated mix and guarantee all three are
     represented where possible — same boundary as Scorecard's
     AXES[].v (function) vs side.pine/side.neo (presentation).
     'archaeo' = archaeophyte: introduced before ~1492, long
     naturalised (centuries, often 800+ years) — neither the
     post-Columbian "neophyte" nor strictly post-glacial native.
     --------------------------------------------------------- */
  var ORIGINS = ['native', 'neo', 'archaeo'];
  var SPECIES = [
    { id: 'sanddorn', name: { de: 'Sanddorn', en: 'Sea buckthorn' }, latin: 'Hippophae rhamnoides',
      origin: 'native', tags: ['Stickstoff', 'Trockenheit', 'Sandboden', 'Wind'],
      t: { de: 'Tiefwurzelnder Stickstofffixierer der Dünen — hält reinen Sand, erträgt Extremtrockenheit, dornige Windbremse.',
           en: 'Deep-rooted nitrogen-fixer of dunes — holds bare sand, shrugs off extreme drought, thorny windbreak.' } },
    { id: 'robinie', name: { de: 'Robinie', en: 'Black locust' }, latin: 'Robinia pseudoacacia',
      origin: 'neo', tags: ['Stickstoff', 'Trockenheit', 'Sandboden', 'Bestaeuber'],
      t: { de: 'Stickstofffixierende Pionierbaumart auf Ödland, hitzetolerant, tiefwurzelnd — eine der ergiebigsten Bienenweiden Mitteleuropas.',
           en: 'Nitrogen-fixing pioneer tree on wasteland, heat-tolerant, deep-rooted — also one of Central Europe’s most productive bee-forage trees.' } },
    { id: 'besenginster', name: { de: 'Besenginster', en: 'Common broom' }, latin: 'Cytisus scoparius',
      origin: 'native', tags: ['Stickstoff', 'Trockenheit', 'Sandboden', 'Pionier'],
      t: { de: 'Stickstofffixierender Heidestrauch, keimt oft massenhaft nach Feuer, erträgt Sand und Trockenheit.',
           en: 'Nitrogen-fixing heathland shrub, often germinates en masse after fire, tolerates sand and drought.' } },
    { id: 'silbergras', name: { de: 'Silbergras', en: 'Grey hair-grass' }, latin: 'Corynephorus canescens',
      origin: 'native', tags: ['Trockenheit', 'Sandboden', 'Wind'],
      t: { de: 'Leitgras offener Binnendünen — Extremspezialist für nährstoffarmen Sand, verfilzt gegen Winderosion.',
           en: 'Signature grass of open inland dunes — an extreme specialist for nutrient-poor sand, mats against wind erosion.' } },
    { id: 'sandstrohblume', name: { de: 'Sandstrohblume', en: 'Immortelle' }, latin: 'Helichrysum arenarium',
      origin: 'native', tags: ['Trockenheit', 'Sandboden', 'Bestaeuber'],
      t: { de: 'Trockenrasen-Charakterart brandenburgischer Sandböden, wichtige Nektarquelle für Wildbienen und Falter.',
           en: 'Signature species of Brandenburg’s dry sandy grasslands, key nectar source for wild bees and moths.' } },
    { id: 'bibernellrose', name: { de: 'Bibernellrose', en: 'Burnet rose' }, latin: 'Rosa spinosissima',
      origin: 'native', tags: ['Trockenheit', 'Sandboden', 'Wind'],
      t: { de: 'Dorniger Wurzelausläufer-Strauch der Dünen, stabilisiert Sand, trockenheitsfest.',
           en: 'Thorny sucker-rooted dune shrub, stabilises sand, drought-hardy.' } },
    { id: 'wiesensalbei', name: { de: 'Wiesensalbei', en: 'Meadow sage' }, latin: 'Salvia pratensis',
      origin: 'native', tags: ['Trockenheit', 'Bestaeuber'],
      t: { de: 'Tiefwurzelnder Lippenblütler trockener Magerrasen, hitzefest, ergiebige Nektarquelle für Hummeln.',
           en: 'Deep-rooted herb of dry, nutrient-poor grassland, heat-hardy, rich nectar source for bumblebees.' } },
    { id: 'sandbirke', name: { de: 'Sandbirke', en: 'Silver birch' }, latin: 'Betula pendula',
      origin: 'native', tags: ['Pionier', 'Sandboden', 'Trockenheit'],
      t: { de: 'Windverbreiteter Pionierbaum auf blankem Mineralboden nach Brand, schnelle Erstbesiedlung.',
           en: 'Wind-dispersed pioneer tree on bare mineral soil after fire, fast first colonisation.' } },
    { id: 'zitterpappel', name: { de: 'Zitterpappel', en: 'Aspen' }, latin: 'Populus tremula',
      origin: 'native', tags: ['Pionier', 'Sandboden'],
      t: { de: 'Wurzelbrütender Pionierbaum, besiedelt Brandflächen über Ausläufer.',
           en: 'Root-suckering pioneer tree, colonises burn scars via runners.' } },
    { id: 'brennnessel', name: { de: 'Brennnessel', en: 'Stinging nettle' }, latin: 'Urtica dioica',
      origin: 'native', tags: ['Pionier', 'Bestaeuber'],
      t: { de: 'Nährstoffzeiger, der Aschepulse nach dem Brand nutzt — Raupenfutter für zahlreiche Schmetterlingsarten.',
           en: 'Nutrient indicator that exploits post-fire ash pulses — caterpillar food for numerous butterfly species.' } },
    { id: 'traubeneiche', name: { de: 'Traubeneiche', en: 'Sessile oak' }, latin: 'Quercus petraea',
      origin: 'native', tags: ['Trockenheit', 'Sandboden'],
      t: { de: 'Tiefwurzelnde Klimawald-Eiche für den Umbau der Kiefernforste — trockenheitsfest, langlebig, dickere Rinde macht sie feuertoleranter als die Kiefer.',
           en: 'Deep-rooted oak central to converting pine monocultures — drought-hardy, long-lived, thicker bark makes it more fire-tolerant than pine.' } },
    { id: 'wacholder', name: { de: 'Wacholder', en: 'Common juniper' }, latin: 'Juniperus communis',
      origin: 'native', tags: ['Trockenheit', 'Sandboden', 'Wind'],
      t: { de: 'Feuerangepasster Heide-Nadelstrauch auf magerstem Sand — extrem trockenheitsfest, langsam, aber dauerhaft, windfeste Dornstruktur.',
           en: 'Fire-adapted heathland conifer on the poorest sand — extremely drought-hardy, slow but persistent, wind-firm thorny structure.' } },
    { id: 'schwarzkiefer', name: { de: 'Schwarzkiefer', en: 'Austrian pine' }, latin: 'Pinus nigra',
      origin: 'neo', tags: ['Trockenheit', 'Sandboden', 'Pionier'],
      t: { de: 'Südeuropäische Kiefer, in Brandenburger Versuchsflächen als hitze- und trockenheitsresistenterer Ersatz für die heimische Kiefer erprobt.',
           en: 'Southern European pine trialled on Brandenburg test sites as a more heat- and drought-resilient stand-in for the native pine.' } },
    { id: 'baumhasel', name: { de: 'Baumhasel', en: 'Turkish hazel' }, latin: 'Corylus colurna',
      origin: 'neo', tags: ['Trockenheit'],
      t: { de: 'Südosteuropäisch-westasiatischer Klimabaum, gilt als einer der hitze- und trockenheitshärtesten Laubbäume für den Stadt- und Forstumbau.',
           en: 'Southeast European / West Asian climate tree, rated among the most heat- and drought-hardy broadleaves for urban and forest conversion.' } },
    { id: 'edelkastanie', name: { de: 'Edelkastanie', en: 'Sweet chestnut' }, latin: 'Castanea sativa',
      origin: 'archaeo', tags: ['Trockenheit', 'Sandboden', 'Bestaeuber'],
      t: { de: 'Seit der Römerzeit in Mitteleuropa eingebürgert (über 800 Jahre nördlich der Alpen kultiviert) — liebt sandig-saure Böden, trockenheitsfest, ergiebige Bienenweide.',
           en: 'Naturalised in Central Europe since Roman times (cultivated north of the Alps for over 800 years) — thrives on sandy, acidic soil, drought-hardy, rich bee forage.' } },
    { id: 'walnuss', name: { de: 'Walnuss', en: 'Walnut' }, latin: 'Juglans regia',
      origin: 'archaeo', tags: ['Trockenheit'],
      t: { de: 'Schon im Mittelalter an Brandenburgs Dörfern gepflanzt — tiefwurzelnd und trockenheitsfest, aber kein Stickstofffixierer oder Pionier wie die anderen Arten hier.',
           en: 'Planted at Brandenburg farmsteads since the Middle Ages — deep-rooted and drought-hardy, but not a nitrogen-fixer or pioneer like the other species here.' } }
  ];

  var CRITERIA = ['Wind', 'Stickstoff', 'Bestaeuber', 'Pionier'];
  var MIX_MIN = 4, MIX_MAX = 7;
  var curCriteria = [];

  function buildSpCard(sp) {
    var li = document.createElement('li');
    li.className = 'spcard';
    var tags = sp.tags.map(function (tg) {
      return '<span class="mtag ' + (TAGCLASS[tg] || 'p') + '">' + t('tag.' + tg) + '</span>';
    }).join('');
    li.innerHTML = '<div class="sp-head"><span class="sp-name"></span><span class="sp-latin"></span></div>' +
      '<p></p><div class="m-tags">' + tags + '</div>';
    li.querySelector('.sp-name').textContent = pick(sp.name);
    li.querySelector('.sp-latin').textContent = sp.latin;
    li.querySelector('p').textContent = pick(sp.t);
    return li;
  }

  function renderSpecies() {
    var list = document.getElementById('species-list');
    if (!list) return;
    list.textContent = '';
    SPECIES.forEach(function (sp) { list.appendChild(buildSpCard(sp)); });
  }

  function scoreOne(sp, active) {
    var s = 0;
    for (var i = 0; i < active.length; i++) if (sp.tags.indexOf(active[i]) !== -1) s++;
    return s;
  }

  function pickMix(criteria) {
    var active = criteria.length ? criteria : CRITERIA;
    var scored = SPECIES.map(function (sp, i) { return { sp: sp, i: i, score: scoreOne(sp, active) }; });
    scored.sort(function (a, b) { return b.score - a.score || a.i - b.i; });

    var matched = scored.filter(function (x) { return x.score > 0; });
    var pool = matched.length >= MIX_MIN ? matched : scored;
    var mix = pool.slice(0, MIX_MAX);
    if (mix.length < MIX_MIN) mix = pool.slice(0, MIX_MIN);

    ORIGINS.forEach(function (need) {
      if (mix.some(function (x) { return x.sp.origin === need; })) return;
      var candidate = scored.filter(function (x) { return x.sp.origin === need; })[0];
      if (!candidate) return;
      var counts = {};
      mix.forEach(function (x) { counts[x.sp.origin] = (counts[x.sp.origin] || 0) + 1; });
      for (var j = mix.length - 1; j >= 0; j--) {
        if (counts[mix[j].sp.origin] > 1) { mix[j] = candidate; break; }
      }
    });

    mix.sort(function (a, b) { return b.score - a.score || a.i - b.i; });
    var grouped = {};
    ORIGINS.forEach(function (o) {
      grouped[o] = mix.filter(function (x) { return x.sp.origin === o; }).map(function (x) { return x.sp; });
    });
    return grouped;
  }

  function renderSpeciesMix() {
    var box = document.getElementById('species-mix');
    if (!box) return;
    box.textContent = '';

    var mix = pickMix(curCriteria);

    var rationale = document.createElement('p');
    rationale.className = 'note';
    if (curCriteria.length) {
      var names = curCriteria.map(function (c) { return t('crit.' + c).toLowerCase(); }).join(', ');
      var parts = ORIGINS.filter(function (o) { return mix[o].length; })
        .map(function (o) {
          return mix[o].length + ' ' + t('unit.' + o + '.' + (mix[o].length === 1 ? 'one' : 'many'));
        }).join(', ');
      rationale.textContent = t('mix.rationale').replace('{criteria}', names).replace('{parts}', parts);
    } else {
      rationale.textContent = t('mix.baseline');
    }
    box.appendChild(rationale);

    var ORIGIN_CLASS = { native: 'tag-pine', neo: 'tag-neo', archaeo: 'tag-archaeo' };
    ORIGINS.forEach(function (o) {
      if (!mix[o].length) return;
      var h = document.createElement('span');
      h.className = ORIGIN_CLASS[o];
      h.textContent = t('origin.' + o);
      box.appendChild(h);
      var ul = document.createElement('ul');
      ul.className = 'species';
      mix[o].forEach(function (sp) { ul.appendChild(buildSpCard(sp)); });
      box.appendChild(ul);
    });

    slice(document.querySelectorAll('.seg-btn[data-tag]')).forEach(function (b) {
      var on = curCriteria.indexOf(b.dataset.tag) !== -1;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  slice(document.querySelectorAll('.seg-btn[data-tag]')).forEach(function (b) {
    b.addEventListener('click', function () {
      var tag = b.dataset.tag;
      var idx = curCriteria.indexOf(tag);
      if (idx === -1) curCriteria.push(tag); else curCriteria.splice(idx, 1);
      renderSpeciesMix();
    });
  });

  /* ---------------------------------------------------------
     Background parallax — hero image drifts slower than scroll,
     then settles (clamped) so it never runs out of image on
     long pages.
     --------------------------------------------------------- */
  var PARALLAX_FACTOR = 0.3, PARALLAX_MAX = 80;
  var parallaxTicking = false;
  function applyParallax() {
    var offset = Math.max(-PARALLAX_MAX, -window.scrollY * PARALLAX_FACTOR);
    document.body.style.setProperty('--bg-parallax', offset + 'px');
    parallaxTicking = false;
  }
  window.addEventListener('scroll', function () {
    if (parallaxTicking) return;
    parallaxTicking = true;
    requestAnimationFrame(applyParallax);
  }, { passive: true });

  /* ---------------------------------------------------------
     Init
     --------------------------------------------------------- */
  buildSwitcher();
  setLang(LANG);          // applies translations + renders scorecard/measures/species
  renderComposite();
})();
