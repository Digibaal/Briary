/* =============================================================
   Bonjour! — Frans voor onderweg
   data.js — alle cursusinhoud (zinnen, lessen, woorden, getallen)

   Alles staat in één plat zinnenoverzicht (PHRASES). Lessen,
   zinnenboek, oefeningen en favorieten verwijzen allemaal naar
   hetzelfde id, zodat een favoriet overal hetzelfde betekent.

   Velden per zin:
     id    unieke sleutel (ook gebruikt in localStorage)
     fr    Franse zin
     nl    Nederlandse betekenis
     ph    uitspraakhulp voor Nederlandstaligen (niet fonetisch
           perfect, wel verstaanbaar)
     tip   optionele korte gebruikstip
     cat   categorie voor het zinnenboek
     sos   true = noodzin (krijgt extra nadruk)

   Tokens tussen accolades worden vervangen door de instellingen
   van de gebruiker, zie app.js -> fill().
   ============================================================= */

/* Categorieën van het zinnenboek, in vaste volgorde. */
const CATEGORIES = [
  { id: 'begroeten',   label: 'Begroeten' },
  { id: 'voorstellen', label: 'Voorstellen' },
  { id: 'vragen',      label: 'Vragen' },
  { id: 'onderweg',    label: 'Onderweg' },
  { id: 'eten',        label: 'Eten en drinken' },
  { id: 'overnachten', label: 'Overnachten' },
  { id: 'betalen',     label: 'Boodschappen en betalen' },
  { id: 'hond',        label: 'Hond' },
  { id: 'hulp',        label: 'Hulp en noodgevallen' }
];

