# 📋 Anleitung: CSV-Preistabelle erstellen

## 🎯 Wie Sie Ihre Preistabelle einbinden

### 1. CSV-Datei erstellen

Erstellen Sie eine Datei `data/preise.csv` mit folgendem Format:

```csv
Glasart,Staerke,PreisProQm
Floatglas,4,48
Floatglas,6,58
Floatglas,8,72
Floatglas,10,85
Floatglas,12,98
ESG,6,68.64
ESG,8,99.51
ESG,10,131.99
ESG,12,165.50
VSG,6,145
VSG,8,170
VSG,10,198
VSG,12,225
```

### 2. Spalten-Format

- **Glasart**: Name der Glasart (z.B. "Floatglas", "ESG", "VSG")
- **Staerke**: Dicke in mm (z.B. 4, 6, 8, 10, 12)
- **PreisProQm**: Preis pro Quadratmeter in Euro

### 3. Ihre 95 Artikel hinzufügen

Fügen Sie alle Ihre Artikel in das gleiche Format ein:

```csv
Glasart,Staerke,PreisProQm
IhreGlasart1,4,45.50
IhreGlasart1,6,55.75
IhreGlasart1,8,68.25
IhreGlasart2,6,72.30
IhreGlasart2,8,89.45
...
```

### 4. Vorteile der CSV-Lösung

✅ **Einfache Verwaltung**: Preise können in Excel bearbeitet werden
✅ **Schnelle Updates**: Neue Preise ohne Code-Änderungen
✅ **Viele Artikel**: Unterstützt beliebig viele Glasarten und Stärken
✅ **Automatische Konvertierung**: Wird automatisch in das richtige Format umgewandelt

### 5. Beispiel für 95 Artikel

Wenn Sie 95 verschiedene Artikel haben, könnte Ihre CSV so aussehen:

```csv
Glasart,Staerke,PreisProQm
Floatglas_Standard,4,48.00
Floatglas_Standard,6,58.00
Floatglas_Standard,8,72.00
Floatglas_Standard,10,85.00
Floatglas_Standard,12,98.00
ESG_Standard,6,68.64
ESG_Standard,8,99.51
ESG_Standard,10,131.99
ESG_Standard,12,165.50
VSG_Standard,6,145.00
VSG_Standard,8,170.00
VSG_Standard,10,198.00
VSG_Standard,12,225.00
Floatglas_Sonnenschutz,4,52.00
Floatglas_Sonnenschutz,6,62.00
...
```

### 6. Testen

Nach dem Erstellen der CSV-Datei:
1. Speichern Sie die Datei als `data/preise.csv`
2. Die Anwendung lädt automatisch die neuen Preise
3. Testen Sie die Preisberechnung mit verschiedenen Glasarten

### 7. Fallback-System

Falls die CSV-Datei nicht geladen werden kann, verwendet die Anwendung automatisch die Standard-Preise als Fallback. 