import React, { useState, useEffect } from 'react';
import { berechnePreis } from '../utils/berechnePreis';
import { erstellePdf } from '../utils/erstellePdf';
import { versendeMail } from '../utils/versendeMail';
import { getPreise } from '../utils/ladePreise';
import { testPreisberechnung } from '../utils/testPreisberechnung';
import { debugCSV } from '../utils/debugCSV';

const EingabeFormular = () => {
  // Funktion für 14 Tage ab heute
  const getGueltigBis = () => {
    const heute = new Date();
    const in14Tagen = new Date(heute.getTime() + (14 * 24 * 60 * 60 * 1000));
    return in14Tagen.toLocaleDateString('de-DE');
  };

  const [kundenDaten, setKundenDaten] = useState({
    firma: '',
    name: '',
    strasse: '',
    plz: '',
    ort: '',
    telefon: '',
    email: '',
    zusatz: '',
    gueltigBis: getGueltigBis()
  });
  const [eingabe, setEingabe] = useState({
    typ: 'ESG',
    staerke: 6,
    breite: 1000,
    hoehe: 1000,
    form: 'rechteck',
    bohrungen: 0,
    steckdosen: 0,
    kantenlaenge: 0,
    menge: 1
  });
  const [positionen, setPositionen] = useState([]);
  const [reparatur, setReparatur] = useState({
    anzahl: 0,
    preis: 0
  });
  const [rabatt, setRabatt] = useState({
    typ: 'prozent',
    wert: 0
  });
  const [lieferung, setLieferung] = useState({
    aktiv: false,
    standardPreis: 60,
    eigenerPreis: 0
  });
  const [monteur, setMonteur] = useState({
    aktiv: false,
    anzahl: 1,
    stunden: 1,
    standardStundenpreis: 85,
    eigenerPreis: 0
  });

  const [csvGlasarten, setCsvGlasarten] = useState([]);
  const [csvPreise, setCsvPreise] = useState({});
  const [glasartSuche, setGlasartSuche] = useState('');
  const [showGlasartDropdown, setShowGlasartDropdown] = useState(false);

  // Lade Glasarten aus CSV beim Start
  useEffect(() => {
    const ladeGlasarten = async () => {
      try {
        const preise = await getPreise();
        const glasartenListe = Object.keys(preise).sort((a, b) => a.localeCompare(b, 'de'));
        setCsvGlasarten(glasartenListe);
        setCsvPreise(preise);
        
        // Setze erste Glasart als Standard (aber nur wenn noch keine ausgewählt)
        if (glasartenListe.length > 0 && !eingabe.typ) {
          setEingabe(prev => ({ ...prev, typ: glasartenListe[0] }));
        }
        
        // Debug: Zeige verfügbare Glasarten
        console.log('Verfügbare Glasarten:', glasartenListe);
      } catch (error) {
        console.error('Fehler beim Laden der Glasarten:', error);
        // Fallback zu Standard-Glasarten
        setCsvGlasarten(['Floatglas', 'ESG', 'VSG']);
      }
    };
    
    ladeGlasarten();
    
    // Test der CSV-Ladung
    const testCSV = async () => {
      try {
        const preise = await getPreise();
        console.log('=== TEST CSV LADUNG ===');
        console.log('Anzahl Glasarten:', Object.keys(preise).length);
        console.log('Delta weiß:', preise['Delta weiß']);
        console.log('Altdeutsch K weiß:', preise['Altdeutsch K weiß']);
      } catch (error) {
        console.error('CSV Test Fehler:', error);
      }
    };
    testCSV();
  }, []);

  // Gefilterte Glasarten basierend auf Suche
  const gefilterteGlasarten = csvGlasarten.filter(glasart =>
    glasartSuche === '' ? true : glasart.toLowerCase().includes(glasartSuche.toLowerCase())
  );

  // Verfügbare Stärken für die ausgewählte Glasart
  const verfuegbareStaerken = csvPreise[eingabe.typ] ? 
    Object.keys(csvPreise[eingabe.typ])
      .filter(key => !isNaN(parseInt(key))) // Nur numerische Stärken
      .map(Number)
      .sort((a, b) => a - b) : 
    [4, 6, 8, 10, 12];

  // Debug: Zeige verfügbare Stärken
  console.log(`Verfügbare Stärken für ${eingabe.typ}:`, verfuegbareStaerken);
  console.log(`Aktuelle Stärke: ${eingabe.staerke}`);
  console.log(`Ist aktuelle Stärke verfügbar:`, verfuegbareStaerken.includes(eingabe.staerke));

  // Korrigiere Stärke nur beim ersten Laden, nicht bei jeder Änderung
  useEffect(() => {
    if (eingabe.typ && verfuegbareStaerken.length > 0 && !verfuegbareStaerken.includes(eingabe.staerke)) {
      console.log(`Stärke ${eingabe.staerke} nicht verfügbar für ${eingabe.typ}. Setze auf ${verfuegbareStaerken[0]}`);
      setEingabe(prev => ({ ...prev, staerke: verfuegbareStaerken[0] }));
    }
  }, [eingabe.typ]); // Nur bei Glasart-Änderung, nicht bei Stärke-Änderung

  // Schließe Dropdown wenn außerhalb geklickt wird
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.glasart-dropdown-container')) {
        setShowGlasartDropdown(false);
      }
    };

    if (showGlasartDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showGlasartDropdown]);

  // Setze "Gültig bis" beim ersten Laden
  useEffect(() => {
    setKundenDaten(prev => ({
      ...prev,
      gueltigBis: getGueltigBis()
    }));
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    
    // Wenn Glasart geändert wird, prüfe ob die aktuelle Stärke verfügbar ist
    if (name === 'typ') {
      const neueStaerken = csvPreise[value] ? 
        Object.keys(csvPreise[value])
          .filter(key => !isNaN(parseInt(key)))
          .map(Number)
          .sort((a, b) => a - b) : 
        [4, 6, 8, 10, 12];
      
      console.log(`Glasart geändert zu: ${value}`);
      console.log(`Verfügbare Stärken:`, neueStaerken);
      console.log(`Aktuelle Stärke: ${eingabe.staerke}`);
      
      // Prüfe ob die aktuelle Stärke für die neue Glasart verfügbar ist
      const aktuelleStaerkeVerfuegbar = neueStaerken.includes(eingabe.staerke);
      
      setEingabe({ 
        ...eingabe, 
        [name]: value, 
        // Nur Stärke ändern wenn die aktuelle nicht verfügbar ist
        staerke: aktuelleStaerkeVerfuegbar ? eingabe.staerke : (neueStaerken[0] || 4)
      });
    } else {
      setEingabe({ ...eingabe, [name]: value });
    }
  };

  const handleKunde = (e) => {
    const { name, value } = e.target;
    setKundenDaten({ ...kundenDaten, [name]: value });
  };

  const handleReparatur = (e) => {
    const { name, value } = e.target;
    setReparatur({ ...reparatur, [name]: parseFloat(value) || 0 });
  };

  const handleRabatt = (e) => {
    const { name, value } = e.target;
    setRabatt({ ...rabatt, [name]: value });
  };

  const handlePositionHinzufuegen = async () => {
    try {
      const preis = await berechnePreis(eingabe);
      
      const neuePosition = {
        ...eingabe,
        flaeche_m2: preis.flaeche_m2,
        nettopreis: preis.nettopreis,
        bruttopreis: preis.bruttopreis,
        gesamtpreis: (parseFloat(preis.bruttopreis) * eingabe.menge).toFixed(2),
        gesamtNettopreis: (parseFloat(preis.nettopreis) * eingabe.menge).toFixed(2)
      };
      
      setPositionen([...positionen, neuePosition]);
      
      // Formular zurücksetzen
      setEingabe({
        typ: csvGlasarten[0] || 'Einscheibensicherheitsglas (ESG)',
        staerke: 6,
        breite: 1000,
        hoehe: 1000,
        form: 'rechteck',
        bohrungen: 0,
        steckdosen: 0,
        kantenlaenge: 0,
        menge: 1
      });
    } catch (error) {
      console.error('Fehler bei der Preisberechnung:', error);
    }
  };

  const handlePositionLoeschen = (index) => {
    setPositionen(positionen.filter((_, i) => i !== index));
  };

  const handleAllesLoeschen = () => {
    // Alle Positionen löschen
    setPositionen([]);
    
    // Eingabe zurücksetzen
    setEingabe({
      typ: csvGlasarten[0] || 'ESG',
      staerke: 6,
      breite: 1000,
      hoehe: 1000,
      form: 'rechteck',
      bohrungen: 0,
      steckdosen: 0,
      kantenlaenge: 0,
      menge: 1
    });
    
    // Reparatur zurücksetzen
    setReparatur({
      anzahl: 0,
      preis: 0
    });
    
    // Rabatt zurücksetzen
    setRabatt({
      typ: 'prozent',
      wert: 0
    });
    
    // Lieferung zurücksetzen
    setLieferung({
      aktiv: false,
      standardPreis: 60,
      eigenerPreis: 0
    });
    
    // Monteur zurücksetzen
    setMonteur({
      aktiv: false,
      anzahl: 1,
      stunden: 1,
      standardStundenpreis: 85,
      eigenerPreis: 0
    });
  };

  // Berechnung der Gesamtsumme
  const glasGesamtpreis = positionen
    .reduce((sum, pos) => sum + parseFloat(pos.gesamtpreis), 0);

  const glasGesamtNettopreis = positionen
    .reduce((sum, pos) => sum + parseFloat(pos.gesamtNettopreis), 0);

  const reparaturGesamtpreis = reparatur.anzahl * reparatur.preis;
  
  // Hilfsfunktionen für Preisberechnung
  const berechneNettoPreis = () => {
    return glasGesamtNettopreis + reparaturGesamtpreis;
  };
  
  const berechneLieferkosten = () => {
    if (!lieferung.aktiv) return 0;
    return lieferung.eigenerPreis > 0 ? lieferung.eigenerPreis : lieferung.standardPreis;
  };

  const berechneMonteurKosten = () => {
    if (!monteur.aktiv) return 0;
    const stundenpreis = monteur.eigenerPreis > 0 ? monteur.eigenerPreis : monteur.standardStundenpreis;
    return monteur.anzahl * monteur.stunden * stundenpreis;
  };
  
  const berechneRabatt = (basisPreis) => {
    if (rabatt.typ === 'prozent') {
      return (basisPreis * rabatt.wert) / 100;
    } else {
      return rabatt.wert;
    }
  };
  
  const lieferkosten = berechneLieferkosten();
  const monteurKosten = berechneMonteurKosten();
  
  const zwischensumme = glasGesamtpreis + reparaturGesamtpreis + lieferkosten + monteurKosten;
  const zwischensummeNetto = glasGesamtNettopreis + reparaturGesamtpreis + lieferkosten + monteurKosten;
  
  let rabattBetrag = 0;
  if (rabatt.typ === 'prozent') {
    rabattBetrag = (zwischensumme * rabatt.wert) / 100;
  } else {
    rabattBetrag = rabatt.wert;
  }
  
  const gesamtpreis = Math.max(0, zwischensumme - rabattBetrag);
  const gesamtpreisNetto = Math.max(0, zwischensummeNetto - rabattBetrag);

  const handlePdf = () => {
    erstellePdf({ 
      kundenDaten, 
      positionen, 
      reparatur,
      rabatt,
      lieferung,
      monteur,
      glasGesamtpreis: glasGesamtpreis.toFixed(2),
      glasGesamtNettopreis: glasGesamtNettopreis.toFixed(2),
      reparaturGesamtpreis: reparaturGesamtpreis.toFixed(2),
      zwischensumme: zwischensumme.toFixed(2),
      zwischensummeNetto: zwischensummeNetto.toFixed(2),
      rabattBetrag: rabattBetrag.toFixed(2),
      gesamtpreis: gesamtpreis.toFixed(2),
      gesamtpreisNetto: gesamtpreisNetto.toFixed(2)
    });
  };

  const handleMail = async () => {
    const pdfBase64 = erstellePdf({ 
      kundenDaten, 
      positionen, 
      reparatur,
      rabatt,
      lieferung,
      monteur,
      glasGesamtpreis: glasGesamtpreis.toFixed(2),
      glasGesamtNettopreis: glasGesamtNettopreis.toFixed(2),
      reparaturGesamtpreis: reparaturGesamtpreis.toFixed(2),
      zwischensumme: zwischensumme.toFixed(2),
      zwischensummeNetto: zwischensummeNetto.toFixed(2),
      rabattBetrag: rabattBetrag.toFixed(2),
      gesamtpreis: gesamtpreis.toFixed(2),
      gesamtpreisNetto: gesamtpreisNetto.toFixed(2)
    });
    await versendeMail({ name: kundenDaten.name, email: kundenDaten.email, pdfBase64 });
  };

  // Berechne Gesamtpreis
  const berechneGesamtpreis = () => {
    const nettoPreis = berechneNettoPreis();
    const lieferkosten = berechneLieferkosten();
    const monteurKosten = berechneMonteurKosten();
    const rabattBetrag = berechneRabatt(nettoPreis + lieferkosten + monteurKosten);
    return nettoPreis + lieferkosten + monteurKosten - rabattBetrag;
  };

  return (
    <div>
      <div className="kundendaten-block">
        <h3>
          <span className="icon icon-user"></span>
          Kundendaten
        </h3>
        <div className="kundendaten-grid">
          <div className="feld">
            <label>Name *</label>
            <input type="text" name="name" value={kundenDaten.name} onChange={handleKunde} required placeholder="Vollständiger Name" />
          </div>
          <div className="feld">
            <label>E-Mail *</label>
            <input type="email" name="email" value={kundenDaten.email} onChange={handleKunde} required placeholder="ihre.email@beispiel.de" />
          </div>
          <div className="feld">
            <label>Telefon</label>
            <input type="text" name="telefon" value={kundenDaten.telefon} onChange={handleKunde} placeholder="+49 123 456789" />
          </div>
          <div className="feld">
            <label>Firma</label>
            <input type="text" name="firma" value={kundenDaten.firma} onChange={handleKunde} placeholder="Firmenname (optional)" />
          </div>
          <div className="feld feld-full">
            <label>Straße</label>
            <input type="text" name="strasse" value={kundenDaten.strasse} onChange={handleKunde} placeholder="Straße und Hausnummer" />
          </div>
          <div className="feld">
            <label>PLZ</label>
            <input type="text" name="plz" value={kundenDaten.plz} onChange={handleKunde} placeholder="12345" />
          </div>
          <div className="feld">
            <label>Ort</label>
            <input type="text" name="ort" value={kundenDaten.ort} onChange={handleKunde} placeholder="Stadt" />
          </div>
          <div className="feld">
            <label>Zusatz</label>
            <input type="text" name="zusatz" value={kundenDaten.zusatz} onChange={handleKunde} placeholder="Etage, Zimmer, etc." />
          </div>
          <div className="feld">
            <label>Gültig bis</label>
            <input type="text" name="gueltigBis" value={kundenDaten.gueltigBis} onChange={handleKunde} readOnly style={{ backgroundColor: '#f9fafb', cursor: 'not-allowed' }} />
          </div>
        </div>
      </div>

      <div className="glasposition-form">
        <h3>
          <span className="icon icon-tools"></span>
          Glasposition eingeben
        </h3>
        <div className="glasposition-grid">
          <div className="feld">
            <label>Glasart</label>
            <div className="glasart-dropdown-container">
              <input
                type="text"
                value={eingabe.typ || ''}
                onChange={(e) => {
                  setEingabe({ ...eingabe, typ: e.target.value });
                  setGlasartSuche(e.target.value);
                  setShowGlasartDropdown(true);
                }}
                onFocus={() => setShowGlasartDropdown(true)}
                placeholder="Bitte Glasart wählen..."
                className="glasart-input"
              />
              {showGlasartDropdown && (
                <div className="glasart-dropdown">
                  <input
                    type="text"
                    value={glasartSuche}
                    onChange={(e) => setGlasartSuche(e.target.value)}
                    placeholder="Glasart suchen..."
                    className="glasart-suche"
                    autoFocus
                  />
                  <div className="glasart-liste">
                    {gefilterteGlasarten.slice(0, 50).map((glasart) => (
                      <div
                        key={glasart}
                        className="glasart-option"
                        onClick={() => {
                          setEingabe({ ...eingabe, typ: glasart });
                          setGlasartSuche('');
                          setShowGlasartDropdown(false);
                        }}
                      >
                        {glasart}
                      </div>
                    ))}
                    {gefilterteGlasarten.length > 50 && (
                      <div className="glasart-option mehr-ergebnisse">
                        ... und {gefilterteGlasarten.length - 50} weitere (suchen Sie für mehr Ergebnisse)
                      </div>
                    )}
                    {gefilterteGlasarten.length === 0 && (
                      <div className="glasart-option keine-ergebnisse">
                        Keine Ergebnisse gefunden
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="feld">
            <label>Stärke (mm)</label>
            <select name="staerke" value={eingabe.staerke} onChange={handleInput}>
              {verfuegbareStaerken.map(staerke => (
                <option key={staerke} value={staerke}>{staerke} mm</option>
              ))}
            </select>
          </div>
          <div className="feld">
            <label>Breite (mm)</label>
            <input name="breite" type="number" value={eingabe.breite} onChange={handleInput} min="100" placeholder="1000" />
          </div>
          <div className="feld">
            <label>Höhe (mm)</label>
            <input name="hoehe" type="number" value={eingabe.hoehe} onChange={handleInput} min="100" placeholder="1000" />
          </div>
          <div className="feld">
            <label>Form</label>
            <select name="form" value={eingabe.form} onChange={handleInput}>
              <option value="rechteck">Rechteck</option>
              <option value="kreis">Kreis</option>
              <option value="dreieck">Dreieck</option>
              <option value="rundbogen">Rundbogen</option>
              <option value="trapez">Trapez</option>
            </select>
          </div>
          <div className="feld">
            <label>Bohrungen</label>
            <input name="bohrungen" type="number" value={eingabe.bohrungen} onChange={handleInput} min="0" placeholder="0" />
          </div>
          <div className="feld">
            <label>Steckdosen-Bohrungen</label>
            <input name="steckdosen" type="number" value={eingabe.steckdosen} onChange={handleInput} min="0" placeholder="0" />
          </div>
          <div className="feld">
            <label>Kanten (lfdm)</label>
            <input name="kantenlaenge" type="number" value={eingabe.kantenlaenge} onChange={handleInput} min="0" step="0.1" placeholder="0" />
          </div>
          <div className="feld">
            <label>Menge</label>
            <input name="menge" type="number" value={eingabe.menge} onChange={handleInput} min="1" placeholder="1" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button onClick={handlePositionHinzufuegen} className="btn-success">
            <span className="icon icon-plus"></span>
            Position hinzufügen
          </button>
          <button onClick={handleAllesLoeschen} className="btn-danger">
            <span className="icon icon-trash"></span>
            Alles löschen
          </button>
        </div>
      </div>

      <div className="reparatur-section">
        <h3>
          <span className="icon icon-tools"></span>
          Reparatur
        </h3>
        <div className="reparatur-grid">
          <div className="feld">
            <label>Anzahl Reparaturen</label>
            <input name="anzahl" type="number" value={reparatur.anzahl} onChange={handleReparatur} min="0" placeholder="0" />
          </div>
          <div className="feld">
            <label>Preis pro Reparatur (€)</label>
            <input name="preis" type="number" value={reparatur.preis} onChange={handleReparatur} min="0" step="0.01" placeholder="0.00" />
          </div>
        </div>
        {reparatur.anzahl > 0 && (
          <div className="reparatur-info">
            <strong>Reparatur-Gesamt: {reparaturGesamtpreis.toFixed(2)} €</strong>
          </div>
        )}
      </div>

      {positionen.length > 0 && (
        <>
          <div className="card">
            <h3>
              <span className="icon icon-list"></span>
              Angebotsübersicht
            </h3>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Typ</th>
                  <th>Stärke</th>
                  <th>Maße</th>
                  <th>Fläche</th>
                  <th>Menge</th>
                  <th>Netto (€)</th>
                  <th>Brutto (€)</th>
                  <th>Gesamt Netto</th>
                  <th>Gesamt Brutto</th>
                  <th>Aktion</th>
                </tr>
              </thead>
              <tbody>
                {positionen.map((p, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{p.typ}</td>
                    <td>{p.staerke} mm</td>
                    <td>{p.breite}×{p.hoehe}</td>
                    <td>{p.flaeche_m2} m²</td>
                    <td>{p.menge}x</td>
                    <td>{p.nettopreis} €</td>
                    <td>{p.bruttopreis} €</td>
                    <td>{p.gesamtNettopreis} €</td>
                    <td>{p.gesamtpreis} €</td>
                    <td>
                      <button onClick={() => handlePositionLoeschen(i)} className="btn-danger" style={{ padding: '8px 12px', fontSize: '0.75rem' }}>
                        <span className="icon icon-trash"></span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="preisaufschlüsselung">
              <div className="preiszeile">
                <span>Glas-Gesamt (Netto):</span>
                <span>{glasGesamtNettopreis.toFixed(2)} €</span>
              </div>
              <div className="preiszeile">
                <span>Glas-Gesamt (Brutto):</span>
                <span>{glasGesamtpreis.toFixed(2)} €</span>
              </div>
              {reparatur.anzahl > 0 && (
                <div className="preiszeile">
                  <span>Reparatur-Gesamt:</span>
                  <span>{reparaturGesamtpreis.toFixed(2)} €</span>
                </div>
              )}
              <div className="preiszeile zwischensumme">
                <span>Zwischensumme (Brutto):</span>
                <span>{zwischensumme.toFixed(2)} €</span>
              </div>
              {rabatt.wert > 0 && (
                <div className="preiszeile rabatt">
                  <span>Rabatt:</span>
                  <span>-{rabattBetrag.toFixed(2)} €</span>
                </div>
              )}
              <div className="preiszeile gesamtpreis">
                <span><strong>Gesamt (Netto):</strong></span>
                <span><strong>{gesamtpreisNetto.toFixed(2)} €</strong></span>
              </div>
              <div className="preiszeile gesamtpreis">
                <span><strong>Gesamt (Brutto):</strong></span>
                <span><strong>{gesamtpreis.toFixed(2)} €</strong></span>
              </div>
            </div>

            <div style={{ textAlign: 'center', margin: '24px 0' }}>
              <button onClick={handlePdf} className="btn-info">
                <span className="icon icon-pdf"></span>
                PDF speichern
              </button>
              <button onClick={handleMail} className="btn-success">
                <span className="icon icon-mail"></span>
                PDF per Mail senden
              </button>
              <button onClick={handleAllesLoeschen} className="btn-danger" style={{ marginLeft: '12px' }}>
                <span className="icon icon-trash"></span>
                Alles löschen
              </button>
            </div>
          </div>

          <div className="rabatt-block">
            <h3>Rabatt</h3>
            <div className="rabatt-controls">
              <label>
                <input
                  type="radio"
                  name="rabattTyp"
                  value="prozent"
                  checked={rabatt.typ === 'prozent'}
                  onChange={(e) => setRabatt({...rabatt, typ: e.target.value})}
                />
                Prozent
              </label>
              <label>
                <input
                  type="radio"
                  name="rabattTyp"
                  value="betrag"
                  checked={rabatt.typ === 'betrag'}
                  onChange={(e) => setRabatt({...rabatt, typ: e.target.value})}
                />
                Betrag (€)
              </label>
            </div>
            <input
              type="number"
              placeholder="Rabatt"
              value={rabatt.wert}
              onChange={(e) => setRabatt({...rabatt, wert: parseFloat(e.target.value) || 0})}
              className="rabatt-input"
            />
          </div>

          {/* Lieferung Block */}
          <div className="lieferung-block">
            <h3>Lieferung</h3>
            <div className="lieferung-controls">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={lieferung.aktiv}
                  onChange={(e) => setLieferung({...lieferung, aktiv: e.target.checked})}
                />
                Lieferung aktivieren
              </label>
            </div>
            {lieferung.aktiv && (
              <div className="lieferung-details">
                <div className="lieferung-field">
                  <label>Standard Lieferkosten:</label>
                  <span className="standard-preis">60,00 €</span>
                </div>
                <div className="lieferung-field">
                  <label>Eigener Preis (optional):</label>
                  <input
                    type="number"
                    placeholder="0,00"
                    value={lieferung.eigenerPreis}
                    onChange={(e) => setLieferung({...lieferung, eigenerPreis: parseFloat(e.target.value) || 0})}
                    className="eigener-preis-input"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Monteur Block */}
          <div className="monteur-block">
            <h3>Monteur</h3>
            <div className="monteur-controls">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={monteur.aktiv}
                  onChange={(e) => setMonteur({...monteur, aktiv: e.target.checked})}
                />
                Monteur aktivieren
              </label>
            </div>
            {monteur.aktiv && (
              <div className="monteur-details">
                <div className="monteur-field">
                  <label>Anzahl Monteure:</label>
                  <input
                    type="number"
                    min="1"
                    value={monteur.anzahl}
                    onChange={(e) => setMonteur({...monteur, anzahl: parseInt(e.target.value) || 1})}
                    className="monteur-input"
                  />
                </div>
                <div className="monteur-field">
                  <label>Stunden:</label>
                  <input
                    type="number"
                    min="1"
                    value={monteur.stunden}
                    onChange={(e) => setMonteur({...monteur, stunden: parseInt(e.target.value) || 1})}
                    className="monteur-input"
                  />
                </div>
                <div className="monteur-field">
                  <label>Standard Stundenpreis:</label>
                  <span className="standard-preis">85,00 €</span>
                </div>
                <div className="monteur-field">
                  <label>Eigener Stundenpreis (optional):</label>
                  <input
                    type="number"
                    placeholder="0,00"
                    value={monteur.eigenerPreis}
                    onChange={(e) => setMonteur({...monteur, eigenerPreis: parseFloat(e.target.value) || 0})}
                    className="eigener-preis-input"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Preisaufschlüsselung */}
          <div className="preisaufschlüsselung">
            <h3>Preisaufschlüsselung</h3>
            <div className="preis-details">
              <div className="preis-zeile">
                <span>Netto-Preis:</span>
                <span>{berechneNettoPreis().toFixed(2)} €</span>
              </div>
              {lieferung.aktiv && (
                <div className="preis-zeile">
                  <span>Lieferkosten:</span>
                  <span>{berechneLieferkosten().toFixed(2)} €</span>
                </div>
              )}
              {monteur.aktiv && (
                <div className="preis-zeile">
                  <span>Monteur-Kosten:</span>
                  <span>{berechneMonteurKosten().toFixed(2)} €</span>
                </div>
              )}
              {rabatt.wert > 0 && (
                <div className="preis-zeile rabatt-zeile">
                  <span>Rabatt ({rabatt.typ === 'prozent' ? `${rabatt.wert}%` : `${rabatt.wert}€`}):</span>
                  <span>-{berechneRabatt(berechneNettoPreis() + berechneLieferkosten() + berechneMonteurKosten()).toFixed(2)} €</span>
                </div>
              )}
              <div className="preis-zeile gesamt">
                <span>Gesamtpreis (Brutto):</span>
                <span>{berechneGesamtpreis().toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EingabeFormular; 