const PHRASES = [
  /* ---------- Les 1 — Begroeten en beleefd zijn ---------- */
  { id: 'b1', cat: 'begroeten', fr: 'Bonjour', nl: 'Goedendag', ph: 'bon-zjoer',
    tip: 'Werkt van het ochtendgloren tot een uur of zes ’s avonds.' },
  { id: 'b2', cat: 'begroeten', fr: 'Bonsoir', nl: 'Goedenavond', ph: 'bon-swaar',
    tip: 'Vanaf het eind van de middag neemt bonsoir het over.' },
  { id: 'b3', cat: 'begroeten', fr: 'Salut', nl: 'Hoi', ph: 'sa-luu',
    tip: 'Alleen bij mensen die je kent. Tegen een onbekende blijft het bonjour.' },
  { id: 'b4', cat: 'begroeten', fr: 'Au revoir', nl: 'Tot ziens', ph: 'o ruh-vwaar',
    tip: 'Ook als je alleen even rondkeek en weer vertrekt.' },
  { id: 'b5', cat: 'begroeten', fr: 'Merci', nl: 'Dank u / dank je', ph: 'mer-sie' },
  { id: 'b6', cat: 'begroeten', fr: 'Merci beaucoup', nl: 'Hartelijk dank', ph: 'mer-sie bo-koe' },
  { id: 'b7', cat: 'begroeten', fr: 'S’il vous plaît', nl: 'Alstublieft', ph: 'sil voe plè',
    tip: 'Plak dit achter zowat elk verzoek. Het maakt alles beleefd.' },
  { id: 'b8', cat: 'begroeten', fr: 'Excusez-moi', nl: 'Pardon / excuseert u mij', ph: 'eks-kuu-zee mwa',
    tip: 'Gebruik dit om iemand aan te spreken.' },
  { id: 'b9', cat: 'begroeten', fr: 'Pardon', nl: 'Sorry / pardon', ph: 'par-don',
    tip: 'Gebruik dit als je ergens langs moet of iemand aanstoot.' },
  { id: 'b10', cat: 'begroeten', fr: 'Oui', nl: 'Ja', ph: 'wie' },
  { id: 'b11', cat: 'begroeten', fr: 'Non', nl: 'Nee', ph: 'non' },
  { id: 'b12', cat: 'begroeten', fr: 'D’accord', nl: 'Oké / afgesproken', ph: 'da-koor' },

  /* ---------- Les 2 — Jezelf voorstellen ---------- */
  { id: 'v1', cat: 'voorstellen', fr: 'Je m’appelle {naam}.', nl: 'Ik heet {naam}.', ph: 'zjuh ma-pel {naamph}',
    tip: 'Je naam pas je aan bij Instellingen.' },
  { id: 'v2', cat: 'voorstellen', fr: 'Je suis néerlandais{e}.', nl: 'Ik ben {nat}.', ph: 'zjuh swie nee-er-lan-dè{z}' },
  { id: 'v3', cat: 'voorstellen', fr: 'Je viens {landfr}.', nl: 'Ik kom uit {landnl}.', ph: 'zjuh vjan {landph}' },
  { id: 'v4', cat: 'voorstellen', fr: 'Je suis en vacances.', nl: 'Ik ben op vakantie.', ph: 'zjuh swie zan va-kans' },
  { id: 'v5', cat: 'voorstellen', fr: 'Je voyage seul{e}.', nl: 'Ik reis alleen.', ph: 'zjuh vwa-jaazj suhl' },
  { id: 'v6', cat: 'voorstellen', fr: 'Je voyage avec ma chienne {hond}.', nl: 'Ik reis met mijn hond {hond}.', ph: 'zjuh vwa-jaazj a-vek ma sjie-en {hondph}',
    tip: 'Chienne is de vrouwelijke vorm. Een reu is mon chien.' },
  { id: 'v7', cat: 'voorstellen', fr: 'Je ne parle pas bien français.', nl: 'Ik spreek niet goed Frans.', ph: 'zjuh nuh parl pa bjan fran-sè',
    tip: 'Deze zin koopt je meestal geduld en langzamer Frans.' },
  { id: 'v8', cat: 'voorstellen', fr: 'Je parle un peu français.', nl: 'Ik spreek een beetje Frans.', ph: 'zjuh parl un puh fran-sè' },
  { id: 'v9', cat: 'voorstellen', fr: 'Parlez-vous anglais ou néerlandais ?', nl: 'Spreekt u Engels of Nederlands ?', ph: 'par-lee voe an-glè oe nee-er-lan-dè' },
  { id: 'v10', cat: 'voorstellen', fr: 'Pouvez-vous parler plus lentement ?', nl: 'Kunt u langzamer spreken ?', ph: 'poe-vee voe par-lee pluu lan-tuh-man',
    tip: 'De meest bruikbare zin van de hele cursus.' },
  { id: 'v11', cat: 'voorstellen', fr: 'Je ne comprends pas.', nl: 'Ik begrijp het niet.', ph: 'zjuh nuh kom-pran pa' },

  /* ---------- Les 3 — Eenvoudige vragen stellen ---------- */
  { id: 'q1', cat: 'vragen', fr: 'Où est… ?', nl: 'Waar is… ?', ph: 'oe è',
    tip: 'Eén woord erachter is genoeg: Où est la gare ?' },
  { id: 'q2', cat: 'vragen', fr: 'Où sont… ?', nl: 'Waar zijn… ?', ph: 'oe son',
    tip: 'Meervoud. Toiletten zijn in het Frans altijd meervoud: où sont les toilettes ?' },
  { id: 'q3', cat: 'vragen', fr: 'Est-ce que… ?', nl: 'Is / kan / heeft… ?', ph: 'es-kuh',
    tip: 'Zet dit voor een gewone zin en je hebt een vraag.' },
  { id: 'q4', cat: 'vragen', fr: 'Avez-vous… ?', nl: 'Heeft u… ?', ph: 'a-vee voe' },
  { id: 'q5', cat: 'vragen', fr: 'Pouvez-vous m’aider ?', nl: 'Kunt u mij helpen ?', ph: 'poe-vee voe mè-dee' },
  { id: 'q6', cat: 'vragen', fr: 'Combien ça coûte ?', nl: 'Hoeveel kost dit ?', ph: 'kom-bjan sa koet' },
  { id: 'q7', cat: 'vragen', fr: 'À quelle heure… ?', nl: 'Hoe laat… ?', ph: 'a kel ur' },
  { id: 'q8', cat: 'vragen', fr: 'C’est loin ?', nl: 'Is het ver ?', ph: 'sè lwan' },
  { id: 'q9', cat: 'vragen', fr: 'C’est ouvert ?', nl: 'Is het open ?', ph: 'sè-toe-vèr' },
  { id: 'q10', cat: 'vragen', fr: 'C’est fermé ?', nl: 'Is het gesloten ?', ph: 'sè fer-mee' },
  { id: 'q11', cat: 'vragen', fr: 'Je peux… ?', nl: 'Mag / kan ik… ?', ph: 'zjuh puh',
    tip: 'Je peux payer ? Je peux entrer ? Werkt met bijna elk werkwoord.' },
  { id: 'q12', cat: 'vragen', fr: 'Qu’est-ce que c’est ?', nl: 'Wat is dit ?', ph: 'kes-kuh sè',
    tip: 'Handig bij een menukaart vol raadsels.' },

  /* ---------- Les 4 — De weg en vervoer ---------- */
  { id: 'w1', cat: 'onderweg', fr: 'Où est le parking ?', nl: 'Waar is de parkeerplaats ?', ph: 'oe è luh par-king' },
  { id: 'w2', cat: 'onderweg', fr: 'Où sont les toilettes ?', nl: 'Waar zijn de toiletten ?', ph: 'oe son lee twa-let' },
  { id: 'w3', cat: 'onderweg', fr: 'Où est la gare ?', nl: 'Waar is het station ?', ph: 'oe è la gaar' },
  { id: 'w4', cat: 'onderweg', fr: 'Je cherche cette adresse.', nl: 'Ik zoek dit adres.', ph: 'zjuh sjersj set a-dres',
    tip: 'Laat het adres op je telefoon zien terwijl je dit zegt.' },
  { id: 'w5', cat: 'onderweg', fr: 'C’est à gauche ou à droite ?', nl: 'Is het links of rechts ?', ph: 'sè-ta gohsj oe a drwat' },
  { id: 'w6', cat: 'onderweg', fr: 'Tout droit.', nl: 'Rechtdoor.', ph: 'toe drwa',
    tip: 'Let op: tout droit is rechtdoor, à droite is rechtsaf.' },
  { id: 'w7', cat: 'onderweg', fr: 'À gauche.', nl: 'Links.', ph: 'a gohsj' },
  { id: 'w8', cat: 'onderweg', fr: 'À droite.', nl: 'Rechts.', ph: 'a drwat' },
  { id: 'w9', cat: 'onderweg', fr: 'Près d’ici.', nl: 'Dichtbij / hier vlakbij.', ph: 'prè die-sie' },
  { id: 'w10', cat: 'onderweg', fr: 'Loin d’ici.', nl: 'Ver hiervandaan.', ph: 'lwan die-sie' },
  { id: 'w11', cat: 'onderweg', fr: 'Je suis perdu{e}.', nl: 'Ik ben verdwaald.', ph: 'zjuh swie per-duu' },
  { id: 'w12', cat: 'onderweg', fr: 'Pouvez-vous me montrer sur la carte ?', nl: 'Kunt u het mij op de kaart laten zien ?', ph: 'poe-vee voe muh mon-tree suur la kart' },
  { id: 'w13', cat: 'onderweg', fr: 'Cette route est-elle accessible ?', nl: 'Is deze weg begaanbaar ?', ph: 'set roet è-tel ak-se-siebl',
    tip: 'Handig in de bergen of bij wegwerkzaamheden.' },
  { id: 'w14', cat: 'onderweg', fr: 'Où puis-je faire le plein ?', nl: 'Waar kan ik tanken ?', ph: 'oe pwie-zjuh fèr luh plan' },

  /* ---------- Les 5 — Restaurant, café en boodschappen ---------- */
  { id: 'e1', cat: 'eten', fr: 'Une table pour une personne, s’il vous plaît.', nl: 'Een tafel voor één persoon, alstublieft.', ph: 'uun taabl poer uun per-son, sil voe plè' },
  { id: 'e2', cat: 'eten', fr: 'Je voudrais…', nl: 'Ik zou graag… willen', ph: 'zjuh voe-drè',
    tip: 'Beleefder dan je veux. Gebruik deze.' },
  { id: 'e3', cat: 'eten', fr: 'Je prends…', nl: 'Ik neem…', ph: 'zjuh pran' },
  { id: 'e4', cat: 'eten', fr: 'La carte, s’il vous plaît.', nl: 'De menukaart, alstublieft.', ph: 'la kart, sil voe plè' },
  { id: 'e5', cat: 'eten', fr: 'L’addition, s’il vous plaît.', nl: 'De rekening, alstublieft.', ph: 'la-die-sjon, sil voe plè',
    tip: 'De rekening komt in Frankrijk pas als je erom vraagt.' },
  { id: 'e6', cat: 'eten', fr: 'De l’eau plate, s’il vous plaît.', nl: 'Water zonder bubbels, alstublieft.', ph: 'duh lo plat, sil voe plè',
    tip: 'Bubbels wil je? Vraag om de l’eau gazeuse. Gratis kraanwater: une carafe d’eau.' },
  { id: 'e7', cat: 'eten', fr: 'Sans alcool.', nl: 'Zonder alcohol.', ph: 'san-zal-kol' },
  { id: 'e8', cat: 'eten', fr: 'Sans viande.', nl: 'Zonder vlees.', ph: 'san vjand' },
  { id: 'e9', cat: 'eten', fr: 'Je suis allergique à…', nl: 'Ik ben allergisch voor…', ph: 'zjuh swie-za-ler-zjiek a',
    tip: 'Noem het woord erachter rustig en laat het desnoods lezen.' },
  { id: 'e10', cat: 'eten', fr: 'Qu’est-ce que vous recommandez ?', nl: 'Wat raadt u aan ?', ph: 'kes-kuh voe ruh-ko-man-dee' },
  { id: 'e11', cat: 'betalen', fr: 'Je peux payer par carte ?', nl: 'Kan ik met de pinpas betalen ?', ph: 'zjuh puh pè-jee par kart' },
  { id: 'e12', cat: 'betalen', fr: 'Avez-vous de la monnaie ?', nl: 'Heeft u wisselgeld ?', ph: 'a-vee voe duh la mo-nè' },
  { id: 'e13', cat: 'betalen', fr: 'Où est le supermarché ?', nl: 'Waar is de supermarkt ?', ph: 'oe è luh suu-per-mar-sjee' },
  { id: 'e14', cat: 'betalen', fr: 'C’est combien ?', nl: 'Hoeveel is het ?', ph: 'sè kom-bjan' },

  /* ---------- Les 6 — Overnachten ---------- */
  { id: 'h1', cat: 'overnachten', fr: 'J’ai une réservation.', nl: 'Ik heb een reservering.', ph: 'zjee uun ree-zer-va-sjon' },
  { id: 'h2', cat: 'overnachten', fr: 'La réservation est au nom de {naam}.', nl: 'De reservering staat op naam van {naam}.', ph: 'la ree-zer-va-sjon è-to non duh {naamph}' },
  { id: 'h3', cat: 'overnachten', fr: 'À quelle heure est l’arrivée ?', nl: 'Hoe laat kan ik inchecken ?', ph: 'a kel ur è la-rie-vee' },
  { id: 'h4', cat: 'overnachten', fr: 'À quelle heure dois-je partir ?', nl: 'Hoe laat moet ik vertrekken ?', ph: 'a kel ur dwa-zjuh par-tier' },
  { id: 'h5', cat: 'overnachten', fr: 'Où puis-je me garer ?', nl: 'Waar kan ik parkeren ?', ph: 'oe pwie-zjuh muh ga-ree' },
  { id: 'h6', cat: 'overnachten', fr: 'Le Wi-Fi fonctionne-t-il ?', nl: 'Werkt de wifi ?', ph: 'luh wie-fie fonk-sjon-tiel' },
  { id: 'h7', cat: 'overnachten', fr: 'Il y a un problème avec…', nl: 'Er is een probleem met…', ph: 'ie-lie-ja un pro-blem a-vek' },
  { id: 'h8', cat: 'overnachten', fr: 'Je n’ai pas d’eau chaude.', nl: 'Ik heb geen warm water.', ph: 'zjuh nee pa do sjohd' },
  { id: 'h9', cat: 'overnachten', fr: 'Pouvez-vous m’aider ?', nl: 'Kunt u mij helpen ?', ph: 'poe-vee voe mè-dee' },
  { id: 'h10', cat: 'overnachten', fr: 'Les chiens sont-ils admis ?', nl: 'Zijn honden toegestaan ?', ph: 'lee sjie-an son-tiel ad-mie' },

  /* ---------- Les 7 — Reizen met een hond ---------- */
  { id: 'd1', cat: 'hond', fr: 'J’ai un chien.', nl: 'Ik heb een hond.', ph: 'zjee un sjie-an' },
  { id: 'd2', cat: 'hond', fr: 'C’est une femelle.', nl: 'Het is een teefje.', ph: 'sè-tuun fuh-mel' },
  { id: 'd3', cat: 'hond', fr: 'Elle est gentille.', nl: 'Ze is lief.', ph: 'el è zjan-tie-j' },
  { id: 'd4', cat: 'hond', fr: 'Elle peut avoir peur.', nl: 'Ze kan bang zijn.', ph: 'el puh a-vwaar pur' },
  { id: 'd5', cat: 'hond', fr: 'Puis-je entrer avec mon chien ?', nl: 'Mag ik met mijn hond naar binnen ?', ph: 'pwie-zjuh an-tree a-vek mon sjie-an' },
  { id: 'd6', cat: 'hond', fr: 'Les chiens sont-ils autorisés ?', nl: 'Zijn honden toegestaan ?', ph: 'lee sjie-an son-tiel o-to-rie-zee' },
  { id: 'd7', cat: 'hond', fr: 'Dois-je la tenir en laisse ?', nl: 'Moet ik haar aangelijnd houden ?', ph: 'dwa-zjuh la tuh-nier an lès' },
  { id: 'd8', cat: 'hond', fr: 'Y a-t-il de l’eau potable ?', nl: 'Is er drinkwater ?', ph: 'ja-tiel duh lo po-taabl' },
  { id: 'd9', cat: 'hond', fr: 'Où est le vétérinaire le plus proche ?', nl: 'Waar is de dichtstbijzijnde dierenarts ?', ph: 'oe è luh vee-tee-rie-nèr luh pluu prosj' },
  { id: 'd10', cat: 'hond', fr: 'Mon chien est malade.', nl: 'Mijn hond is ziek.', ph: 'mon sjie-an è ma-laad', sos: true },
  { id: 'd11', cat: 'hond', fr: 'Mon chien s’est blessé.', nl: 'Mijn hond heeft zich bezeerd.', ph: 'mon sjie-an sè ble-see', sos: true },
  { id: 'd12', cat: 'hond', fr: 'Ne la touchez pas, s’il vous plaît.', nl: 'Raak haar niet aan, alstublieft.', ph: 'nuh la toe-sjee pa, sil voe plè',
    tip: 'Vriendelijk maar duidelijk. Bij een reu: ne le touchez pas.' },

  /* ---------- Les 8 — Hulp en noodgevallen ---------- */
  { id: 's1', cat: 'hulp', fr: 'Aidez-moi, s’il vous plaît.', nl: 'Helpt u mij, alstublieft.', ph: 'è-dee mwa, sil voe plè', sos: true },
  { id: 's2', cat: 'hulp', fr: 'J’ai besoin d’aide.', nl: 'Ik heb hulp nodig.', ph: 'zjee buh-zwan dèd', sos: true },
  { id: 's3', cat: 'hulp', fr: 'Appelez un médecin.', nl: 'Bel een dokter.', ph: 'a-puh-lee un meed-san', sos: true },
  { id: 's4', cat: 'hulp', fr: 'Appelez la police.', nl: 'Bel de politie.', ph: 'a-puh-lee la po-lies', sos: true,
    tip: 'Europees alarmnummer in Frankrijk: 112.' },
  { id: 's5', cat: 'hulp', fr: 'Où est la pharmacie ?', nl: 'Waar is de apotheek ?', ph: 'oe è la far-ma-sie', sos: true },
  { id: 's6', cat: 'hulp', fr: 'Où est l’hôpital ?', nl: 'Waar is het ziekenhuis ?', ph: 'oe è lo-pie-tal', sos: true },
  { id: 's7', cat: 'hulp', fr: 'Je ne me sens pas bien.', nl: 'Ik voel me niet goed.', ph: 'zjuh nuh muh san pa bjan', sos: true },
  { id: 's8', cat: 'hulp', fr: 'J’ai mal ici.', nl: 'Ik heb hier pijn.', ph: 'zjee mal ie-sie', sos: true,
    tip: 'Wijs erbij. Dat scheelt een hoop woordenschat.' },
  { id: 's9', cat: 'hulp', fr: 'J’ai perdu mes clés.', nl: 'Ik ben mijn sleutels kwijt.', ph: 'zjee per-duu mee klee', sos: true },
  { id: 's10', cat: 'hulp', fr: 'J’ai perdu mon téléphone.', nl: 'Ik ben mijn telefoon kwijt.', ph: 'zjee per-duu mon tee-lee-fon', sos: true },
  { id: 's11', cat: 'hulp', fr: 'Ma voiture est en panne.', nl: 'Mijn auto is kapot.', ph: 'ma vwa-tuur è-tan pan', sos: true },
  { id: 's12', cat: 'hulp', fr: 'C’est urgent.', nl: 'Het is dringend.', ph: 'sè-tuur-zjan', sos: true },
  { id: 's13', cat: 'hulp', fr: 'Ce n’est pas urgent.', nl: 'Het is niet dringend.', ph: 'suh nè pa-zuur-zjan' },

  /* ---------- Extra zinnen: alleen in het zinnenboek ---------- */
  { id: 'x1', cat: 'begroeten', fr: 'Bonne journée !', nl: 'Fijne dag !', ph: 'bon zjoer-nee',
    tip: 'Het standaard afscheid in winkels. Antwoord: vous aussi (u ook).' },
  { id: 'x2', cat: 'begroeten', fr: 'Je ne sais pas.', nl: 'Ik weet het niet.', ph: 'zjuh nuh sè pa' },
  { id: 'x3', cat: 'begroeten', fr: 'Un moment, s’il vous plaît.', nl: 'Een moment, alstublieft.', ph: 'un mo-man, sil voe plè' },
  { id: 'x4', cat: 'betalen', fr: 'Je regarde seulement.', nl: 'Ik kijk alleen even rond.', ph: 'zjuh ruh-gard suhl-man' },
  { id: 'x5', cat: 'betalen', fr: 'Vous ouvrez à quelle heure ?', nl: 'Hoe laat gaat u open ?', ph: 'voe-zoe-vree a kel ur' },
  { id: 'x6', cat: 'eten', fr: 'Un café, s’il vous plaît.', nl: 'Een koffie, alstublieft.', ph: 'un ka-fee, sil voe plè',
    tip: 'Un café is een espresso. Wil je koffie met melk: un café au lait.' },
  { id: 'x7', cat: 'onderweg', fr: 'Je descends ici.', nl: 'Ik stap hier uit.', ph: 'zjuh dee-san ie-sie' },
  { id: 'x8', cat: 'overnachten', fr: 'Le petit-déjeuner est inclus ?', nl: 'Is het ontbijt inbegrepen ?', ph: 'luh puh-tie dee-zjuh-nee è-tan-kluu' }
];

