// ══════════════════════════════════════════
//  PNCNS — DONNÉES SIMULÉES RÉALISTES RDC
// ══════════════════════════════════════════

const DATA = {

  years: {
    2025: {
      total: 2840,
      srmnea: 612,
      nutrition: 187,
      sources: 47,
      sources_breakdown: {
        etat: 511,       // 18%
        ptf: 1193,       // 42%
        menages: 795,    // 28%
        ong: 341         // 12%
      }
    },
    2024: {
      total: 2623,
      srmnea: 546,
      nutrition: 192,
      sources: 42,
      sources_breakdown: { etat: 472, ptf: 1100, menages: 735, ong: 316 }
    },
    2023: {
      total: 2401,
      srmnea: 498,
      nutrition: 178,
      sources: 38,
      sources_breakdown: { etat: 432, ptf: 1008, menages: 672, ong: 289 }
    }
  },

  evolution: {
    labels: ['2020','2021','2022','2023','2024','2025'],
    etat:     [320, 350, 390, 432, 472, 511],
    ptf:      [680, 750, 880, 1008, 1100, 1193],
    menages:  [420, 450, 520, 672, 735, 795],
    ong:      [180, 210, 260, 289, 316, 341]
  },

  provinces: [
    { name: 'Kinshasa',       srmnea: 142, nutrition: 72, total: 214, lat: -4.32, lng: 15.32 },
    { name: 'Haut-Katanga',   srmnea: 98,  nutrition: 53, total: 151, lat: -11.67, lng: 27.47 },
    { name: 'Nord-Kivu',      srmnea: 80,  nutrition: 42, total: 122, lat: -0.72, lng: 29.24 },
    { name: 'Kongo Central',  srmnea: 58,  nutrition: 33, total: 91,  lat: -5.52, lng: 14.43 },
    { name: 'Kasaï Oriental', srmnea: 44,  nutrition: 24, total: 68,  lat: -6.78, lng: 23.61 },
    { name: 'Équateur',       srmnea: 30,  nutrition: 17, total: 47,  lat: 0.05,  lng: 24.34 },
    { name: 'Maniema',        srmnea: 22,  nutrition: 14, total: 36,  lat: -2.94, lng: 26.72 },
    { name: 'Tanganyika',     srmnea: 19,  nutrition: 12, total: 31,  lat: -6.20, lng: 29.07 },
    { name: 'Lomami',         srmnea: 16,  nutrition: 10, total: 26,  lat: -5.11, lng: 24.98 },
    { name: 'Ituri',          srmnea: 15,  nutrition: 9,  total: 24,  lat: 1.56,  lng: 29.12 }
  ],

  srmnea: {
    categories: ['Soins prénataux','Accouchements assistés','Soins néonataux','PF & Contraception','VIH/SIDA (SRMNEA)','Nutrition maternelle'],
    values_2025: [148, 127, 98, 89, 74, 76],
    values_2024: [132, 115, 88, 80, 68, 63],
    financement: {
      labels: ['PTF (bilat.)','PTF (multilat.)','État RDC','ONG intl','Ménages'],
      values: [224, 185, 98, 67, 38]
    }
  },

  nutrition: {
    categories: ['Malnutrition aiguë sévère','Supplémentation micronutriments','Alimentation nourrissons','Eau & assainissement (lié)','Sécurité alimentaire'],
    values_2025: [54, 42, 38, 31, 22],
    values_2024: [58, 40, 35, 33, 26]
  },

  saisies_recentes: [
    { id: 'SAI-2025-0421', source: 'État RDC (Trésor)', programme: 'SRMNEA', province: 'Kinshasa', montant: 12.4, date: '2025-04-07', statut: 'validé', agent: 'K. Mbemba' },
    { id: 'SAI-2025-0420', source: 'USAID', programme: 'Nutrition', province: 'Nord-Kivu', montant: 8.1, date: '2025-04-07', statut: 'validé', agent: 'M. Lufwa' },
    { id: 'SAI-2025-0419', source: 'OMS', programme: 'SRMNEA', province: 'Haut-Katanga', montant: 5.7, date: '2025-04-06', statut: 'en cours', agent: 'A. Ngandu' },
    { id: 'SAI-2025-0418', source: 'UNICEF', programme: 'Nutrition', province: 'Kasaï Oriental', montant: 4.2, date: '2025-04-05', statut: 'en cours', agent: 'P. Kazadi' },
    { id: 'SAI-2025-0417', source: 'Ménages (enquête)', programme: 'Général', province: 'Équateur', montant: 3.9, date: '2025-04-04', statut: 'à vérifier', agent: 'J. Liongo' },
    { id: 'SAI-2025-0416', source: 'Banque mondiale', programme: 'SRMNEA', province: 'Maniema', montant: 9.8, date: '2025-04-03', statut: 'validé', agent: 'K. Mbemba' },
    { id: 'SAI-2025-0415', source: 'GAVI Alliance', programme: 'SRMNEA', province: 'Tanganyika', montant: 7.3, date: '2025-04-02', statut: 'validé', agent: 'M. Lufwa' }
  ],

  sha2011: [
    { code: 'HF.1', label: 'Hôpitaux', montant: 892, pct: 31.4 },
    { code: 'HF.2', label: 'Établissements de soins résidentiels', montant: 114, pct: 4.0 },
    { code: 'HF.3', label: 'Prestataires ambulatoires', montant: 641, pct: 22.6 },
    { code: 'HF.4', label: 'Prestataires auxiliaires', montant: 228, pct: 8.0 },
    { code: 'HF.5', label: 'Fournisseurs de produits médicaux', montant: 312, pct: 11.0 },
    { code: 'HF.6', label: 'Prestataires de prévention', montant: 199, pct: 7.0 },
    { code: 'HF.7', label: 'Administration de la santé', montant: 284, pct: 10.0 },
    { code: 'HF.9', label: 'Reste du monde', montant: 170, pct: 6.0 }
  ],

  sources_list: [
    { nom: 'État RDC (Trésor Public)', type: 'Gouvernement', montant: 511, actif: true },
    { nom: 'USAID', type: 'PTF bilatéral', montant: 312, actif: true },
    { nom: 'Banque mondiale / IDA', type: 'PTF multilatéral', montant: 287, actif: true },
    { nom: 'Fonds mondial (GFATM)', type: 'PTF multilatéral', montant: 198, actif: true },
    { nom: 'UNICEF', type: 'Agence ONU', montant: 143, actif: true },
    { nom: 'OMS / WHO', type: 'Agence ONU', montant: 112, actif: true },
    { nom: 'GAVI Alliance', type: 'PTF multilatéral', montant: 98, actif: true },
    { nom: 'Ménages (out-of-pocket)', type: 'Ménages', montant: 795, actif: true },
    { nom: 'ONG nationales (BDOM, etc.)', type: 'ONG locale', montant: 89, actif: true },
    { nom: 'Entreprises / Médecine travail', type: 'Entreprise', montant: 67, actif: false }
  ]
};
