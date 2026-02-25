/**
 * SDIS 66 — Carte Prévisionnelle Opérationnelle
 * Utilitaires géographiques
 */

var MapUtils = (function () {

  var EARTH_RADIUS_KM = 6371;

  /**
   * Distance entre deux points GPS (Haversine) en km
   */
  function haversine(lat1, lng1, lat2, lng2) {
    var dLat = _toRad(lat2 - lat1);
    var dLng = _toRad(lng2 - lng1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(_toRad(lat1)) * Math.cos(_toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function _toRad(deg) {
    return deg * (Math.PI / 180);
  }

  return {
    haversine: haversine
  };

})();