/* De acht lessen. phrases = ids uit PHRASES, in leesvolgorde. */
const LESSONS = [
  { id: 1, title: 'Begroeten en beleefd zijn',
    subtitle: 'De twaalf woorden waar je het langst mee doet',
    intro: 'In Frankrijk begint bijna elk gesprek met bonjour. Ook in een winkel, ook bij een vraag op straat. Zeg je het niet, dan klink je onbedoeld kortaf. Zeg je het wel, dan is de rest bijzaak.',
    phrases: ['b1','b2','b3','b4','b5','b6','b7','b8','b9','b10','b11','b12'] },

  { id: 2, title: 'Jezelf voorstellen',
    subtitle: 'Wie je bent, waar je vandaan komt, en dat je Frans nog groeit',
    intro: 'Je hoeft geen levensverhaal te vertellen. Vier zinnen zijn genoeg: je naam, je land, dat je op vakantie bent en dat je Frans beperkt is. Die laatste zin levert je meestal geduld op. Naam, land en hondennaam pas je aan bij Instellingen.',
    phrases: ['v1','v2','v3','v4','v5','v6','v7','v8','v9','v10','v11'] },

  { id: 3, title: 'Eenvoudige vragen stellen',
    subtitle: 'Eén patroon, tientallen vragen',
    intro: 'Vragen in het Frans hoeven niet ingewikkeld. Neem een vast begin, plak er een woord achter, en klaar. Où est + la gare, le parking, la pharmacie. Avez-vous + du pain, une table, un plan. Zo maak je met tien patronen honderd vragen.',
    phrases: ['q1','q2','q3','q4','q5','q6','q7','q8','q9','q10','q11','q12'] },

  { id: 4, title: 'De weg en vervoer',
    subtitle: 'Vragen, en het antwoord ook begrijpen',
    intro: 'De kunst is niet het vragen, maar het verstaan van het antwoord. Leer daarom vooral tout droit, à gauche en à droite te herkennen. En vraag gerust of iemand het op de kaart wil aanwijzen — dat werkt in elke taal.',
    phrases: ['w1','w2','w3','w4','w5','w6','w7','w8','w9','w10','w11','w12','w13','w14'] },

  { id: 5, title: 'Restaurant, café en boodschappen',
    subtitle: 'Bestellen, betalen en niets krijgen waar je niet tegen kunt',
    intro: 'Je voudrais is je beste vriend: beleefd, kort en overal bruikbaar. Wijs desnoods op de kaart. En onthoud: de rekening komt pas als je erom vraagt, dus l’addition, s’il vous plaît.',
    phrases: ['e1','e2','e3','e4','e5','e6','e7','e8','e9','e10','e11','e12','e13','e14'] },

  { id: 6, title: 'Overnachten',
    subtitle: 'Inchecken, uitchecken en dat ene ding dat het niet doet',
    intro: 'Bij aankomst red je het met twee zinnen. Gaat er iets mis, dan is il y a un problème avec… genoeg — wijs er daarna gewoon naar. Dat is geen slecht Frans, dat is efficiënt.',
    phrases: ['h1','h2','h3','h4','h5','h6','h7','h8','h9','h10'] },

  { id: 7, title: 'Reizen met een hond',
    subtitle: 'Frankrijk is hondvriendelijk, maar vraag het toch even',
    intro: 'Honden mogen in Frankrijk verrassend veel, maar terrassen, winkels en stranden verschillen per plek. Vraag het kort en je bent ervan af. Chien is de reu, chienne het teefje — en elle is zij.',
    phrases: ['d1','d2','d3','d4','d5','d6','d7','d8','d9','d10','d11','d12'] },

  { id: 8, title: 'Hulp en noodgevallen',
    subtitle: 'De zinnen die je hopelijk niet nodig hebt',
    intro: 'Bij stress verdwijnt vreemde taal als eerste. Daarom staat bij elke zin hier de knop Toon groot: je laat het scherm gewoon lezen. Het Europese alarmnummer in Frankrijk is 112.',
    phrases: ['s1','s2','s3','s4','s5','s6','s7','s8','s9','s10','s11','s12','s13'] }
];

