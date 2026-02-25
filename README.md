# SDIS 66 — Carte Prévisionnelle Opérationnelle

## Description

Application Google Apps Script pour la gestion et la visualisation de la **carte prévisionnelle opérationnelle** du SDIS 66 (Service Départemental d'Incendie et de Secours des Pyrénées-Orientales).

## Objectifs

- Centraliser les données opérationnelles sur une carte interactive
- Visualiser les zones de couverture, les casernes, les risques et les moyens
- Aider à la planification et à l'anticipation opérationnelle
- Fournir un outil d'aide à la décision pour les officiers

## Structure du projet

```
sdis66-carte-previsionnelle-operationnelle/
├── appsscript.json       # Configuration Google Apps Script
├── Code.js               # Logique serveur principale
├── Index.html            # Interface utilisateur (carte)
├── Config.js             # Configuration et paramètres
├── MapUtils.js           # Utilitaires cartographiques
├── DataService.js        # Service d'accès aux données
├── .clasp.json           # Configuration clasp (déploiement)
├── .claspignore          # Fichiers ignorés par clasp
├── .gitignore            # Fichiers ignorés par git
└── README.md             # Ce fichier
```

## Technologies

- **Google Apps Script** — Backend et hébergement
- **Google Sheets** — Source de données
- **Leaflet.js / Google Maps** — Visualisation cartographique
- **HTML/CSS/JS** — Interface utilisateur

## Déploiement

1. Installer [clasp](https://github.com/google/clasp) : `npm install -g @google/clasp`
2. Se connecter : `clasp login`
3. Lier au projet : configurer `.clasp.json`
4. Pousser le code : `clasp push`
5. Déployer en webapp : `clasp deploy`

## Auteur

SDIS 66 — Brice Dubrey
