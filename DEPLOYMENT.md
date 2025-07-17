# Deployment auf Netlify

## Vorbereitung

1. **Git Repository erstellen** (falls noch nicht vorhanden):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Auf GitHub/GitLab hochladen**:
   ```bash
   git remote add origin https://github.com/IHR_USERNAME/IHR_REPO_NAME.git
   git push -u origin main
   ```

## Netlify Deployment

### Option 1: Über Netlify Dashboard (Empfohlen)

1. **Netlify Dashboard öffnen**: https://app.netlify.com/
2. **"New site from Git"** klicken
3. **GitHub/GitLab** auswählen und Repository verbinden
4. **Build-Einstellungen**:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **"Deploy site"** klicken

### Option 2: Drag & Drop

1. **Lokal bauen**:
   ```bash
   npm run build
   ```
2. **Dist-Ordner** auf https://app.netlify.com/ ziehen

### Option 3: Netlify CLI

1. **Netlify CLI installieren**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Lokal bauen**:
   ```bash
   npm run build
   ```

3. **Deployen**:
   ```bash
   netlify deploy --prod --dir=dist
   ```

## Umgebungsvariablen (falls benötigt)

Falls Sie EmailJS-Konfiguration haben, können Sie diese in Netlify setzen:

1. **Netlify Dashboard** → **Site settings** → **Environment variables**
2. **Variablen hinzufügen**:
   - `VITE_EMAILJS_PUBLIC_KEY`
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`

## Domain anpassen

1. **Netlify Dashboard** → **Site settings** → **Domain management**
2. **Custom domain** hinzufügen oder **Subdomain** anpassen

## Troubleshooting

### Build-Fehler
- **Node.js Version**: Stellen Sie sicher, dass Node.js 18+ verwendet wird
- **Dependencies**: `npm install` vor dem Build ausführen

### Routing-Probleme
- **SPA-Routing**: Die `_redirects` Datei ist bereits konfiguriert
- **404-Fehler**: Sollten durch die Redirect-Regel behoben werden

### Performance
- **Build-Optimierung**: Vite optimiert automatisch für Production
- **Caching**: Netlify cacht automatisch statische Assets

## Support

Bei Problemen:
1. **Netlify Logs** im Dashboard prüfen
2. **Build-Logs** auf Fehler überprüfen
3. **Lokal testen**: `npm run build && npm run preview` 