/* Snelle woordenlijst. */
const WORDS = [
  { nl: 'hier', fr: 'ici', ph: 'ie-sie' },
  { nl: 'daar', fr: 'là-bas', ph: 'la-ba' },
  { nl: 'links', fr: 'à gauche', ph: 'a gohsj' },
  { nl: 'rechts', fr: 'à droite', ph: 'a drwat' },
  { nl: 'rechtdoor', fr: 'tout droit', ph: 'toe drwa' },
  { nl: 'vandaag', fr: 'aujourd’hui', ph: 'o-zjoer-dwie' },
  { nl: 'morgen', fr: 'demain', ph: 'duh-man' },
  { nl: 'nu', fr: 'maintenant', ph: 'mant-nan' },
  { nl: 'later', fr: 'plus tard', ph: 'pluu taar' },
  { nl: 'open', fr: 'ouvert', ph: 'oe-vèr' },
  { nl: 'gesloten', fr: 'fermé', ph: 'fer-mee' },
  { nl: 'veel', fr: 'beaucoup', ph: 'bo-koe' },
  { nl: 'weinig', fr: 'peu', ph: 'puh' },
  { nl: 'warm', fr: 'chaud', ph: 'sjoh' },
  { nl: 'koud', fr: 'froid', ph: 'frwa' },
  { nl: 'water', fr: 'eau', ph: 'oh' },
  { nl: 'eten', fr: 'nourriture', ph: 'noe-rie-tuur' },
  { nl: 'toilet', fr: 'toilettes', ph: 'twa-let' },
  { nl: 'ingang', fr: 'entrée', ph: 'an-tree' },
  { nl: 'uitgang', fr: 'sortie', ph: 'sor-tie' },
  { nl: 'verboden', fr: 'interdit', ph: 'an-ter-die' },
  { nl: 'toegestaan', fr: 'autorisé', ph: 'o-to-rie-zee' },
  { nl: 'gevaar', fr: 'danger', ph: 'dan-zjee' },
  { nl: 'hulp', fr: 'aide', ph: 'èd' },
  { nl: 'dokter', fr: 'médecin', ph: 'meed-san' },
  { nl: 'apotheek', fr: 'pharmacie', ph: 'far-ma-sie' },
  { nl: 'contant', fr: 'en espèces', ph: 'an-nes-pes' },
  { nl: 'pinpas / bankkaart', fr: 'carte bancaire', ph: 'kart ban-kèr' }
];

