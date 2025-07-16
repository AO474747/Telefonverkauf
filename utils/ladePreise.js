// CSV-Preistabelle laden und konvertieren
export async function ladePreiseAusCSV() {
  try {
    console.log('=== CSV LADEN START ===');
    const response = await fetch('/data/preise.csv');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    console.log('CSV geladen, Länge:', csvText.length);
    
    // CSV parsen (mit Semikolon als Trennzeichen)
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(';');
    const data = lines.slice(1);
    
    console.log('Headers:', headers);
    console.log('Anzahl Datenzeilen:', data.length);
    
    // In das benötigte Format konvertieren
    const preise = {};
    const glasartenSet = new Set(); // Für eindeutige Glasarten-Liste
    
    data.forEach((line, index) => {
      const values = line.split(';');
      const glasart = values[0];
      const staerke = parseInt(values[1]) || 4; // Fallback auf 4mm wenn leer
      const preis = parseFloat(values[2]);
      
      if (!preise[glasart]) {
        preise[glasart] = {};
      }
      
      // Füge zur eindeutigen Glasarten-Liste hinzu
      glasartenSet.add(glasart);
      
      // Speichere sowohl als String als auch als Number
      preise[glasart][staerke] = preis;
      preise[glasart][staerke.toString()] = preis;
      
      // Erstelle auch Kurznamen für bessere Suche (nur für interne Verwendung)
      if (glasart.includes('Einscheibensicherheitsglas (ESG)')) {
        if (!preise['ESG']) preise['ESG'] = {};
        preise['ESG'][staerke] = preis;
        preise['ESG'][staerke.toString()] = preis;
      }
      
      if (glasart.includes('Verbundsicherheitsglas (VSG)')) {
        if (!preise['VSG']) preise['VSG'] = {};
        preise['VSG'][staerke] = preis;
        preise['VSG'][staerke.toString()] = preis;
      }
      
      // Erstelle auch Kurznamen für Floatglas
      if (glasart.includes('Floatglas')) {
        if (!preise['Floatglas']) preise['Floatglas'] = {};
        preise['Floatglas'][staerke] = preis;
        preise['Floatglas'][staerke.toString()] = preis;
      }
      
      // Debug: Erste 5 Zeilen und ESG/VSG speziell
      if (index < 5 || glasart.includes('ESG') || glasart.includes('VSG')) {
        console.log(`Zeile ${index + 1}:`, { glasart, staerke, preis });
      }
    });
    
    console.log('Geladene Glasarten:', Object.keys(preise).length);
    console.log('Beispiel Delta weiß:', preise['Delta weiß']);
    console.log('Beispiel Altdeutsch K weiß:', preise['Altdeutsch K weiß']);
    console.log('ESG Preise:', preise['ESG']);
    console.log('VSG Preise:', preise['VSG']);
    
    return preise;
  } catch (error) {
    console.error('Fehler beim Laden der Preistabelle:', error);
    // Fallback zu den Standard-Preisen
    return {
      Floatglas: { 4: 48, 6: 58, 8: 72 },
      ESG: { 6: 68.64, 8: 99.51, 10: 131.99 },
      VSG: { 6: 145, 8: 170, 10: 198 }
    };
  }
}

// Preise im Browser-Cache speichern
let preiseCache = null;

export async function getPreise() {
  if (!preiseCache) {
    preiseCache = await ladePreiseAusCSV();
  }
  return preiseCache;
} 