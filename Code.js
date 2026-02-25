/**
 * SDIS 66 — Carte Prévisionnelle Opérationnelle
 * Point d'entrée principal — Menu, doGet, fonctions serveur
 */

/* ═══════════════════════════════════════════════════════
   WEBAPP
   ═══════════════════════════════════════════════════════ */

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('SDIS 66 — Carte Prévisionnelle Opérationnelle')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/* ═══════════════════════════════════════════════════════
   MENU GOOGLE SHEETS
   ═══════════════════════════════════════════════════════ */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🗺️ Carte Opérationnelle')
    .addItem('📋 Initialiser le classeur', 'initialiserClasseur')
    .addSeparator()
    .addItem('🔄 Actualiser Par Centre', 'actualiserParCentre')
    .addItem('🎯 Actualiser Priorisation', 'actualiserPriorisation')
    .addItem('🔄 Tout actualiser', 'toutActualiser')
    .addSeparator()
    .addItem('🗺️ Ouvrir la carte', 'ouvrirCarte')
    .addToUi();
}

/* ═══════════════════════════════════════════════════════
   ACTIONS MENU
   ═══════════════════════════════════════════════════════ */

function initialiserClasseur() {
  SpreadsheetSetup.initialiser();
}

function actualiserParCentre() {
  DataService.actualiserParCentre();
}

function actualiserPriorisation() {
  PriorisationService.actualiserPriorisation();
}

function toutActualiser() {
  DataService.actualiserParCentre();
  PriorisationService.actualiserPriorisation();
  SpreadsheetApp.getActiveSpreadsheet().toast(
    'Onglets "Par Centre" et "Priorisation" actualisés ✅',
    'Carte Opérationnelle', 5
  );
}

function ouvrirCarte() {
  var html = HtmlService.createHtmlOutputFromFile('Index')
    .setWidth(1300)
    .setHeight(850);
  SpreadsheetApp.getUi().showModalDialog(html, '🗺️ Carte Prévisionnelle Opérationnelle');
}

/* ═══════════════════════════════════════════════════════
   FONCTIONS SERVEUR exposées au client HTML (google.script.run)
   ═══════════════════════════════════════════════════════ */

/**
 * Retourne la config de la carte
 */
function getMapConfig() {
  return Config.MAP;
}

/**
 * Retourne les données de tous les centres pour la carte
 * [{nom, groupement, lat, lng, effectifActuel, effectifCible}]
 */
function getCarteData() {
  return DataService.getCarteData();
}

/**
 * Retourne le plan de priorisation
 */
function getPlanRecrutement() {
  return PriorisationService.genererPlan();
}
