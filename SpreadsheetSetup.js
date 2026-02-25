/**
 * SDIS 66 — Carte Prévisionnelle Opérationnelle
 * Création et formatage du Google Spreadsheet (3 onglets)
 */

var SpreadsheetSetup = (function () {

  /* ═══════════════════════════════════════════════════════
     INITIALISATION COMPLÈTE
     ═══════════════════════════════════════════════════════ */

  /**
   * Crée / réinitialise les 3 onglets du spreadsheet actif.
   * ➜  Appeler via le menu  🗺️ > Initialiser le classeur
   */
  function initialiser() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    _creerOngletISP(ss);
    _creerOngletParCentre(ss);
    _creerOngletPriorisation(ss);

    // Supprimer "Feuille 1" par défaut si elle existe
    var defaut = ss.getSheetByName('Feuille 1') || ss.getSheetByName('Sheet1');
    if (defaut && ss.getSheets().length > 1) {
      ss.deleteSheet(defaut);
    }

    ss.toast('Classeur initialisé avec les 3 onglets ✅', 'Carte Opérationnelle', 5);
  }

  /* ═══════════════════════════════════════════════════════
     ONGLET 1 — ISP  (liste des agents)
     ═══════════════════════════════════════════════════════ */

  function _creerOngletISP(ss) {
    var nom = Config.SHEETS.ISP;
    var sheet = ss.getSheetByName(nom);
    if (!sheet) {
      sheet = ss.insertSheet(nom, 0);
    } else {
      sheet.clear();
      sheet.clearFormats();
    }

    // En-têtes
    var headers = [['Nom Prénom', 'Centre Principal', 'Centre Secondaire']];
    sheet.getRange(1, 1, 1, 3).setValues(headers);

    // Style en-têtes
    var headerRange = sheet.getRange(1, 1, 1, 3);
    headerRange.setBackground('#c0392b')
               .setFontColor('#ffffff')
               .setFontWeight('bold')
               .setFontSize(11)
               .setHorizontalAlignment('center');

    // Largeur colonnes
    sheet.setColumnWidth(1, 250);  // Nom
    sheet.setColumnWidth(2, 220);  // Centre Principal
    sheet.setColumnWidth(3, 220);  // Centre Secondaire

    // Data validation : liste déroulante des centres
    var listeCentres = Config.getNomsCentres();
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(listeCentres, true)
      .setAllowInvalid(false)
      .setHelpText('Sélectionnez un centre de la liste')
      .build();

    // Appliquer sur 500 lignes (B2:C501)
    sheet.getRange(2, 2, 500, 2).setDataValidation(rule);

    // Figer la ligne d'en-tête
    sheet.setFrozenRows(1);

    // Bandes alternées
    sheet.getRange(2, 1, 500, 3).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);

    return sheet;
  }

  /* ═══════════════════════════════════════════════════════
     ONGLET 2 — PAR CENTRE  (agents triés par centre)
     ═══════════════════════════════════════════════════════ */

  function _creerOngletParCentre(ss) {
    var nom = Config.SHEETS.PAR_CENTRE;
    var sheet = ss.getSheetByName(nom);
    if (!sheet) {
      sheet = ss.insertSheet(nom, 1);
    } else {
      sheet.clear();
      sheet.clearFormats();
    }

    // En-tête principal
    sheet.getRange(1, 1).setValue('📋 Récapitulatif par centre — SDIS 66');
    sheet.getRange(1, 1).setFontSize(13).setFontWeight('bold').setFontColor('#c0392b');
    sheet.getRange(1, 1, 1, 6).merge();

    // Sous-en-têtes colonnes
    var subHeaders = [['Centre', 'Groupement', 'Agent', 'Effectif Actuel', 'Effectif Cible', 'Taux (%)']];
    sheet.getRange(2, 1, 1, 6).setValues(subHeaders);
    sheet.getRange(2, 1, 1, 6)
      .setBackground('#2c3e50')
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setFontSize(10)
      .setHorizontalAlignment('center');

    // Largeurs
    sheet.setColumnWidth(1, 200);
    sheet.setColumnWidth(2, 120);
    sheet.setColumnWidth(3, 250);
    sheet.setColumnWidth(4, 130);
    sheet.setColumnWidth(5, 130);
    sheet.setColumnWidth(6, 100);

    sheet.setFrozenRows(2);

    // Le contenu sera rempli par DataService.actualiserParCentre()
    return sheet;
  }

  /* ═══════════════════════════════════════════════════════
     ONGLET 3 — PRIORISATION RECRUTEMENT
     ═══════════════════════════════════════════════════════ */

  function _creerOngletPriorisation(ss) {
    var nom = Config.SHEETS.PRIORISATION;
    var sheet = ss.getSheetByName(nom);
    if (!sheet) {
      sheet = ss.insertSheet(nom, 2);
    } else {
      sheet.clear();
      sheet.clearFormats();
    }

    // Titre
    sheet.getRange(1, 1).setValue('🎯 Plan de Priorisation du Recrutement — SDIS 66');
    sheet.getRange(1, 1).setFontSize(13).setFontWeight('bold').setFontColor('#c0392b');
    sheet.getRange(1, 1, 1, 7).merge();

    // En-têtes
    var headers = [['Étape', 'Action', 'Centre', 'Groupement', 'Effectif Après', 'Cible', 'Taux Après (%)']];
    sheet.getRange(2, 1, 1, 7).setValues(headers);
    sheet.getRange(2, 1, 1, 7)
      .setBackground('#2c3e50')
      .setFontColor('#ffffff')
      .setFontWeight('bold')
      .setFontSize(10)
      .setHorizontalAlignment('center');

    // Largeurs
    sheet.setColumnWidth(1, 70);
    sheet.setColumnWidth(2, 300);
    sheet.setColumnWidth(3, 200);
    sheet.setColumnWidth(4, 120);
    sheet.setColumnWidth(5, 130);
    sheet.setColumnWidth(6, 80);
    sheet.setColumnWidth(7, 120);

    sheet.setFrozenRows(2);

    return sheet;
  }

  return {
    initialiser: initialiser
  };

})();