/* Getallen 0 t/m 20 en de tientallen tot 100. */
const NUMBERS = [
  { nl: '0', fr: 'zéro', ph: 'zee-ro' },
  { nl: '1', fr: 'un', ph: 'un' },
  { nl: '2', fr: 'deux', ph: 'duh' },
  { nl: '3', fr: 'trois', ph: 'trwa' },
  { nl: '4', fr: 'quatre', ph: 'katr' },
  { nl: '5', fr: 'cinq', ph: 'sank' },
  { nl: '6', fr: 'six', ph: 'sies' },
  { nl: '7', fr: 'sept', ph: 'set' },
  { nl: '8', fr: 'huit', ph: 'wiet' },
  { nl: '9', fr: 'neuf', ph: 'nuhf' },
  { nl: '10', fr: 'dix', ph: 'dies' },
  { nl: '11', fr: 'onze', ph: 'onz' },
  { nl: '12', fr: 'douze', ph: 'doez' },
  { nl: '13', fr: 'treize', ph: 'trèz' },
  { nl: '14', fr: 'quatorze', ph: 'ka-torz' },
  { nl: '15', fr: 'quinze', ph: 'kanz' },
  { nl: '16', fr: 'seize', ph: 'sèz' },
  { nl: '17', fr: 'dix-sept', ph: 'die-set' },
  { nl: '18', fr: 'dix-huit', ph: 'die-zwiet' },
  { nl: '19', fr: 'dix-neuf', ph: 'diez-nuhf' },
  { nl: '20', fr: 'vingt', ph: 'van' },
  { nl: '30', fr: 'trente', ph: 'trant' },
  { nl: '40', fr: 'quarante', ph: 'ka-rant' },
  { nl: '50', fr: 'cinquante', ph: 'san-kant' },
  { nl: '60', fr: 'soixante', ph: 'swa-sant' },
  { nl: '70', fr: 'soixante-dix', ph: 'swa-sant-dies' },
  { nl: '80', fr: 'quatre-vingts', ph: 'katr-van' },
  { nl: '90', fr: 'quatre-vingt-dix', ph: 'katr-van-dies' },
  { nl: '100', fr: 'cent', ph: 'san' }
];

