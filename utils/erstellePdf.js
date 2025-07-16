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

  // Kopfbereich mit Firmenlogo/Header
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('Telefon Verkauf', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont(undefined, 'normal');
  doc.text('Glas-Angebot', 105, 30, { align: 'center' });

  // Trennlinie nach Header
  doc.setDrawColor(62, 179, 142); // #3EB38E
  doc.setLineWidth(0.5);
  doc.line(10, 35, 200, 35);

  // Kundendaten
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Kundendaten:', 10, 45);
  
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10);
  let yPos = 52;
  
  if (kundenDaten.firma) {
    doc.text(`Firma: ${kundenDaten.firma}`, 10, yPos);
    yPos += 6;
  }
  
  doc.text(`Name: ${kundenDaten.name}`, 10, yPos);
  yPos += 6;
  
  if (kundenDaten.strasse) {
    doc.text(`Adresse: ${kundenDaten.strasse}`, 10, yPos);
    yPos += 6;
  }
  
  if (kundenDaten.plz || kundenDaten.ort) {
    doc.text(`PLZ/Ort: ${kundenDaten.plz || ''} ${kundenDaten.ort || ''}`, 10, yPos);
    yPos += 6;
  }
  
  if (kundenDaten.telefon) {
    doc.text(`Telefon: ${kundenDaten.telefon}`, 10, yPos);
    yPos += 6;
  }
  
  if (kundenDaten.email) {
    doc.text(`E-Mail: ${kundenDaten.email}`, 10, yPos);
    yPos += 6;
  }
  
  if (kundenDaten.zusatz) {
    doc.text(`Zusatz: ${kundenDaten.zusatz}`, 10, yPos);
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
    doc.text(`Rabatt:`, 10, priceY);
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
  
  // Kontaktdaten
  doc.text(`Kontakt: Telefon Verkauf | Tel: [Ihre Telefonnummer] | E-Mail: [Ihre E-Mail]`, 10, textY + 18);

  // Rückgabe
  const base64 = doc.output('datauristring'); // für EmailJS
  doc.save(`angebot_${kundenDaten.name}_${new Date().toLocaleDateString('de-DE').replace(/\./g, '-')}.pdf`); // lokal speichern

  return base64;
} 