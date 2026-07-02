# Guter GeDANKE aufs iPhone bringen (EAS Build)

Diese Anleitung führt dich Schritt für Schritt vom Code zur App auf deinem
iPhone. Alles ist bereits vorkonfiguriert (`eas.json`, Bundle-ID,
Sign in with Apple, Icons) — du brauchst nur noch deine Accounts.

## Voraussetzungen

1. **Expo-Konto** (kostenlos): https://expo.dev/signup
2. **Apple Developer Program** (99 €/Jahr): https://developer.apple.com/programs/
   — Apple verlangt das für jede Installation auf einem echten iPhone
   (außer über einen eigenen Mac mit Xcode).
3. Node.js auf deinem Computer, dann einmalig:

```bash
npm install -g eas-cli
```

## Einmalige Einrichtung

```bash
git clone https://github.com/kattilathubiyon-lab/Gedanke.git
cd Gedanke
git checkout claude/guter-gedanke-app-d3hfl5
npm install

eas login          # mit deinem Expo-Konto anmelden
eas init           # verknüpft das Projekt mit deinem Expo-Konto
```

`eas init` trägt automatisch eine `projectId` in die `app.json` ein —
diese Änderung einfach mit committen.

## Weg A: Direkt auf dein iPhone (Ad-hoc, ohne App Store)

Ideal zum sofortigen Ausprobieren auf deinem eigenen Gerät.

```bash
# 1. Dein iPhone registrieren — öffnet einen Link/QR-Code,
#    den du auf dem iPhone öffnest:
eas device:create

# 2. Build starten (EAS fragt nach deinem Apple-Developer-Login
#    und erstellt Zertifikate & Profile automatisch):
eas build --platform ios --profile preview
```

Nach ca. 10–20 Minuten bekommst du einen Link bzw. QR-Code.
Öffne ihn auf dem iPhone → **Installieren** → die App liegt mit Icon
auf deinem Homescreen.

> Wichtig: Das iPhone muss **vor** dem Build registriert sein (Schritt 1).
> Kommt ein Gerät später dazu, einfach erneut bauen.

## Weg B: TestFlight (empfohlen für dauerhafte Nutzung)

TestFlight-Builds laufen 90 Tage, aktualisieren sich bequem über die
TestFlight-App und funktionieren auf jedem deiner Geräte:

```bash
# Produktions-Build erstellen:
eas build --platform ios --profile production

# Build automatisch zu App Store Connect hochladen:
eas submit --platform ios --latest
```

Danach in [App Store Connect](https://appstoreconnect.apple.com):
**Meine Apps → Guter GeDANKE → TestFlight** — dich selbst als internen
Tester hinzufügen, TestFlight-App auf dem iPhone installieren und
die App laden. Von hier aus ist es später auch nur noch ein kleiner
Schritt zur echten App-Store-Veröffentlichung.

## Was bereits konfiguriert ist

| Einstellung | Wert |
|---|---|
| Bundle-ID | `de.gutergedanke.app` |
| Sign in with Apple | aktiviert (`usesAppleSignIn`) — EAS legt die Capability automatisch an |
| Benachrichtigungen | lokal geplant, kein Push-Server/APNs-Setup nötig |
| Icons & Splash | aus dem Brand-SVG generiert (`node scripts/generate-assets.js`) |
| Build-Nummern | werden bei Produktions-Builds automatisch hochgezählt |

### Build-Profile (`eas.json`)

| Profil | Zweck |
|---|---|
| `preview` | Installation direkt auf registrierten iPhones (Ad-hoc) · Android: APK |
| `preview-simulator` | Build für den iOS-Simulator (nur Mac) |
| `development` | Dev-Client für die Entwicklung mit Hot Reload |
| `production` | App Store / TestFlight |

## Häufige Fragen

**EAS fragt nach meinem Apple-Login — ist das sicher?**
Ja, EAS nutzt ihn nur, um Zertifikate und Provisioning-Profile zu
erstellen, und speichert die Credentials verschlüsselt in deinem
Expo-Konto. Alternativ kannst du Zertifikate manuell hinterlegen
(`eas credentials`).

**Kostet der Build etwas?**
Der kostenlose Expo-Plan enthält ein monatliches Build-Kontingent —
für dieses Projekt völlig ausreichend.

**Und Android?**
`eas build --platform android --profile preview` erzeugt eine APK,
die du ohne Entwicklerkonto direkt installieren kannst.

**Google-Anmeldung aktivieren?**
OAuth-Client-IDs in der Google Cloud Console erstellen und in
`app.json` unter `expo.extra.googleAuth` eintragen. Ohne sie
funktioniert die E-Mail-Anmeldung; auf dem iPhone zusätzlich
Sign in with Apple.
