/**
 * SDIS 66 — Carte Prévisionnelle Opérationnelle
 * Pré-remplissage des ISP dans le spreadsheet
 *
 * Appelé une seule fois via le menu pour injecter la liste initiale.
 */

function peuplerISP() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(Config.SHEETS.ISP);
  if (!sheet) {
    SpreadsheetSetup.initialiser();
    sheet = ss.getSheetByName(Config.SHEETS.ISP);
  }

  var agents = _getListeAgents();

  // Écrire à partir de la ligne 2
  var rows = agents.map(function (a) {
    return [a.nom, a.principal, a.secondaire];
  });

  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, 3).setValues(rows);
  }

  ss.toast(rows.length + ' agents insérés ✅', 'Carte Opérationnelle', 5);
}

/**
 * Liste complète des ISP avec mapping vers les noms de centres Config.js
 * Agents en double dans le listing source → fusionnés avec principal + secondaire
 */
function _getListeAgents() {
  return [
    { nom: 'BERTRAN Remi',                 principal: 'Canet',                    secondaire: '' },
    { nom: 'BOIS Florian',                 principal: 'Canet',                    secondaire: '' },
    { nom: 'BROUART Cédric',               principal: 'Perpignan Nord',           secondaire: '' },
    { nom: 'BURCET Alexandre',             principal: 'Perpignan Sud',            secondaire: '' },
    { nom: 'CALVET Séverine',              principal: 'Canet',                    secondaire: '' },
    { nom: 'CAPUANO Yannick',              principal: 'Perpignan Nord',           secondaire: '' },
    { nom: 'CAMBILLAU Françoise',          principal: 'Maury',                    secondaire: 'Perpignan Nord' },
    { nom: 'COLLARD PREVOST Emilie',       principal: 'Ribéral',                  secondaire: '' },
    { nom: 'COMAS Elodie',                 principal: 'Canet',                    secondaire: '' },
    { nom: 'CONDEMINAS Cédric',            principal: 'Perpignan Nord',           secondaire: '' },
    { nom: 'COSTA Bruno',                  principal: 'Ille Sur Tet',             secondaire: '' },
    { nom: 'CUNILL Caroline',              principal: 'Millas',                   secondaire: '' },
    { nom: 'DELABRIERE Julia',             principal: 'Perpignan Nord',           secondaire: '' },
    { nom: 'DUBREY Brice',                 principal: 'Millas',                   secondaire: '' },
    { nom: 'FREZOUL Marlène',              principal: 'Perpignan Nord',           secondaire: '' },
    { nom: 'GIPULO Mathieu',               principal: 'Ille Sur Tet',             secondaire: '' },
    { nom: 'LE ROY Jean Luc',              principal: 'Canet',                    secondaire: '' },
    { nom: 'MARAVAL Karine',               principal: 'Millas',                   secondaire: '' },
    { nom: 'MASSE Alison',                 principal: 'Ille Sur Tet',             secondaire: '' },
    { nom: 'MATHIEU Jonathan',             principal: 'Salanque',                 secondaire: '' },
    { nom: 'PICARD Yannick',               principal: 'Perpignan Nord',           secondaire: '' },
    { nom: 'PY Kristele',                  principal: 'Perpignan Ouest',          secondaire: '' },
    { nom: 'RAINOTTE Nicolas',             principal: 'Perpignan Sud',            secondaire: '' },
    { nom: 'ROUSSET Valérie',              principal: 'Salanque',                 secondaire: '' },
    { nom: 'SAUTIN Amandine',              principal: 'Ribéral',                  secondaire: '' },
    { nom: 'VERDAGUER CLARA Morgane',      principal: 'Ribéral',                  secondaire: '' },
    { nom: 'WIEGAND-RAYMOND Cécile',       principal: 'Ribéral',                  secondaire: '' },
    { nom: 'DUCHET Marie',                 principal: 'Baixas',                   secondaire: '' },
    { nom: 'LECOEUR Yann',                 principal: 'Agly',                     secondaire: '' },
    { nom: 'NABONNE Agnès',                principal: 'Rivesaltes',               secondaire: '' },
    { nom: 'RAYNAUD-VOIRIN Cindy',         principal: 'Saint Paul De Fenouillet', secondaire: '' },
    { nom: 'SOLEY Anaïs',                  principal: 'Rivesaltes',               secondaire: '' },
    { nom: 'SOLEY Guillaume',              principal: 'Rivesaltes',               secondaire: '' },
    { nom: 'SOLLIEC Ronan',                principal: 'Rivesaltes',               secondaire: '' },
    { nom: 'CASTANY Elise',                principal: 'Prades',                   secondaire: '' },
    { nom: 'CUEVAS Isabel',                principal: 'Vinca',                    secondaire: '' },
    { nom: 'FRIEDERICH ALLANIC Joëlle',    principal: 'Prades',                   secondaire: '' },
    { nom: 'GARCIA Claudia',               principal: 'Saillagouse',              secondaire: '' },
    { nom: 'LEBEAU Anne',                  principal: 'Olette',                   secondaire: '' },
    { nom: 'ROBOAM Julie',                 principal: 'Porte',                    secondaire: '' },
    { nom: 'BEDU Antoine',                 principal: 'Perpignan Sud',            secondaire: 'Elne' },
    { nom: 'BEJAT Florie',                 principal: 'Perpignan Sud',            secondaire: '' },
    { nom: 'BRAU Melanie',                 principal: 'Perpignan Ouest',          secondaire: 'Argelès' },
    { nom: 'DENIAU Dany',                  principal: 'Les Aspres',               secondaire: '' },
    { nom: 'FERRARI Madison',              principal: 'Perpignan Sud',            secondaire: '' },
    { nom: 'GOUNA Nadine',                 principal: 'Perpignan Ouest',          secondaire: '' },
    { nom: 'PARES-BORRAT Céline',          principal: 'Perpignan Ouest',          secondaire: '' },
    { nom: 'PERIE Anaïs',                  principal: 'Les Aspres',               secondaire: '' },
    { nom: 'PETIPRE Chloé',                principal: 'Perpignan Sud',            secondaire: '' },
    { nom: 'PIGUILLEM Alexandra',          principal: 'Perpignan Ouest',          secondaire: '' },
    { nom: 'SANCHEZ Sophie',               principal: 'Les Aspres',               secondaire: '' },
    { nom: 'SOTO Yannick',                 principal: 'Les Aspres',               secondaire: '' },
    { nom: 'TOUSTOU Jean Claude',          principal: 'Perpignan Sud',            secondaire: '' },
    { nom: 'VAN DEN BERGH Kevin',          principal: 'Les Aspres',               secondaire: '' },
    { nom: 'BONAFOS Remy',                 principal: 'Saint Cyprien',            secondaire: '' },
    { nom: 'CAROL Emmanuelle',             principal: 'Côte Vermeille',           secondaire: '' },
    { nom: 'CHALOT Sophie',                principal: 'Elne',                     secondaire: '' },
    { nom: 'LAMBERT Emmanuelle',           principal: 'Palau',                    secondaire: '' },
    { nom: 'MANO Christelle',              principal: 'Elne',                     secondaire: '' },
    { nom: 'MARMET Christophe',            principal: 'Saint Cyprien',            secondaire: '' },
    { nom: 'RIERA-ZAROURI Safia',          principal: 'Elne',                     secondaire: '' },
    { nom: 'ROQUE Christine',              principal: 'Banyuls',                  secondaire: '' },
    { nom: 'BODE FOUSSARD Lina',           principal: 'Boulou',                   secondaire: '' },
    { nom: 'BOSCHSACOMA Julie',            principal: 'Céret',                    secondaire: '' },
    { nom: 'CHASTANG Guillaume',           principal: 'Boulou',                   secondaire: '' },
    { nom: 'FORT Thomas',                  principal: 'Boulou',                   secondaire: '' },
    { nom: 'LASSAGNE Jean Michel',         principal: 'Prats',                    secondaire: '' },
    { nom: 'PI Marion',                    principal: 'Vallespir',                secondaire: '' },
    { nom: 'PONS Emeline',                 principal: 'Céret',                    secondaire: '' },
    { nom: 'SPILEMONT Jean Baptiste',      principal: 'Boulou',                   secondaire: '' }
  ];
}
