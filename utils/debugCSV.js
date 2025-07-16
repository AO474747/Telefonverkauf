// Debug-Funktion für CSV-Ladung
export async function debugCSV() {
  try {
    console.log('=== CSV DEBUG START ===');
    
    // Test 1: Direkter Fetch
    console.log('Test 1: Direkter Fetch der CSV-Datei');
    const response = await fetch('/data/preise.csv');
    console.log('Response Status:', response.status);
    console.log('Response OK:', response.ok);
    
    if (response.ok) {
      const csvText = await response.text();
      console.log('CSV Länge:', csvText.length);
      console.log('Erste 200 Zeichen:', csvText.substring(0, 200));
      
      // Test 2: Parsen
      console.log('\nTest 2: CSV Parsen');
      const lines = csvText.split('\n').filter(line => line.trim());
      console.log('Anzahl Zeilen:', lines.length);
      console.log('Erste Zeile:', lines[0]);
      console.log('Zweite Zeile:', lines[1]);
      
      // Test 3: Preise extrahieren
      console.log('\nTest 3: Preise extrahieren');
      const headers = lines[0].split(';');
      const data = lines.slice(1);
      
      const preise = {};
      data.forEach((line, index) => {
        const values = line.split(';');
        const glasart = values[0];
        const staerke = parseInt(values[1]) || 4;
        const preis = parseFloat(values[2]);
        
        if (!preise[glasart]) {
          preise[glasart] = {};
        }
        
        preise[glasart][staerke] = preis;
        
        if (index < 3) {
          console.log(`Zeile ${index + 1}:`, { glasart, staerke, preis });
        }
      });
      
      console.log('Anzahl Glasarten:', Object.keys(preise).length);
      console.log('Beispiel Floatglas:', preise['Floatglas']);
      
    } else {
      console.error('CSV konnte nicht geladen werden');
    }
    
  } catch (error) {
    console.error('Debug-Fehler:', error);
  }
} 