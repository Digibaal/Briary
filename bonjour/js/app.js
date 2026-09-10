/* =============================================================
   Bonjour! — Frans voor onderweg
   app.js — schermen, opslag, oefeningen, uitspraak

   Geen frameworks, geen build, geen netwerk. Alles draait op
   localStorage en de Web Speech API (die optioneel is).
   ============================================================= */
(function () {
  'use strict';

  /* ===========================================================
     1. Opslag
     =========================================================== */

  var SLEUTEL = 'bonjour.v1';

  var STANDAARD = {
    niveau: null,              // 'nul' | 'iets' | null (nog niet gekozen)
    voltooid: [],              // les-ids
    laatsteLes: null,
    favorieten: [],            // zin-ids
    recent: [],                // zin-ids, nieuwste eerst
    lastig: [],                // zin-ids die fout gingen
    scores: [],                // { datum, goed, totaal }
    instellingen: {
      naam: 'Patries',
      hond: 'Mila',
      landnl: 'Nederland',
      landfr: 'des Pays-Bas',
      vorm: 'v'                // 'v' = vrouw, 'm' = man
    }
  };

  var state = laden();

  function laden() {
    var basis = JSON.parse(JSON.stringify(STANDAARD));
    try {
      var ruw = localStorage.getItem(SLEUTEL);
      if (!ruw) return basis;
      var opgeslagen = JSON.parse(ruw);
      Object.keys(basis).forEach(function (k) {
        if (opgeslagen[k] === undefined || opgeslagen[k] === null) return;
        if (k === 'instellingen') {
          Object.keys(basis.instellingen).forEach(function (i) {
            if (typeof opgeslagen.instellingen[i] === 'string' && opgeslagen.instellingen[i] !== '') {
              basis.instellingen[i] = opgeslagen.instellingen[i];
            }
          });
        } else {
          basis[k] = opgeslagen[k];
        }
      });
    } catch (e) {
      /* Kapotte of geblokkeerde opslag: gewoon met een schone lei verder. */
    }
    return basis;
  }

  function bewaren() {
    try {
      localStorage.setItem(SLEUTEL, JSON.stringify(state));
    } catch (e) {
      /* Privémodus of volle opslag: de app blijft werken, alleen zonder geheugen. */
    }
  }

  /* ===========================================================
     2. Hulpjes
     =========================================================== */

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function el(tag, klasse, tekst) {
    var n = document.createElement(tag);
    if (klasse) n.className = klasse;
    if (tekst !== undefined) n.textContent = tekst;
    return n;
  }

  function icoon(naam) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    var use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', '#' + naam);
    svg.appendChild(use);
    return svg;
  }

  /* Accenten en leestekens weghalen zodat zoeken soepel werkt. */
  function normaliseer(tekst) {
    return (tekst || '')
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[\u2019']/g, ' ')
      .replace(/[^a-z0-9 ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function shuffle(lijst) {
    var kopie = lijst.slice();
    for (var i = kopie.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = kopie[i]; kopie[i] = kopie[j]; kopie[j] = t;
    }
    return kopie;
  }

  function kies(lijst) { return lijst[Math.floor(Math.random() * lijst.length)]; }

  /* ===========================================================
     3. Tokens invullen (naam, hond, land, vrouwelijke vorm)
     =========================================================== */

  var STANDAARD_LANDFR = 'des Pays-Bas';
  var STANDAARD_LANDPH = 'dee pei-ba';

  function fill(tekst) {
    if (!tekst) return '';
    var s = state.instellingen;
    var vrouw = s.vorm !== 'm';
    return tekst
      .replace(/\{naamph\}/g, s.naam)
      .replace(/\{hondph\}/g, s.hond)
      .replace(/\{landph\}/g, s.landfr === STANDAARD_LANDFR ? STANDAARD_LANDPH : s.landfr)
      .replace(/\{naam\}/g, s.naam)
      .replace(/\{hond\}/g, s.hond)
      .replace(/\{landfr\}/g, s.landfr)
      .replace(/\{landnl\}/g, s.landnl)
      .replace(/\{nat\}/g, vrouw ? 'Nederlandse' : 'Nederlander')
      .replace(/\{e\}/g, vrouw ? 'e' : '')
      .replace(/\{z\}/g, vrouw ? 'z' : '');
  }

  function fr(p) { return fill(p.fr); }
  function nl(p) { return fill(p.nl); }
  function ph(p) { return fill(p.ph); }

  /* ===========================================================
     4. Uitspraak (Web Speech API, altijd optioneel)
     =========================================================== */

  var spraak = {
    kan: false,
    stem: null,
    gemeld: false
  };

  function stemZoeken() {
    if (!('speechSynthesis' in window)) return;
    var stemmen = window.speechSynthesis.getVoices() || [];
    var frans = stemmen.filter(function (v) { return /^fr(-|_)?/i.test(v.lang || ''); });
    spraak.stem = frans.filter(function (v) { return v.localService; })[0] || frans[0] || null;
    spraak.kan = !!spraak.stem;
    stemStatusTonen();
    $$('[data-spreek]').forEach(function (knop) { knop.disabled = !spraak.kan; });
  }

  function stemStatusTonen() {
    var vak = $('#stem-status');
    if (!vak) return;
    if (spraak.kan) {
      vak.textContent = 'Dit apparaat heeft een Franse stem (' + spraak.stem.name +
        '). Tik op Luister bij een zin. De uitspraakhulp blijft altijd zichtbaar.';
    } else {
      vak.textContent = 'Dit apparaat heeft geen Franse stem beschikbaar. Geen probleem: ' +
        'de app werkt volledig zonder geluid, de uitspraakhulp staat bij elke zin.';
    }
  }

  function uitspreken(tekst) {
    if (!spraak.kan) return;
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(tekst);
      u.voice = spraak.stem;
      u.lang = spraak.stem.lang || 'fr-FR';
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    } catch (e) { /* geluid is nooit noodzakelijk */ }
  }

  if ('speechSynthesis' in window) {
    stemZoeken();
    window.speechSynthesis.onvoiceschanged = stemZoeken;
  } else {
    stemStatusTonen();
  }

  /* ===========================================================
     5. Favorieten, recent en lastige zinnen
     =========================================================== */

  function isFavoriet(id) { return state.favorieten.indexOf(id) !== -1; }

  function favorietWissel(id) {
    var i = state.favorieten.indexOf(id);
    if (i === -1) state.favorieten.push(id); else state.favorieten.splice(i, 1);
    bewaren();
    tekenFavorieten();
    werkStatsBij();
    /* Alle zichtbare knoppen voor deze zin gelijkzetten. */
    $$('[data-fav="' + id + '"]').forEach(function (knop) {
      zetFavKnop(knop, isFavoriet(id));
    });
  }

  function zetFavKnop(knop, aan) {
    knop.setAttribute('aria-pressed', aan ? 'true' : 'false');
    var label = knop.querySelector('.fav-tekst');
    if (label) label.textContent = aan ? 'Favoriet' : 'Bewaar';
    knop.setAttribute('aria-label', aan ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten');
  }

  function recentToevoegen(id) {
    state.recent = [id].concat(state.recent.filter(function (r) { return r !== id; })).slice(0, 12);
    bewaren();
  }

  function lastigToevoegen(id) {
    if (state.lastig.indexOf(id) === -1) {
      state.lastig.push(id);
      state.lastig = state.lastig.slice(-24);
      bewaren();
    }
  }

  function lastigWeghalen(id) {
    var i = state.lastig.indexOf(id);
    if (i !== -1) { state.lastig.splice(i, 1); bewaren(); }
  }

  /* ===========================================================
     6. Zinkaart
     =========================================================== */

  /* opties: { herkomst: true } toont bij welke les een zin hoort. */
  function zinKaart(p, opties) {
    opties = opties || {};
    var kaart = el('article', 'zin' + (p.sos ? ' nood' : ''));

    var zinFR = el('p', 'fr', fr(p));
    zinFR.lang = 'fr';
    kaart.appendChild(zinFR);

    kaart.appendChild(el('p', 'nl', nl(p)));

    var uit = el('p', 'ph');
    uit.appendChild(el('b', null, 'Uitspraak: '));
    uit.appendChild(document.createTextNode(ph(p)));
    kaart.appendChild(uit);

    if (p.tip) kaart.appendChild(el('p', 'tip', fill(p.tip)));

    var acties = el('div', 'acties');

    var favKnop = el('button', 'icoonknop');
    favKnop.type = 'button';
    favKnop.setAttribute('data-fav', p.id);
    favKnop.appendChild(icoon('i-hart'));
    favKnop.appendChild(el('span', 'fav-tekst', ''));
    zetFavKnop(favKnop, isFavoriet(p.id));
    favKnop.addEventListener('click', function () {
      favorietWissel(p.id);
      recentToevoegen(p.id);
    });
    acties.appendChild(favKnop);

    var grootKnop = el('button', 'icoonknop');
    grootKnop.type = 'button';
    grootKnop.appendChild(icoon('i-vergroot'));
    grootKnop.appendChild(el('span', null, 'Toon groot'));
    grootKnop.addEventListener('click', function () { toonGroot(p, grootKnop); });
    acties.appendChild(grootKnop);

    var geluidKnop = el('button', 'icoonknop');
    geluidKnop.type = 'button';
    geluidKnop.setAttribute('data-spreek', p.id);
    geluidKnop.disabled = !spraak.kan;
    geluidKnop.appendChild(icoon('i-geluid'));
    geluidKnop.appendChild(el('span', null, 'Luister'));
    geluidKnop.addEventListener('click', function () {
      uitspreken(fr(p));
      recentToevoegen(p.id);
    });
    acties.appendChild(geluidKnop);

    kaart.appendChild(acties);

    if (opties.herkomst && p.lesson) {
      var les = LESSONS[p.lesson - 1];
      kaart.appendChild(el('p', 'herkomst', 'Les ' + les.id + ' — ' + les.title));
    }
    return kaart;
  }

  function zinnenLijst(container, lijst, legeTekst, opties) {
    container.textContent = '';
    if (!lijst.length) {
      container.appendChild(el('p', 'leeg', legeTekst));
      return;
    }
    lijst.forEach(function (p) { container.appendChild(zinKaart(p, opties)); });
  }

  /* ===========================================================
     7. Beeldvullende weergave
     =========================================================== */

  var grootDialoog = $('#groot');
  var grootVorigeFocus = null;
  var grootZin = null;

  function toonGroot(p, herkomstKnop) {
    grootZin = p;
    grootVorigeFocus = herkomstKnop || document.activeElement;
    $('#groot-fr').textContent = fr(p);
    $('#groot-nl').textContent = nl(p);
    $('#groot-ph').textContent = 'Uitspraak: ' + ph(p);
    $('#groot-spreek').disabled = !spraak.kan;
    grootDialoog.hidden = false;
    $('#groot-sluit').focus();
    recentToevoegen(p.id);
    tekenRecent();
  }

  function sluitGroot() {
    grootDialoog.hidden = true;
    if (grootVorigeFocus && document.contains(grootVorigeFocus)) grootVorigeFocus.focus();
  }

  $('#groot-sluit').addEventListener('click', sluitGroot);
  $('#groot-spreek').addEventListener('click', function () {
    if (grootZin) uitspreken(fr(grootZin));
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !grootDialoog.hidden) sluitGroot();
  });
  /* Simpele focusval: binnen het dialoogvenster blijven met Tab. */
  grootDialoog.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var focusbaar = $$('button:not([disabled])', grootDialoog);
    if (!focusbaar.length) return;
    var eerste = focusbaar[0], laatste = focusbaar[focusbaar.length - 1];
    if (e.shiftKey && document.activeElement === eerste) { e.preventDefault(); laatste.focus(); }
    else if (!e.shiftKey && document.activeElement === laatste) { e.preventDefault(); eerste.focus(); }
  });

  /* ===========================================================
     8. Schermen en navigatie
     =========================================================== */

  var SCHERMEN = ['start', 'leren', 'les', 'oefenen', 'zinnenboek', 'favorieten', 'voortgang'];
  var huidigScherm = 'start';

  function toonScherm(naam, opties) {
    opties = opties || {};
    if (SCHERMEN.indexOf(naam) === -1) naam = 'start';
    huidigScherm = naam;

    SCHERMEN.forEach(function (s) {
      var vak = document.getElementById('scherm-' + s);
      if (vak) vak.hidden = (s !== naam);
    });

    /* Navigatie: 'les' hoort visueel bij 'leren', 'start' bij niets. */
    var actief = (naam === 'les') ? 'leren' : naam;
    $$('.hoofdnav button').forEach(function (knop) {
      if (knop.getAttribute('data-ga') === actief) knop.setAttribute('aria-current', 'page');
      else knop.removeAttribute('aria-current');
    });

    if (naam === 'leren') tekenLessen();
    if (naam === 'oefenen') {
      if (!bezigMetOefenen) {
        $('#oefen-ronde').hidden = true;
        $('#oefen-klaar').hidden = true;
        $('#oefen-keuze').hidden = false;
      }
      tekenOefenKeuze();
    }
    if (naam === 'zinnenboek') { tekenZinnenboek(); tekenRecent(); }
    if (naam === 'favorieten') tekenFavorieten();
    if (naam === 'voortgang') tekenVoortgang();
    if (naam === 'start') tekenStart();

    if (!opties.stil) window.scrollTo(0, 0);
    if (!opties.geenFocus) {
      var kop = $('#scherm-' + naam + ' h1');
      if (kop) {
        kop.setAttribute('tabindex', '-1');
        kop.focus({ preventScroll: true });
      }
    }
    if (!opties.geenGeschiedenis) {
      history.pushState({ scherm: naam, les: opties.les || null }, '', '');
    }
  }

  window.addEventListener('popstate', function (e) {
    var s = (e.state && e.state.scherm) || 'start';
    if (!grootDialoog.hidden) { sluitGroot(); return; }
    if (s === 'les' && e.state.les) openLes(e.state.les, true);
    else toonScherm(s, { geenGeschiedenis: true });
  });

  /* Alle knoppen met data-ga navigeren naar een scherm. */
  document.addEventListener('click', function (e) {
    var knop = e.target.closest ? e.target.closest('[data-ga]') : null;
    if (knop) toonScherm(knop.getAttribute('data-ga'));
  });

  /* ===========================================================
     9. Startscherm
     =========================================================== */

  function aantalVoltooid() { return state.voltooid.length; }

  function tekenStart() {
    var n = aantalVoltooid();
    $('#start-voortgangstekst').textContent = n + ' van ' + LESSONS.length + ' lessen voltooid';
    $('#start-balk').style.width = Math.round(n / LESSONS.length * 100) + '%';

    var laatste = $('#start-laatste');
    if (state.laatsteLes && LESSONS[state.laatsteLes - 1]) {
      laatste.textContent = 'Laatst geopend: les ' + state.laatsteLes + ' — ' + LESSONS[state.laatsteLes - 1].title;
    } else {
      laatste.textContent = 'Nog niet begonnen. Les 1 duurt ongeveer vier minuten.';
    }

    $$('#niveau-kaart [data-niveau]').forEach(function (knop) {
      knop.setAttribute('aria-pressed', knop.getAttribute('data-niveau') === state.niveau ? 'true' : 'false');
    });
  }

  $$('#niveau-kaart [data-niveau]').forEach(function (knop) {
    knop.addEventListener('click', function () {
      state.niveau = knop.getAttribute('data-niveau');
      bewaren();
      tekenStart();
      var select = $('#set-niveau');
      if (select) select.value = state.niveau;
    });
  });

  $('[data-actie="start-cursus"]').addEventListener('click', function () {
    var volgende = LESSONS.filter(function (l) { return state.voltooid.indexOf(l.id) === -1; })[0];
    openLes(volgende ? volgende.id : (state.laatsteLes || 1));
  });

  /* ===========================================================
     10. Leren: lessenlijst en lesdetail
     =========================================================== */

  function lesKnop(les) {
    var knop = el('button', 'leskaart');
    knop.type = 'button';
    var klaar = state.voltooid.indexOf(les.id) !== -1;
    knop.setAttribute('data-klaar', klaar ? 'ja' : 'nee');

    knop.appendChild(el('span', 'nr', String(les.id)));

    var midden = el('span');
    midden.appendChild(el('span', 'titel', les.title));
    midden.appendChild(document.createElement('br'));
    midden.appendChild(el('span', 'sub', les.subtitle));
    knop.appendChild(midden);

    if (klaar) {
      var vink = el('span', 'vink');
      vink.appendChild(icoon('i-vink'));
      knop.appendChild(vink);
      knop.setAttribute('aria-label', 'Les ' + les.id + ': ' + les.title + ' — voltooid');
    } else {
      knop.setAttribute('aria-label', 'Les ' + les.id + ': ' + les.title);
    }

    knop.addEventListener('click', function () { openLes(les.id); });
    return knop;
  }

  function tekenLessen() {
    var lijst = $('#leslijst');
    lijst.textContent = '';
    LESSONS.forEach(function (les) {
      var li = document.createElement('li');
      li.appendChild(lesKnop(les));
      lijst.appendChild(li);
    });
    var n = aantalVoltooid();
    $('#leren-balk').style.width = Math.round(n / LESSONS.length * 100) + '%';
    $('#leren-voortgangstekst').textContent = n + ' van ' + LESSONS.length + ' lessen voltooid';
  }

  var actieveLes = null;

  function openLes(id, uitGeschiedenis) {
    var les = LESSONS[id - 1];
    if (!les) return;
    actieveLes = les;
    state.laatsteLes = id;
    bewaren();

    $('#les-nummer').textContent = 'Les ' + les.id + ' van ' + LESSONS.length + ' • ' + les.subtitle;
    $('#titel-les').textContent = les.title;
    $('#les-intro').textContent = les.intro;

    var vak = $('#les-zinnen');
    vak.textContent = '';
    les.phrases.forEach(function (pid) {
      if (PHRASE_BY_ID[pid]) vak.appendChild(zinKaart(PHRASE_BY_ID[pid]));
    });

    var klaar = state.voltooid.indexOf(id) !== -1;
    var knop = $('#les-klaar');
    knop.textContent = klaar ? 'Voltooid — markeer als onafgerond' : 'Les afronden';
    knop.className = klaar ? 'knop omlijnd' : 'knop primair';

    var volgende = LESSONS[id];
    var vTekst = $('#les-volgende');
    vTekst.textContent = volgende
      ? 'Hierna: les ' + volgende.id + ' — ' + volgende.title
      : 'Dit is de laatste les. Daarna is het zinnenboek je reisgenoot.';

    toonScherm('les', { les: id, geenGeschiedenis: !!uitGeschiedenis });
  }

  $('#les-klaar').addEventListener('click', function () {
    if (!actieveLes) return;
    var i = state.voltooid.indexOf(actieveLes.id);
    if (i === -1) state.voltooid.push(actieveLes.id); else state.voltooid.splice(i, 1);
    bewaren();
    var klaar = i === -1;
    this.textContent = klaar ? 'Voltooid — markeer als onafgerond' : 'Les afronden';
    this.className = klaar ? 'knop omlijnd' : 'knop primair';
    werkStatsBij();
    if (klaar) {
      var volgende = LESSONS[actieveLes.id];
      if (volgende) openLes(volgende.id); else toonScherm('leren');
    }
  });

  $('#les-oefen').addEventListener('click', function () {
    if (!actieveLes) return;
    toonScherm('oefenen');
    $('#oefen-bron').value = 'les-' + actieveLes.id;
    startRonde();
  });

  /* ===========================================================
     11. Zinnenboek
     =========================================================== */

  var actieveCategorie = 'alles';

  function tekenCategorieFilters() {
    var vak = $('#cat-filters');
    vak.textContent = '';
    var alles = [{ id: 'alles', label: 'Alles' }].concat(CATEGORIES);
    alles.forEach(function (cat) {
      var knop = el('button', null, cat.label);
      knop.type = 'button';
      knop.setAttribute('aria-pressed', cat.id === actieveCategorie ? 'true' : 'false');
      knop.addEventListener('click', function () {
        actieveCategorie = cat.id;
        tekenCategorieFilters();
        tekenZinnenboek();
      });
      vak.appendChild(knop);
    });
  }

  function tekenZinnenboek() {
    var zoekterm = normaliseer($('#zoek').value);
    var resultaat = PHRASES.filter(function (p) {
      if (actieveCategorie !== 'alles' && p.cat !== actieveCategorie) return false;
      if (!zoekterm) return true;
      var hooi = normaliseer(fr(p) + ' ' + nl(p) + ' ' + ph(p) + ' ' + (p.tip || ''));
      return zoekterm.split(' ').every(function (woord) { return hooi.indexOf(woord) !== -1; });
    });

    $('#zoek-telling').textContent = resultaat.length === PHRASES.length
      ? PHRASES.length + ' zinnen'
      : resultaat.length + ' van ' + PHRASES.length + ' zinnen';

    zinnenLijst($('#zinnenboek-lijst'), resultaat,
      'Niets gevonden. Probeer een korter woord, of zoek in het Frans.', { herkomst: true });
  }

  $('#zoek').addEventListener('input', tekenZinnenboek);

  function tekenRecent() {
    var blok = $('#recent-blok');
    var lijst = state.recent
      .map(function (id) { return PHRASE_BY_ID[id]; })
      .filter(Boolean)
      .slice(0, 5);
    blok.hidden = lijst.length === 0;
    if (lijst.length) zinnenLijst($('#recent-lijst'), lijst, '', { herkomst: true });
  }

  function tekenWoordenlijst() {
    var body = $('#woordenlijst');
    body.textContent = '';
    WORDS.forEach(function (w) {
      var rij = document.createElement('tr');
      rij.appendChild(el('td', null, w.nl));
      var f = el('td', 'fr', w.fr); f.lang = 'fr';
      rij.appendChild(f);
      rij.appendChild(el('td', 'ph', w.ph));
      body.appendChild(rij);
    });

    var getallen = $('#getallenlijst');
    getallen.textContent = '';
    NUMBERS.forEach(function (g) {
      var vak = el('div', 'getal');
      var b = el('b', null, g.nl + ' — ' + g.fr); b.lang = 'fr';
      vak.appendChild(b);
      vak.appendChild(el('span', null, g.ph));
      getallen.appendChild(vak);
    });
  }

  /* ===========================================================
     12. Favorieten
     =========================================================== */

  function tekenFavorieten() {
    var lijst = state.favorieten.map(function (id) { return PHRASE_BY_ID[id]; }).filter(Boolean);
    zinnenLijst($('#favorieten-lijst'), lijst,
      'Nog geen favorieten. Tik bij een zin op Bewaar en hij verschijnt hier — handig als spiekbriefje bij de kassa.',
      { herkomst: true });
  }

  /* ===========================================================
     13. Voortgang en instellingen
     =========================================================== */

  function gemiddeldeScore() {
    if (!state.scores.length) return null;
    var laatste = state.scores.slice(-10);
    var goed = 0, totaal = 0;
    laatste.forEach(function (s) { goed += s.goed; totaal += s.totaal; });
    return totaal ? Math.round(goed / totaal * 100) : null;
  }

  function werkStatsBij() {
    var score = gemiddeldeScore();
    if ($('#stat-lessen')) {
      $('#stat-lessen').textContent = aantalVoltooid() + '/' + LESSONS.length;
      $('#stat-favorieten').textContent = String(state.favorieten.length);
      $('#stat-score').textContent = score === null ? '—' : score + '%';
      $('#stat-lastig').textContent = String(state.lastig.length);
    }
    if (huidigScherm === 'start') tekenStart();
  }

  function tekenVoortgang() {
    werkStatsBij();

    var lijst = $('#voortgang-lessen');
    lijst.textContent = '';
    LESSONS.forEach(function (les) {
      var li = document.createElement('li');
      li.appendChild(lesKnop(les));
      lijst.appendChild(li);
    });

    var s = state.instellingen;
    $('#set-naam').value = s.naam;
    $('#set-hond').value = s.hond;
    $('#set-landnl').value = s.landnl;
    $('#set-landfr').value = s.landfr;
    $('#set-vorm').value = s.vorm;
    $('#set-niveau').value = state.niveau || 'nul';
  }

  function instellingOpslaan(veld, waarde) {
    state.instellingen[veld] = waarde.trim() || STANDAARD.instellingen[veld];
    bewaren();
    $('#set-bevestiging').textContent = 'Opgeslagen. De zinnen zijn bijgewerkt.';
    window.setTimeout(function () {
      var b = $('#set-bevestiging');
      if (b) b.textContent = '';
    }, 2500);
  }

  [['#set-naam', 'naam'], ['#set-hond', 'hond'], ['#set-landnl', 'landnl'], ['#set-landfr', 'landfr']]
    .forEach(function (paar) {
      $(paar[0]).addEventListener('change', function () { instellingOpslaan(paar[1], this.value); });
    });

  $('#set-vorm').addEventListener('change', function () { instellingOpslaan('vorm', this.value); });

  $('#set-niveau').addEventListener('change', function () {
    state.niveau = this.value;
    bewaren();
  });

  $('#wis-knop').addEventListener('click', function () {
    $('#wis-bevestig').hidden = false;
    $('#wis-ja').focus();
  });
  $('#wis-nee').addEventListener('click', function () {
    $('#wis-bevestig').hidden = true;
    $('#wis-knop').focus();
  });
  $('#wis-ja').addEventListener('click', function () {
    try { localStorage.removeItem(SLEUTEL); } catch (e) { /* niets aan te doen */ }
    state = JSON.parse(JSON.stringify(STANDAARD));
    $('#wis-bevestig').hidden = true;
    tekenVoortgang();
    tekenFavorieten();
    tekenZinnenboek();
    tekenRecent();
    tekenLessen();
    $('#set-bevestiging').textContent = 'Alles gewist. Je begint met een schone lei.';
    $('#wis-knop').focus();
  });

  /* ===========================================================
     14. Oefeningen
     =========================================================== */

  var GOED_REACTIES = ['Precies!', 'Klopt helemaal.', 'Dat is ’m.', 'Goed gedaan.'];
  var FOUT_REACTIE = 'Bijna — kijk nog eens naar het sleutelwoord.';
  var HERHAAL_REACTIE = 'Geen ramp. Deze zin komt straks nog een keer terug.';

  var ronde = null;
  var bezigMetOefenen = false;

  function tekenOefenKeuze() {
    var bron = $('#oefen-bron');
    var vorige = bron.value;
    bron.textContent = '';

    var alles = el('option', null, 'Alle zinnen');
    alles.value = 'alles';
    bron.appendChild(alles);

    LESSONS.forEach(function (les) {
      var o = el('option', null, 'Les ' + les.id + ' — ' + les.title);
      o.value = 'les-' + les.id;
      bron.appendChild(o);
    });

    if (state.favorieten.length >= 4) {
      var f = el('option', null, 'Mijn favorieten');
      f.value = 'favorieten';
      bron.appendChild(f);
    }

    /* Standaard: de laatst geopende les, anders alles. */
    if (vorige && $$('option', bron).some(function (o) { return o.value === vorige; })) bron.value = vorige;
    else if (state.laatsteLes) bron.value = 'les-' + state.laatsteLes;

    var lastigKaart = $('#lastig-kaart');
    lastigKaart.hidden = state.lastig.length < 3;
    if (!lastigKaart.hidden) {
      var lijst = $('#lastig-lijst');
      lijst.textContent = '';
      state.lastig.slice(0, 6).forEach(function (id) {
        var p = PHRASE_BY_ID[id];
        if (p) lijst.appendChild(el('li', null, fr(p) + ' — ' + nl(p)));
      });
    }
  }

  function poolVoorBron(bron) {
    if (bron === 'alles') return PHRASES.slice();
    if (bron === 'favorieten') {
      return state.favorieten.map(function (id) { return PHRASE_BY_ID[id]; }).filter(Boolean);
    }
    if (bron === 'lastig') {
      return state.lastig.map(function (id) { return PHRASE_BY_ID[id]; }).filter(Boolean);
    }
    var m = /^les-(\d+)$/.exec(bron);
    if (m) {
      var les = LESSONS[Number(m[1]) - 1];
      return les ? les.phrases.map(function (id) { return PHRASE_BY_ID[id]; }).filter(Boolean) : [];
    }
    return PHRASES.slice();
  }

  /* Bouwt één opdracht. */
  function maakOpdracht(soort, zin, pool) {
    var afleiders = pool.filter(function (p) { return p.id !== zin.id; });
    var opties;

    if (soort === 'situatie') {
      var situaties = SITUATIONS.filter(function (s) {
        return pool.some(function (p) { return p.id === s.answer; });
      });
      if (!situaties.length) return maakOpdracht('fr', zin, pool);
      var sit = kies(situaties);
      var juist = PHRASE_BY_ID[sit.answer];
      opties = shuffle([juist].concat(shuffle(pool.filter(function (p) { return p.id !== juist.id; })).slice(0, 3)));
      return { soort: 'keuze', vraagKlein: 'Wat zeg je?', vraag: sit.text, taal: 'nl',
               opties: opties, toon: fr, juist: juist };
    }

    if (soort === 'nl') {
      opties = shuffle([zin].concat(shuffle(afleiders).slice(0, 3)));
      return { soort: 'keuze', vraagKlein: 'Wat betekent dit?', vraag: fr(zin), taal: 'fr',
               opties: opties, toon: nl, juist: zin, uitspraak: ph(zin) };
    }

    if (soort === 'fr') {
      opties = shuffle([zin].concat(shuffle(afleiders).slice(0, 3)));
      return { soort: 'keuze', vraagKlein: 'Hoe zeg je dit in het Frans?', vraag: nl(zin), taal: 'nl',
               opties: opties, toon: fr, juist: zin };
    }

    if (soort === 'aanvullen') {
      var woorden = fr(zin).split(' ').filter(function (w) { return w.replace(/[^A-Za-zÀ-ÿ’]/g, '').length > 3; });
      if (woorden.length < 1 || afleiders.length < 3) return maakOpdracht('fr', zin, pool);
      var sleutel = kies(woorden);
      var kaal = sleutel.replace(/[^A-Za-zÀ-ÿ’-]/g, '');
      var gat = fr(zin).replace(sleutel, sleutel.replace(kaal, '_____'));
      var anderen = [];
      shuffle(afleiders).some(function (p) {
        var kandidaten = fr(p).split(' ')
          .map(function (w) { return w.replace(/[^A-Za-zÀ-ÿ’-]/g, ''); })
          .filter(function (w) { return w.length > 3 && w !== kaal && anderen.indexOf(w) === -1; });
        if (kandidaten.length) anderen.push(kies(kandidaten));
        return anderen.length >= 3;
      });
      if (anderen.length < 3) return maakOpdracht('fr', zin, pool);
      return { soort: 'woord', vraagKlein: nl(zin), vraag: gat, taal: 'fr',
               opties: shuffle([kaal].concat(anderen)), juistWoord: kaal, zin: zin };
    }

    if (soort === 'volgorde') {
      var delen = maakDelen(fr(zin));
      if (!delen) return maakOpdracht('fr', zin, pool);
      return { soort: 'volgorde', vraagKlein: nl(zin), delen: delen, zin: zin };
    }

    if (soort === 'flash') return { soort: 'flash', zin: zin };
    if (soort === 'hardop') return { soort: 'hardop', zin: zin };

    return maakOpdracht('fr', zin, pool);
  }

  /* Knipt een zin in drie ongeveer gelijke stukken. */
  function maakDelen(tekst) {
    var woorden = tekst.split(' ');
    if (woorden.length < 3) return null;
    var per = Math.ceil(woorden.length / 3);
    var delen = [];
    for (var i = 0; i < woorden.length; i += per) delen.push(woorden.slice(i, i + per).join(' '));
    while (delen.length > 3) {
      delen[2] = delen[2] + ' ' + delen.pop();
    }
    return delen.length === 3 ? delen : null;
  }

  function startRonde() {
    var bron = $('#oefen-bron').value;
    var soortKeuze = $('#oefen-soort').value;
    var pool = poolVoorBron(bron);

    if (pool.length < 4) {
      $('#oefen-keuze').hidden = false;
      $('#oefen-ronde').hidden = true;
      window.alert('Voor deze ronde zijn minstens vier zinnen nodig. Kies een andere les of alle zinnen.');
      return;
    }

    var soorten = soortKeuze === 'mix'
      ? ['nl', 'fr', 'aanvullen', 'volgorde', 'situatie', 'flash', 'hardop']
      : [soortKeuze];

    var zinnen = shuffle(pool).slice(0, 8);
    ronde = {
      pool: pool,
      opdrachten: zinnen.map(function (z, i) {
        return maakOpdracht(soorten.length === 1 ? soorten[0] : soorten[i % soorten.length], z, pool);
      }),
      index: 0,
      goed: 0,
      geteld: 0,
      herhaald: {}
    };

    bezigMetOefenen = true;
    $('#oefen-keuze').hidden = true;
    $('#oefen-klaar').hidden = true;
    $('#oefen-ronde').hidden = false;
    toonOpdracht();
  }

  function toonOpdracht() {
    var vak = $('#oefen-vak');
    var feedback = $('#oefen-feedback');
    var volgendeKnop = $('#oefen-volgende');
    vak.textContent = '';
    feedback.textContent = '';
    feedback.removeAttribute('data-soort');
    volgendeKnop.hidden = true;

    if (ronde.index >= ronde.opdrachten.length) return rondeAfronden();

    var totaal = ronde.opdrachten.length;
    $('#oefen-teller').textContent = (ronde.index + 1) + ' / ' + totaal;
    $('#oefen-balk').style.width = Math.round(ronde.index / totaal * 100) + '%';

    var o = ronde.opdrachten[ronde.index];
    if (o.soort === 'keuze') return tekenKeuze(o, vak);
    if (o.soort === 'woord') return tekenWoordKeuze(o, vak);
    if (o.soort === 'volgorde') return tekenVolgorde(o, vak);
    if (o.soort === 'flash') return tekenFlash(o, vak);
    if (o.soort === 'hardop') return tekenHardop(o, vak);
  }

  function luisterKnopje(zin) {
    var knop = el('button', 'icoonknop');
    knop.type = 'button';
    knop.setAttribute('data-spreek', zin.id);
    knop.disabled = !spraak.kan;
    knop.appendChild(icoon('i-geluid'));
    knop.appendChild(el('span', null, 'Luister'));
    knop.addEventListener('click', function () { uitspreken(fr(zin)); });
    return knop;
  }

  function tekenKeuze(o, vak) {
    vak.appendChild(el('p', 'mini', o.vraagKlein));
    var vraag = el('p', o.taal === 'fr' ? 'vraag-fr' : 'vraag', o.vraag);
    if (o.taal === 'fr') vraag.lang = 'fr';
    vak.appendChild(vraag);
    if (o.uitspraak) vak.appendChild(el('p', 'mini', 'Uitspraak: ' + o.uitspraak));

    var opties = el('div', 'opties');
    o.opties.forEach(function (p) {
      var knop = el('button', 'optie', o.toon(p));
      knop.type = 'button';
      if (o.toon === fr) knop.lang = 'fr';
      knop.addEventListener('click', function () {
        beoordeel(p.id === o.juist.id, o.juist, opties, knop,
          o.toon === fr ? fr(o.juist) : nl(o.juist));
      });
      opties.appendChild(knop);
    });
    vak.appendChild(opties);
  }

  function tekenWoordKeuze(o, vak) {
    vak.appendChild(el('p', 'mini', o.vraagKlein));
    var vraag = el('p', 'vraag-fr', o.vraag);
    vraag.lang = 'fr';
    vak.appendChild(vraag);
    vak.appendChild(el('p', 'mini', 'Welk woord hoort op de open plek?'));

    var opties = el('div', 'opties');
    o.opties.forEach(function (woord) {
      var knop = el('button', 'optie', woord);
      knop.type = 'button';
      knop.lang = 'fr';
      knop.addEventListener('click', function () {
        beoordeel(woord === o.juistWoord, o.zin, opties, knop, o.juistWoord);
      });
      opties.appendChild(knop);
    });
    vak.appendChild(opties);
  }

  function tekenVolgorde(o, vak) {
    vak.appendChild(el('p', 'mini', 'Zet in de goede volgorde:'));
    vak.appendChild(el('p', 'vraag', o.vraagKlein));

    var bouw = el('div', 'bouw');
    bouw.setAttribute('aria-live', 'polite');
    vak.appendChild(bouw);

    var voorraad = el('div', 'knoprij');
    vak.appendChild(voorraad);

    var gekozen = [];
    var knoppen = shuffle(o.delen).map(function (deel) {
      var knop = el('button', 'deel', deel);
      knop.type = 'button';
      knop.lang = 'fr';
      knop.addEventListener('click', function () {
        if (knop.classList.contains('gekozen')) return;
        knop.classList.add('gekozen');
        knop.disabled = true;
        gekozen.push(deel);
        bouw.appendChild(el('span', 'deel gekozen', deel));
        if (gekozen.length === o.delen.length) {
          var goed = gekozen.join(' ') === o.delen.join(' ');
          beoordeel(goed, o.zin, null, null, fr(o.zin));
        }
      });
      return knop;
    });
    knoppen.forEach(function (k) { voorraad.appendChild(k); });

    var opnieuw = el('button', 'knop klein omlijnd', 'Opnieuw');
    opnieuw.type = 'button';
    opnieuw.addEventListener('click', function () {
      gekozen = [];
      bouw.textContent = '';
      knoppen.forEach(function (k) { k.classList.remove('gekozen'); k.disabled = false; });
      $('#oefen-feedback').textContent = '';
    });
    vak.appendChild(opnieuw);
  }

  function tekenFlash(o, vak) {
    var p = o.zin;
    var omgedraaid = false;

    var kaart = el('button', 'flashcard');
    kaart.type = 'button';
    var vul = function () {
      kaart.textContent = '';
      if (!omgedraaid) {
        var f = el('span', 'groot', fr(p)); f.lang = 'fr';
        kaart.appendChild(f);
        kaart.appendChild(el('span', 'hint', 'Tik om de vertaling te zien'));
      } else {
        kaart.appendChild(el('span', 'groot', nl(p)));
        kaart.appendChild(el('span', 'hint', 'Uitspraak: ' + ph(p)));
      }
    };
    vul();
    kaart.addEventListener('click', function () {
      omgedraaid = !omgedraaid;
      vul();
      if (omgedraaid) knoprij.hidden = false;
    });
    vak.appendChild(kaart);

    var knoprij = el('div', 'knoprij');
    knoprij.style.marginTop = '14px';
    knoprij.hidden = true;

    var gelukt = el('button', 'knop secundair', 'Deze zat goed');
    gelukt.type = 'button';
    gelukt.addEventListener('click', function () { beoordeel(true, p, null, null, fr(p)); });

    var lastig = el('button', 'knop omlijnd', 'Nog even oefenen');
    lastig.type = 'button';
    lastig.addEventListener('click', function () { beoordeel(false, p, null, null, fr(p)); });

    knoprij.appendChild(gelukt);
    knoprij.appendChild(lastig);
    knoprij.appendChild(luisterKnopje(p));
    vak.appendChild(knoprij);
  }

  function tekenHardop(o, vak) {
    var p = o.zin;
    vak.appendChild(el('p', 'mini', 'Zeg deze zin hardop. Niemand luistert mee — er is geen spraakherkenning.'));
    var f = el('p', 'vraag-fr', fr(p)); f.lang = 'fr';
    vak.appendChild(f);
    vak.appendChild(el('p', 'mini', 'Uitspraak: ' + ph(p)));
    vak.appendChild(el('p', 'nl', nl(p)));

    var knoprij = el('div', 'knoprij');
    knoprij.style.marginTop = '10px';

    var gezegd = el('button', 'knop secundair', 'Gezegd');
    gezegd.type = 'button';
    gezegd.addEventListener('click', function () { beoordeel(true, p, null, null, fr(p)); });

    var lastig = el('button', 'knop omlijnd', 'Kwam er niet uit');
    lastig.type = 'button';
    lastig.addEventListener('click', function () { beoordeel(false, p, null, null, fr(p)); });

    knoprij.appendChild(gezegd);
    knoprij.appendChild(lastig);
    knoprij.appendChild(luisterKnopje(p));
    vak.appendChild(knoprij);
  }

  /* Verwerkt een antwoord: feedback, score, eventueel herhalen. */
  function beoordeel(goed, zin, optiesVak, gekozenKnop, juisteTekst) {
    var feedback = $('#oefen-feedback');

    if (optiesVak) {
      $$('button', optiesVak).forEach(function (knop) {
        knop.disabled = true;
        if (knop.textContent === juisteTekst) knop.setAttribute('data-staat', 'goed');
      });
      if (!goed && gekozenKnop) gekozenKnop.setAttribute('data-staat', 'fout');
    }

    ronde.geteld++;
    if (goed) {
      ronde.goed++;
      lastigWeghalen(zin.id);
      feedback.textContent = kies(GOED_REACTIES);
      feedback.setAttribute('data-soort', 'goed');
    } else {
      lastigToevoegen(zin.id);
      var extra = ' Het juiste antwoord: ' + juisteTekst;
      /* Fout gegane zinnen komen één keer terug aan het eind van de ronde. */
      if (!ronde.herhaald[zin.id]) {
        ronde.herhaald[zin.id] = true;
        ronde.opdrachten.push(maakOpdracht('nl', zin, ronde.pool));
        feedback.textContent = FOUT_REACTIE + extra + ' ' + HERHAAL_REACTIE;
      } else {
        feedback.textContent = FOUT_REACTIE + extra;
      }
      feedback.setAttribute('data-soort', 'fout');
    }

    var volgendeKnop = $('#oefen-volgende');
    volgendeKnop.hidden = false;
    volgendeKnop.textContent = (ronde.index + 1 >= ronde.opdrachten.length) ? 'Ronde afronden' : 'Volgende';
    volgendeKnop.focus();
    bewaren();
  }

  $('#oefen-volgende').addEventListener('click', function () {
    ronde.index++;
    toonOpdracht();
  });

  function rondeAfronden() {
    bezigMetOefenen = false;
    $('#oefen-ronde').hidden = true;
    $('#oefen-klaar').hidden = false;

    state.scores.push({ datum: Date.now(), goed: ronde.goed, totaal: ronde.geteld });
    state.scores = state.scores.slice(-50);
    bewaren();

    var pct = ronde.geteld ? Math.round(ronde.goed / ronde.geteld * 100) : 0;
    var staart = pct >= 80
      ? 'Dat zit er goed in. Onderweg kom je hier ver mee.'
      : (pct >= 50
        ? 'Prima basis. Nog een rondje en het zakt in.'
        : 'Deze stof is nieuw, dat mag. Herhaling doet de rest.');
    $('#oefen-uitslag').textContent = ronde.goed + ' van ' + ronde.geteld + ' goed. ' + staart;
    werkStatsBij();
    $('#oefen-klaar h1').setAttribute('tabindex', '-1');
    $('#oefen-klaar h1').focus({ preventScroll: true });
  }

  $('#oefen-start').addEventListener('click', startRonde);
  $('#oefen-nogeens').addEventListener('click', startRonde);
  $('#oefen-terug').addEventListener('click', function () {
    bezigMetOefenen = false;
    $('#oefen-klaar').hidden = true;
    $('#oefen-keuze').hidden = false;
    tekenOefenKeuze();
  });
  $('#oefen-stop').addEventListener('click', function () {
    bezigMetOefenen = false;
    $('#oefen-ronde').hidden = true;
    $('#oefen-klaar').hidden = true;
    $('#oefen-keuze').hidden = false;
    tekenOefenKeuze();
  });
  $('#oefen-lastig').addEventListener('click', function () {
    var pool = poolVoorBron('lastig');
    if (pool.length < 4) {
      /* Te weinig lastige zinnen: vul aan met alle zinnen. */
      $('#oefen-bron').value = 'alles';
    } else {
      var optie = $('#oefen-bron').querySelector('option[value="lastig"]');
      if (!optie) {
        optie = el('option', null, 'Zinnen die je lastig vindt');
        optie.value = 'lastig';
        $('#oefen-bron').appendChild(optie);
      }
      $('#oefen-bron').value = 'lastig';
    }
    startRonde();
  });

  /* ===========================================================
     15. Online- en offline-indicator
     =========================================================== */

  function netStatus() {
    var vak = $('#netstatus');
    if (navigator.onLine) {
      vak.dataset.net = 'online';
      vak.textContent = 'Online';
    } else {
      vak.dataset.net = 'offline';
      vak.textContent = 'Offline — werkt gewoon';
    }
  }
  window.addEventListener('online', netStatus);
  window.addEventListener('offline', netStatus);

  /* ===========================================================
     16. Service worker
     =========================================================== */

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {
        /* Bijvoorbeeld bij openen via file:// — de app werkt dan nog steeds,
           alleen zonder offline-cache. */
      });
    });
  }

  /* ===========================================================
     17. Opstarten
     =========================================================== */

  tekenCategorieFilters();
  tekenWoordenlijst();
  tekenZinnenboek();
  tekenRecent();
  tekenFavorieten();
  netStatus();
  werkStatsBij();
  toonScherm('start', { geenFocus: true, geenGeschiedenis: true });
  history.replaceState({ scherm: 'start', les: null }, '', '');
})();
