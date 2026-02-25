/**
 * SDIS 66 — Carte Prévisionnelle Opérationnelle
 * Configuration : centres, groupements, coordonnées GPS
 *
 * Les centres sont issus de la carte des Groupements Territoriaux du SDIS 66.
 */

var Config = (function () {

  /* ── Paramètres de la carte ── */
  var MAP = {
    center: { lat: 42.58, lng: 2.55 },   // centre du département 66
    zoom: 10,
    minZoom: 9,
    maxZoom: 17
  };

  /* ── Noms des onglets ── */
  var SHEETS = {
    ISP:           'ISP',
    PAR_CENTRE:    'Par Centre',
    PRIORISATION:  'Priorisation Recrutement'
  };

  /* ── Couleurs groupements ── */
  var COLORS = {
    Nord:  '#3498db',
    Ouest: '#9b59b6',
    Sud:   '#e67e22'
  };

  /* ════════════════════════════════════════════════════════
     CENTRES D'INCENDIE ET DE SECOURS — SDIS 66
     Coordonnées GPS approximatives, classés par groupement
     ════════════════════════════════════════════════════════ */
  var CENTRES = [

    // ─── GROUPEMENT NORD ───
    { id: 'caudies',              nom: 'Caudiès',                    groupement: 'Nord',  lat: 42.8099, lng: 2.3742 },
    { id: 'st-paul-fenouillet',   nom: 'Saint Paul De Fenouillet',   groupement: 'Nord',  lat: 42.8109, lng: 2.5030 },
    { id: 'maury',                nom: 'Maury',                      groupement: 'Nord',  lat: 42.8329, lng: 2.5878 },
    { id: 'vingrau',              nom: 'Vingrau',                    groupement: 'Nord',  lat: 42.8591, lng: 2.7382 },
    { id: 'salses',               nom: 'Salses',                     groupement: 'Nord',  lat: 42.8367, lng: 2.9208 },
    { id: 'le-barcares',          nom: 'Le Barcarès',                groupement: 'Nord',  lat: 42.7910, lng: 3.0340 },
    { id: 'rivesaltes',           nom: 'Rivesaltes',                 groupement: 'Nord',  lat: 42.7702, lng: 2.8770 },
    { id: 'salanque',             nom: 'Salanque',                   groupement: 'Nord',  lat: 42.7714, lng: 2.9936 },
    { id: 'agly',                 nom: 'Agly',                       groupement: 'Nord',  lat: 42.7957, lng: 2.6878 },
    { id: 'baixas',               nom: 'Baixas',                     groupement: 'Nord',  lat: 42.7546, lng: 2.8103 },

    // ─── GROUPEMENT OUEST ───
    { id: 'sounia',               nom: 'Sounia',                     groupement: 'Ouest', lat: 42.7316, lng: 2.4317 },
    { id: 'ille-sur-tet',         nom: 'Ille Sur Tet',               groupement: 'Ouest', lat: 42.6710, lng: 2.6210 },
    { id: 'vinca',                nom: 'Vinca',                      groupement: 'Ouest', lat: 42.6438, lng: 2.5277 },
    { id: 'millas',               nom: 'Millas',                     groupement: 'Ouest', lat: 42.6944, lng: 2.6950 },
    { id: 'prades',               nom: 'Prades',                     groupement: 'Ouest', lat: 42.6177, lng: 2.4216 },
    { id: 'capcir',               nom: 'Capcir',                     groupement: 'Ouest', lat: 42.5718, lng: 2.0695 },
    { id: 'olette',               nom: 'Olette',                     groupement: 'Ouest', lat: 42.5430, lng: 2.2750 },
    { id: 'vernet',               nom: 'Vernet',                     groupement: 'Ouest', lat: 42.5458, lng: 2.3870 },
    { id: 'font-romeu',           nom: 'Font Romeu',                 groupement: 'Ouest', lat: 42.5044, lng: 2.0370 },
    { id: 'mont-louis',           nom: 'Mont Louis',                 groupement: 'Ouest', lat: 42.5106, lng: 2.1213 },
    { id: 'saillagouse',          nom: 'Saillagouse',                groupement: 'Ouest', lat: 42.4590, lng: 2.0370 },
    { id: 'cerdagne',             nom: 'Cerdagne',                   groupement: 'Ouest', lat: 42.4323, lng: 1.9485 },
    { id: 'porte',                nom: 'Porte',                      groupement: 'Ouest', lat: 42.5472, lng: 1.8312 },

    // ─── GROUPEMENT SUD ───
    { id: 'pnord',                nom: 'Perpignan Nord',             groupement: 'Sud',   lat: 42.7100, lng: 2.8950 },
    { id: 'psud',                 nom: 'Perpignan Sud',              groupement: 'Sud',   lat: 42.6850, lng: 2.8900 },
    { id: 'riberal',              nom: 'Ribéral',                    groupement: 'Sud',   lat: 42.6755, lng: 2.8345 },
    { id: 'les-aspres',           nom: 'Les Aspres',                 groupement: 'Sud',   lat: 42.6400, lng: 2.7900 },
    { id: 'canet',                nom: 'Canet',                      groupement: 'Sud',   lat: 42.7066, lng: 3.0130 },
    { id: 'saint-cyprien',        nom: 'Saint Cyprien',              groupement: 'Sud',   lat: 42.6193, lng: 3.0067 },
    { id: 'elne',                 nom: 'Elne',                       groupement: 'Sud',   lat: 42.5991, lng: 2.9718 },
    { id: 'palau',                nom: 'Palau',                      groupement: 'Sud',   lat: 42.5711, lng: 2.9609 },
    { id: 'argeles',              nom: 'Argelès',                    groupement: 'Sud',   lat: 42.5460, lng: 3.0233 },
    { id: 'boulou',               nom: 'Boulou',                     groupement: 'Sud',   lat: 42.5230, lng: 2.8334 },
    { id: 'ceret',                nom: 'Céret',                      groupement: 'Sud',   lat: 42.4860, lng: 2.7480 },
    { id: 'vallespir',            nom: 'Vallespir',                  groupement: 'Sud',   lat: 42.4581, lng: 2.6313 },
    { id: 'st-laurent-cerdans',   nom: 'St Laurent De Cerdans',      groupement: 'Sud',   lat: 42.3853, lng: 2.6101 },
    { id: 'prats',                nom: 'Prats',                      groupement: 'Sud',   lat: 42.4053, lng: 2.4855 },
    { id: 'cote-vermeille',       nom: 'Côte Vermeille',             groupement: 'Sud',   lat: 42.5170, lng: 3.1040 },
    { id: 'banyuls',              nom: 'Banyuls',                    groupement: 'Sud',   lat: 42.4830, lng: 3.1290 },
    { id: 'cerbere',              nom: 'Cerbère',                    groupement: 'Sud',   lat: 42.4424, lng: 3.1685 }
  ];

  /**
   * Retourne la liste des noms de centres (pour data validation)
   */
  function getNomscentres() {
    return CENTRES.map(function (c) { return c.nom; }).sort();
  }

  return {
    MAP: MAP,
    SHEETS: SHEETS,
    COLORS: COLORS,
    CENTRES: CENTRES,
    getNomsCentres: getNomscentres
  };

})();