/* Mini-situaties voor de oefening "wat zeg je?" */
const SITUATIONS = [
  { text: 'Je wilt weten waar het toilet is.', answer: 'w2' },
  { text: 'De ober is klaar met afruimen en je wilt afrekenen.', answer: 'e5' },
  { text: 'Iemand ratelt in rap Frans tegen je.', answer: 'v10' },
  { text: 'Je staat in een vreemde straat en weet niet meer waar je bent.', answer: 'w11' },
  { text: 'Je wilt met je hond een café binnenlopen.', answer: 'd5' },
  { text: 'Je komt aan bij je hotel en hebt online geboekt.', answer: 'h1' },
  { text: 'Je hebt hulp nodig en het is dringend.', answer: 's2' },
  { text: 'Je wilt weten of je met de pinpas kunt betalen.', answer: 'e11' },
  { text: 'Je stapt een winkel binnen. Wat zeg je als eerste ?', answer: 'b1' },
  { text: 'Je wilt weten hoeveel iets kost.', answer: 'q6' },
  { text: 'Je zoekt een adres en wilt het laten aanwijzen.', answer: 'w12' },
  { text: 'Je hond is onwel geworden.', answer: 'd10' },
  { text: 'Je bent iets kwijt: je telefoon.', answer: 's10' },
  { text: 'De douche in je kamer blijft koud.', answer: 'h8' },
  { text: 'Je wilt water zonder bubbels bestellen.', answer: 'e6' }
];

/* Snelle opzoektabel id -> zin. */
const PHRASE_BY_ID = PHRASES.reduce(function (map, p) { map[p.id] = p; return map; }, {});

/* In welke les komt een zin voor (voor het zinnenboek). */
LESSONS.forEach(function (les) {
  les.phrases.forEach(function (id) {
    if (PHRASE_BY_ID[id]) PHRASE_BY_ID[id].lesson = les.id;
  });
});
