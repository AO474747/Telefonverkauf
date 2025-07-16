import { bearbeitung } from '../data/preise.js';
import { formZuschlaege } from '../data/formZuschlaege.js';
import { getPreise } from './ladePreise.js';

export async function berechnePreis({
  typ,        // z. B. ESG
  staerke,    // z. B. 6
  breite,     // mm
  hoehe,      // mm
  form,       // z. B. kreis, rechteck
  bohrungen = 0,
  steckdosen = 0,
  kantenlaenge = 0 // in Meter
}) {
  try {
    const m2Preise = await getPreise();
    
    if (!m2Preise || Object.keys(m2Preise).length === 0) {
      throw new Error('Keine Preise geladen');
    }
    
    const flaeche_m2 = Math.max((breite * hoehe) / 1_000_000, 0.25); // Mindestfläche 0.25 m²
    
    // Konvertiere Stärke zu String für CSV-Lookup
    const staerkeStr = staerke.toString();
    const staerkeNum = parseInt(staerke);
    
    // Debug: Zeige verfügbare Stärken für die Glasart
    console.log(`=== PREISBERECHNUNG DEBUG ===`);
    console.log(`Glasart: ${typ}, Stärke: ${staerke}`);
    console.log(`Verfügbare Stärken für ${typ}:`, Object.keys(m2Preise[typ] || {}));
    
    // Versuche verschiedene Stärke-Formate zu finden
    let grundpreis = 0;
    if (m2Preise?.[typ]) {
      grundpreis = m2Preise[typ][staerkeStr] || 
                   m2Preise[typ][staerkeNum] || 
                   m2Preise[typ][staerke] || 
                   0;
      
      console.log(`Gefundener Preis für ${typ} ${staerke}mm: ${grundpreis}€/m²`);
    } else {
      console.warn(`Glasart ${typ} nicht gefunden in Preistabelle`);
      console.log('Verfügbare Glasarten:', Object.keys(m2Preise));
    }
    
    const glaspreis = grundpreis * flaeche_m2;

    const formZuschlag = formZuschlaege?.[form] ?? 0;

  const bohrungPreis = bohrungen * bearbeitung.bohrung_mittel;
  const steckdosenPreis = steckdosen * bearbeitung.bohrung_steckdose;
  const kantenPreis = kantenlaenge * bearbeitung.kanten_poliert;

  const nettopreis = glaspreis + formZuschlag + bohrungPreis + steckdosenPreis + kantenPreis;
  const mwst = +(nettopreis * 0.19).toFixed(2);
  const bruttopreis = +(nettopreis + mwst).toFixed(2);

  return {
    flaeche_m2: flaeche_m2.toFixed(2),
    nettopreis: nettopreis.toFixed(2),
    mwst,
    bruttopreis
  };
  } catch (error) {
    console.error('Fehler bei der Preisberechnung:', error);
    // Fallback-Werte zurückgeben
    return {
      flaeche_m2: '0.00',
      nettopreis: '0.00',
      mwst: 0,
      bruttopreis: '0.00'
    };
  }
} 