# Glas-Angebotserstellung

Eine moderne React-Anwendung zur Erstellung von Glas-Angeboten mit automatischer Preisberechnung, PDF-Export und E-Mail-Versand.

## Features

- ✅ **Dynamische Glasarten** aus CSV-Datei
- ✅ **Automatische Preisberechnung** mit MwSt
- ✅ **Lieferkosten und Monteur-Kosten** mit Brutto-Berechnung
- ✅ **Rabatt-System** (Prozent oder Betrag)
- ✅ **PDF-Export** mit professionellem Layout
- ✅ **E-Mail-Versand** über EmailJS
- ✅ **Responsive Design** mit moderner UI
- ✅ **CSV-Preisverwaltung** für einfache Aktualisierung

## Technologie

- **React 18** mit Hooks
- **Vite** für schnelle Entwicklung
- **jsPDF** für PDF-Erstellung
- **EmailJS** für E-Mail-Versand
- **Moderne CSS** mit CSS-Variablen

## Installation

```bash
npm install
```

## Entwicklung

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

## Deployment auf Netlify

Siehe [DEPLOYMENT.md](./DEPLOYMENT.md) für detaillierte Anweisungen.

### Schnellstart:

1. **Repository auf GitHub/GitLab hochladen**
2. **Netlify Dashboard** öffnen: https://app.netlify.com/
3. **"New site from Git"** → Repository auswählen
4. **Build-Einstellungen**:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **"Deploy site"** klicken

## Projektstruktur

```
├── components/
│   └── EingabeFormular.jsx    # Hauptkomponente
├── data/
│   ├── formZuschlaege.js      # Formzuschläge
│   ├── glasarten.js           # Glasarten (Legacy)
│   └── preise.js              # Preise für Bearbeitung
├── utils/
│   ├── berechnePreis.js       # Preisberechnung
│   ├── erstellePdf.js         # PDF-Erstellung
│   ├── versendeMail.js        # E-Mail-Versand
│   ├── ladePreise.js          # CSV-Preisverwaltung
│   ├── testPreisberechnung.js # Tests
│   └── debugCSV.js            # Debug-Tools
├── public/
│   ├── _redirects             # Netlify SPA-Routing
│   └── data/                  # CSV-Dateien
└── style.css                  # Globale Styles
```

## Konfiguration

### EmailJS Setup

1. **EmailJS Account** erstellen: https://www.emailjs.com/
2. **Service-ID** und **Template-ID** konfigurieren
3. **Public Key** in der Anwendung verwenden

### CSV-Preisverwaltung

Die Preise werden aus CSV-Dateien geladen:
- `public/data/preise.csv` - Glasarten und Preise
- Automatische Aktualisierung ohne Code-Änderungen

## Support

Bei Fragen oder Problemen:
1. **Build-Logs** in Netlify prüfen
2. **Browser-Konsole** für JavaScript-Fehler
3. **Lokal testen** mit `npm run build && npm run preview` 