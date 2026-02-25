/**
 * SDIS 66 — Carte Prévisionnelle Opérationnelle
 * Fichier principal — Point d'entrée de l'application
 */

/**
 * Affiche l'interface web de la carte
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('SDIS 66 — Carte Prévisionnelle Opérationnelle')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Récupère les données de configuration depuis le spreadsheet
 * @returns {Object} Configuration de la carte
 */
function getMapConfig() {
  return Config.getMapSettings();
}

/**
 * Récupère toutes les données opérationnelles pour la carte
 * @returns {Object} Données des casernes, risques, zones, moyens
 */
function getOperationalData() {
  return DataService.getAllData();
}

/**
 * Récupère les données d'une zone spécifique
 * @param {string} zoneId - Identifiant de la zone
 * @returns {Object} Données de la zone
 */
function getZoneDetails(zoneId) {
  return DataService.getZoneById(zoneId);
}

/**
 * Menu personnalisé dans Google Sheets
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('🗺️ Carte Opérationnelle')
    .addItem('Ouvrir la carte', 'openMap')
    .addItem('Rafraîchir les données', 'refreshData')
    .addSeparator()
    .addItem('Configuration', 'openConfig')
    .addToUi();
}

/**
 * Ouvre la carte dans un nouvel onglet
 */
function openMap() {
  var html = HtmlService.createHtmlOutputFromFile('Index')
    .setWidth(1200)
    .setHeight(800);
  SpreadsheetApp.getUi().showModalDialog(html, 'Carte Prévisionnelle Opérationnelle');
}

/**
 * Rafraîchit les données en cache
 */
function refreshData() {
  var cache = CacheService.getScriptCache();
  cache.removeAll(['mapData', 'zones', 'casernes', 'risques']);
  SpreadsheetApp.getActiveSpreadsheet().toast('Données rafraîchies ✅', 'Carte Opérationnelle');
}

/**
 * Ouvre le panneau de configuration
 */
function openConfig() {
  var html = HtmlService.createHtmlOutput('<p>Configuration à venir</p>')
    .setWidth(400)
    .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(html, 'Configuration');
}
