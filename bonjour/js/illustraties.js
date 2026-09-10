/* =============================================================
   Bonjour! — Frans voor onderweg
   illustraties.js — platte SVG-taferelen, één per les

   Alles wordt hier met bouwstenen samengesteld: een boog als
   achtergrond, een figuur en per les een eigen rekwisiet. Zo
   blijven de negen taferelen consistent en is een kleur of een
   kapsel op één plek aan te passen.

   Geen externe bestanden: alles is inline SVG, dus scherp op elk
   scherm en beschikbaar zonder internet.
   ============================================================= */

var ILLUSTRATIES = (function () {
  'use strict';

  /* Vaste kleuren van de illustratiestijl. */
  var K = {
    room: '#fdf6ea',
    inkt: '#241c46',
    koraal: '#e8734a',
    mosterd: '#f3b54a',
    munt: '#6ec9b8',
    lucht: '#8fb8e8',
    lila: '#b9a6e8',
    blad: '#7fb98a',
    roze: '#f2a8b8',
    huidLicht: '#e8b98a',
    huidMidden: '#c68642',
    huidDiep: '#96562a'
  };

  /* Elke tekening krijgt eigen verloop-id's, anders botsen ze. */
  var teller = 0;

  function nieuwId(naam) { return 'ill-' + naam + '-' + (++teller); }

  /* --- Bouwstenen ------------------------------------------- */

  /* De gekleurde boog waar het tafereel in staat. */
  function boog(van, naar) {
    var id = nieuwId('boog');
    return '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + van + '"/><stop offset="1" stop-color="' + naar + '"/>' +
      '</linearGradient></defs>' +
      '<path d="M6 212V106a154 98 0 0 1 308 0v106z" fill="url(#' + id + ')"/>';
  }

  /* Halve figuur: hoofd, haar en schouders. */
  function figuur(o) {
    var x = o.x, y = o.y, s = o.schaal || 1;
    var huid = o.huid || K.huidMidden;
    var haar = o.haar || K.inkt;
    var trui = o.trui || K.blad;
    var haarAchter = '';   /* gaat achter het hoofd, bijvoorbeeld lange lokken */
    var haarVoor;          /* de kap over de kruin */

    /* De kap: bovenste helft van het hoofd, met een lichte haargrens. */
    var kap = '<path d="M-26 4a26 26 0 0 1 52 0q-9-9-26-9t-26 9z" fill="' + haar + '"/>';

    if (o.kapsel === 'knot') {
      haarVoor = kap + '<circle cx="0" cy="-30" r="12" fill="' + haar + '"/>' +
                 '<rect x="-5" y="-24" width="10" height="8" rx="4" fill="' + haar + '"/>';
    } else if (o.kapsel === 'lang') {
      haarAchter = '<path d="M-24-14q-14 8-13 32t3 30a9 9 0 0 0 17-2q-6-30-1-56z" fill="' + haar + '"/>' +
                   '<path d="M24-14q14 8 13 32t-3 30a9 9 0 0 1-17-2q6-30 1-56z" fill="' + haar + '"/>';
      haarVoor = kap;
    } else if (o.kapsel === 'krullen') {
      haarVoor = '<g fill="' + haar + '"><circle cx="-17" cy="-13" r="12"/><circle cx="0" cy="-22" r="13"/>' +
                 '<circle cx="17" cy="-13" r="12"/><circle cx="-24" cy="-1" r="9"/><circle cx="24" cy="-1" r="9"/></g>';
    } else { /* kort */
      haarVoor = '<path d="M-26 6a26 26 0 0 1 52 0q-10-11-26-11T-26 6z" fill="' + haar + '"/>';
    }

    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      /* schouders */
      '<path d="M-40 74a40 40 0 0 1 80 0v6h-80z" fill="' + trui + '"/>' +
      /* hals */
      '<rect x="-9" y="28" width="18" height="20" rx="8" fill="' + huid + '"/>' +
      /* hoofd */
      '<g transform="translate(0 8)">' + haarAchter + '</g>' +
      '<circle cx="0" cy="8" r="26" fill="' + huid + '"/>' +
      '<g transform="translate(0 8)">' + haarVoor + '</g>' +
      /* gezicht: gesloten ogen en een glimlach, verder niets */
      '<path d="M-12 6q4 4 8 0M4 6q4 4 8 0" stroke="' + K.inkt + '" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
      '<path d="M-6 17q6 6 12 0" stroke="' + K.inkt + '" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
      (o.wang !== false ? '<circle cx="-17" cy="15" r="4.5" fill="' + K.koraal + '" opacity=".35"/>' +
        '<circle cx="17" cy="15" r="4.5" fill="' + K.koraal + '" opacity=".35"/>' : '') +
      '</g>';
  }

  /* Spraakbel met geluidsgolfjes erin. */
  function bel(x, y, b, h, kleur) {
    var balken = '';
    var hoogtes = [10, 20, 30, 16, 24, 12];
    for (var i = 0; i < 6; i++) {
      var bh = hoogtes[i] * (h / 56);
      balken += '<rect x="' + (x + 14 + i * 11) + '" y="' + (y + h / 2 - bh / 2) +
        '" width="5" height="' + bh + '" rx="2.5" fill="' + (i % 2 ? K.koraal : K.inkt) + '"/>';
    }
    return '<path d="M' + x + ' ' + (y + 18) + 'a18 18 0 0 1 18-18h' + (b - 36) +
      'a18 18 0 0 1 18 18v' + (h - 36) + 'a18 18 0 0 1-18 18h' + -(b - 36) +
      'a18 18 0 0 1-18-18z" fill="' + (kleur || K.room) + '"/>' +
      '<path d="M' + (x + 18) + ' ' + (y + h) + 'h22l-16 20z" fill="' + (kleur || K.room) + '"/>' +
      balken;
  }

  /* Vierpuntige ster. */
  function ster(x, y, r, kleur) {
    return '<path d="M' + x + ' ' + (y - r) +
      'c' + (r * .18) + ' ' + (r * .62) + ' ' + (r * .38) + ' ' + (r * .82) + ' ' + r + ' ' + r +
      'c' + -(r * .62) + ' ' + (r * .18) + ' ' + -(r * .82) + ' ' + (r * .38) + ' ' + -r + ' ' + r +
      'c' + -(r * .18) + ' ' + -(r * .62) + ' ' + -(r * .38) + ' ' + -(r * .82) + ' ' + -r + ' ' + -r +
      'c' + (r * .62) + ' ' + -(r * .18) + ' ' + (r * .82) + ' ' + -(r * .38) + ' ' + r + ' ' + -r + 'z"' +
      ' fill="' + kleur + '"/>';
  }

  function sterren(lijst) {
    return lijst.map(function (s) { return ster(s[0], s[1], s[2], s[3] || K.room); }).join('');
  }

  /* Omhulsel: maakt er een compleet, toegankelijk plaatje van. */
  function svg(inhoud, beschrijving) {
    return '<svg class="tafereel" viewBox="0 0 320 212" role="img" aria-label="' +
      beschrijving.replace(/"/g, '') + '">' + inhoud + '</svg>';
  }

  /* --- De taferelen ------------------------------------------ */

  var scenes = {

    /* Startscherm: iemand die praat, met een spraakbel vol geluid. */
    hero: function () {
      return svg(
        boog('#7fd7d0', '#b9a6e8') +
        bel(120, 26, 168, 56) +
        figuur({ x: 92, y: 96, schaal: 1.05, kapsel: 'knot', haar: K.mosterd, huid: K.huidDiep, trui: K.blad }) +
        '<g transform="translate(238 122)">' +
          '<rect x="-13" y="-56" width="26" height="52" rx="13" fill="' + K.lila + '"/>' +
          '<g stroke="' + K.room + '" stroke-width="2.6" opacity=".75" stroke-linecap="round">' +
            '<path d="M-8-46h16M-8-38h16M-8-30h16M-8-22h16"/>' +
          '</g>' +
          '<path d="M-21-20a21 21 0 0 0 42 0" stroke="' + K.inkt + '" stroke-width="5" fill="none" stroke-linecap="round"/>' +
          '<rect x="-3.5" y="0" width="7" height="30" rx="3.5" fill="' + K.inkt + '"/>' +
          '<rect x="-19" y="30" width="38" height="8" rx="4" fill="' + K.inkt + '"/>' +
        '</g>' +
        sterren([[58, 52, 9], [286, 74, 7], [46, 128, 6, K.mosterd]]),
        'Iemand die Frans spreekt, met een spraakbel vol geluidsgolven en een microfoon');
    },

    /* Les 1 — begroeten: twee mensen die elkaar gedag zeggen. */
    1: function () {
      return svg(
        boog('#8fd9ea', '#7fd0c4') +
        bel(96, 22, 128, 48) +
        figuur({ x: 96, y: 104, schaal: .92, kapsel: 'krullen', haar: K.inkt, huid: K.huidDiep, trui: K.koraal }) +
        figuur({ x: 216, y: 108, schaal: .86, kapsel: 'kort', haar: '#5b4a3a', huid: K.huidLicht, trui: K.lucht }) +
        /* zwaaiende hand */
        '<g transform="translate(174 124) rotate(-12)">' +
          '<rect x="-7" y="-2" width="14" height="34" rx="7" fill="' + K.lucht + '"/>' +
          '<circle cx="0" cy="-9" r="11" fill="' + K.huidLicht + '"/>' +
          '<g stroke="' + K.huidLicht + '" stroke-width="5" stroke-linecap="round">' +
            '<path d="M-7-17v-7M0-19v-9M7-17v-7"/>' +
          '</g>' +
        '</g>' +
        sterren([[62, 60, 8], [268, 52, 9], [286, 118, 6, K.mosterd]]),
        'Twee mensen die elkaar begroeten met een spraakbel');
    },

    /* Les 2 — jezelf voorstellen: figuur met een naamkaartje. */
    2: function () {
      return svg(
        boog('#c3b6f2', '#8fb8e8') +
        figuur({ x: 118, y: 96, schaal: 1.05, kapsel: 'knot', haar: K.mosterd, huid: K.huidDiep, trui: K.munt }) +
        '<g transform="translate(214 92) rotate(-6)">' +
          '<rect x="-46" y="-34" width="92" height="68" rx="12" fill="' + K.room + '"/>' +
          '<rect x="-46" y="-34" width="92" height="20" rx="10" fill="' + K.koraal + '"/>' +
          '<rect x="-30" y="-2" width="60" height="7" rx="3.5" fill="' + K.inkt + '" opacity=".8"/>' +
          '<rect x="-30" y="12" width="38" height="6" rx="3" fill="' + K.inkt + '" opacity=".35"/>' +
        '</g>' +
        sterren([[70, 56, 9], [276, 140, 7, K.mosterd], [62, 140, 6]]),
        'Iemand die zichzelf voorstelt, met een naamkaartje ernaast');
    },

    /* Les 3 — vragen stellen: een grote vraagtekenbel. */
    3: function () {
      return svg(
        boog('#f7cf7e', '#f0a878') +
        figuur({ x: 108, y: 100, schaal: 1, kapsel: 'lang', haar: '#3d2c50', huid: K.huidLicht, trui: K.lila }) +
        '<g transform="translate(224 84)">' +
          '<circle cx="0" cy="0" r="44" fill="' + K.room + '"/>' +
          '<path d="M-13-13a13 13 0 1 1 13 13v9" stroke="' + K.inkt + '" stroke-width="8" fill="none" stroke-linecap="round"/>' +
          '<circle cx="0" cy="25" r="5" fill="' + K.koraal + '"/>' +
          '<path d="M-30 34h20l-12 22z" fill="' + K.room + '"/>' +
        '</g>' +
        sterren([[66, 62, 9], [286, 142, 7], [56, 136, 6, K.koraal]]),
        'Iemand die een vraag stelt, met een groot vraagteken in een spraakbel');
    },

    /* Les 4 — de weg: een wegwijzer met pijlen. */
    4: function () {
      return svg(
        boog('#8fd0ea', '#a8c8f0') +
        figuur({ x: 100, y: 104, schaal: .95, kapsel: 'kort', haar: '#2f2a3d', huid: K.huidMidden, trui: K.koraal }) +
        '<g transform="translate(226 60)">' +
          '<rect x="-4" y="0" width="8" height="120" rx="4" fill="' + K.inkt + '"/>' +
          '<path d="M-52 14h74l16 15-16 15h-74z" fill="' + K.room + '"/>' +
          '<path d="M52 56h-74l-16 15 16 15h74z" fill="' + K.mosterd + '"/>' +
          '<rect x="-40" y="25" width="42" height="7" rx="3.5" fill="' + K.inkt + '" opacity=".7"/>' +
          '<rect x="-2" y="67" width="42" height="7" rx="3.5" fill="' + K.inkt + '" opacity=".7"/>' +
        '</g>' +
        '<ellipse cx="226" cy="184" rx="46" ry="9" fill="' + K.blad + '" opacity=".55"/>' +
        sterren([[64, 58, 8], [284, 44, 7, K.room]]),
        'Iemand bij een wegwijzer met pijlen naar links en rechts');
    },

    /* Les 5 — café: kopje koffie en een croissant op tafel. */
    5: function () {
      return svg(
        boog('#f7c98a', '#f0a0a8') +
        figuur({ x: 104, y: 92, schaal: .95, kapsel: 'krullen', haar: '#4a3520', huid: K.huidMidden, trui: K.munt }) +
        '<rect x="150" y="150" width="150" height="10" rx="5" fill="' + K.inkt + '" opacity=".8"/>' +
        /* kopje */
        '<g transform="translate(196 118)">' +
          '<path d="M-26 0h46v20a20 20 0 0 1-20 20h-6a20 20 0 0 1-20-20z" fill="' + K.room + '"/>' +
          '<path d="M20 6h6a11 11 0 0 1 0 22h-6" stroke="' + K.room + '" stroke-width="7" fill="none"/>' +
          '<rect x="-26" y="-6" width="46" height="8" rx="4" fill="' + K.koraal + '"/>' +
          '<path d="M-14-16q6-8 0-16M0-16q6-8 0-16" stroke="' + K.room + '" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".8"/>' +
        '</g>' +
        /* croissant */
        '<g transform="translate(268 134)">' +
          '<path d="M-22 12a23 23 0 0 1 44 0" stroke="' + K.mosterd + '" stroke-width="19" fill="none" stroke-linecap="round"/>' +
          '<circle cx="-25" cy="13" r="6" fill="' + K.mosterd + '"/>' +
          '<circle cx="25" cy="13" r="6" fill="' + K.mosterd + '"/>' +
          '<path d="M-8-2q8 2 14 8" stroke="#e0a038" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>' +
        '</g>' +
        sterren([[68, 54, 9], [286, 70, 7]]),
        'Iemand aan een cafétafel met een kop koffie en een croissant');
    },

    /* Les 6 — overnachten: koffer en sleutel. */
    6: function () {
      return svg(
        boog('#b9a6e8', '#8fd0d8') +
        figuur({ x: 106, y: 100, schaal: .95, kapsel: 'knot', haar: '#8a4b2a', huid: K.huidLicht, trui: K.lucht }) +
        '<g transform="translate(226 128)">' +
          '<rect x="-46" y="-34" width="92" height="72" rx="12" fill="' + K.koraal + '"/>' +
          '<rect x="-46" y="-6" width="92" height="12" fill="' + K.inkt + '" opacity=".25"/>' +
          '<path d="M-16-34v-10a16 8 0 0 1 32 0v10" stroke="' + K.inkt + '" stroke-width="6" fill="none"/>' +
          '<rect x="-40" y="38" width="14" height="10" rx="4" fill="' + K.inkt + '"/>' +
          '<rect x="26" y="38" width="14" height="10" rx="4" fill="' + K.inkt + '"/>' +
        '</g>' +
        '<g transform="translate(268 66) rotate(24)">' +
          '<circle cx="0" cy="0" r="13" fill="' + K.mosterd + '"/><circle cx="0" cy="0" r="5" fill="' + K.room + '"/>' +
          '<rect x="-3" y="10" width="6" height="34" rx="3" fill="' + K.mosterd + '"/>' +
          '<rect x="0" y="30" width="12" height="6" rx="3" fill="' + K.mosterd + '"/>' +
        '</g>' +
        sterren([[66, 60, 9], [56, 140, 6, K.mosterd]]),
        'Iemand bij een koffer, met een sleutel ernaast');
    },

    /* Les 7 — de hond: figuur met hond aan de lijn. */
    7: function () {
      return svg(
        boog('#a8d8b0', '#8fd0ea') +
        figuur({ x: 100, y: 92, schaal: .92, kapsel: 'lang', haar: K.mosterd, huid: K.huidMidden, trui: K.koraal }) +
        /* hond */
        '<g transform="translate(222 130)">' +
          /* staart */
          '<path d="M-36 4q-16-6-14-24" stroke="#e8c49a" stroke-width="9" fill="none" stroke-linecap="round"/>' +
          /* romp en poten */
          '<ellipse cx="0" cy="16" rx="38" ry="23" fill="#e8c49a"/>' +
          '<rect x="-26" y="30" width="11" height="26" rx="5.5" fill="#dbb489"/>' +
          '<rect x="14" y="30" width="11" height="26" rx="5.5" fill="#dbb489"/>' +
          '<rect x="-12" y="32" width="11" height="24" rx="5.5" fill="#e8c49a"/>' +
          '<rect x="26" y="32" width="11" height="24" rx="5.5" fill="#e8c49a"/>' +
          /* hoofd met snuit */
          '<circle cx="34" cy="-12" r="23" fill="#e8c49a"/>' +
          '<path d="M50-6h14a9 9 0 0 1 9 9v3a7 7 0 0 1-7 7H50z" fill="#f0d3ae"/>' +
          '<ellipse cx="71" cy="1" rx="6" ry="5" fill="' + K.inkt + '"/>' +
          '<path d="M55 12q6 4 12 0" stroke="' + K.inkt + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
          '<circle cx="44" cy="-14" r="3.4" fill="' + K.inkt + '"/>' +
          /* hangoor */
          '<path d="M26-32q-16 2-14 20t16 8q-6-14-2-28z" fill="#c99a68"/>' +
          /* halsband */
          '<path d="M20-2q8 10 20 10" stroke="' + K.koraal + '" stroke-width="7" fill="none" stroke-linecap="round"/>' +
        '</g>' +
        /* lijn van hand naar halsband */
        '<path d="M136 128q52 22 100 12" stroke="' + K.inkt + '" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
        '<ellipse cx="224" cy="186" rx="56" ry="9" fill="' + K.blad + '" opacity=".5"/>' +
        sterren([[64, 56, 9], [284, 60, 7, K.mosterd]]),
        'Iemand die met een hond aan de lijn wandelt');
    },

    /* Les 8 — hulp: apotheekkruis en een telefoon. */
    8: function () {
      return svg(
        boog('#f0b0a0', '#f7cf7e') +
        figuur({ x: 104, y: 100, schaal: .95, kapsel: 'kort', haar: '#2f2a3d', huid: K.huidDiep, trui: K.lucht }) +
        '<g transform="translate(228 86)">' +
          '<rect x="-42" y="-42" width="84" height="84" rx="20" fill="' + K.room + '"/>' +
          '<rect x="-10" y="-26" width="20" height="52" rx="10" fill="' + K.koraal + '"/>' +
          '<rect x="-26" y="-10" width="52" height="20" rx="10" fill="' + K.koraal + '"/>' +
        '</g>' +
        '<g transform="translate(236 168) rotate(-8)">' +
          '<rect x="-22" y="-26" width="44" height="52" rx="9" fill="' + K.inkt + '"/>' +
          '<rect x="-17" y="-20" width="34" height="34" rx="5" fill="' + K.munt + '"/>' +
          '<circle cx="0" cy="19" r="3.5" fill="' + K.room + '"/>' +
        '</g>' +
        sterren([[66, 58, 9], [64, 148, 7, K.room]]),
        'Iemand naast een apotheekkruis en een telefoon om hulp te bellen');
    }
  };

  return {
    hero: function () { return scenes.hero(); },
    les: function (nummer) {
      return scenes[nummer] ? scenes[nummer]() : '';
    }
  };
})();
