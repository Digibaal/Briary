# Bonjour! — Frans voor onderweg

Een compacte offline PWA met een korte basiscursus Frans voor Nederlandstalige
reizigers. Acht lessen, een doorzoekbaar zinnenboek, oefeningen, favorieten en
voortgang — allemaal lokaal op het apparaat.

Geen framework, geen build, geen backend, geen account, geen externe fonts,
scripts, CDN's of API's. Na het eerste bezoek werkt de app volledig zonder
internet.

## Bestandsstructuur

```
bonjour/
├── index.html              alle schermen (semantische HTML)
├── manifest.json           naam, kleuren, iconen, standalone-weergave
├── sw.js                   service worker: precache + cache-first
├── css/
│   └── styles.css          volledige vormgeving, mobiel als uitgangspunt
├── js/
│   ├── data.js             alle cursusinhoud: zinnen, lessen, woorden, getallen
│   └── app.js              schermen, opslag, oefeningen, uitspraak
└── icons/
    ├── icon-192.png        installatie-icoon
    ├── icon-512.png        installatie-icoon (ook maskable)
    └── apple-touch-icon.png
```

Alle paden zijn relatief, dus de map kan op elke plek onder een domein staan.

## Lokaal draaien

Een service worker werkt alleen via `http://` of `https://`, niet via
`file://`. Start dus een eenvoudige lokale server vanuit de map `bonjour`:

```bash
# Python (staat op vrijwel elke Mac en Linux-machine)
python3 -m http.server 8000

# of Node
npx serve .
```

Open daarna `http://localhost:8000/` in de browser.

## Installeren op je telefoon

1. Zet de map op een webserver met https (of gebruik je lokale server in
   hetzelfde wifi-netwerk).
2. Open de app in Chrome (Android) of Safari (iOS).
3. Android: menu → *App installeren* / *Toevoegen aan startscherm*.
   iOS: deelknop → *Zet op beginscherm*.
4. Open de app vanaf het beginscherm. Hij start dan zonder browserbalk.

Blader na de installatie één keer door de app zodat alles in de cache staat.
Daarna is internet niet meer nodig.

## Offline werking testen

**In de browser op de computer**

1. Open de app en laad de pagina één keer volledig.
2. Open de ontwikkelaarstools → tabblad *Application*.
3. Controleer bij *Service Workers* dat er een actieve worker staat, en bij
   *Cache Storage* dat `bonjour-v1` alle bestanden bevat (html, css, js,
   manifest, iconen).
4. Ga naar het tabblad *Network* en zet *Offline* aan (of vink *Offline* aan
   bij *Service Workers*).
5. Herlaad de pagina. De app hoort normaal te openen; de indicator rechtsboven
   verandert in *Offline — werkt gewoon*.
6. Klik door lessen, zinnenboek, oefeningen en favorieten. Alles moet werken.

**Op de telefoon**

Zet de vliegtuigmodus aan en open de geïnstalleerde app vanaf het beginscherm.

**Na een wijziging in de code**

Verhoog de versie in `sw.js` (`var CACHE = 'bonjour-v1';` → `-v2`) en herlaad
twee keer, of gebruik *Update on reload* in de ontwikkelaarstools. Anders
blijft de oude versie uit de cache komen.

## Wat er lokaal wordt bewaard

In `localStorage`, onder de sleutel `bonjour.v1`:

* voltooide lessen en de laatst geopende les
* favoriete zinnen en recent bekeken zinnen
* oefenscores en zinnen die fout gingen
* instellingen: naam, hondennaam, land en de vrouwelijke of mannelijke vorm

Er worden geen gegevens verzameld of verstuurd. Bij *Voortgang → Opnieuw
beginnen* wordt alles op het apparaat gewist.

## Uitspraak

De app gebruikt de Web Speech API voor Franse uitspraak als het apparaat een
Franse stem heeft. Is die er niet, dan zijn de luisterknoppen uitgeschakeld en
staat de reden bij *Voortgang → Uitspraak*. De fonetische uitspraakhulp staat
altijd bij elke zin, en geen enkele oefening heeft geluid nodig.

## Toegankelijkheid

* Semantische opbouw: `header`, `nav`, `main`, `section`, koppen op volgorde.
* Alles is met het toetsenbord te bedienen; de eerste tabstop is *Naar de
  inhoud*.
* Duidelijke focusmarkering, knoppen van minimaal 44 pixels.
* Statusmeldingen (feedback bij oefeningen, zoekresultaten, offline-indicator)
  worden via `role="status"` doorgegeven aan een schermlezer.
* De beeldvullende weergave is een `dialog` met focusval en sluit met Escape.
* Franse tekst is gemarkeerd met `lang="fr"`, zodat een schermlezer overschakelt.
* `prefers-reduced-motion` wordt gerespecteerd.

## Vormgeving

Alle kleuren, radiussen en schaduwen staan als custom properties bovenaan
`css/styles.css`. De achtergrond is één vast vlak (`body::before`) met drie
zachte kleurvlekken; per scherm wisselen die tinten via
`body[data-scherm="…"]`, wat `app.js` bij elke schermwissel zet. Wil je de
sfeer aanpassen, dan zijn dat de enige twee plekken die je nodig hebt.

Typografie: systeemfont in zwaar gewicht met strakke letterafstand voor de
koppen, en een serif-cursief (`--font-serif`) voor de kleine accentregels, het
woordmerk en de beeldvullende weergave. Geen webfonts, dus niets om te laden.

Backdrop-blur zit alleen op de kop, de navigatiebalk en losse kaarten — niet op
de zinkaarten, omdat daar lange lijsten van komen.

## Inhoud aanpassen

Alle tekst staat in `js/data.js`:

* `PHRASES` — alle zinnen met vertaling, uitspraak, tip en categorie
* `LESSONS` — de acht lessen, met verwijzingen naar zin-id's
* `WORDS` en `NUMBERS` — de snelle woordenlijst en de getallen
* `SITUATIONS` — de mini-situaties voor de oefeningen

Tokens tussen accolades worden ingevuld met de instellingen van de gebruiker:
`{naam}`, `{hond}`, `{landnl}`, `{landfr}`, `{nat}` en `{e}` / `{z}` voor de
vrouwelijke of mannelijke vorm (`néerlandais{e}`).

Voeg je een zin toe, geef hem dan een uniek `id` en een bestaande `cat`, en zet
het id in de `phrases` van een les als hij daar hoort.
