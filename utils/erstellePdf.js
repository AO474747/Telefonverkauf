import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function erstellePdf({ 
  kundenDaten, 
  positionen, 
  reparatur,
  rabatt,
  lieferung,
  monteur,
  glasGesamtpreis,
  glasGesamtNettopreis,
  reparaturGesamtpreis,
  zwischensumme,
  zwischensummeNetto,
  rabattBetrag,
  gesamtpreis,
  gesamtpreisNetto
}) {
  const doc = new jsPDF();

  // Kopfbereich mit Firmenadresse und Logo
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Glas & Design Glasservice GmbH', 10, 20);
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('Brüsseler Straße 20, 13353 Berlin', 10, 28);
  doc.text('Tel.: (030) 45 48 20 06', 10, 36);
  doc.text('Fax.: (030) 45 37 129', 10, 44);
  doc.text('E-Mail: post@glasdesign-berlin.de', 10, 52);
  
  // Logo hinzufügen (rechts oben) - mit verbesserter Qualität
  try {
    doc.addImage('/data/glasdesign_logo.png', 'PNG', 150, 10, 35, 35, undefined, 'MEDIUM');
  } catch (error) {
    console.warn('Logo konnte nicht geladen werden:', error);
  }
  
  // Angebotstitel (rechts) - entfernt, da redundant
  // doc.setFontSize(12);
  // doc.setFont(undefined, 'bold');
  // doc.text('Glas-Angebot', 105, 30, { align: 'center' });

  // Trennlinie nach Header
  doc.setDrawColor(62, 179, 142); // #3EB38E
  doc.setLineWidth(0.5);
  doc.line(10, 60, 200, 60);

  // Glas-Angebot für - wie ein echter Briefkopf
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Glas-Angebot für:', 10, 70);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  let yPos = 77;
  
  // Firma (falls vorhanden)
  if (kundenDaten.firma) {
    doc.text(kundenDaten.firma, 10, yPos);
    yPos += 6;
  }
  
  // Name
  doc.text(kundenDaten.name, 10, yPos);
  yPos += 6;
  
  // Adresse
  if (kundenDaten.strasse) {
    doc.text(kundenDaten.strasse, 10, yPos);
    yPos += 6;
  }
  
  // PLZ/Ort
  if (kundenDaten.plz || kundenDaten.ort) {
    doc.text(`${kundenDaten.plz || ''} ${kundenDaten.ort || ''}`, 10, yPos);
    yPos += 6;
  }
  
  // Leerzeile vor Kontaktdaten
  yPos += 3;
  
  // Telefon (falls vorhanden)
  if (kundenDaten.telefon) {
    doc.text(`Tel: ${kundenDaten.telefon}`, 10, yPos);
    yPos += 6;
  }
  
  // E-Mail (falls vorhanden)
  if (kundenDaten.email) {
    doc.text(`E-Mail: ${kundenDaten.email}`, 10, yPos);
    yPos += 6;
  }
  
  // Zusatz (falls vorhanden)
  if (kundenDaten.zusatz) {
    doc.text(kundenDaten.zusatz, 10, yPos);
    yPos += 6;
  }

  // Angebotsdetails
  yPos += 5;
  doc.setFont(undefined, 'bold');
  doc.text(`Angebotsdatum: ${new Date().toLocaleDateString("de-DE")}`, 10, yPos);
  yPos += 6;
  doc.text(`Gültig bis: ${kundenDaten.gueltigBis}`, 10, yPos);

  // Trennlinie vor Stückliste
  yPos += 10;
  doc.setDrawColor(62, 179, 142); // #3EB38E
  doc.setLineWidth(0.3);
  doc.line(10, yPos, 200, yPos);

  // Stückliste Überschrift
  yPos += 8;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Stückliste:', 10, yPos);

  // Tabelle mit Positionen
  const tableBody = positionen.map((pos, index) => [
    `${index + 1}.`,
    pos.typ,
    `${pos.staerke} mm`,
    `${pos.breite} × ${pos.hoehe} mm`,
    `${pos.flaeche_m2} m²`,
    `${pos.menge}x`,
    `${pos.bruttopreis} €`,
    `${pos.gesamtpreis} €`
  ]);

  autoTable(doc, {
    head: [['Pos.', 'Glasart', 'Stärke', 'Maße', 'Fläche', 'Menge', 'Einzelpreis', 'Gesamtpreis']],
    body: tableBody,
    startY: yPos + 5,
    headStyles: {
      fillColor: [62, 179, 142], // #3EB38E
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 8,
      cellPadding: 2
    },
    columnStyles: {
      0: { cellWidth: 12 }, // Pos.
      1: { cellWidth: 25 }, // Glasart
      2: { cellWidth: 20 }, // Stärke
      3: { cellWidth: 30 }, // Maße
      4: { cellWidth: 20 }, // Fläche
      5: { cellWidth: 15 }, // Menge
      6: { cellWidth: 25 }, // Einzelpreis
      7: { cellWidth: 25 }  // Gesamtpreis
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250]
    }
  });

  // Preisaufschlüsselung
  const endY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Preisaufschlüsselung:', 10, endY);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  let priceY = endY + 8;
  
  // Glas-Gesamt
  doc.text(`Glas-Gesamt:`, 10, priceY);
  doc.text(`${glasGesamtpreis} €`, 180, priceY, { align: 'right' });
  priceY += 6;
  
  // Glas-Gesamt Nettopreis
  doc.text(`Glas-Gesamt Nettopreis:`, 10, priceY);
  doc.text(`${glasGesamtNettopreis} €`, 180, priceY, { align: 'right' });
  priceY += 6;
  
  // Reparatur (falls vorhanden)
  if (parseFloat(reparaturGesamtpreis) > 0) {
    doc.text(`Reparatur-Gesamt:`, 10, priceY);
    doc.text(`${reparaturGesamtpreis} €`, 180, priceY, { align: 'right' });
    priceY += 6;
  }
  
  // Zwischensumme
  doc.setFont(undefined, 'bold');
  doc.text(`Zwischensumme:`, 10, priceY);
  doc.text(`${zwischensumme} €`, 180, priceY, { align: 'right' });
  
  // Zwischensumme Netto
  doc.text(`Zwischensumme Netto:`, 10, priceY + 6);
  doc.text(`${zwischensummeNetto} €`, 180, priceY + 6, { align: 'right' });
  priceY += 12;
  
  // Lieferkosten (falls aktiviert)
  if (lieferung && lieferung.aktiv) {
    const lieferkosten = lieferung.eigenerPreis > 0 ? lieferung.eigenerPreis : lieferung.standardPreis;
    doc.text(`Lieferkosten:`, 10, priceY);
    doc.text(`${lieferkosten.toFixed(2)} €`, 180, priceY, { align: 'right' });
    priceY += 6;
  }
  
  // Monteur-Kosten (falls aktiviert)
  if (monteur && monteur.aktiv) {
    const stundenpreis = monteur.eigenerPreis > 0 ? monteur.eigenerPreis : monteur.standardStundenpreis;
    const monteurKosten = monteur.anzahl * monteur.stunden * stundenpreis;
    doc.text(`Monteur-Kosten (${monteur.anzahl} Monteur${monteur.anzahl > 1 ? 'e' : ''}, ${monteur.stunden} Stunde${monteur.stunden > 1 ? 'n' : ''}):`, 10, priceY);
    doc.text(`${monteurKosten.toFixed(2)} €`, 180, priceY, { align: 'right' });
    priceY += 6;
  }
  
  // Rabatt (falls vorhanden)
  if (parseFloat(rabattBetrag) > 0) {
    doc.setFont(undefined, 'normal');
    doc.setTextColor(179, 62, 142); // #B33E8E (Magenta)
    
    // Rabatt-Typ anzeigen
    let rabattText = 'Rabatt:';
    if (rabatt && rabatt.typ === 'prozent') {
      rabattText = `Rabatt ${rabatt.wert}%:`;
    } else if (rabatt && rabatt.typ === 'euro') {
      rabattText = `${rabatt.wert} € Rabatt:`;
    }
    
    doc.text(rabattText, 10, priceY);
    doc.text(`-${rabattBetrag} €`, 180, priceY, { align: 'right' });
    doc.setTextColor(0, 0, 0); // Zurück zu schwarz
    priceY += 6;
  }
  
  // Gesamtsumme
  doc.setFont(undefined, 'bold');
  doc.setFontSize(12);
  doc.setTextColor(62, 179, 142); // #3EB38E (Hauptfarbe)
  doc.text(`Gesamtsumme (brutto):`, 10, priceY);
  doc.text(`${gesamtpreis} €`, 180, priceY, { align: 'right' });
  doc.setTextColor(0, 0, 0); // Zurück zu schwarz

  // Gesamtsumme Netto
  doc.text(`Gesamtsumme Netto:`, 10, priceY + 6);
  doc.text(`${gesamtpreisNetto} €`, 180, priceY + 6, { align: 'right' });
  priceY += 12;

  // Trennlinie vor Fußzeile
  const gapAfterTable = 15;
  const textY = priceY + gapAfterTable;
  doc.setDrawColor(62, 179, 142); // #3EB38E
  doc.setLineWidth(0.3);
  doc.line(10, textY - 6, 200, textY - 6);

  // Fußzeile
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.text(`Dieses Angebot ist gültig bis zum ${kundenDaten.gueltigBis}.`, 10, textY);
  doc.text(`Preise verstehen sich netto zzgl. gesetzlicher MwSt. (19%).`, 10, textY + 5);
  doc.text(`Bei Rückfragen stehen wir Ihnen gern zur Verfügung.`, 10, textY + 10);
  
  // Impressum
  doc.text(`Glas & Design Glasservice GmbH`, 10, textY + 18);
  doc.text(`Brüsseler Straße 20, 13353 Berlin`, 10, textY + 23);
  doc.text(`Tel.: (030) 45 48 20 06 | Fax.: (030) 45 37 129`, 10, textY + 28);
  doc.text(`E-Mail: post@glasdesign-berlin.de | Web: www.glasdesign-berlin.de`, 10, textY + 33);
  doc.text(`Geschäftsführer: Abdülakif Çinar`, 10, textY + 38);
  doc.text(`HR Berlin-Charlottenburg | HRB 54100 | USt-ID: DE167868042`, 10, textY + 43);

  // Rückgabe
  const base64 = doc.output('datauristring'); // für EmailJS
  doc.save(`angebot_${kundenDaten.name}_${new Date().toLocaleDateString('de-DE').replace(/\./g, '-')}.pdf`); // lokal speichern

  return base64;
} 