/**
 * SDIS 66 — Configuration de la carte
 * Paramètres par défaut et accès aux réglages
 */

var Config = (function () {

  // Centre par défaut : Perpignan (préfecture des Pyrénées-Orientales)
  var DEFAULTS = {
    center: { lat: 42.6887, lng: 2.8948 },
    zoom: 10,
    minZoom: 8,
    maxZoom: 18,
    tileProvider: 'openstreetmap',
    departement: '66',
    refreshInterval: 300000 // 5 min
  };

  /**
   * Récupère les paramètres de la carte
   * Priorité : Spreadsheet > Défauts
   */
  function getMapSettings() {
    try {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var configSheet = ss.getSheetByName('CONFIG');
      if (!configSheet) return DEFAULTS;

      var data = configSheet.getDataRange().getValues();
      var settings = {};
      data.forEach(function (row) {
        if (row[0] && row[1] !== '') {
          settings[row[0]] = row[1];
        }
      });

      return {
        center: {
          lat: parseFloat(settings.centerLat) || DEFAULTS.center.lat,
          lng: parseFloat(settings.centerLng) || DEFAULTS.center.lng
        },
        zoom: parseInt(settings.zoom) || DEFAULTS.zoom,
        minZoom: parseInt(settings.minZoom) || DEFAULTS.minZoom,
        maxZoom: parseInt(settings.maxZoom) || DEFAULTS.maxZoom,
        tileProvider: settings.tileProvider || DEFAULTS.tileProvider,
        departement: settings.departement || DEFAULTS.departement,
        refreshInterval: parseInt(settings.refreshInterval) || DEFAULTS.refreshInterval
      };
    } catch (e) {
      Logger.log('Config.getMapSettings error: ' + e.message);
      return DEFAULTS;
    }
  }

  return {
    DEFAULTS: DEFAULTS,
    getMapSettings: getMapSettings
  };

})();
