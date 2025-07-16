import { getPreise } from './ladePreise.js';

// Test-Funktion für Preisberechnung
export async function testPreisberechnung() {
  try {
    const preise = await getPreise();
    
    console.log('=== PREISBERECHNUNG TEST ===');
    console.log('Verfügbare Glasarten:', Object.keys(preise).length);
    
    // Test einiger Glasarten
    const testGlasarten = [
      'Floatglas',
      'ESG',
      'VSG',
      'Ornament 176 Madera weiß',
      'Kathe großgehämmert weiß'
    ];
    
    testGlasarten.forEach(glasart => {
      if (preise[glasart]) {
        console.log(`\n${glasart}:`);
        Object.entries(preise[glasart]).forEach(([staerke, preis]) => {
          console.log(`  ${staerke}mm: ${preis}€/m²`);
        });
      } else {
        console.log(`\n${glasart}: Nicht gefunden`);
      }
    });
    
    // Test-Berechnung für 1m²
    const testBerechnung = {
      typ: 'Floatglas',
      staerke: 6,
      breite: 1000,
      hoehe: 1000,
      form: 'rechteck',
      bohrungen: 0,
      steckdosen: 0,
      kantenlaenge: 0
    };
    
    console.log('\n=== TEST-BERECHNUNG ===');
    console.log('1m² Floatglas 6mm:');
    console.log('Erwarteter Preis:', preise['Floatglas']?.['6'], '€/m²');
    
  } catch (error) {
    console.error('Fehler beim Testen der Preisberechnung:', error);
  }
} 