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
    .addItem('👥 Peupler les ISP (1ère fois)', 'peuplerISP')
    .addSeparator()
    .addItem('🔄 Tout actualiser', 'toutActualiser')
    .addSeparator()
    .addItem('🗺️ Ouvrir la carte', 'ouvrirCarte')
    .addToUi();

  // Actualisation automatique à chaque ouverture du classeur
  try {
    DataService.actualiserParCentre();
    PriorisationService.actualiserPriorisation();
  } catch (err) { /* onglets pas encore créés */ }
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

/* ═══════════════════════════════════════════════════════
   TRIGGER onEdit — MISE À JOUR AUTOMATIQUE
   Simple trigger : se déclenche à chaque modification,
   sans aucune installation nécessaire.
   ═══════════════════════════════════════════════════════ */

function onEdit(e) {
  try {
    if (!e || !e.range) return;
    var sheetName = e.range.getSheet().getName();
    if (sheetName === Config.SHEETS.ISP || sheetName === Config.SHEETS.PAR_CENTRE) {
      DataService.actualiserParCentre();
      PriorisationService.actualiserPriorisation();
    }
  } catch (err) {
    Logger.log('onEdit error: ' + err.message);
  }
}

/**
 * Retourne les données du tableau de projection (pour le PDF)
 * [{nom, groupement, effectifActuel, effectifCible, taux}]
 */
function getTableauProjection() {
  var centres = DataService.construireDonneesCentres();
  var result = [];
  Config.CENTRES.forEach(function (c) {
    var d = centres[c.nom];
    if (!d) return;
    var taux = d.effectifCible > 0 ? Math.round((d.effectifActuel / d.effectifCible) * 100) : 0;
    result.push({
      nom: c.nom,
      groupement: c.groupement,
      effectifActuel: d.effectifActuel,
      effectifCible: d.effectifCible,
      taux: taux
    });
  });
  return result;
}
