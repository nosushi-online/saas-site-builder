# SaaS Site Builder avec sous-domaines et canvases prédéfinis

Un SaaS complet permettant aux utilisateurs abonnés de créer leur propre site web sur un **sous-domaine** du domaine du SaaS (ex: `mon-site.votresaas.com`), en utilisant des **canvases (templates)** prédéfinis et gérés par l'admin.

## Fonctionnalités principales

- **Abonnements Stripe** : Les utilisateurs doivent souscrire pour créer un site.
- **Sous-domaines dynamiques** : Chaque site vit sur `username.votresaas.com` ou `custom.votresaas.com`.
- **Canvases prédéfinis par l'admin** : L'admin crée et gère des templates de pages (sections, styles, layouts).
- **Personnalisation** : Les utilisateurs choisissent un canvas et éditent le contenu (textes, images, couleurs).
- **Panel Admin** : CRUD des canvases, gestion des utilisateurs et abonnements.
- **Dashboard Utilisateur** : Création du site, choix du sous-domaine, sélection et édition du canvas.
- **Rendu multi-tenant** : Middleware qui route les sous-domaines vers le contenu du tenant.

## Stack technique recommandée

| Couche          | Technologie                  | Pourquoi |
|-----------------|------------------------------|----------|
| Framework       | Next.js 15+ (App Router)    | SSR, middleware, excellent support multi-tenant |
| Base de données | PostgreSQL + Prisma         | Ou Redis (comme le starter Vercel Platforms) |
| Authentification| Auth.js (NextAuth) ou Clerk | Gestion sessions + protection routes |
| Paiements       | Stripe                      | Checkout + Customer Portal + Webhooks |
| UI              | Tailwind CSS + shadcn/ui    | Moderne et rapide |
| Hébergement     | Vercel                      | Wildcard domains, edge, déploiement simple |

**Base de départ recommandée** : [Vercel Platforms Starter Kit](https://github.com/vercel/platforms) — multi-tenancy avec sous-domaines déjà implémentée.

## Architecture Multi-tenant

```
Requete: mon-site.votresaas.com
    ↓
Middleware (proxy.ts ou middleware.ts)
    ↓ Extract subdomain = "mon-site"
    ↓ Rewrite interne vers /sites/mon-site
    ↓
Page dynamique qui charge les données du tenant (canvas + contenu)
```

- Domaine principal (`votresaas.com`) : Landing, Pricing, Login, Dashboard.
- Sous-domaines : Sites des utilisateurs uniquement.

## Modèle de Canvas (Template)

Les canvases sont stockés en base (JSON) :

```json
{
  "id": "portfolio-modern",
  "name": "Portfolio Moderne",
  "description": "Hero + Projets + Contact",
  "previewImage": "/previews/portfolio.jpg",
  "sections": [
    {
      "type": "hero",
      "fields": ["title", "subtitle", "backgroundImage", "ctaText", "ctaLink"]
    },
    {
      "type": "projects",
      "fields": ["items"]
    },
    {
      "type": "contact",
      "fields": ["email", "message"]
    }
  ],
  "defaultStyles": {
    "primaryColor": "#2563eb",
    "fontFamily": "Inter"
  }
}
```

L'admin peut en ajouter via le panel. Les utilisateurs sélectionnent un canvas et remplissent les champs.

## Flux utilisateur

1. Visite la landing → clique "Commencer"
2. S'inscrit / se connecte
3. Souscrit à un plan Stripe
4. Choisit un sous-domaine disponible
5. Sélectionne un canvas
6. Personnalise le contenu
7. Publie → site accessible sur `sousdomaine.votresaas.com`

## Structure des dossiers suggérée

```
app/
  (marketing)/          # Landing, pricing
  (auth)/               # Login, register
  dashboard/            # Dashboard utilisateur
  admin/                # Panel admin (canvases, users)
  sites/[subdomain]/    # Rendu des sites tenants
  api/
    stripe/             # Webhooks, checkout
    sites/              # CRUD sites
middleware.ts           # Routing sous-domaines
lib/
  db.ts
  stripe.ts
  tenants.ts
```

## Variables d'environnement essentielles

```env
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_ROOT_DOMAIN=votresaas.com
```

## Déploiement sur Vercel

1. Push ce repo.
2. Importer sur Vercel.
3. Dans Domains → ajouter `*.votresaas.com` (wildcard).
4. Configurer les env vars.
5. Les sous-domaines fonctionnent automatiquement.

## Prochaines étapes de développement

- [ ] Implémenter le middleware de sous-domaines
- [ ] Créer les modèles Prisma (User, Subscription, Site, Canvas)
- [ ] Panel Admin pour gérer les canvases
- [ ] Intégration Stripe Checkout + Portal
- [ ] Éditeur simple de contenu pour les utilisateurs
- [ ] Prévisualisation des canvases

---

Ce starter est prêt à être étendu. La partie la plus critique est le middleware + le système de templates.

Voir aussi : https://github.com/vercel/platforms pour l'implémentation multi-tenant de référence.
