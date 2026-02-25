# SDIS 66 — Carte Prévisionnelle Opérationnelle

## Description

Application Google Apps Script pour la **carte prévisionnelle opérationnelle** du SDIS 66 (Pyrénées-Orientales).  
Elle permet de visualiser sur une carte interactive l'état des effectifs ISP de chaque centre, de comparer l'effectif actuel à l'effectif cible, et de générer automatiquement un **plan de priorisation du recrutement**.

## Fonctionnalités

### 📋 Onglet « ISP »
- Liste de tous les ISP (colonne A)
- Centre d'affectation principal (B) et secondaire (C)
- Listes déroulantes avec les 40 centres du département

### 📊 Onglet « Par Centre »
- Vue triée par groupement (Nord / Ouest / Sud) puis par centre
- Pour chaque centre : liste des agents affectés, effectif actuel (auto), effectif cible (saisie manuelle), taux de couverture
- Code couleur : vert ≥100%, orange ≥75%, rouge <75%

### 🎯 Onglet « Priorisation Recrutement »
- Algorithme étape par étape : recrute toujours **1 ISP dans le centre au taux le plus bas**
- Garantit un remplissage équilibré de tous les centres
- Affiche : étape, action, centre, groupement, effectif après, cible, taux

### 🗺️ Carte interactive (Leaflet)
- 40 centres positionnés par GPS sur le département 66
- Chaque centre = **cercle coupé en diagonale** :
  - Moitié gauche (vert) = effectif actuel
  - Moitié droite (orange) = effectif cible
- Filtres par groupement, tooltips détaillés, panneau latéral
- Adapté mobile et desktop

## Centres (40)

| Groupement | Centres |
|---|---|
| **Nord** (10) | Caudiès, Saint Paul De Fenouillet, Maury, Vingrau, Salses, Le Barcarès, Rivesaltes, Salanque, Agly, Baixas |
| **Ouest** (13) | Sournia, Ille Sur Tet, Vinca, Millas, Prades, Capcir, Olette, Vernet, Font Romeu, Mont Louis, Saillagouse, Cerdagne, Porte |
| **Sud** (17) | Perpignan Nord, Perpignan Sud, Ribéral, Les Aspres, Canet, Saint Cyprien, Elne, Palau, Argelès, Boulou, Céret, Vallespir, St Laurent De Cerdans, Prats, Côte Vermeille, Banyuls, Cerbère |

## Structure du projet

```
├── Code.js                 # Point d'entrée : menu, doGet, fonctions serveur
├── Config.js               # 40 centres avec GPS + groupements + paramètres carte
├── DataService.js          # Lecture ISP, construction par centre, actualisation
├── PriorisationService.js  # Algorithme de priorisation du recrutement
├── SpreadsheetSetup.js     # Création/formatage des 3 onglets
├── MapUtils.js             # Utilitaires géographiques
├── Index.html              # Carte interactive Leaflet avec cercles SVG
├── appsscript.json         # Manifest Google Apps Script
├── .clasp.json             # Configuration clasp (à créer)
├── .claspignore            # Fichiers ignorés par clasp
└── .gitignore
```

## Utilisation

1. Créer un Google Spreadsheet
2. Lier le script (via clasp ou l'éditeur Apps Script)
3. Menu **🗺️ Carte Opérationnelle** → **Initialiser le classeur**
4. Remplir l'onglet **ISP** avec les agents et leurs centres
5. Menu → **Tout actualiser** (reconstruit Par Centre + Priorisation)
6. Menu → **Ouvrir la carte** pour voir la visualisation

## Déploiement

```bash
npm install -g @google/clasp
clasp login
clasp create --type sheets --title "Carte Prévisionnelle Opérationnelle"
clasp push
clasp deploy
```

## Auteur

SDIS 66 — Brice Dubrey
