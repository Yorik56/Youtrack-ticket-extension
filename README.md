# 🧩 Extension Thunderbird - Création de tickets YouTrack

Cette extension Thunderbird ajoute un bouton **"Créer un ticket"** pour transformer un e-mail en **ticket dans YouTrack** (auto-hébergé).  
Elle utilise un **proxy Node.js local** pour contourner les restrictions CORS.

---

## ✅ Fonctionnalités

- 🖱️ Bouton intégré à l'interface de Thunderbird
- ⚙️ Formulaire de configuration (URL, token, projet)
- 📡 Envoi des tickets via un **proxy local**
- 🔐 Stockage des paramètres via `browser.storage.local`
- 🎨 Rendu HTML avec signature + images inline (`cid:` → `base64`)
- 📎 Prend en charge les emails en `multipart/alternative`, HTML ou texte brut

---

## 🧠 Pourquoi un proxy Node.js ?

L’API de YouTrack ne supporte pas les appels directs depuis Thunderbird (CORS, authentification).  
On a donc développé un petit **serveur proxy en local** pour :

- 🔁 Recevoir les données de l’extension
- 📥 Lire et parser les emails bruts via `mailparser`
- 📤 Envoyer un ticket vers l’API REST YouTrack

---

## 🚀 Lancer le proxy local

### 1. Installer les dépendances (une seule fois)

```bash
cd youtrack-ticket-extension
npm install
````

> Si tu utilises Node.js < 18, ajoute aussi :

```bash
npm install node-fetch
```

---

### 2. Lancer le proxy

```bash
node proxy.js
```

Tu devrais voir :

```
🚀 Proxy YouTrack en écoute sur http://localhost:3000
```

---

## 🧪 Tester dans Thunderbird

1. Ouvrir Thunderbird
2. Menu ☰ > Modules complémentaires > Extensions > ⚙️ > **"Charger un module temporaire…"**
3. Sélectionner le fichier `manifest.json` dans `youtrack-ticket-extension/`
4. Sélectionner un email → bouton **"Créer un ticket"**
5. Regarder la console (CTRL+SHIFT+J)

---

## 📦 Structure du projet

```
youtrack-ticket-extension/
├── pico-main/             ← Code de l’extension
│   ├── background.js      ← Logique principale
│   ├── icon-16.png        ← Icône du bouton
│   ├── manifest.json      ← Déclaration de l’extension
│   ├── options.html       ← Interface de config
│   └── options.js         ← Gestion config
├── proxy.js               ← Serveur Node.js local
├── package.json           ← Dépendances proxy
├── package-lock.json
└── node_modules/          ← Généré par npm install
```

---

## 📦 Builder l’extension Thunderbird

Pour créer un fichier `.xpi` installable dans Thunderbird :

```bash
rm -rf youtrack-extension.xpi
zip -r youtrack-extension.zip ./pico-main/*
mv youtrack-extension.zip youtrack-extension.xpi
```

---

## 🛠️ Améliorations futures

* [ ] 🎯 Champs personnalisés (priorité, tags…)
* [ ] 📎 Upload des pièces jointes réelles dans YouTrack
* [ ] 🔔 Popup HTML de confirmation dans Thunderbird
* [ ] ✅ Validation live du token API depuis les options