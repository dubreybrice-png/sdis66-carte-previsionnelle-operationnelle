/**
 * SDIS 66 — Service d'accès aux données
 * Lecture des feuilles Google Sheets pour alimenter la carte
 */

var DataService = (function () {

  /**
   * Récupère toutes les données opérationnelles
   * @returns {Object}
   */
  function getAllData() {
    return {
      casernes: getCasernes(),
      zones: getZones(),
      risques: getRisques(),
      moyens: getMoyens(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Récupère la liste des casernes (CIS)
   */
  function getCasernes() {
    return _readSheet('CASERNES', function (row, headers) {
      return {
        id: row[headers.indexOf('ID')],
        nom: row[headers.indexOf('NOM')],
        type: row[headers.indexOf('TYPE')],           // CSP, CS, CI
        lat: parseFloat(row[headers.indexOf('LAT')]),
        lng: parseFloat(row[headers.indexOf('LNG')]),
        commune: row[headers.indexOf('COMMUNE')],
        effectif: parseInt(row[headers.indexOf('EFFECTIF')]) || 0,
        vehicules: row[headers.indexOf('VEHICULES')] || ''
      };
    });
  }

  /**
   * Récupère les zones de couverture
   */
  function getZones() {
    return _readSheet('ZONES', function (row, headers) {
      return {
        id: row[headers.indexOf('ID')],
        nom: row[headers.indexOf('NOM')],
        type: row[headers.indexOf('TYPE')],
        couleur: row[headers.indexOf('COULEUR')] || '#3388ff',
        polygone: row[headers.indexOf('POLYGONE')] || '',
        casernePrincipale: row[headers.indexOf('CASERNE_PRINCIPALE')] || ''
      };
    });
  }

  /**
   * Récupère les risques identifiés
   */
  function getRisques() {
    return _readSheet('RISQUES', function (row, headers) {
      return {
        id: row[headers.indexOf('ID')],
        type: row[headers.indexOf('TYPE')],           // Feu forêt, Inondation, SEVESO, etc.
        niveau: row[headers.indexOf('NIVEAU')],       // Faible, Moyen, Élevé, Très élevé
        lat: parseFloat(row[headers.indexOf('LAT')]),
        lng: parseFloat(row[headers.indexOf('LNG')]),
        description: row[headers.indexOf('DESCRIPTION')] || '',
        rayon: parseFloat(row[headers.indexOf('RAYON')]) || 0
      };
    });
  }

  /**
   * Récupère les moyens disponibles
   */
  function getMoyens() {
    return _readSheet('MOYENS', function (row, headers) {
      return {
        id: row[headers.indexOf('ID')],
        type: row[headers.indexOf('TYPE')],
        caserne: row[headers.indexOf('CASERNE')],
        statut: row[headers.indexOf('STATUT')],       // Disponible, Engagé, Maintenance
        immatriculation: row[headers.indexOf('IMMATRICULATION')] || ''
      };
    });
  }

  /**
   * Récupère les données d'une zone par ID
   */
  function getZoneById(zoneId) {
    var zones = getZones();
    return zones.find(function (z) { return z.id === zoneId; }) || null;
  }

  /**
   * Utilitaire : lit une feuille et mappe chaque ligne via un transformer
   */
  function _readSheet(sheetName, transformer) {
    try {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = ss.getSheetByName(sheetName);
      if (!sheet) {
        Logger.log('DataService: feuille "' + sheetName + '" introuvable');
        return [];
      }

      var data = sheet.getDataRange().getValues();
      if (data.length < 2) return [];

      var headers = data[0].map(function (h) { return String(h).trim().toUpperCase(); });
      var results = [];

      for (var i = 1; i < data.length; i++) {
        var item = transformer(data[i], headers);
        if (item && item.id) results.push(item);
      }

      return results;
    } catch (e) {
      Logger.log('DataService._readSheet("' + sheetName + '") error: ' + e.message);
      return [];
    }
  }

  return {
    getAllData: getAllData,
    getCasernes: getCasernes,
    getZones: getZones,
    getRisques: getRisques,
    getMoyens: getMoyens,
    getZoneById: getZoneById
  };

})();
