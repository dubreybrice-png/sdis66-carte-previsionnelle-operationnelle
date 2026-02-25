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
    .addItem('🔄 Actualiser Par Centre', 'actualiserParCentre')
    .addItem('🎯 Actualiser Priorisation', 'actualiserPriorisation')
    .addItem('🔄 Tout actualiser', 'toutActualiser')
    .addSeparator()
    .addItem('🗺️ Ouvrir la carte', 'ouvrirCarte')
    .addSeparator()
    .addItem('⚡ Activer mise à jour auto', 'installerTriggerOnEdit')
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

/* ═══════════════════════════════════════════════════════
   TRIGGER onEdit — MISE À JOUR AUTOMATIQUE
   Dès qu'on modifie l'onglet ISP, les onglets Par Centre
   et Priorisation sont recalculés automatiquement.
   ═══════════════════════════════════════════════════════ */

/**
 * Simple trigger onEdit (fonctionne sans installation).
 * Détecte les modifications sur l'onglet ISP et lance la mise à jour.
 */
function onEdit(e) {
  try {
    if (!e || !e.range) return;
    var sheetName = e.range.getSheet().getName();
    // Réagir aux modifs sur l'onglet ISP ou sur la colonne Cible de Par Centre
    if (sheetName === Config.SHEETS.ISP || sheetName === Config.SHEETS.PAR_CENTRE) {
      _planifierMiseAJour();
    }
  } catch (err) {
    // Simple trigger : on ignore silencieusement les erreurs d'auth
  }
}

/**
 * Installable trigger pour onEdit — plus puissant (accès complet aux services).
 * Nécessite d'être installé une fois via le menu.
 */
function onEditInstallable(e) {
  try {
    if (!e || !e.range) return;
    var sheetName = e.range.getSheet().getName();
    if (sheetName === Config.SHEETS.ISP || sheetName === Config.SHEETS.PAR_CENTRE) {
      DataService.actualiserParCentre();
      PriorisationService.actualiserPriorisation();
    }
  } catch (err) {
    Logger.log('onEditInstallable error: ' + err.message);
  }
}

/**
 * Installe le trigger onEdit installable (à faire UNE seule fois).
 * Appelé via le menu "⚡ Activer mise à jour auto".
 */
function installerTriggerOnEdit() {
  // Supprimer les anciens triggers onEditInstallable pour éviter les doublons
  var triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function (t) {
    if (t.getHandlerFunction() === 'onEditInstallable') {
      ScriptApp.deleteTrigger(t);
    }
  });

  // Créer le nouveau trigger
  ScriptApp.newTrigger('onEditInstallable')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onEdit()
    .create();

  SpreadsheetApp.getActiveSpreadsheet().toast(
    'Mise à jour automatique activée ✅\nLes onglets se recalculent à chaque modification.',
    'Carte Opérationnelle', 5
  );
}

/**
 * Anti-rebond pour le simple trigger (ne peut pas appeler les services complets,
 * mais met un flag pour signaler qu'un refresh est nécessaire).
 */
function _planifierMiseAJour() {
  var cache = CacheService.getScriptCache();
  cache.put('needsRefresh', 'true', 10);
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
