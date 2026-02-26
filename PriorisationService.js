/**
 * SDIS 66 — Carte Prévisionnelle Opérationnelle
 * Service de priorisation du recrutement
 *
 * Algorithme : on recrute toujours 1 ISP dans le centre qui a
 * le PLUS GRAND DÉFICIT en valeur absolue (cible - actuel).
 * En cas d'égalité, on prend le centre avec le plus mauvais taux.
 */

var PriorisationService = (function () {

  /**
   * Génère le plan de recrutement étape par étape.
   * @returns {Array<{etape, action, centre, groupement, effectifApres, cible, tauxApres}>}
   */
  function genererPlan() {
    var centres = DataService.construireDonneesCentres();

    // Construire l'état simulé
    var etat = [];
    Object.keys(centres).forEach(function (nom) {
      var c = centres[nom];
      if (c.effectifCible > 0) {  // on ignore les centres sans cible définie
        etat.push({
          nom: c.nom,
          groupement: c.groupement,
          actuel: c.effectifActuel,
          cible: c.effectifCible
        });
      }
    });

    if (etat.length === 0) return [];

    var plan = [];
    var etape = 0;
    var securite = 5000; // sécurité anti-boucle infinie

    while (securite-- > 0) {
      // Trouver le centre avec le plus grand déficit absolu parmi ceux pas encore complets
      var pire = null;
      var pireDeficit = 0;
      var pireTaux = Infinity;

      etat.forEach(function (c) {
        if (c.actuel < c.cible) {
          var deficit = c.cible - c.actuel;
          var taux = c.actuel / c.cible;
          // Priorité au plus grand déficit absolu, puis au pire taux en cas d'égalité
          if (deficit > pireDeficit || (deficit === pireDeficit && taux < pireTaux)) {
            pireDeficit = deficit;
            pireTaux = taux;
            pire = c;
          }
        }
      });

      // Si plus aucun centre n'a besoin de recruter → terminé
      if (!pire) break;

      // Recruter 1 personne dans ce centre
      pire.actuel++;
      etape++;

      var nouveauTaux = Math.round((pire.actuel / pire.cible) * 100);

      plan.push({
        etape: etape,
        action: 'Recruter 1 ISP à ' + pire.nom,
        centre: pire.nom,
        groupement: pire.groupement,
        effectifApres: pire.actuel,
        cible: pire.cible,
        tauxApres: nouveauTaux
      });
    }

    return plan;
  }

  /**
   * Écrit le plan dans l'onglet Priorisation Recrutement
   */
  function actualiserPriorisation() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(Config.SHEETS.PRIORISATION);
    if (!sheet) {
      SpreadsheetSetup.initialiser();
      sheet = ss.getSheetByName(Config.SHEETS.PRIORISATION);
    }

    // Effacer sous les en-têtes
    var lastRow = sheet.getLastRow();
    if (lastRow > 2) {
      sheet.getRange(3, 1, lastRow - 2, 7).clear();
    }

    var plan = genererPlan();

    if (plan.length === 0) {
      sheet.getRange(3, 1).setValue('Aucun effectif cible défini. Remplissez la colonne "Effectif Cible" dans l\'onglet Par Centre.');
      sheet.getRange(3, 1, 1, 7).merge().setFontStyle('italic').setFontColor('#999999');
      ss.toast('Aucune cible définie — complétez l\'onglet Par Centre d\'abord', 'Priorisation', 5);
      return;
    }

    // Écrire les étapes
    var rows = plan.map(function (p) {
      return [p.etape, p.action, p.centre, p.groupement, p.effectifApres, p.cible, p.tauxApres + '%'];
    });

    sheet.getRange(3, 1, rows.length, 7).setValues(rows);

    // Mise en forme
    for (var i = 0; i < rows.length; i++) {
      var r = i + 3;
      var taux = plan[i].tauxApres;

      // Couleur du taux
      var couleur = taux >= 100 ? '#27ae60' : taux >= 75 ? '#f39c12' : '#e74c3c';
      sheet.getRange(r, 7).setFontColor(couleur).setFontWeight('bold');

      // Bande alternée légère
      if (i % 2 === 0) {
        sheet.getRange(r, 1, 1, 7).setBackground('#f8f9fa');
      }

      // Ligne verte quand un centre atteint 100%
      if (taux >= 100) {
        sheet.getRange(r, 1, 1, 7).setBackground('#eafaf1');
        sheet.getRange(r, 2).setFontWeight('bold').setFontColor('#27ae60');
      }
    }

    // Résumé final
    var derniereLigne = 3 + rows.length + 1;
    sheet.getRange(derniereLigne, 1).setValue('TOTAL');
    sheet.getRange(derniereLigne, 1).setFontWeight('bold').setFontSize(11);
    sheet.getRange(derniereLigne, 2).setValue(plan.length + ' recrutements nécessaires');
    sheet.getRange(derniereLigne, 2).setFontWeight('bold').setFontColor('#c0392b').setFontSize(11);
    sheet.getRange(derniereLigne, 1, 1, 7).setBackground('#fdecea');

    ss.toast(plan.length + ' étapes de recrutement générées ✅', 'Priorisation', 5);
  }

  return {
    genererPlan: genererPlan,
    actualiserPriorisation: actualiserPriorisation
  };

})();
