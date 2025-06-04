# 🧩 Extension Thunderbird – Création de tickets YouTrack

Cette extension Thunderbird ajoute un bouton **"Créer un ticket"** pour transformer un email en **ticket dans YouTrack** (auto-hébergé).  
Elle utilise un **proxy Node.js local** pour contourner les restrictions CORS et parser correctement les emails.

---

## ✅ Fonctionnalités

- 🖱️ Bouton intégré à l’interface de Thunderbird
- ⚙️ Formulaire de configuration (URL, token API, projet)
- 📡 Envoi des tickets via un **proxy local**
- 🔐 Stockage des paramètres via `browser.storage.local`
- 🎨 Support du rendu HTML (signatures, images `cid:` intégrées)
- 📎 Prise en charge des emails en `multipart/alternative`, HTML ou texte brut

---

## 🧠 Pourquoi un proxy Node.js ?

L’API REST de YouTrack ne permet pas d’appels directs depuis Thunderbird à cause des restrictions **CORS**.  
On a donc mis en place un petit **proxy local** pour :

- 🔁 Recevoir les données de l’extension
- 📥 Lire et parser les emails bruts (`raw MIME`) grâce à `mailparser`
- 📤 Envoyer le ticket via l’API REST de YouTrack

---

## 🚀 Lancer le proxy local

### 1. Installer les dépendances (une seule fois)

```bash
cd youtrack-ticket-extension
npm install
````

> Si tu utilises Node.js < 18 :

```bash
npm install node-fetch
```

---

### 2. Lancer le proxy

```bash
node proxy.js
```

Tu devrais voir apparaître :

```
🚀 Proxy YouTrack en écoute sur http://localhost:3000
```

---

## 🧪 Tester dans Thunderbird

1. Ouvrir Thunderbird
2. Menu ☰ > Modules complémentaires > Extensions > ⚙️ > **"Charger un module temporaire…"**
3. Sélectionner le fichier `manifest.json` dans `youtrack-ticket-extension/`
4. Cliquer sur un email > bouton **"Créer un ticket"**
5. Regarder la console (CTRL + SHIFT + J)

---

## 📁 Structure du projet

```
youtrack-ticket-extension/
├── background.js          ← Logique principale
├── icon-16.png            ← Icône du bouton
├── manifest.json          ← Déclaration de l’extension
├── options.html           ← Interface de configuration
├── options.js             ← Sauvegarde/restauration des options
├── proxy.js               ← Serveur proxy Node.js
├── package.json           ← Dépendances du proxy
├── package-lock.json
├── pico-main/             ← (Optionnel) CSS avec Pico
└── node_modules/          ← Créé automatiquement par npm
```

---

## 📦 Générer l’extension `.xpi`

Pour créer une version installable dans Thunderbird :

```bash
rm -rf youtrack-extension.xpi
zip -r youtrack-extension.zip ./*
mv youtrack-extension.zip youtrack-extension.xpi
```

Tu peux ensuite la charger dans Thunderbird comme extension temporaire.

---

## 🛠️ Améliorations futures

* [ ] 🎯 Ajouter des champs personnalisés (tags, priorité…)
* [ ] 📎 Gérer les pièces jointes dans les tickets
* [ ] 🔔 Afficher une popup de confirmation dans Thunderbird
* [ ] ✅ Valider le token API en direct dans l’interface