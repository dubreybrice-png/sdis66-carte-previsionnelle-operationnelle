/**
 * SDIS 66 — Utilitaires cartographiques
 * Fonctions de calcul géographique côté serveur
 */

var MapUtils = (function () {

  var EARTH_RADIUS_KM = 6371;

  /**
   * Calcule la distance entre deux points GPS (formule de Haversine)
   * @param {number} lat1
   * @param {number} lng1
   * @param {number} lat2
   * @param {number} lng2
   * @returns {number} Distance en km
   */
  function haversine(lat1, lng1, lat2, lng2) {
    var dLat = _toRad(lat2 - lat1);
    var dLng = _toRad(lng2 - lng1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(_toRad(lat1)) * Math.cos(_toRad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return EARTH_RADIUS_KM * c;
  }

  /**
   * Trouve la caserne la plus proche d'un point
   * @param {number} lat
   * @param {number} lng
   * @param {Array} casernes
   * @returns {Object} { caserne, distance }
   */
  function findNearestCaserne(lat, lng, casernes) {
    var nearest = null;
    var minDist = Infinity;

    casernes.forEach(function (c) {
      var dist = haversine(lat, lng, c.lat, c.lng);
      if (dist < minDist) {
        minDist = dist;
        nearest = c;
      }
    });

    return { caserne: nearest, distance: Math.round(minDist * 100) / 100 };
  }

  /**
   * Vérifie si un point est dans un rayon donné
   */
  function isInRadius(lat, lng, centerLat, centerLng, radiusKm) {
    return haversine(lat, lng, centerLat, centerLng) <= radiusKm;
  }

  /**
   * Convertit des degrés en radians
   */
  function _toRad(deg) {
    return deg * (Math.PI / 180);
  }

  return {
    haversine: haversine,
    findNearestCaserne: findNearestCaserne,
    isInRadius: isInRadius
  };

})();
