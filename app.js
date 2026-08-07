/* Fire on the Land — MVP scaffold. Dependency-free. */
(function () {
  'use strict';

  var slice = function (nl) { return Array.prototype.slice.call(nl); };

  /* ---------------------------------------------------------
     Glossar — Fachbegriffe werden dort erklärt, wo sie stehen.
     Schreibweise im Text: [[schluessel|angezeigtes Wort]].
     Antippen klappt die Erklärung direkt darunter auf.
     --------------------------------------------------------- */
  var GLOSSARY = {
    riegel: {
      de: 'Ein 40–50 m breiter Waldstreifen quer zur Hauptwindrichtung. Er löscht kein Feuer, sondern entzieht ihm Energie: Ein Vollfeuer, das in den Kronen läuft und mit Bodentechnik kaum zu bekämpfen ist, soll beim Auftreffen in ein Bodenfeuer zurückfallen — und das kann die Feuerwehr angreifen.',
      en: 'A 40–50 m wide forest strip laid across the prevailing wind. It does not extinguish a fire, it drains its energy: a crown fire, which ground crews can barely fight, is meant to drop back into a ground fire on hitting the strip — and that firefighters can attack.'
    },
    neophyt: {
      de: 'Eine Pflanzenart, die erst nach 1492 durch den Menschen hierher gelangt ist — die Jahreszahl steht für den Beginn des weltweiten Seehandels. Robinie, Rot-Eiche und Essigbaum stammen aus Nordamerika.',
      en: 'A plant species brought here by people after 1492 — the date marks the start of global maritime trade. Black locust, red oak and staghorn sumac all come from North America.'
    },
    archaeophyt: {
      de: 'Eine Art, die schon vor 1492 eingeführt wurde und seit Jahrhunderten hier wächst — weder ursprünglich heimisch noch neu. Die Edelkastanie kam mit den Römern.',
      en: 'A species introduced before 1492 that has grown here for centuries — neither originally native nor new. Sweet chestnut arrived with the Romans.'
    },
    naturverjuengung: {
      de: 'Bäume, die von selbst aufwachsen — aus angeflogenem Samen, aus der Samenbank im Boden oder aus Wurzelbrut. Das Gegenteil ist die Kunstverjüngung: gepflanzt oder gesät.',
      en: 'Trees that come up on their own — from wind-blown seed, from the soil seed bank, or from root suckers. The opposite is artificial regeneration: planted or sown.'
    },
    ammenstruktur: {
      de: 'Alles, was jungen Pflanzen Schutz gibt, ohne selbst Pflanze zu sein: liegendes Totholz, Reisig, Steine, Wurzelteller. Sie bremsen Wind, werfen Schatten, sammeln Tau und fangen Samen.',
      en: 'Anything that shelters young plants without being a plant itself: fallen deadwood, brush, stones, root plates. They slow the wind, cast shade, gather dew and catch seed.'
    },
    sukzession: {
      de: 'Die Abfolge, in der sich Pflanzengemeinschaften auf einer freien Fläche ablösen — von den schnellen Pionieren bis zu den langsamen, langlebigen Arten.',
      en: 'The sequence in which plant communities replace one another on open ground — from fast pioneers to slow, long-lived species.'
    },
    nbr: {
      de: 'Normalized Burn Ratio: ein Index aus zwei Sentinel-2-Kanälen, der Vegetation von verbranntem Boden trennt. Hohe Werte bedeuten grün, niedrige verbrannt oder vegetationsfrei.',
      en: 'Normalized Burn Ratio: an index from two Sentinel-2 bands that separates vegetation from burnt ground. High values mean green, low values burnt or bare.'
    },
    lrt: {
      de: 'Lebensraumtyp — eine europaweit einheitlich definierte Schutzkategorie. „LRT 2330 Silbergrasfluren auf Binnendünen" bezeichnet offene, nährstoffarme Sandflächen, deren Schutzzweck gerade die Armut ist.',
      en: 'Habitat type — a conservation category defined uniformly across Europe. “Habitat 2330, inland dune grassland” denotes open, nutrient-poor sand whose very poverty is the protection goal.'
    }
  };

  function withGlossary(text) {
    return escapeHtml(text).replace(/\[\[([a-z]+)\|([^\]]+)\]\]/g, function (all, key, label) {
      if (!GLOSSARY[key]) return label;
      return '<button type="button" class="gloss" data-gloss="' + key + '">' + label + '</button>';
    });
  }

  // direkt binden statt delegieren — wie die übrigen Schalter der App auch
  function bindGloss(root) {
    slice((root || document).querySelectorAll('.gloss')).forEach(function (b) {
      if (b.dataset.bound) return;
      b.dataset.bound = '1';
      b.addEventListener('click', function () { toggleGloss(b); });
    });
  }

  function toggleGloss(b) {
    var key = b.dataset.gloss;
    var wasOpen = b.getAttribute('aria-expanded') === 'true';
    // Erklärung unter den ganzen Absatz hängen, nicht mitten in den Satz
    var block = b.closest('p, li, div') || b.parentNode;
    var card = block.parentNode;
    slice(document.querySelectorAll('.gloss-def')).forEach(function (d) { d.remove(); });
    slice(document.querySelectorAll('.gloss')).forEach(function (x) { x.setAttribute('aria-expanded', 'false'); });
    if (wasOpen) return;
    var def = document.createElement('p');
    def.className = 'gloss-def';
    def.textContent = (GLOSSARY[key] && GLOSSARY[key][LANG]) || (GLOSSARY[key] && GLOSSARY[key].de) || '';
    card.insertBefore(def, block.nextSibling);
    b.setAttribute('aria-expanded', 'true');
  }

  // credits come from Wikimedia metadata — never interpolate them raw into innerHTML
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

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
  var STORE_KEY = 'fireontheland-lang';

  var T = {
    de: {
      'lang.aria': 'Sprache',
      'nav.aria': 'Ansichten',
      'mainnav.aria': 'Bereiche',

      'section.novel': 'Graphic Novel',
      'section.font': 'Font',
      'section.app': 'Adoption Scenarios',
      'loc.novel': 'Northwest Territories · Kanada',
      'loc.font': 'AS Dehcho',
      'loc.app': 'Jüterbog · Brandenburg',

      'novel.kicker': 'Work in Progress · Graphic Novel',
      'novel.title': 'Fire on the Land',
      'novel.sub': 'Der Wissenschaftler Oliver Sonnentag verlor 2022 durch einen Waldbrand seinen Messturm an der Scotty-Creek-Forschungsstation — Kanadas erster indigen geführter Forschungsstation. Die Graphic Novel begleitet den Wiederaufbau vor der Schneeschmelze, mit Dieter Cazon von der Liidlii Kue First Nation als Begleiter und Ko-Autor.',
      'novel.status': 'Character Studies · 170/180 Skriptseiten (v.2) · 70 Storyboard-Seiten',
      'novel.teamTitle': 'Team',
      'novel.team.oliver.role': 'Wissenschaftlicher Berater, Protagonist',
      'novel.team.dom.role': 'Illustrator',
      'novel.team.dieter.role': 'Traditioneller Wissenshüter, Liidlii Kue First Nation',
      'novel.sampleTitle': 'Leseprobe — Kapitel 01',
      'novel.cta': 'Konzept + Leseprobe lesen (PDF)',
      'novel.notify': 'Bescheid sagen, wenn es fertig ist',
      'novel.photosTitle': 'Von der Forschungsreise, 2023',
      'novel.pressTitle': 'In der Presse',
      'novel.press.cabin': 'Über den Einstieg ins Wiederaufbau-Team',
      'novel.press.cbcArticle': 'Das Wer, Wie und Warum des Turm-Wiederaufbaus',
      'novel.press.cbcRadio': 'Interview zum Comic-Projekt',
      'novel.press.nasa': 'Erwähnt im ABoVE-Monatsbrief',

      'font.kicker': 'Font · früher Testbuild',
      'font.title': 'AS Dehcho',
      'font.sub': 'Ein handgezeichneter Comic-Display-Font für dieses Projekt — trägt sowohl die Dene-Orthografie der Dehcho-Region als auch Sprechblasen-Lettering in einer Familie. Aktuell nicht in aktiver Arbeit, aber schon nutzbar.',
      'font.linkSpecimen': 'Vollständiges Specimen — Diakritika, Alternates, Grawlixes',

      'app.kicker': 'Adoption Scenarios',
      'app.sub': 'Reale Post-Fire-Flächen, an denen die Fragen aus Fire on the Land an echten Daten geprüft werden — angefangen mit Jüterbog, Brandenburg.',

      'tab.composite': 'Komposit',
      'tab.scorecard': 'Scorecard',
      'tab.measures': 'Maßnahmen',
      'tab.species': 'Arten',
      'tab.scenarios': 'Szenarien',
      'tab.concept': 'Konzept',

      'composite.kicker': 'Was Fire on the Land ist',
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
      'scorecard.note': 'Die Achse <strong>Biodiversität</strong> kippt je nach Fläche — der Angelpunkt, den das Werkzeug sichtbar macht. Beim <strong>Brandrisiko</strong> entscheidet nach der Datenlage die Bestandesstruktur, nicht die Baumart: Streu-Brennversuche nach Ewald u.&nbsp;a. (2025, <em>Forestry</em> 98(1)), Alters- und Strukturkriterium nach Bentele u.&nbsp;a. (2023, AFZ/Der Wald 1), Riegel-Eignung nach <em>Waldstrukturelle Waldbrandvorbeugung</em> (LFB/MLUK Brandenburg, 2024).',
      'side.pine': 'Kiefer',
      'side.neo': 'Neophyt',
      'verdict.neo': 'Neophyt',
      'verdict.pine': 'Kiefer',
      'verdict.split': 'Geteilt',
      'verdict.ctx': 'Kontextabhängig',

      'measures.title': 'Maßnahmen',
      'measures.sub': 'Struktur, nicht Art, ist die billigste Maßnahme: Wind bremsen, Schatten und Tau schaffen, Samen fangen — reburn-resilient sind davon aber nur die unbrennbaren Teile wie Stein und Wurzelteller; trockenes Totholz brennt im Ernstfall mit.',
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
      'tag.Wiederaustrieb': 'Wiederaustrieb',

      'species.title': 'Arten',
      'species.sub': 'Was auf brandenburgischem Sand nach dem Feuer wirklich kommt — Artenauswahl und Zahlen aus dem Forschungsprojekt PYROPHOB (Treuenbrietzen und Jüterbog).',
      'crit.aria': 'Kriterium wählen',
      'crit.Wind': 'Wind stabilisieren',
      'crit.Stickstoff': 'Stickstoff aufbauen',
      'crit.Bestaeuber': 'Bestäuber fördern',
      'crit.Pionier': 'Schnelle Pionierbesiedlung',
      'crit.Wiederaustrieb': 'Treibt nach Feuer wieder aus',
      'site.aria': 'Flächenstatus wählen',
      'site.nsg': 'Schutzgebiet (Jüterbog)',
      'site.open': 'Fläche ohne Schutzstatus',
      'site.nsgNote': 'Die Ankerfläche ist Naturschutz- und FFH-Gebiet mit geschützten <strong>nährstoffarmen</strong> Lebensraumtypen. Das Ausbringen gebietsfremder Arten ist dort nach § 40 BNatSchG genehmigungspflichtig — und die Genehmigung <em>ist zu versagen</em>, wenn eine Gefährdung nicht auszuschließen ist. Das Bundesamt für Naturschutz rät für Naturschutz- und FFH-Gebiete generell davon ab. Der Generator schlägt hier deshalb nur einheimische Arten vor.',
      'site.openNote': 'Ohne Schutzstatus entfällt die Beschränkung aus § 40 BNatSchG, und gebietsfremde Arten stehen zur Wahl. Damit wird die Mischung zur <em>Hypothese</em>: Ob sie besser trägt als eine einheimische, ist auf diesen Flächen nicht gemessen worden.',
      'site.excludedTitle': 'Auf dieser Fläche ausgeschlossen:',
      'site.excludedBody': '{n} gebietsfremde Arten ({list}) — nicht wegen ihrer Herkunft, sondern weil der Schutzzweck hier Nährstoffarmut ist und das Ausbringen rechtlich beschränkt.',
      'hypo.kicker': 'Hypothese, nicht Befund',
      'hypo.title': 'Können Neophyten Teil der Klimaanpassung sein?',
      'hypo.body': 'Die Robinie liefert das dauerhafteste Holz Europas, wurzelt tief, erträgt Hitze und Trockenheit und fixiert Stickstoff — als Anpassungskandidat auf armem Sand ist sie ernstzunehmen. <strong>Belegt ist das hier aber nicht.</strong> Die zugrunde liegenden Messungen vergleichen Behandlungs<em>verfahren</em> — räumen, pflügen, pflanzen, nichts tun — und nicht Herkünfte. Kein einziger Messwert dieser Flächen testet, ob gebietsfremde Arten die bessere Klimaanpassung liefern.',
      'hypo.counter': 'Dagegen steht: Auf nährstoffarmen Schutzflächen ist genau die Stickstofffixierung das Problem, weil sie den Lebensraum beseitigt, der geschützt werden soll. Und die anerkannte Route der forstlichen Klimaanpassung führt nicht über fremde Arten, sondern über die <strong>Herkunftswahl innerhalb heimischer Arten</strong> — trockenheitserprobte Provenienzen etwa von Traubeneiche oder Kiefer.',
      'hypo.quantifiable': 'Ein Punkt spricht dafür, ausgerechnet die Robinie zu prüfen: Sie ist die einzige der Kandidatinnen, für die eine <strong>Ertragstafel für Brandenburg existiert</strong> — Lockow &amp; Lockow (2015), ausdrücklich bis zur Nährkraftstufe „ziemlich arm“, mit Kulmination des Zuwachses um das 35. Jahr. Ihr Ertrag wäre also prüfbar, während er für die spontan dominierende Zitterpappel mangels Datengrundlage gar nicht berechenbar ist.',
      'hypo.test': 'Prüfbar wäre die These auf einer Fläche ohne Schutzstatus, mit Robinie gegen heimische Vergleichsvariante, über mindestens zehn Jahre. Diesen Versuch gibt es nach derzeitigem Stand nicht.',
      'foot.credit': 'Sentinel-2 · Copernicus · PYROPHOB',
      'foot.legal': 'Impressum & Datenschutz',
      'species.source': 'Zahlen zur Naturverjüngung aus dem Forschungsprojekt PYROPHOB: Abschlussband <em>Eberswalder Forstliche Schriftenreihe Bd. 77</em> (LFE Brandenburg, 2024) sowie Schüle u.&nbsp;a., <em>Vegetationsentwicklung nach Waldbrand</em> (EFS 73) — die Aspen-Dichte von 13.590/ha stammt aus der 200-Plot-Rasteraufnahme Treuenbrietzen 2020 (Masterarbeiten Domes &amp; Schwanitz); der Abschlussband nennt für seine 15 Untersuchungsstandorte 6.289/ha. Standortangaben nach NSG-Verordnung Forst Zinna–Jüterbog–Keilberg und FloraWeb.',
      'origin.native': 'Einheimisch',
      'origin.neo': 'Neophyten',
      'origin.archaeo': 'Archäophyten',
      'mix.rationale': 'Kriterien: {criteria}. Fire on the Land empfiehlt diese Mischung: {parts}.',
      'mix.baseline': 'Standardmischung für die gesamte Fläche',
      'unit.native.one': 'einheimischer Pionier',
      'unit.native.many': 'einheimische Pioniere',
      'unit.neo.one': 'Neophyt',
      'unit.neo.many': 'Neophyten',
      'unit.archaeo.one': 'Archäophyt',
      'unit.archaeo.many': 'Archäophyten',
      'speciesMap.aria': 'Generierte Mischung illustrativ auf dem Sentinel-Komposit platziert',
      'speciesMap.caption': 'Illustrative Platzierung — keine realen Standortdaten.',
      'list.allTitle': 'Alle Arten',

      'scenarios.kicker': 'Illustratives Modell',
      'scenarios.title': 'Drei Wege nach dem Brand',
      'scenarios.sub': 'Wie sich Jüterbogs Brandfläche je nach Strategie erholen könnte — vorbereitete Szenarien, keine Live-Simulation.',
      'scenarios.chartAria': 'Liniendiagramm: modellierte Erholung über 30 Jahre für drei Strategien',
      'scenarios.caption.forest': 'Bewaldungsgrad (%) über Jahre seit dem Brand',
      'scenarios.caption.open': 'Erhaltungsgrad des Offenlands (%) über Jahre seit dem Brand',
      'scenarios.measured': 'gemessen',
      'scenarios.modelled': 'modelliert',
      'target.aria': 'Zielzustand wählen',
      'target.forest': 'Ziel: geschlossener Wald',
      'target.open': 'Ziel: offene Sandheide',
      'target.forestNote': 'Gemessen wird gegen den unverbrannten Kiefernforst nebenan: 80 % Kronendeckung, rund 20 m Höhe. Beides muss stimmen — hohe Einzelbäume ohne Deckung sind kein Wald, dichter Niederwuchs ohne Höhe auch nicht.',
      'target.openNote': 'Für die geschützten Lebensraumtypen des Gebiets — Silbergrasfluren auf Binnendünen, Sandheiden — ist Offenheit das Ziel. Gemessen wird deshalb die <strong>Freiheit von Gehölzen</strong>: Managementpläne stufen solche Flächen ab etwa 30 % Verbuschung als verschlechtert ein. Dieselben Daten, dieselbe Fläche, umgekehrtes Urteil — der Brand hat hier nicht zerstört, sondern zurückgesetzt. <em>Einschränkung:</em> Erfasst ist nur die Verbuschung, nicht das Vorhandensein der kennzeichnenden Arten — die brauchen Jahre und sind hier nicht modelliert. Das gemessene Unsicherheitsband gilt nur fürs Waldziel und wird deshalb ausgeblendet.',
      'scenarios.note': 'Bis Jahr 3–4 aus den PYROPHOB-Messungen in Jüterbog, danach modelliert (Höhen nach den Ertragstafeln für Sand-Birke und Kiefer). Keine Live-Simulation. Die tatsächliche Entwicklung hängt von Samenbäumen, Wild, Witterung und Wiederholungsbränden ab.',
      'scenario.pine': 'Kiefern nachpflanzen',
      'scenario.pine.note': 'Die gemessene Ernüchterung: Nach fünf Jahren lebten noch 14,7 % der gepflanzten Kiefern, „praktisch kein Höhenwachstum“. Was auf dieser Fläche Biomasse bildete, war die spontane Aspe — 0,8 % entfielen auf die Pflanzung. Erst mit Nachbesserung schließt sich später ein Kronendach (durchgezogen); die gestrichelte Linie zeigt den real gemessenen Verlauf ohne Nachpflanzen.',
      'scenario.passive': 'Sich selbst überlassen',
      'scenario.passive.note': 'In Jüterbog der unsicherste Weg — deshalb das breite Band: Zwei Flächen derselben Brandfläche liegen um den Faktor 20 auseinander, je nachdem ob Samenbäume überlebt haben. Dazu Reinsand, keine Jagd und flächiger Verbiss. Kostet nichts, garantiert aber auch nichts.',
      'scenario.assisted': 'Nachhelfen statt pflanzen',
      'scenario.assisted.note': 'Nicht räumen, sondern gezielt säen: Eichensaat überlebte zu über 99 %, gepflanzte Kiefer zu 14,7 %. Junge Eichen stoppten 2018 sogar ein Feuer. Schwächste Datenbasis der drei — keine PYROPHOB-Fläche kombiniert „nicht räumen“ mit Saat, das ist eine begründete Synthese.',
      'rad.kicker': 'Der Rahmen dahinter',
      'rad.title': 'Resist · Accept · Direct',
      'rad.resist': 'Resist',
      'rad.accept': 'Accept',
      'rad.direct': 'Direct',
      'rad.body': 'Diese drei Wege sind keine Erfindung dieser App. Sie entsprechen dem <strong>Resist–Accept–Direct</strong>-Rahmen, mit dem der US-amerikanische National Park Service Ökosysteme im Klimawandel steuert. Sein Bild dafür ist ein Segelboot: <em>Resist</em> heißt Motor an und gegen den Wind zurück in den Heimathafen. <em>Accept</em> heißt Segel runter und treiben lassen. <em>Direct</em> heißt den Wind nutzen, um einen neuen, besseren Zielort anzusteuern.',
      'rad.body2': 'Der entscheidende Punkt: <em>Direct</em> zielt ausdrücklich auf „bevorzugte <strong>neue</strong> Zustände“ — nicht auf historische. Genau dort liegt die Anpassungshypothese dieses Projekts, und genau dort liegt der Unterschied zwischen konservativem und progressivem Walddenken: Der eine Weg misst Erfolg am Vorzustand, der andere an der Überlebensfähigkeit unter künftigen Bedingungen.',
      'rad.source': 'Schuurman u.&nbsp;a. (2022): <em>Navigating Ecological Transformation: Resist–Accept–Direct as a Path to a New Resource Management Paradigm</em>, BioScience 72(1) — sowie das RAD-Entscheidungsrahmenwerk des National Park Service.',
      'scenarios.mapTitle': 'Szenario durchspielen',
      'scenarios.scenAria': 'Szenario wählen',
      'scenarios.mapAria': 'Modellierter Bestand auf der Brandfläche',
      'scenarios.sliderAria': 'Jahre seit dem Brand',
      'scenarios.play': 'Abspielen',
      'scenarios.pause': 'Pause',
      'scenarios.yearLabel': 'Jahr {y}',
      'scenarios.canopy': 'Kronendeckung',
      'scenarios.density': 'Stammzahl',
      'scenarios.height': 'Höhe',
      'scenarios.dominant': 'Dominant',
      'scenarios.mapNote': 'Jeder Punkt steht für ein Stück Kronendach, nicht für einen Baum — deshalb wächst die Punktwolke stetig, während die Stammzahl im älteren Bestand sinkt: Aus vielen dünnen Bäumen werden wenige dicke.',

      'concept.title': 'Das Konzept',
      'concept.kicker': 'Was es ist',
      'concept.define': 'Ein offenes Werkzeug, das eine Waldbrandfläche danach lesbar macht, was dort von selbst wächst — und welcher Umgang damit zugleich <strong>klimaangepasst, wirtschaftlich zukunftsfähig und kohlenstoff-wirksam</strong> wäre. Nicht: Wie stellen wir den Vorzustand wieder her.',
      'concept.thesis': 'Der Wert einer Sukzession ist keine Eigenschaft der <em>Pflanze</em> — sondern der <em>Fläche</em>.',
      'concept.hsec3': 'Nicht wiederherstellen — weiterdenken',
      'concept.rethink.1': 'Wiederherstellung fragt: Wie bekommen wir zurück, was vorher da war? Auf einer Fläche, deren Vorzustand ein brandanfälliger Kiefernacker war, ist das die falsche Frage. Sinnvoller ist: <strong>Was wächst hier von selbst, und was lässt sich damit anfangen?</strong>',
      'concept.rethink.2': 'In einem Ökosystem gibt es keinen Abfall — jedes Produkt ist anderswo Eingangsstoff. Übertragen auf die Brandfläche heißt das: Die 13.590 Aspen pro Hektar, die dort ohne Zutun und ohne Kosten hochkommen, sind kein Ausfall. Es fehlt ihnen nur die Verwertungskette. Und eine fehlende Kette ist keine Eigenschaft des Baumes, sondern eine Entscheidung der Branche.',
      'concept.rethink.3': 'Die Zahlen stützen das deutlicher, als der Ruf der Pionierhölzer vermuten lässt. Nach den Ertragstafeln für Nordostdeutschland erreicht die Sand-Birke auf armem Sand im Alter 30 einen Vorrat in derselben Größenordnung wie die Kiefer auf vergleichbarem Standort — bei einer Baumart, die sich gratis selbst aussät, während die gepflanzte Kiefer nach fünf Jahren zu 85 % tot war. Die Robinie liefert das dauerhafteste Holz Europas und ersetzt im Außenbau Tropenholz und Druckimprägnat.',
      'concept.rethink.4': 'Am deutlichsten zeigt sich das an einer Lücke. Für die Kiefer stützt sich die Ertragstafel Nordostdeutschlands auf rund 1.500 Probeflächen, für die Sand-Birke auf 192. Für die Zitterpappel — die Baumart, die nach dem Brand tatsächlich dominiert — <strong>gibt es keine</strong>, und für ungleichaltrige Pionier-Mischbestände existiert überhaupt kein Ertragsmodell. Auch das Forschungsprojekt selbst hält fest, es habe „keine ökonomischen Untersuchungen“ gegeben.',
      'concept.rethink.5': 'Das ist kein Datenmangel, sondern ein Abdruck der Bewirtschaftungsgeschichte: <strong>Die Forstwissenschaft hat zweihundertfünfzig Jahre lang vermessen, was gepflanzt wurde.</strong> Was von selbst kommt, ist unvermessen geblieben — nicht weil es nichts leistet, sondern weil niemand es gezählt hat. Die fehlende Tafel ist damit selbst das stärkste Argument dafür, den Blick zu ändern.',
      'concept.rethink.limit': '<strong>Wo dieses Argument nicht hingehört:</strong> auf Schutzflächen, deren Zweck gerade die Nährstoffarmut und Offenheit ist — dort ist der Aufwuchs nicht Ertrag, sondern Verlust. Der Umdenk-Vorschlag zielt auf den gewöhnlichen Wirtschaftswald, von dem Brandenburg nach jedem Brandjahr reichlich hat.',
      'concept.hsec2': 'Wertekanon',
      'concept.canon.1': '<strong>Vorurteilsfrei.</strong> Bewertet wird Funktion, nicht Herkunft.',
      'concept.canon.2': '<strong>Kontext vor Dogma.</strong> Derselbe Baum ist Retter oder Verdränger — je nach Fläche.',
      'concept.canon.3': '<strong>Ehrlich über Grenzen.</strong> Permanenz, Homogenisierung, schwächster Datenpunkt offen.',
      'concept.canon.4': '<strong>Bewerten, nicht entscheiden.</strong> Das Werkzeug zeigt den Zielkonflikt; entscheiden Mensch und Fläche.'
    },
    en: {
      'lang.aria': 'Language',
      'nav.aria': 'Views',
      'mainnav.aria': 'Sections',

      'section.novel': 'Graphic Novel',
      'section.font': 'Font',
      'section.app': 'Adoption Scenarios',
      'loc.novel': 'Northwest Territories · Canada',
      'loc.font': 'AS Dehcho',
      'loc.app': 'Jüterbog · Brandenburg',

      'novel.kicker': 'Work in progress · Graphic novel',
      'novel.title': 'Fire on the Land',
      'novel.sub': 'Scientist Oliver Sonnentag lost his research tower to a 2022 wildfire at Scotty Creek — Canada’s first Indigenous-led research station. This graphic novel follows the race to rebuild it before snowmelt, with Dieter Cazon of the Liidlii Kue First Nation as guide and co-author.',
      'novel.status': 'Character studies · 170/180 script pages (v.2) · 70 storyboard pages',
      'novel.teamTitle': 'Team',
      'novel.team.oliver.role': 'Scientific advisor, protagonist',
      'novel.team.dom.role': 'Artist & illustrator',
      'novel.team.dieter.role': 'Traditional knowledge holder, Liidlii Kue First Nation',
      'novel.sampleTitle': 'Reading sample — Chapter 01',
      'novel.cta': 'Read the concept + sample chapter (PDF)',
      'novel.notify': 'Get notified when it’s out',
      'novel.photosTitle': 'From the research trip, 2023',
      'novel.pressTitle': 'In the press',
      'novel.press.cabin': 'On joining the team rebuilding the NWT research station',
      'novel.press.cbcArticle': 'The who, how and why of the tower rebuild',
      'novel.press.cbcRadio': 'Interview on the comic project',
      'novel.press.nasa': 'Featured in the ABoVE monthly newsletter',

      'font.kicker': 'Font · early test build',
      'font.title': 'AS Dehcho',
      'font.sub': 'A hand-lettered comic display face built for this project — carrying both Dehcho-region Dene orthography and speech-bubble lettering in one family. Not in active development right now, but already usable.',
      'font.linkSpecimen': 'Full specimen — diacritics, alternates, grawlixes',

      'app.kicker': 'Adoption Scenarios',
      'app.sub': 'Real post-fire sites where the questions from Fire on the Land get tested against actual data — starting with Jüterbog, Brandenburg.',

      'tab.composite': 'Composite',
      'tab.scorecard': 'Scorecard',
      'tab.measures': 'Measures',
      'tab.species': 'Species',
      'tab.scenarios': 'Scenarios',
      'tab.concept': 'Concept',

      'composite.kicker': 'What Fire on the Land is',
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
      'measures.sub': 'Structure, not species, is the cheapest measure: slow the wind, make shade and dew, catch seed — but only the parts that don’t burn, stone and root plates, are actually reburn-resilient; dry deadwood is fuel again, not shelter, once fire returns.',
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
      'tag.Wiederaustrieb': 'Resprouting',

      'species.title': 'Species',
      'species.sub': 'What actually returns to Brandenburg sand after fire — species and figures from the PYROPHOB research project (Treuenbrietzen and Jüterbog).',
      'crit.aria': 'Choose a criterion',
      'crit.Wind': 'Stabilize wind',
      'crit.Stickstoff': 'Build nitrogen',
      'crit.Bestaeuber': 'Support pollinators',
      'crit.Pionier': 'Fast pioneer colonization',
      'crit.Wiederaustrieb': 'Resprouts after fire',
      'site.aria': 'Choose site status',
      'site.nsg': 'Protected area (Jüterbog)',
      'site.open': 'Site without protected status',
      'site.nsgNote': 'The anchor site is a nature reserve and Natura 2000 area with protected <strong>nutrient-poor</strong> habitat types. Introducing non-native species there requires a permit under § 40 of the German Federal Nature Conservation Act — and that permit <em>must be refused</em> where harm cannot be ruled out. The Federal Agency for Nature Conservation advises against it for nature reserves and Natura 2000 sites generally. The generator therefore proposes native species only.',
      'site.openNote': 'Without protected status the § 40 restriction falls away and non-native species become available. That turns the mix into a <em>hypothesis</em>: whether it performs better than a native one has not been measured on these sites.',
      'site.excludedTitle': 'Excluded on this site:',
      'site.excludedBody': '{n} non-native species ({list}) — not because of where they come from, but because the protection goal here is nutrient poverty and introduction is legally restricted.',
      'hypo.kicker': 'Hypothesis, not finding',
      'hypo.title': 'Can neophytes be part of climate adaptation?',
      'hypo.body': 'Black locust yields Europe’s most durable timber, roots deeply, tolerates heat and drought and fixes nitrogen — as an adaptation candidate on poor sand it deserves to be taken seriously. <strong>But nothing here proves it.</strong> The underlying measurements compare treatment <em>methods</em> — clearing, ploughing, planting, doing nothing — not origins. Not one measurement from these sites tests whether non-native species deliver better climate adaptation.',
      'hypo.counter': 'Against it: on nutrient-poor protected land, nitrogen fixation is precisely the problem, because it removes the habitat that is meant to be protected. And the accepted route of forestry climate adaptation does not run through foreign species but through <strong>provenance selection within native species</strong> — drought-tested origins of sessile oak or Scots pine, for instance.',
      'hypo.quantifiable': 'One point argues for testing black locust in particular: it is the only candidate for which a <strong>yield table for Brandenburg exists</strong> — Lockow &amp; Lockow (2015), explicitly down to the “rather poor” nutrient class, with increment culminating around year 35. Its yield would therefore be checkable, whereas for the spontaneously dominant aspen it cannot be calculated at all for lack of data.',
      'hypo.test': 'The thesis would be testable on a site without protected status, black locust against a native control, over at least ten years. No such trial exists as things stand.',
      'foot.credit': 'Sentinel-2 · Copernicus · PYROPHOB',
      'foot.legal': 'Imprint & Privacy',
      'species.source': 'Regeneration figures from the PYROPHOB research project: final volume <em>Eberswalder Forstliche Schriftenreihe</em> vol. 77 (LFE Brandenburg, 2024) and Schüle et al., <em>Vegetationsentwicklung nach Waldbrand</em> (EFS 73) — the aspen density of 13,590/ha comes from the 200-plot grid survey at Treuenbrietzen in 2020 (master’s theses Domes &amp; Schwanitz); the final volume reports 6,289/ha for its 15 study sites. Site data after the Forst Zinna–Jüterbog–Keilberg nature reserve ordinance and FloraWeb.',
      'origin.native': 'Native',
      'origin.neo': 'Neophytes',
      'origin.archaeo': 'Archaeophytes',
      'mix.rationale': 'Criteria: {criteria}. Fire on the Land suggests this mix: {parts}.',
      'mix.baseline': 'Default mix for the whole site',
      'unit.native.one': 'native pioneer',
      'unit.native.many': 'native pioneers',
      'unit.neo.one': 'neophyte',
      'unit.neo.many': 'neophytes',
      'unit.archaeo.one': 'archaeophyte',
      'unit.archaeo.many': 'archaeophytes',
      'speciesMap.aria': 'Generated mix illustratively placed on the Sentinel composite',
      'speciesMap.caption': 'Illustrative placement — not real site data.',
      'list.allTitle': 'All species',

      'scenarios.kicker': 'Illustrative model',
      'scenarios.title': 'Three paths after the fire',
      'scenarios.sub': 'How Jüterbog’s burn scar could recover under different strategies — prepared scenarios, not a live simulation.',
      'scenarios.chartAria': 'Line chart: modelled recovery over 30 years for three strategies',
      'scenarios.caption.forest': 'Afforestation index (%) over years since the fire',
      'scenarios.caption.open': 'Open-habitat condition (%) over years since the fire',
      'scenarios.measured': 'measured',
      'scenarios.modelled': 'modelled',
      'target.aria': 'Choose target state',
      'target.forest': 'Target: closed forest',
      'target.open': 'Target: open sand heath',
      'target.forestNote': 'Measured against the unburned pine forest next door: 80% canopy cover, about 20 m height. Both have to hold — tall single trees without cover are not a forest, and dense low growth without height is not either.',
      'target.openNote': 'For the site’s protected habitat types — silver-grass swards on inland dunes, sand heaths — openness is the goal. What is measured is therefore <strong>freedom from woody encroachment</strong>: management plans rate such areas as degraded from roughly 30% shrub cover. Same data, same site, opposite verdict — here the fire did not destroy, it reset. <em>Caveat:</em> only encroachment is captured, not the presence of the characteristic species, which take years and are not modelled here. The measured uncertainty band applies to the forest target only and is therefore hidden.',
      'scenarios.note': 'Measured by PYROPHOB at Jüterbog to year 3–4, modelled after that (heights following the yield tables for silver birch and Scots pine). Not a live simulation. Real recovery depends on seed trees, browsing, weather and repeat fires.',
      'scenario.pine': 'Replant pine',
      'scenario.pine.note': 'The measured disappointment: after five years 14.7% of the planted pines were still alive, with “practically no height growth”. What actually built biomass on that plot was spontaneous aspen — the planting accounted for 0.8%. Only with replanting does a canopy eventually close (solid line); the dashed line is the course actually measured, without replanting.',
      'scenario.passive': 'Left alone',
      'scenario.passive.note': 'At Jüterbog the least predictable route — hence the wide band: two plots in the same burn scar differ by a factor of 20, depending on whether seed trees survived. Add pure sand, no hunting and browsing everywhere. It costs nothing, but guarantees nothing either.',
      'scenario.assisted': 'Assist, don’t plant',
      'scenario.assisted.note': 'Don’t clear — sow instead: sown oak survived at over 99%, planted pine at 14.7%. Young oaks even stopped a fire in 2018. The weakest evidence base of the three — no PYROPHOB plot combines “don’t clear” with sowing, so this is a reasoned synthesis.',
      'rad.kicker': 'The framework behind it',
      'rad.title': 'Resist · Accept · Direct',
      'rad.resist': 'Resist',
      'rad.accept': 'Accept',
      'rad.direct': 'Direct',
      'rad.body': 'These three paths are not this app’s invention. They match the <strong>Resist–Accept–Direct</strong> framework the US National Park Service uses to steward ecosystems under climate change. Its own image for it is a sailboat: <em>Resist</em> means running the engine against the wind to get back to the home port. <em>Accept</em> means dropping the sails and going where the wind takes you. <em>Direct</em> means using the wind to steer for a new, better destination.',
      'rad.body2': 'The decisive point: <em>Direct</em> explicitly aims at “preferred <strong>new</strong> conditions” — not historical ones. That is exactly where this project’s adaptation hypothesis sits, and exactly where conservative and progressive forest thinking part ways: one measures success against the previous state, the other against survivability under future conditions.',
      'rad.source': 'Schuurman et al. (2022): <em>Navigating Ecological Transformation: Resist–Accept–Direct as a Path to a New Resource Management Paradigm</em>, BioScience 72(1) — together with the National Park Service RAD decision framework.',
      'scenarios.mapTitle': 'Play a scenario',
      'scenarios.scenAria': 'Choose a scenario',
      'scenarios.mapAria': 'Modelled stand on the burn scar',
      'scenarios.sliderAria': 'Years since the fire',
      'scenarios.play': 'Play',
      'scenarios.pause': 'Pause',
      'scenarios.yearLabel': 'Year {y}',
      'scenarios.canopy': 'Canopy cover',
      'scenarios.density': 'Stems',
      'scenarios.height': 'Height',
      'scenarios.dominant': 'Dominant',
      'scenarios.mapNote': 'Each dot stands for a piece of canopy, not for a single tree — which is why the dots keep filling in while the stem count falls in the older stand: many thin trees become a few thick ones.',

      'concept.title': 'The concept',
      'concept.kicker': 'What it is',
      'concept.define': 'An open tool that makes a wildfire site legible in terms of what grows there on its own — and which way of working with that would be at once <strong>climate-adapted, economically future-proof and carbon-effective</strong>. Not: how do we restore the previous state.',
      'concept.thesis': 'The value of a succession is not a property of the <em>plant</em> — but of the <em>site</em>.',
      'concept.hsec3': 'Not restoration — rethinking',
      'concept.rethink.1': 'Restoration asks: how do we get back what was here before? On a site whose previous state was a fire-prone pine field, that is the wrong question. The better one is: <strong>what grows here on its own, and what can be done with it?</strong>',
      'concept.rethink.2': 'An ecosystem produces no waste — every output is an input somewhere else. Applied to the burn scar: the 13,590 aspen per hectare that come up there unaided and at no cost are not a failure. What they lack is a supply chain. And a missing chain is not a property of the tree, it is a decision of the industry.',
      'concept.rethink.3': 'The figures support this more clearly than the reputation of pioneer timber suggests. According to the yield tables for northeast Germany, silver birch on poor sand reaches a standing volume at age 30 of the same order as pine on comparable ground — from a species that seeds itself for free, while the planted pine was 85% dead after five years. Black locust yields Europe’s most durable timber and replaces tropical hardwood and pressure-treated pine in outdoor construction.',
      'concept.rethink.4': 'The clearest evidence is an absence. The yield table for pine in northeast Germany rests on some 1,500 sample plots, the one for silver birch on 192. For aspen — the species that actually dominates after the fire — <strong>there is none</strong>, and for uneven-aged pioneer mixtures no yield model exists at all. The research project itself records that it carried out “no economic investigations”.',
      'concept.rethink.5': 'That is not a data gap but a fingerprint of management history: <strong>forestry science spent two and a half centuries measuring what it planted.</strong> What arrives on its own has stayed unmeasured — not because it yields nothing, but because nobody counted it. The missing table is therefore itself the strongest argument for changing the view.',
      'concept.rethink.limit': '<strong>Where this argument does not belong:</strong> on protected sites whose very purpose is nutrient poverty and openness — there the growth is not yield but loss. The rethinking proposed here targets ordinary commercial forest, of which Brandenburg has plenty after every fire year.',
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
    renderSpeciesMap();
    renderScenarios();
    if (appbarSite) appbarSite.textContent = t(LOC_KEY[curSection]);
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
    scenarios: document.getElementById('view-scenarios'),
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
    if (target === 'scenarios') renderScenarios();
    if (target === 'species') { renderSpecies(); renderSpeciesMix(); renderSpeciesMap(); }
  }

  tabs.forEach(function (t2) {
    t2.addEventListener('click', function () { show(t2.dataset.target); });
  });

  /* ---------------------------------------------------------
     Navigation (main sections: Graphic Novel / Font / Adoption Scenarios)
     --------------------------------------------------------- */
  var mainnavBtns = slice(document.querySelectorAll('.mainnav-btn'));
  var mainSections = {
    novel: document.getElementById('view-novel'),
    font: document.getElementById('view-font'),
    app: document.getElementById('view-app')
  };
  var subtabbar = document.getElementById('subtabbar');
  var appbarSite = document.getElementById('appbar-site');
  var LOC_KEY = { novel: 'loc.novel', font: 'loc.font', app: 'loc.app' };
  var curSection = 'novel';

  function showSection(target) {
    curSection = target;
    Object.keys(mainSections).forEach(function (k) {
      mainSections[k].hidden = (k !== target);
    });
    mainnavBtns.forEach(function (b) {
      var on = b.dataset.section === target;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    if (subtabbar) subtabbar.hidden = (target !== 'app');
    if (appbarSite) appbarSite.textContent = t(LOC_KEY[target]);
  }

  mainnavBtns.forEach(function (b) {
    b.addEventListener('click', function () { showSection(b.dataset.section); });
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
    { v: 'ctx',
      axis: { de: 'Kühlung & Brandrisiko', en: 'Cooling & fire risk' },
      pine: { de: 'Höchste gemessene Wärmefreisetzung aller mitteleuropäischen Streuarten, dazu tiefe Beastung als Leiterbrennstoff — dichte Bestände unter 40 Jahren gelten als vollfeuerfähig.',
              en: 'The highest measured heat release of any Central European litter type, plus low branching as ladder fuel — dense stands under 40 years are rated fully fire-capable.' },
      neo: { de: 'Laubstreu hält mehr Feuchte und senkt in Mischung die Brandintensität — aber Brandenburgs Forstbehörde stuft ausgerechnet Birke, Aspe und Robinie als ausdrücklich nicht brandhemmend ein: lichte Kronen, trockene Bodenvegetation, brennbare Rinde. Belegt ist ein Riegeleffekt bislang nur für die Rot-Eiche.',
             en: 'Broadleaf litter holds more moisture and lowers fire intensity in mixture — but Brandenburg’s forest authority rates birch, aspen and black locust of all things as explicitly not fire-inhibiting: open crowns, dry ground vegetation, flammable bark. A genuine firebreak effect is so far documented only for red oak.' } },
    { v: 'split',
      axis: { de: 'Wirtschaftl. Verwertung', en: 'Economic use' },
      pine: { de: 'Große Holzmengen und eine eingespielte Kette — der Vorsprung liegt in der Infrastruktur, nicht im Holz.',
              en: 'Large volumes and a well-oiled supply chain — the advantage lies in the infrastructure, not the timber.' },
      neo: { de: 'Robinie: dauerhaftestes Holz Europas, ersetzt Tropenholz und Druckimprägnat. Birke: Sperrholz und Möbel, in Finnland längst Standard. Was fehlt, ist hier die Kette, nicht der Rohstoff.',
             en: 'Black locust: Europe’s most durable timber, replacing tropical hardwood and pressure-treated pine. Birch: plywood and furniture, long standard in Finland. What is missing here is the chain, not the raw material.' } },
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

  function drawCompositeOn(targetCanvas, yr, yg, yb) {
    if (!targetCanvas || !tilesReady || !tileCache[yr] || !tileCache[yg] || !tileCache[yb]) return false;
    var r = tileCache[yr].data, g = tileCache[yg].data, b = tileCache[yb].data;
    var ctx = targetCanvas.getContext('2d');
    var out = ctx.createImageData(targetCanvas.width, targetCanvas.height);
    var px = out.data;
    for (var i = 0; i < px.length; i += 4) {
      px[i]     = r[i];   // grayscale NBR PNG → R=G=B=value at index i
      px[i + 1] = g[i];
      px[i + 2] = b[i];
      px[i + 3] = 255;
    }
    ctx.putImageData(out, 0, 0);
    return true;
  }

  function renderComposite() {
    if (!canvas || views.composite.hidden) return;
    drawCompositeOn(canvas, +selR.value, +selG.value, +selB.value);
  }

  Promise.all(TILE_YEARS.map(loadTile)).then(function () {
    tilesReady = true;
    renderComposite();
    renderSpeciesMap();
    renderScenarioMap();
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
      t: { de: 'Totholz- und Reisighaufen als [[ammenstruktur|Ammenstrukturen]]: Schatten, Feuchtinseln, Habitat.',
           en: 'Deadwood and brush piles as [[ammenstruktur|nurse structures]]: shade, moisture islands, habitat.' } },
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
      t: { de: '[[riegel|Waldbrandriegel]] 40–50 m breit, quer zur Hauptwindrichtung. Wirksamste Art ist die Rot-Eiche; wo sie nicht anwächst, trägt auch ein Riegel aus Kiefer — dann über die Bestandesstruktur statt über die Baumart, was besonders konsequente Pflege verlangt.',
           en: '[[riegel|Firebreak strips]] 40–50 m wide, across the prevailing wind. Red oak is the most effective species; where it will not establish, a pine firebreak also works — then carried by stand structure rather than species, which demands especially rigorous tending.' } },
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
      t: { de: 'Totholz stehend/liegend als [[ammenstruktur|Ammenstruktur]], Windbremse und Schatten lassen — nicht kahlräumen.',
           en: 'Leave deadwood standing or lying as [[ammenstruktur|nurse structure]], windbreak and shade — don’t clear-cut.' } },
    { a: 'forst', tags: ['Wind', 'Streu'],
      t: { de: 'Schlagreisig flächig auslegen (lop-and-scatter): Wind bremsen, Feuchte halten, Natursaat fangen.',
           en: 'Spread slash across the area (lop-and-scatter): slow the wind, hold moisture, catch natural seed.' } },
    { a: 'forst', tags: ['Schatten', 'Streu'],
      t: { de: 'Zwei-Phasen: Pionier-[[naturverjuengung|Naturverjüngung]] (Birke/Zitterpappel) als Amme, Zielbaumart darunter etablieren.',
           en: 'Two-phase: pioneer [[naturverjuengung|natural regeneration]] (birch/aspen) as nurse, establish the target species beneath.' } },
    { a: 'forst', tags: ['Feuer', 'Schatten'],
      t: { de: 'Leiterbrennstoffe unterbrechen: Bestände auflockern, tiefe Beastung ästen, Kronenschluss zum Boden vermeiden. Struktur senkt das Risiko nachweisbarer als die Baumartenwahl.',
           en: 'Break up ladder fuels: thin stands, prune low branches, avoid canopy running to the ground. Structure lowers risk more demonstrably than species choice does.' } },
    { a: 'forst', tags: ['Wind', 'Kohlenstoff'],
      t: { de: 'Erosionsgefährdete Brandnarben mit Stroh-/Geotextil-Rastern fixieren; Kohlenstoff nach LSR bewerten.',
           en: 'Fix erosion-prone burn scars with straw/geotextile grids; assess carbon per LSR.' } }
  ];
  var TAGCLASS = { Wind: 'p', Schatten: 'p', Tau: 'n', Streu: 'n', Feuer: 'a', Kohlenstoff: 'a',
    Trockenheit: 'p', Sandboden: 'p', Pionier: 'n', Stickstoff: 'n', Bestaeuber: 'a',
    Wiederaustrieb: 'a' };
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
        li.querySelector('p').innerHTML = withGlossary(pick(m.t));
        bindGloss(li);
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
    /* --- die dokumentierten Hauptakteure der Naturverjüngung (PYROPHOB) --- */
    { id: 'zitterpappel', name: { de: 'Zitterpappel', en: 'Aspen' }, latin: 'Populus tremula',
      origin: 'native', tags: ['Pionier', 'Sandboden', 'Wiederaustrieb'],
      t: { de: 'Die dominante Art der Brandenburger Brandflächen: 13.590 Pflanzen/ha zwei Jahre nach dem Brand in Treuenbrietzen — 89 % aller Bäume. Treibt aus Wurzelbrut und überstand auch den Zweitbrand 2022.',
           en: 'The dominant species on Brandenburg burn scars: 13,590 plants/ha two years after the Treuenbrietzen fire — 89% of all trees. Resprouts from root suckers and survived the 2022 second fire too.' } },
    { id: 'sandbirke', name: { de: 'Sandbirke', en: 'Silver birch' }, latin: 'Betula pendula',
      origin: 'native', tags: ['Pionier', 'Sandboden', 'Trockenheit', 'Wiederaustrieb'],
      t: { de: 'Windverbreiteter Pionier auf blankem Mineralboden, 660 Pflanzen/ha nach zwei Jahren und mit rund 1 m im dritten Jahr die höchste Art. Ein zweites Feuer verträgt sie schlecht: minus 82,5 %.',
           en: 'Wind-dispersed pioneer on bare mineral soil, 660 plants/ha after two years and the tallest species at roughly 1 m in year three. It takes a second fire badly: minus 82.5%.' } },
    { id: 'waldkiefer', name: { de: 'Waldkiefer', en: 'Scots pine' }, latin: 'Pinus sylvestris',
      origin: 'native', tags: ['Trockenheit', 'Sandboden', 'Pionier'],
      t: { de: 'Die Kulturkiefer Brandenburgs selbst. Bemerkenswert: natürlich angeflogene Kiefern überlebten zu 91–100 %, gepflanzte nur zu 23–40 %. Im Reinbestand bleibt sie die brandanfällige Monokultur, die Fire on the Land hinterfragt.',
           en: 'Brandenburg’s cultivated pine itself. Notably: naturally seeded pines survived at 91–100%, planted ones at only 23–40%. In monoculture it stays the fire-prone stand Fire on the Land questions.' } },
    { id: 'salweide', name: { de: 'Salweide', en: 'Goat willow' }, latin: 'Salix caprea',
      origin: 'native', tags: ['Pionier', 'Bestaeuber'],
      t: { de: 'Fernbesiedler mit flugfähigen Samen, 104 Pflanzen/ha nach zwei Jahren. Früheste Bienenweide des Jahres — verliert nach einem Zweitbrand aber knapp 60 % ihrer Bestände.',
           en: 'Long-distance coloniser with airborne seed, 104 plants/ha after two years. The year’s earliest bee forage — but loses nearly 60% of its stems to a second fire.' } },
    { id: 'traubeneiche', name: { de: 'Traubeneiche', en: 'Sessile oak' }, latin: 'Quercus petraea',
      origin: 'native', tags: ['Trockenheit', 'Sandboden', 'Wiederaustrieb'],
      t: { de: 'Namensgeberin des Pyrophobizitäts-Effekts: Ein 10–15-jähriger Eichenbestand stoppte 2018 in Treuenbrietzen das Feuer. Von allen gepflanzten Arten die einzige, die auf der Brandfläche wirklich anwuchs.',
           en: 'Namesake of the “pyrophobicity” effect: a 10–15-year-old oak stand stopped the 2018 Treuenbrietzen fire. Of all planted species, the only one that genuinely established on the burn scar.' } },

    /* --- Heide, Sandtrockenrasen, Bodenvegetation --- */
    { id: 'besenheide', name: { de: 'Besenheide', en: 'Heather' }, latin: 'Calluna vulgaris',
      origin: 'native', tags: ['Trockenheit', 'Sandboden', 'Bestaeuber'],
      t: { de: 'Namensgebend für den Schutzzweck des Gebiets („Sandheiden mit Besenheide auf Binnendünen“). Ihre Samen überdauern Jahrzehnte im Boden und keimen nach Feuer — die klassische Heide-Regeneration.',
           en: 'Namesake of the reserve’s protection goal (“sand heaths with heather on inland dunes”). Its seed survives decades in the soil and germinates after fire — classic heathland regeneration.' } },
    { id: 'silbergras', name: { de: 'Silbergras', en: 'Grey hair-grass' }, latin: 'Corynephorus canescens',
      origin: 'native', tags: ['Trockenheit', 'Sandboden', 'Wind'],
      t: { de: 'Leitgras offener Binnendünen und Extremspezialist für nährstoffarmen Sand. Auf der Jüterboger Brandfläche nimmt es stetig zu — im fünften Jahr rund 4 % Deckung.',
           en: 'Signature grass of open inland dunes and an extreme specialist for nutrient-poor sand. On the Jüterbog burn scar it increases steadily — about 4% cover by year five.' } },
    { id: 'sandsegge', name: { de: 'Sand-Segge', en: 'Sand sedge' }, latin: 'Carex arenaria',
      origin: 'native', tags: ['Sandboden', 'Wind', 'Wiederaustrieb'],
      t: { de: 'Treibt nach dem Feuer aus tiefen Rhizomen wieder aus und vernetzt offenen Sand unterirdisch — eine der Arten, die von der Brandfläche nie ganz verschwindet.',
           en: 'Resprouts from deep rhizomes after fire and knits open sand together below ground — one of the species that never quite disappears from a burn scar.' } },
    { id: 'drahtschmiele', name: { de: 'Drahtschmiele', en: 'Wavy hair-grass' }, latin: 'Deschampsia flexuosa',
      origin: 'native', tags: ['Sandboden', 'Streu', 'Wiederaustrieb'],
      t: { de: 'Dominierendes Gras der Sukzession in Jüterbog. Seine Rückkehr gilt als Zeichen, dass sich die typische Kiefernwald-Bodenvegetation wieder einstellt.',
           en: 'The dominant grass of the Jüterbog succession. Its return is read as a sign that typical pine-forest ground vegetation is re-establishing.' } },
    { id: 'landreitgras', name: { de: 'Land-Reitgras', en: 'Wood small-reed' }, latin: 'Calamagrostis epigejos',
      origin: 'native', tags: ['Sandboden', 'Wiederaustrieb'],
      t: { de: 'Gilt als Vergrasungs-Problemart — auf den Jüterboger Wildnisflächen ausdrücklich nicht: Nach fünf Jahren stand es im Wesentlichen dort, wo es schon vor dem Brand stand. Ein Beispiel gegen vorschnelle Bekämpfung.',
           en: 'Reputed to choke regeneration — explicitly not so on the Jüterbog wilderness plots: after five years it largely stayed where it already grew before the fire. A case against pre-emptive control.' } },
    { id: 'adlerfarn', name: { de: 'Adlerfarn', en: 'Bracken' }, latin: 'Pteridium aquilinum',
      origin: 'native', tags: ['Pionier', 'Trockenheit', 'Sandboden', 'Wiederaustrieb'],
      t: { de: 'Erstbesiedler brandenburgischer Brandflächen — das tiefe Rhizom übersteht das Feuer. Nach dem Zweitbrand 2022 eine der Arten mit den höchsten Deckungsgraden.',
           en: 'A first colonist of Brandenburg burn scars — its deep rhizome survives the fire. After the 2022 second fire, one of the highest-cover species.' } },
    { id: 'weidenroeschen', name: { de: 'Schmalblättriges Weidenröschen', en: 'Rosebay willowherb' }, latin: 'Chamaenerion angustifolium',
      origin: 'native', tags: ['Pionier', 'Bestaeuber'],
      t: { de: 'Stickstoffzeiger, der den Nährstoffschub nach dem Brand nutzt. Nach dem Zweitbrand 2022 eine der Arten mit den höchsten Deckungsgraden — und eine ergiebige Bienenweide.',
           en: 'Nitrogen indicator that exploits the post-fire nutrient flush. One of the highest-cover species after the 2022 second fire — and rich bee forage.' } },
    { id: 'sandstrohblume', name: { de: 'Sandstrohblume', en: 'Immortelle' }, latin: 'Helichrysum arenarium',
      origin: 'native', tags: ['Trockenheit', 'Sandboden', 'Bestaeuber'],
      t: { de: 'Charakterart der Sandtrockenrasen und lichten Kiefern-Trockenwälder Brandenburgs, wichtige Nektarquelle für Wildbienen und Falter.',
           en: 'Signature species of Brandenburg’s dry sandy grasslands and open dry pine woods, a key nectar source for wild bees and moths.' } },
    { id: 'brennnessel', name: { de: 'Brennnessel', en: 'Stinging nettle' }, latin: 'Urtica dioica',
      origin: 'native', tags: ['Pionier', 'Bestaeuber'],
      t: { de: 'Nährstoffzeiger auf Ascheflecken und alten Lagerplätzen — auf magerem Sand nur punktuell, nie flächig. Raupenfutter für zahlreiche Schmetterlingsarten.',
           en: 'Nutrient indicator on ash patches and old camp sites — only ever patchy on poor sand, never widespread. Caterpillar food for numerous butterfly species.' } },
    { id: 'besenginster', name: { de: 'Besenginster', en: 'Common broom' }, latin: 'Cytisus scoparius',
      origin: 'native', tags: ['Stickstoff', 'Trockenheit', 'Sandboden', 'Pionier'],
      t: { de: 'Stickstofffixierender Heidestrauch, dessen hartschalige Samen jahrzehntelang keimfähig bleiben und deren Keimruhe Feuer bricht. Auf den PYROPHOB-Flächen trat er allerdings nicht in Erscheinung.',
           en: 'Nitrogen-fixing heathland shrub whose hard-coated seed stays viable for decades, with dormancy broken by fire. On the PYROPHOB plots, however, it did not appear.' } },
    { id: 'wacholder', name: { de: 'Wacholder', en: 'Common juniper' }, latin: 'Juniperus communis',
      origin: 'native', tags: ['Trockenheit', 'Sandboden', 'Wind'],
      t: { de: 'Sandheide-Nadelstrauch auf magerstem Boden — extrem trockenheitsfest, langsam, aber dauerhaft. In Brandenburg zerstreut, nicht flächenprägend.',
           en: 'Sand-heath conifer on the poorest ground — extremely drought-hardy, slow but persistent. Scattered in Brandenburg rather than landscape-forming.' } },
    { id: 'sanddorn', name: { de: 'Sanddorn', en: 'Sea buckthorn' }, latin: 'Hippophae rhamnoides',
      origin: 'native', tags: ['Stickstoff', 'Trockenheit', 'Wind'],
      t: { de: 'An Brandenburgs Böschungen und Tagebaukippen weit verbreitet, dort aber eingebürgert statt ursprünglich — natürlich wächst er an Küstendünen und Alpenflüssen. Er ist kalkhold, der Jüterboger Flugsand dagegen sauer; und als Stickstofffixierer wäre er auf geschütztem Magerland eher Problem als Lösung.',
           en: 'Widespread on Brandenburg’s embankments and reclaimed mine spoil, but naturalised there rather than original — its native ground is coastal dunes and alpine gravel rivers. It is lime-loving whereas Jüterbog’s drift sand is acidic; and as a nitrogen-fixer it would be a problem on protected nutrient-poor land, not a solution.' } },

    /* --- Neophyten: forstlich eingebracht oder selbst eingewandert --- */
    { id: 'robinie', name: { de: 'Robinie', en: 'Black locust' }, latin: 'Robinia pseudoacacia',
      origin: 'neo', tags: ['Stickstoff', 'Trockenheit', 'Sandboden', 'Bestaeuber', 'Wiederaustrieb'],
      t: { de: 'Stickstofffixierende Pionierbaumart, treibt nach Feuer wieder aus und ist eine der ergiebigsten Bienenweiden Mitteleuropas. Auf geschütztem Magerland verdrängt ihr Stickstoffeintrag aber genau die Spezialisten, die dort hingehören.',
           en: 'Nitrogen-fixing pioneer tree, resprouts after fire and is one of Central Europe’s most productive bee-forage trees. On protected nutrient-poor land, though, its nitrogen input displaces exactly the specialists that belong there.' } },
    { id: 'roteiche', name: { de: 'Rot-Eiche', en: 'Red oak' }, latin: 'Quercus rubra',
      origin: 'neo', tags: ['Trockenheit', 'Sandboden', 'Wiederaustrieb'],
      t: { de: 'Nordamerikanische Eiche, in Brandenburg forstlich verbreitet. Gesät erreichte sie auf der Versuchsfläche 21.709 Pflanzen/ha und überstand den Zweitbrand teils über Stockausschlag — forstlich erfolgreich, naturschutzfachlich umstritten.',
           en: 'North American oak, widely used in Brandenburg forestry. Sown, it reached 21,709 plants/ha on the trial plot and partly survived the second fire by stump sprouting — a forestry success, contested in conservation terms.' } },
    { id: 'traubenkirsche', name: { de: 'Spätblühende Traubenkirsche', en: 'Black cherry' }, latin: 'Prunus serotina',
      origin: 'neo', tags: ['Sandboden', 'Pionier', 'Wiederaustrieb'],
      t: { de: 'Der Problem-Neophyt genau dieser Standorte: breitet sich auf sauren Sanden und in Kiefernforsten massiv aus, Brandenburg hat einen eigenen Managementleitfaden dafür. Rückschnitt verstärkt sie eher, als dass er sie schwächt.',
           en: 'The problem neophyte of exactly these sites: spreads aggressively on acidic sands and through pine forests; Brandenburg has a dedicated management guideline for it. Cutting back tends to strengthen rather than weaken it.' } },
    { id: 'essigbaum', name: { de: 'Essigbaum', en: 'Staghorn sumac' }, latin: 'Rhus typhina',
      origin: 'neo', tags: ['Trockenheit', 'Sandboden', 'Wiederaustrieb'],
      t: { de: 'Nordamerikanischer Zierstrauch, der über Wurzelbrut ganze Klone bildet und trockene Sandstandorte erobert; er steht auf der Grauen Liste des Bundesamts für Naturschutz. Fällen löst massiven Wurzel- und Stockausschlag aus — dasselbe Muster wie bei der Aspe.',
           en: 'North American ornamental that forms entire clones via root suckers and takes over dry sandy sites; it is on the German federal conservation agency’s grey list. Felling triggers massive root and stump sprouting — the same pattern as aspen.' } },
    { id: 'schwarzkiefer', name: { de: 'Schwarzkiefer', en: 'Austrian pine' }, latin: 'Pinus nigra',
      origin: 'neo', tags: ['Trockenheit', 'Sandboden', 'Pionier'],
      t: { de: 'Südeuropäische Kiefer, als hitze- und trockenheitsresistenterer Ersatz für die heimische Kiefer erprobt. Anbau-Baumart, nicht Teil der Naturausstattung des Gebiets.',
           en: 'Southern European pine trialled as a more heat- and drought-resilient stand-in for the native pine. A planted timber species, not part of the site’s natural flora.' } },
    { id: 'douglasie', name: { de: 'Douglasie', en: 'Douglas fir' }, latin: 'Pseudotsuga menziesii',
      origin: 'neo', tags: ['Trockenheit', 'Sandboden'],
      t: { de: 'Nordamerikanischer Waldumbau-Baum, oft als Ersatz für die klimasensible Weißtanne getestet — trockenheitsfester, aber botanisch keine echte Tanne. Auf reinem Trockensand wüchsig grenzwertig.',
           en: 'North American forest-conversion tree, often trialled as a substitute for the climate-sensitive silver fir — more drought-hardy, though botanically not a true fir. Growth is marginal on pure dry sand.' } },
    { id: 'baumhasel', name: { de: 'Baumhasel', en: 'Turkish hazel' }, latin: 'Corylus colurna',
      origin: 'neo', tags: ['Trockenheit'],
      t: { de: 'Südosteuropäisch-westasiatische Klimabaumart mit 3–4 m tiefer Pfahlwurzel und breiter Standortamplitude — Versuchsbaum des Waldumbaus, keine Art der Brandflächen-Sukzession.',
           en: 'Southeast European / West Asian climate tree with a 3–4 m taproot and broad site tolerance — a forest-conversion trial species, not part of burn-scar succession.' } },

    /* --- Archäophyt: seit der Antike hier, weder heimisch noch Neophyt --- */
    { id: 'edelkastanie', name: { de: 'Edelkastanie', en: 'Sweet chestnut' }, latin: 'Castanea sativa',
      origin: 'archaeo', tags: ['Sandboden', 'Bestaeuber'],
      t: { de: 'Seit der Römerzeit nördlich der Alpen kultiviert und anders als die meisten Kulturbäume kalkmeidend — sie mag sauren Boden. Für die offene Brandfläche bleibt sie trotzdem zu anspruchsvoll: Sie braucht tiefgründigeren, frischeren Boden als reinen Flugsand.',
           en: 'Cultivated north of the Alps since Roman times and, unlike most orchard trees, lime-avoiding — it likes acidic ground. Still too demanding for the open burn scar: it needs deeper, moister soil than pure drift sand.' } }
  ];

  /* Image credits — fetched from Wikimedia Commons by
     scripts/fetch-species-images.mjs. Inlined rather than fetched so the
     page also works from file://. a = author, l = licence, u = licence URL,
     s = Commons file page. */
  var IMG_CREDITS = {
    zitterpappel: { a: 'Willow', l: 'CC BY-SA 2.5', u: 'https://creativecommons.org/licenses/by-sa/2.5', s: 'https://commons.wikimedia.org/wiki/File:Populus_tremula_004.jpg' },
    sandbirke: { a: 'Andrzej Otrębski', l: 'CC BY-SA 3.0', u: 'https://creativecommons.org/licenses/by-sa/3.0', s: 'https://commons.wikimedia.org/wiki/File:Chmielno_brzoza.jpg' },
    waldkiefer: { a: 'floranet', l: 'Public domain', u: '', s: 'https://commons.wikimedia.org/wiki/File:Illustration_Pinus_sylvestris0_new.jpg' },
    salweide: { a: 'Willow', l: 'CC BY 2.5', u: 'https://creativecommons.org/licenses/by/2.5', s: 'https://commons.wikimedia.org/wiki/File:Salix_caprea_036.jpg' },
    traubeneiche: { a: 'Franz Eugen Köhler, Köhler\'s Medizinal-Pflanzen', l: 'Public domain', u: '', s: 'https://commons.wikimedia.org/wiki/File:Quercus_petraea_-_K%C3%B6hler%E2%80%93s_Medizinal-Pflanzen-118.jpg' },
    besenheide: { a: 'Aqwis', l: 'CC BY-SA 3.0', u: 'https://creativecommons.org/licenses/by-sa/3.0', s: 'https://commons.wikimedia.org/wiki/File:CallunaVulgaris.jpg' },
    silbergras: { a: 'Alexis', l: 'CC BY 4.0', u: 'https://creativecommons.org/licenses/by/4.0', s: 'https://commons.wikimedia.org/wiki/File:Corynephorus_canescens_80318704.jpg' },
    sandsegge: { a: 'Christian Fischer', l: 'CC BY-SA 3.0', u: 'https://creativecommons.org/licenses/by-sa/3.0', s: 'https://commons.wikimedia.org/wiki/File:CarexArenaria.jpg' },
    drahtschmiele: { a: 'Stefan.lefnaer', l: 'CC BY-SA 4.0', u: 'https://creativecommons.org/licenses/by-sa/4.0', s: 'https://commons.wikimedia.org/wiki/File:Avenella_flexuosa_subsp._flexuosa_sl5.jpg' },
    landreitgras: { a: 'Christian Fischer', l: 'CC BY-SA 3.0', u: 'https://creativecommons.org/licenses/by-sa/3.0', s: 'https://commons.wikimedia.org/wiki/File:CalamagrostisEpigejos2.jpg' },
    adlerfarn: { a: 'Hans Hillewaert', l: 'CC BY-SA 4.0', u: 'https://creativecommons.org/licenses/by-sa/4.0', s: 'https://commons.wikimedia.org/wiki/File:Pteridium_aquilinum_(habitus).jpg' },
    weidenroeschen: { a: 'kallerna', l: 'CC BY-SA 3.0', u: 'https://creativecommons.org/licenses/by-sa/3.0', s: 'https://commons.wikimedia.org/wiki/File:Maitohorsma_(Epilobium_angustifolium).JPG' },
    sandstrohblume: { a: 'Fornax (Wikimedia Commons)', l: 'CC BY-SA 3.0', u: 'http://creativecommons.org/licenses/by-sa/3.0/', s: 'https://commons.wikimedia.org/wiki/File:Helichrysum_arenarium.jpg' },
    brennnessel: { a: 'Anghy (Wikimedia Commons)', l: 'CC BY-SA 3.0', u: 'http://creativecommons.org/licenses/by-sa/3.0/', s: 'https://commons.wikimedia.org/wiki/File:Brennnessel.jpg' },
    besenginster: { a: 'MPF (Wikimedia Commons)', l: 'CC BY-SA 3.0', u: 'http://creativecommons.org/licenses/by-sa/3.0/', s: 'https://commons.wikimedia.org/wiki/File:Cytisus_scoparius3.jpg' },
    wacholder: { a: 'Nikanos', l: 'CC BY-SA 2.5', u: 'https://creativecommons.org/licenses/by-sa/2.5', s: 'https://commons.wikimedia.org/wiki/File:L%C3%BCneburger_Heide_006.jpg' },
    sanddorn: { a: 'Svdmolen', l: 'CC BY-SA 3.0', u: 'http://creativecommons.org/licenses/by-sa/3.0/', s: 'https://commons.wikimedia.org/wiki/File:Hippophae_rhamnoides-01_(xndr).JPG' },
    robinie: { a: 'Pollinator at English Wikipedia', l: 'CC BY-SA 3.0', u: 'http://creativecommons.org/licenses/by-sa/3.0/', s: 'https://commons.wikimedia.org/wiki/File:Robina9146.JPG' },
    roteiche: { a: 'Ivan Ruggiero', l: 'CC BY-SA 4.0', u: 'https://creativecommons.org/licenses/by-sa/4.0', s: 'https://commons.wikimedia.org/wiki/File:Quercus_Rubra_Sambuy.jpg' },
    traubenkirsche: { a: 'Rasbak', l: 'CC BY-SA 3.0', u: 'http://creativecommons.org/licenses/by-sa/3.0/', s: 'https://commons.wikimedia.org/wiki/File:Amerikaanse_vogelkers_vruchten_(1)_Prunus_serotina.jpg' },
    essigbaum: { a: 'Dcoetzee (Wikimedia Commons)', l: 'CC BY-SA 3.0', u: 'http://creativecommons.org/licenses/by-sa/3.0/', s: 'https://commons.wikimedia.org/wiki/File:Rhus-typhina.JPG' },
    schwarzkiefer: { a: 'Fritz Geller-Grimm', l: 'CC BY-SA 2.5', u: 'https://creativecommons.org/licenses/by-sa/2.5', s: 'https://commons.wikimedia.org/wiki/File:Pinus_nigra_salzmannii_fg01.jpg' },
    douglasie: { a: 'Thomas Dreger , Suhl', l: 'CC BY-SA 3.0', u: 'http://creativecommons.org/licenses/by-sa/3.0/', s: 'https://commons.wikimedia.org/wiki/File:Pseudotsuga_menziesii_Schleus_Berg_Suhl_Th_Dreger.jpg' },
    baumhasel: { a: 'Orjen, Pavle Cikovac', l: 'CC BY-SA 3.0', u: 'https://creativecommons.org/licenses/by-sa/3.0', s: 'https://commons.wikimedia.org/wiki/File:Corylus_colurna_subadriatic_dinaric_mountains_Orjen_2.JPG' },
    edelkastanie: { a: 'Darkone', l: 'CC BY-SA 2.5', u: 'https://creativecommons.org/licenses/by-sa/2.5', s: 'https://commons.wikimedia.org/wiki/File:Edelkastanie_(Castanea_sativa)_1.jpg' }
  };

  var CRITERIA = ['Wiederaustrieb', 'Pionier', 'Stickstoff', 'Bestaeuber', 'Wind'];
  var MIX_MIN = 4, MIX_MAX = 7;
  var curCriteria = [];
  /* Flächen-Modus. Die Ankerfläche ist NSG und FFH-Gebiet mit geschützten
     nährstoffarmen Lebensraumtypen; dort ist das Ausbringen gebietsfremder
     Arten nach § 40 BNatSchG genehmigungspflichtig (Genehmigung IST zu
     versagen, wenn eine Gefährdung nicht auszuschließen ist), und das BfN rät
     für NSG/FFH generell davon ab. Der Generator muss diese Antwort geben
     können — sonst ist er ein Verkaufs-, kein Entscheidungsinstrument. */
  var curSite = 'nsg';
  function allowedSpecies() {
    if (curSite !== 'nsg') return SPECIES;
    return SPECIES.filter(function (sp) { return sp.origin === 'native'; });
  }

  function buildSpCard(sp) {
    var li = document.createElement('li');
    li.className = 'spcard';
    var tags = sp.tags.map(function (tg) {
      return '<span class="mtag ' + (TAGCLASS[tg] || 'p') + '">' + t('tag.' + tg) + '</span>';
    }).join('');
    var cr = IMG_CREDITS[sp.id];
    var figure = '';
    if (cr) {
      var licence = cr.u
        ? '<a href="' + cr.u + '" rel="noopener nofollow">' + cr.l + '</a>'
        : cr.l;
      figure = '<figure class="sp-fig">' +
        '<img src="./assets/species/' + sp.id + '.jpg" alt="" loading="lazy" width="320" height="320">' +
        '<figcaption class="sp-credit">' +
          '<a href="' + cr.s + '" rel="noopener nofollow">' + escapeHtml(cr.a) + '</a>' +
          '<br>' + licence +
        '</figcaption></figure>';
    }
    li.innerHTML = figure +
      '<div class="sp-body">' +
      '<div class="sp-head"><span class="sp-name"></span><span class="sp-latin"></span></div>' +
      '<p></p><div class="m-tags">' + tags + '</div></div>';
    li.querySelector('.sp-name').textContent = pick(sp.name);
    li.querySelector('.sp-latin').textContent = sp.latin;
    li.querySelector('p').innerHTML = withGlossary(pick(sp.t));
    bindGloss(li);
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
    var scored = allowedSpecies().map(function (sp, i) { return { sp: sp, i: i, score: scoreOne(sp, active) }; });
    scored.sort(function (a, b) { return b.score - a.score || a.i - b.i; });

    var matched = scored.filter(function (x) { return x.score > 0; });
    var pool = matched.length >= MIX_MIN ? matched : scored;
    var mix = pool.slice(0, MIX_MAX);
    if (mix.length < MIX_MIN) mix = pool.slice(0, MIX_MIN);

    ORIGINS.forEach(function (need) {
      if (mix.some(function (x) { return x.sp.origin === need; })) return;
      var candidate = scored.filter(function (x) { return x.sp.origin === need; })[0];
      // never force in a species that matches none of the chosen criteria —
      // a guaranteed slot must not become a wrong recommendation
      if (!candidate || candidate.score === 0) return;
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
      var names = curCriteria.map(function (c) { return t('crit.' + c); }).join(' · ');
      var parts = ORIGINS.filter(function (o) { return mix[o].length; })
        .map(function (o) {
          return mix[o].length + ' ' + t('unit.' + o + '.' + (mix[o].length === 1 ? 'one' : 'many'));
        }).join(', ');
      rationale.textContent = t('mix.rationale').replace('{criteria}', names).replace('{parts}', parts);
    } else {
      rationale.textContent = t('mix.baseline');
    }
    box.appendChild(rationale);

    // sichtbar machen, was der Flächenschutz ausschließt — nicht still weglassen
    if (curSite === 'nsg') {
      var barred = SPECIES.filter(function (sp) { return sp.origin !== 'native'; });
      var ex = document.createElement('p');
      ex.className = 'note excluded';
      ex.innerHTML = '<strong></strong> <span></span>';
      ex.querySelector('strong').textContent = t('site.excludedTitle');
      ex.querySelector('span').textContent = t('site.excludedBody')
        .replace('{n}', String(barred.length))
        .replace('{list}', barred.map(function (sp) { return pick(sp.name); }).join(', '));
      box.appendChild(ex);
    }

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

  /* ---------------------------------------------------------
     Species map — the generated mix placed illustratively on
     the real Sentinel composite. Positions are a deterministic
     hash of each species id (never Math.random — reproducible,
     screenshot-stable) and are NOT real planting coordinates;
     labelled as such (speciesMap.caption) per "ehrlich über
     Grenzen".
     --------------------------------------------------------- */
  var ORIGIN_DOT = { native: 'var(--pine)', neo: 'var(--neo)', archaeo: 'var(--accent)' };

  function hashPos(id) {
    var h = 0;
    for (var i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
    return {
      x: 10 + (h % 1000) / 1000 * 80,
      y: 12 + (Math.floor(h / 256) % 1000) / 1000 * 74
    };
  }

  function renderSpeciesMap() {
    var mapCanvas = document.getElementById('species-map-canvas');
    var pinLayer = document.getElementById('species-map-pins');
    if (!mapCanvas || !pinLayer) return;
    drawCompositeOn(mapCanvas, 2020, 2022, 2024);

    var mix = pickMix(curCriteria);
    var all = ORIGINS.reduce(function (acc, o) { return acc.concat(mix[o]); }, []);
    pinLayer.textContent = '';
    all.forEach(function (sp) {
      var pos = hashPos(sp.id);
      var pin = document.createElement('span');
      pin.className = 'sp-pin';
      pin.style.left = pos.x + '%';
      pin.style.top = pos.y + '%';
      pin.style.background = ORIGIN_DOT[sp.origin] || 'var(--accent)';
      pin.title = pick(sp.name);
      pinLayer.appendChild(pin);
    });
  }

  slice(document.querySelectorAll('.seg-btn[data-tag]')).forEach(function (b) {
    b.addEventListener('click', function () {
      var tag = b.dataset.tag;
      var idx = curCriteria.indexOf(tag);
      if (idx === -1) curCriteria.push(tag); else curCriteria.splice(idx, 1);
      renderSpeciesMix();
      renderSpeciesMap();
    });
  });

  slice(document.querySelectorAll('.site-btn')).forEach(function (b) {
    b.addEventListener('click', function () {
      curSite = b.dataset.site;
      slice(document.querySelectorAll('.site-btn')).forEach(function (x) {
        var on = x.dataset.site === curSite;
        x.classList.toggle('is-on', on);
        x.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      var note = document.getElementById('site-note');
      if (note) note.innerHTML = t('site.' + curSite + 'Note');
      renderSpeciesMix();
      renderSpeciesMap();
    });
  });

  /* ---------------------------------------------------------
     Scenarios (Szenarien) — illustrative, hand-authored recovery
     curves for three post-fire strategies. NOT a live simulation
     and not GUS output — clearly labelled as a prepared model
     (scenarios.note) so it's honest about what it is, matching
     the app's "ehrlich über Grenzen" value.
     --------------------------------------------------------- */
  var SCENARIO_YEARS = [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30];
  var MEASURED_UNTIL = 4;   // PYROPHOB misst in Jüterbog bis Jahr 4 — danach modelliert

  /* Wiederbewaldungsgrad = √( min(1, Kronendeckung/0,80) × min(1, Oberhöhe/20 m) ).
     Geometrisches Mittel, weil beides erfüllt sein muss: hohe Einzelbäume ohne
     Deckung sind kein Wald, dichter Niederwuchs ohne Höhe auch nicht. Genau
     dieser Unterschied trennt Jüterbog von Treuenbrietzen.
     Werte bis Jahr 3–4 aus PYROPHOB (EFS 77), danach modelliert; Höhen ab Jahr 10
     an den Ertragstafeln Sand-Birke (Lockow 1996) bzw. Kiefer (Lembcke u.a.). */
  var REF_CANOPY = 0.80, REF_HEIGHT = 20;
  /* Zwei legitime Zielzustände auf derselben Fläche — genau das, was der
     Leitsatz der App behauptet. Der Schutzzweck des Gebiets ist Offenland
     (Silbergrasfluren, Sandheiden), nicht geschlossener Wald; Kronendeckung
     ist dort kein Erfolg, sondern das Gegenteil.
       forest = Kronendeckung und Höhe gegen den unverbrannten Kiefernforst
       open   = Freiheit von Gehölzen; Managementpläne stufen Offenland-LRT
                ab etwa 30 % Verbuschung als verschlechtert ein */
  var WOODY_LIMIT = 0.30;
  var curTarget = 'forest';
  function recoveryOf(canopy, hgt) {
    if (curTarget === 'open') return Math.max(0, 1 - Math.min(1, canopy / WOODY_LIMIT));
    return Math.sqrt(Math.min(1, canopy / REF_CANOPY) * Math.min(1, hgt / REF_HEIGHT));
  }
  function curveOf(s) {
    return s.canopy.map(function (c, i) { return recoveryOf(c, s.hgt[i]); });
  }
  function altCurveOf(s) {
    if (!s.altCanopy) return null;
    return s.altCanopy.map(function (c, i) { return recoveryOf(c, s.altHgt[i]); });
  }

  var SCENARIOS = [
    { id: 'passive', color: 'var(--neo)', rad: 'accept',
      canopy: [0, .02, .06, .13, .20, .26, .32, .37, .40, .43, .46],
      hgt:    [0, 1.0, 2.6, 3.6, 4.6, 5.8, 6.9, 7.9, 8.2, 8.8, 9.3],
      dens:   [0, 1000, 1600, 2100, 2500, 2700, 2800, 2800, 2700, 2600, 2500],
      dom: ['silbergras', 'drahtschmiele', 'drahtschmiele', 'sandbirke', 'sandbirke',
            'sandbirke', 'sandbirke', 'sandbirke', 'sandbirke', 'sandbirke', 'sandbirke'],
      // gemessene Spannweite: Fläche V und Fläche Y liegen in derselben
      // Brandfläche um Faktor 20 auseinander
      band: { lo: [0, .02, .05, .09, .13, .16, .20, .22, .25, .26, .29],
              hi: [0, .07, .18, .31, .42, .52, .61, .67, .72, .75, .78] } },
    { id: 'pine', color: 'var(--pine)', rad: 'resist',
      canopy: [0, .01, .02, .08, .20, .42, .63, .79, .84, .88, .92],
      hgt:    [0, 0.25, 0.5, 1.0, 1.8, 2.6, 3.45, 4.25, 4.75, 5.6, 6.5],
      dens:   [0, 3000, 1300, 6500, 6200, 5900, 5600, 5400, 5200, 5000, 4800],
      dom: ['waldkiefer', 'waldkiefer', 'waldkiefer', 'waldkiefer', 'waldkiefer',
            'waldkiefer', 'waldkiefer', 'waldkiefer', 'waldkiefer', 'waldkiefer', 'waldkiefer'],
      // ohne Nachbesserungspflanzung — das ist der real gemessene Fall
      altCanopy: [0, .006, .012, .025, .06, .10, .15, .21, .28, .33, .385],
      altHgt:    [0, 0.2, 0.35, 0.6, 1.0, 1.5, 2.1, 2.7, 3.2, 3.6, 4.0] },
    { id: 'assisted', color: 'var(--accent)', rad: 'direct',
      canopy: [0, .05, .15, .28, .42, .51, .60, .67, .69, .72, .75],
      hgt:    [0, 1.2, 3.0, 4.2, 5.4, 6.4, 7.4, 8.3, 8.9, 9.9, 11.0],
      dens:   [0, 8000, 9000, 8500, 7800, 7200, 6700, 6300, 5900, 5600, 5300],
      dom: ['besenheide', 'zitterpappel', 'zitterpappel', 'sandbirke', 'sandbirke',
            'traubeneiche', 'traubeneiche', 'traubeneiche', 'traubeneiche', 'traubeneiche', 'traubeneiche'] }
  ];

  var SP_COLOR = {
    waldkiefer: 'var(--pine)', schwarzkiefer: 'var(--pine)', douglasie: 'var(--pine)', wacholder: 'var(--pine)',
    zitterpappel: 'var(--neo)', sandbirke: 'var(--neo)', salweide: 'var(--neo)',
    traubeneiche: 'var(--accent)', roteiche: 'var(--accent)', besenheide: 'var(--accent)',
    silbergras: 'var(--muted)', drahtschmiele: 'var(--muted)', landreitgras: 'var(--muted)'
  };

  function buildScenarioChart() {
    var W = 320, H = 200, padL = 28, padR = 4, padT = 12, padB = 18;
    var pw = W - padL - padR, ph = H - padT - padB;
    var n = SCENARIO_YEARS.length - 1;
    var maxYear = SCENARIO_YEARS[n];
    function xAt(i) { return padL + (i / n) * pw; }
    function xAtYear(y) { return padL + (y / maxYear) * pw; }
    function yAt(v) { return padT + (1 - v) * ph; }
    function ptsOf(arr) {
      return arr.map(function (v, i) { return xAt(i).toFixed(1) + ',' + yAt(v).toFixed(1); }).join(' ');
    }

    var grid = [0, 25, 50, 75, 100].map(function (pct) {
      var y = yAt(pct / 100);
      return '<line x1="' + padL + '" y1="' + y.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + y.toFixed(1) + '" stroke="var(--line)" stroke-width="0.75"/>' +
        '<text x="' + (padL - 4) + '" y="' + (y + 2.5).toFixed(1) + '" text-anchor="end" class="chart-axis">' + pct + '</text>';
    }).join('');

    var xlabels = SCENARIO_YEARS.map(function (yr, i) {
      if (i % 2 !== 0) return '';
      return '<text x="' + xAt(i).toFixed(1) + '" y="' + (H - 4) + '" text-anchor="middle" class="chart-axis">' + yr + '</text>';
    }).join('');

    // everything right of this line is extrapolation, not measurement
    var divX = xAtYear(MEASURED_UNTIL);
    var divider =
      '<rect x="' + padL + '" y="' + padT + '" width="' + (divX - padL).toFixed(1) + '" height="' + ph +
        '" fill="var(--ink)" opacity="0.06"/>' +
      '<line x1="' + divX.toFixed(1) + '" y1="' + padT + '" x2="' + divX.toFixed(1) + '" y2="' + (padT + ph) +
        '" stroke="var(--muted)" stroke-width="0.75" stroke-dasharray="3 3"/>' +
      '<text x="' + (padL + 1) + '" y="' + (padT - 3) + '" text-anchor="start" class="chart-phase">' +
        escapeHtml(t('scenarios.measured')) + '</text>' +
      '<text x="' + (divX + 4).toFixed(1) + '" y="' + (padT - 3) + '" text-anchor="start" class="chart-phase">' +
        escapeHtml(t('scenarios.modelled')) + '</text>';

    // Das Band ist als gemessene Spannweite gegen das Waldziel hinterlegt —
    // fürs Offenlandziel gibt es dafür keine Entsprechung, also nicht umdeuten.
    var bands = (curTarget !== 'forest' ? [] : SCENARIOS.filter(function (s) { return s.band; })).map(function (s) {
      var up = s.band.hi.map(function (v, i) { return xAt(i).toFixed(1) + ',' + yAt(v).toFixed(1); });
      var dn = s.band.lo.map(function (v, i) { return xAt(i).toFixed(1) + ',' + yAt(v).toFixed(1); }).reverse();
      return '<polygon points="' + up.concat(dn).join(' ') + '" fill="' + s.color + '" opacity="0.13"/>';
    }).join('');

    var alts = SCENARIOS.map(function (s) {
      var a = altCurveOf(s);
      if (!a) return '';
      return '<polyline points="' + ptsOf(a) + '" fill="none" stroke="' + s.color +
        '" stroke-width="1.25" stroke-dasharray="4 3" opacity="0.85"/>';
    }).join('');

    var lines = SCENARIOS.map(function (s) {
      return '<polyline points="' + ptsOf(curveOf(s)) + '" fill="none" stroke="' + s.color +
        '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    }).join('');

    return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + escapeHtml(t('scenarios.chartAria')) + '">' +
      grid + divider + bands + alts + lines + xlabels + '</svg>';
  }

  /* --- interactive scenario map: one scenario, scrubbed through time --- */
  var curScenario = 'passive', curYear = 0, playTimer = null;
  var MAX_YEAR = SCENARIO_YEARS[SCENARIO_YEARS.length - 1];
  var DOT_MAX = 340;

  // fixed, deterministic scatter — same seed every render, so scrubbing the
  // slider grows the existing stand instead of reshuffling it
  var DOT_POS = (function () {
    var out = [], h = 2166136261;
    for (var i = 0; i < DOT_MAX; i++) {
      h = (h ^ (i + 1)) >>> 0; h = (h * 16777619) >>> 0;
      var x = (h % 10000) / 10000;
      h = (h * 16777619) >>> 0;
      var y = (h % 10000) / 10000;
      out.push({ x: 3 + x * 94, y: 6 + y * 88 });
    }
    return out;
  })();

  function scenarioById(id) {
    for (var i = 0; i < SCENARIOS.length; i++) if (SCENARIOS[i].id === id) return SCENARIOS[i];
    return SCENARIOS[0];
  }

  // linear interpolation between the SCENARIO_YEARS support points
  function atYear(arr, year) {
    var n = SCENARIO_YEARS.length - 1;
    if (year <= 0) return arr[0];
    if (year >= MAX_YEAR) return arr[n];
    var pos = (year / MAX_YEAR) * n;
    var i = Math.floor(pos), f = pos - i;
    return arr[i] + (arr[i + 1] - arr[i]) * f;
  }
  function domAtYear(sc, year) {
    var n = SCENARIO_YEARS.length - 1;
    var i = Math.min(n, Math.round((year / MAX_YEAR) * n));
    return sc.dom[i];
  }

  function cssColor(varExpr) {
    var name = /var\((--[\w-]+)\)/.exec(varExpr);
    if (!name) return varExpr;
    return getComputedStyle(document.documentElement).getPropertyValue(name[1]).trim() || '#888';
  }

  function renderScenarioMap() {
    var canvas = document.getElementById('scenario-map-canvas');
    if (!canvas) return;
    var sc = scenarioById(curScenario);

    drawCompositeOn(canvas, 2020, 2022, 2024);
    var ctx = canvas.getContext('2d');

    // dim the satellite base so the modelled stand reads clearly on top
    ctx.fillStyle = 'rgba(12,9,5,0.55)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    var dens = atYear(sc.dens, curYear);
    var hgt = atYear(sc.hgt, curYear);
    var canopy = atYear(sc.canopy, curYear);
    var domId = domAtYear(sc, curYear);
    // Punktzahl folgt der Kronendeckung, nicht der Stammzahl: die Stammzahl
    // sinkt im älteren Bestand durch Selbstdurchforstung (wenige dicke statt
    // vieler dünner Bäume) — als schrumpfende Punktwolke gelesen wäre das
    // das Gegenteil dessen, was passiert. Punktgröße folgt der Höhe.
    var count = Math.round(Math.min(1, canopy / REF_CANOPY) * DOT_MAX);
    var r = 1.5 + Math.min(1, hgt / REF_HEIGHT) * 7;

    ctx.fillStyle = cssColor(SP_COLOR[domId] || 'var(--neo)');
    ctx.globalAlpha = 0.85;
    for (var i = 0; i < count; i++) {
      var p = DOT_POS[i];
      ctx.beginPath();
      ctx.arc(p.x / 100 * canvas.width, p.y / 100 * canvas.height, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    var readout = document.getElementById('scenario-readout');
    if (readout) {
      var domSp = null;
      for (var j = 0; j < SPECIES.length; j++) if (SPECIES[j].id === domId) domSp = SPECIES[j];
      readout.innerHTML =
        '<span class="ro-year"></span>' +
        '<span class="ro-item"><b></b> <i></i></span>' +
        '<span class="ro-item"><b></b> <i></i></span>' +
        '<span class="ro-item"><b></b> <i></i></span>' +
        '<span class="ro-item"><b></b> <i></i></span>';
      readout.querySelector('.ro-year').textContent =
        t('scenarios.yearLabel').replace('{y}', String(Math.round(curYear)));
      var items = readout.querySelectorAll('.ro-item');
      items[0].querySelector('b').textContent = t('scenarios.canopy');
      items[0].querySelector('i').textContent = Math.round(canopy * 100) + ' %';
      items[1].querySelector('b').textContent = t('scenarios.height');
      items[1].querySelector('i').textContent =
        (LANG === 'de' ? hgt.toFixed(1).replace('.', ',') : hgt.toFixed(1)) + ' m';
      items[2].querySelector('b').textContent = t('scenarios.density');
      items[2].querySelector('i').textContent = Math.round(dens / 100) * 100 + ' /ha';
      items[3].querySelector('b').textContent = t('scenarios.dominant');
      items[3].querySelector('i').textContent = domSp ? pick(domSp.name) : '—';
    }

    slice(document.querySelectorAll('.scen-btn')).forEach(function (b) {
      var on = b.dataset.scenario === curScenario;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    var slider = document.getElementById('scenario-slider');
    if (slider && +slider.value !== curYear) slider.value = String(curYear);
  }

  function stopPlay() {
    if (playTimer) { clearInterval(playTimer); playTimer = null; }
    var pb = document.getElementById('scenario-play');
    if (pb) { pb.textContent = t('scenarios.play'); pb.setAttribute('aria-pressed', 'false'); }
  }
  function startPlay() {
    stopPlay();
    if (curYear >= MAX_YEAR) curYear = 0;
    var pb = document.getElementById('scenario-play');
    if (pb) { pb.textContent = t('scenarios.pause'); pb.setAttribute('aria-pressed', 'true'); }
    playTimer = setInterval(function () {
      curYear += 1;
      if (curYear >= MAX_YEAR) { curYear = MAX_YEAR; renderScenarioMap(); stopPlay(); return; }
      renderScenarioMap();
    }, 220);
  }

  slice(document.querySelectorAll('.scen-btn')).forEach(function (b) {
    b.addEventListener('click', function () {
      curScenario = b.dataset.scenario;
      renderScenarioMap();
    });
  });
  (function () {
    var slider = document.getElementById('scenario-slider');
    if (slider) {
      slider.addEventListener('input', function () {
        stopPlay();
        curYear = +slider.value;
        renderScenarioMap();
      });
    }
    var pb = document.getElementById('scenario-play');
    if (pb) pb.addEventListener('click', function () { playTimer ? stopPlay() : startPlay(); });
  })();

  slice(document.querySelectorAll('.target-btn')).forEach(function (b) {
    b.addEventListener('click', function () {
      curTarget = b.dataset.target;
      slice(document.querySelectorAll('.target-btn')).forEach(function (x) {
        var on = x.dataset.target === curTarget;
        x.classList.toggle('is-on', on);
        x.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      renderScenarios();
    });
  });

  function renderScenarios() {
    var box = document.getElementById('scenario-chart');
    if (!box) return;
    box.innerHTML = buildScenarioChart();

    var cap = document.getElementById('chart-caption');
    if (cap) cap.textContent = t('scenarios.caption.' + curTarget);
    var tn = document.getElementById('target-note');
    if (tn) tn.innerHTML = t('target.' + curTarget + 'Note');

    renderScenarioMap();

    var legend = document.getElementById('scenario-legend');
    if (!legend) return;
    legend.textContent = '';
    SCENARIOS.forEach(function (s) {
      var li = document.createElement('li');
      li.className = 'scenario-item';
      li.innerHTML = '<span class="scenario-dot" style="background:' + s.color + '"></span>' +
        '<div><span class="scenario-name"></span> <span class="rad-badge"></span>' +
        '<p class="scenario-note"></p></div>';
      li.querySelector('.scenario-name').textContent = t('scenario.' + s.id);
      li.querySelector('.rad-badge').textContent = t('rad.' + s.rad);
      li.querySelector('.scenario-note').textContent = t('scenario.' + s.id + '.note');
      legend.appendChild(li);
    });
  }

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
