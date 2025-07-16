// EmailJS Integration für PDF-Versand
// Benötigt: npm install @emailjs/browser

import emailjs from '@emailjs/browser';

// EmailJS Konfiguration
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Ersetzen Sie mit Ihrer Service ID
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Ersetzen Sie mit Ihrer Template ID
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Ersetzen Sie mit Ihrem Public Key

export async function versendeMail({ name, email, pdfBase64 }) {
  try {
    // EmailJS Template-Parameter
    const templateParams = {
      to_name: name,
      to_email: email,
      pdf_attachment: pdfBase64,
      message: `Sehr geehrte(r) ${name},\n\nanbei erhalten Sie Ihr Glas-Angebot als PDF.\n\nMit freundlichen Grüßen\nAkif Telefon Verkauf`
    };

    // E-Mail senden
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    );

    console.log('E-Mail erfolgreich gesendet:', response);
    alert('Angebot wurde erfolgreich per E-Mail versendet!');
    
    return { success: true, message: 'E-Mail erfolgreich gesendet' };
    
  } catch (error) {
    console.error('Fehler beim E-Mail-Versand:', error);
    alert('Fehler beim E-Mail-Versand. Bitte versuchen Sie es erneut.');
    
    return { success: false, error: error.message };
  }
}

// Alternative: Einfache Implementierung ohne EmailJS (für Tests)
export async function versendeMailEinfach({ name, email, pdfBase64 }) {
  // Simuliere E-Mail-Versand
  console.log('E-Mail würde gesendet an:', email);
  console.log('PDF Base64 Länge:', pdfBase64.length);
  
  // Simuliere Verzögerung
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  alert(`Angebot würde an ${email} gesendet werden.\n\nHinweis: Für echten E-Mail-Versand EmailJS konfigurieren.`);
  
  return { success: true, message: 'E-Mail simuliert' };
} 