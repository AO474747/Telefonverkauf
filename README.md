# 🏢 Akif Telefon Verkauf - Glas-Angebotserstellung

Eine React-basierte Webanwendung zur Erstellung von Glas-Angeboten für Akif Telefon Verkauf.

## 🚀 Features

- **Kundendaten-Verwaltung**: Vollständige Erfassung von Kundeninformationen
- **Glaspositionen**: Eingabe verschiedener Glasarten (Floatglas, ESG, VSG) mit Maßen
- **Preisberechnung**: Automatische Berechnung basierend auf Fläche, Glasart und Bearbeitung
- **PDF-Export**: Generierung professioneller Angebote als PDF
- **E-Mail-Versand**: Direkter Versand der Angebote per E-Mail (EmailJS)
- **Responsive Design**: Optimiert für Desktop und mobile Geräte

## 📦 Installation

1. **Abhängigkeiten installieren:**
   ```bash
   npm install
   ```

2. **Entwicklungsserver starten:**
   ```bash
   npm run dev
   ```

3. **Browser öffnen:**
   Die Anwendung läuft unter `http://localhost:3000`

## 🏗️ Projektstruktur

```
Akif Telefon Verkauf/
├── components/
│   └── EingabeFormular.jsx    # Hauptkomponente für die Angebotserstellung
├── data/
│   ├── glasarten.js           # Definition der verfügbaren Glasarten
│   ├── preise.js              # Preislisten für verschiedene Glasarten
│   └── formZuschlaege.js      # Zuschläge für spezielle Formen
├── utils/
│   ├── berechnePreis.js       # Preisberechnungslogik
│   ├── erstellePdf.js         # PDF-Generierung mit jsPDF
│   └── versendeMail.js        # E-Mail-Versand mit EmailJS
├── src/
│   ├── App.jsx                # Haupt-App-Komponente
│   └── main.jsx               # React-Einstiegspunkt
├── style.css                  # Globale Styles
└── index.html                 # HTML-Template
```

## ⚙️ Konfiguration

### EmailJS Setup (für E-Mail-Versand)

1. Registrieren Sie sich bei [EmailJS](https://www.emailjs.com/)
2. Erstellen Sie einen Service (z.B. Gmail)
3. Erstellen Sie ein E-Mail-Template
4. Aktualisieren Sie die Konfiguration in `utils/versendeMail.js`:

```javascript
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
```

## 💰 Preisberechnung

Die Anwendung berechnet Preise basierend auf:

- **Glasart**: Floatglas, ESG, VSG
- **Stärke**: 4-12mm
- **Fläche**: Mindestfläche 0.25m²
- **Formzuschläge**: Für Kreise, Dreiecke, etc.
- **Bearbeitung**: Bohrungen, Steckdosen, Kanten
- **MwSt**: 19% auf den Nettopreis

## 🎨 Verwendete Technologien

- **React 18**: Moderne React-Features
- **Vite**: Schneller Build-Tool
- **jsPDF**: PDF-Generierung
- **EmailJS**: E-Mail-Versand
- **CSS Grid/Flexbox**: Responsive Layout

## 📱 Browser-Support

- Chrome (empfohlen)
- Firefox
- Safari
- Edge

## 🔧 Entwicklung

### Verfügbare Scripts

- `npm run dev` - Startet den Entwicklungsserver
- `npm run build` - Erstellt eine Produktionsversion
- `npm run preview` - Zeigt die Produktionsversion an

### Code-Struktur

- **Komponenten**: Funktionskomponenten mit Hooks
- **State Management**: React useState für lokalen State
- **Styling**: CSS-Klassen mit responsivem Design
- **Daten**: Zentrale Datenstrukturen in `/data`

## 📄 Lizenz

Dieses Projekt ist für Akif Telefon Verkauf entwickelt.

## 🤝 Support

Bei Fragen oder Problemen wenden Sie sich an das Entwicklungsteam. 