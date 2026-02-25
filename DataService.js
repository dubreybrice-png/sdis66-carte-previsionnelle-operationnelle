/**
 * SDIS 66 — Carte Prévisionnelle Opérationnelle
 * Service de données : lecture ISP, construction par centre, actualisation
 */

var DataService = (function () {

  /* ═══════════════════════════════════════════════════════
     LECTURE DES ISP (onglet 1)
     ═══════════════════════════════════════════════════════ */

  /**
   * Lit tous les ISP depuis l'onglet ISP
   * @returns {Array<{nom, centrePrincipal, centreSecondaire}>}
   */
  function lireISP() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(Config.SHEETS.ISP);
    if (!sheet) return [];

    var data = sheet.getDataRange().getValues();
    var agents = [];
    for (var i = 1; i < data.length; i++) {
      var nom = String(data[i][0]).trim();
      if (!nom) continue;
      agents.push({
        nom: nom,
        centrePrincipal: String(data[i][1]).trim(),
        centreSecondaire: String(data[i][2]).trim()
      });
    }
    return agents;
  }

  /* ═══════════════════════════════════════════════════════
     CONSTRUCTION DES DONNÉES PAR CENTRE
     ═══════════════════════════════════════════════════════ */

  /**
   * Construit un objet { centreNom → { agents[], effectifActuel, effectifCible, groupement } }
   * en croisant ISP + centres Config + cibles saisies
   */
  function construireDonneesCentres() {
    var agents = lireISP();
    var cibles = _lireCibles();   // { centreNom → effectifCible }

    // Initialiser chaque centre
    var centres = {};
    Config.CENTRES.forEach(function (c) {
      centres[c.nom] = {
        id: c.id,
        nom: c.nom,
        groupement: c.groupement,
        lat: c.lat,
        lng: c.lng,
        agents: [],
        effectifActuel: 0,
        effectifCible: cibles[c.nom] || 0
      };
    });

    // Affecter les agents (centre principal uniquement pour le comptage)
    agents.forEach(function (a) {
      if (a.centrePrincipal && centres[a.centrePrincipal]) {
        centres[a.centrePrincipal].agents.push(a.nom);
      }
    });

    // Compter
    Object.keys(centres).forEach(function (nom) {
      centres[nom].effectifActuel = centres[nom].agents.length;
    });

    return centres;
  }

  /**
   * Retourne un tableau trié pour la carte
   * @returns {Array} [{nom, groupement, lat, lng, effectifActuel, effectifCible}]
   */
  function getCarteData() {
    var centres = construireDonneesCentres();
    return Config.CENTRES.map(function (c) {
      var d = centres[c.nom];
      return {
        nom: c.nom,
        groupement: c.groupement,
        lat: c.lat,
        lng: c.lng,
        effectifActuel: d ? d.effectifActuel : 0,
        effectifCible: d ? d.effectifCible : 0
      };
    });
  }

  /* ═══════════════════════════════════════════════════════
     LECTURE DES CIBLES (depuis onglet Par Centre)
     Préserve les valeurs saisies manuellement
     ═══════════════════════════════════════════════════════ */

  function _lireCibles() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(Config.SHEETS.PAR_CENTRE);
    if (!sheet) return {};

    var data = sheet.getDataRange().getValues();
    var cibles = {};
    for (var i = 2; i < data.length; i++) {
      var centre = String(data[i][0]).trim();
      var cible = parseInt(data[i][4]);   // colonne E = Effectif Cible
      if (centre && !isNaN(cible) && cible > 0) {
        cibles[centre] = cible;
      }
    }
    return cibles;
  }

  /* ═══════════════════════════════════════════════════════
     ACTUALISATION ONGLET "PAR CENTRE"
     ═══════════════════════════════════════════════════════ */

  /**
   * Reconstruit entièrement l'onglet Par Centre
   * en préservant les effectifs cibles saisis manuellement.
   */
  function actualiserParCentre() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(Config.SHEETS.PAR_CENTRE);
    if (!sheet) {
      SpreadsheetSetup.initialiser();
      sheet = ss.getSheetByName(Config.SHEETS.PAR_CENTRE);
    }

    var centres = construireDonneesCentres();

    // Effacer le contenu sous les en-têtes (lignes 3+)
    var lastRow = sheet.getLastRow();
    if (lastRow > 2) {
      sheet.getRange(3, 1, lastRow - 2, 6).clear();
    }

    // Écrire centre par centre, triés par groupement puis nom
    var ordreGroupements = ['Nord', 'Ouest', 'Sud'];
    var centresTries = Config.CENTRES.slice().sort(function (a, b) {
      var ga = ordreGroupements.indexOf(a.groupement);
      var gb = ordreGroupements.indexOf(b.groupement);
      if (ga !== gb) return ga - gb;
      return a.nom.localeCompare(b.nom);
    });

    var row = 3;
    var currentGroupement = '';

    centresTries.forEach(function (c) {
      var data = centres[c.nom];
      var agents = data.agents;
      var effectifActuel = data.effectifActuel;
      var effectifCible = data.effectifCible;
      var taux = effectifCible > 0 ? Math.round((effectifActuel / effectifCible) * 100) : 0;

      // Séparateur de groupement
      if (c.groupement !== currentGroupement) {
        currentGroupement = c.groupement;
        sheet.getRange(row, 1).setValue('── GROUPEMENT ' + currentGroupement.toUpperCase() + ' ──');
        sheet.getRange(row, 1, 1, 6).merge()
          .setBackground('#34495e')
          .setFontColor('#ffffff')
          .setFontWeight('bold')
          .setFontSize(10);
        row++;
      }

      // Ligne du centre (en-tête de section)
      var centreRow = [
        c.nom,
        c.groupement,
        '',
        effectifActuel,
        effectifCible || '',
        effectifCible > 0 ? taux + '%' : ''
      ];
      sheet.getRange(row, 1, 1, 6).setValues([centreRow]);

      // Style de la ligne centre
      var centreRange = sheet.getRange(row, 1, 1, 6);
      centreRange.setBackground('#ecf0f1')
                 .setFontWeight('bold')
                 .setFontSize(10);

      // Colonne D (effectif actuel) en vert si > 0
      if (effectifActuel > 0) {
        sheet.getRange(row, 4).setFontColor('#27ae60');
      }

      // Colonne E (effectif cible) : fond jaune clair pour inviter à saisir
      sheet.getRange(row, 5).setBackground('#fef9e7')
                            .setFontColor('#e67e22')
                            .setFontWeight('bold');

      // Colonne F (taux) : couleur selon niveau
      if (effectifCible > 0) {
        var couleurTaux = taux >= 100 ? '#27ae60' : taux >= 75 ? '#f39c12' : '#e74c3c';
        sheet.getRange(row, 6).setFontColor(couleurTaux).setFontWeight('bold');
      }

      var centreStartRow = row;
      row++;

      // Lignes agents
      if (agents.length > 0) {
        agents.sort().forEach(function (agent) {
          sheet.getRange(row, 3).setValue(agent);
          sheet.getRange(row, 3).setFontSize(9).setFontColor('#555555');
          row++;
        });
      } else {
        sheet.getRange(row, 3).setValue('(aucun agent)');
        sheet.getRange(row, 3).setFontSize(9).setFontColor('#bdc3c7').setFontStyle('italic');
        row++;
      }

      // Ligne vide de séparation
      row++;
    });

    ss.toast('Onglet "Par Centre" actualisé ✅', 'Carte Opérationnelle', 3);
  }

  return {
    lireISP: lireISP,
    construireDonneesCentres: construireDonneesCentres,
    getCarteData: getCarteData,
    actualiserParCentre: actualiserParCentre
  };

})();
