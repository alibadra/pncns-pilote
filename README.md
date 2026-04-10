# PNCNS — Plateforme Nationale des Comptes de Santé · RDC
## Projet Pilote Interactif

---

## Déploiement sur Vercel (5 minutes)

### Option A — Interface web (le plus simple)

1. Va sur **https://vercel.com** et crée un compte gratuit
2. Clique sur **"Add New Project"** → **"Upload"** (ou drag & drop)
3. **Glisse le dossier `pncns-pilote`** entier dans la fenêtre
4. Clique **"Deploy"**
5. Ton lien sera du type : `https://pncns-pilote.vercel.app`

### Option B — Via terminal (si tu as Vercel CLI)

```bash
cd pncns-pilote
npx vercel --prod
```

---

## Comptes de démonstration

| Identifiant | Mot de passe | Rôle |
|-------------|-------------|------|
| `admin` | `admin123` | Administrateur système |
| `analyste` | `analyse123` | Analyste financier (lecture seule) |
| `saisie` | `saisie123` | Agent de saisie |

---

## Fonctionnalités du pilote

- **Login sécurisé** avec 3 profils différents
- **Dashboard principal** avec métriques clés et graphiques dynamiques
- **Cartographie interactive** des provinces RDC (Leaflet.js)
- **Module SRMNEA & Nutrition** avec analyses comparatives
- **Formulaire de saisie** SHA2011 complet avec validation
- **Registre des sources** de financement
- **Rapports SHA2011** avec export (maquette)

---

## Structure du projet

```
pncns-pilote/
├── index.html          ← Point d'entrée
├── vercel.json         ← Configuration déploiement
├── css/
│   └── main.css        ← Design system complet
└── js/
    ├── data.js         ← Données simulées RDC
    ├── auth.js         ← Gestion authentification
    ├── pages.js        ← Rendu de chaque page
    └── app.js          ← Routeur principal
```

---

*Version pilote — PNCNS/RDC 2026*
