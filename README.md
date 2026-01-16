# 🍳 RecettesBlog - Blog de Recettes avec Dashboard Admin

Un blog de recettes moderne construit avec Next.js 15, MongoDB, et optimisé pour la monétisation Google AdSense.

## 🚀 Fonctionnalités

### Public
- ✅ Page d'accueil avec recettes à la une
- ✅ Liste de recettes avec filtres par catégorie
- ✅ Pages de recettes individuelles avec SEO optimisé
- ✅ Schema.org pour les recettes (Google Rich Snippets)
- ✅ Partage social (Facebook, Twitter, Pinterest, WhatsApp)
- ✅ Design responsive et moderne
- ✅ Emplacements publicitaires Google AdSense

### Dashboard Admin
- ✅ Authentification sécurisée (NextAuth.js)
- ✅ CRUD complet pour les recettes
- ✅ Gestion des brouillons et publications
- ✅ Statistiques (vues, recettes publiées)
- ✅ Éditeur de recettes complet (ingrédients, étapes, tags)

## 📋 Prérequis

- Node.js 18+
- MongoDB (local ou Atlas)
- Compte Google AdSense (pour la monétisation)

## 🛠️ Installation

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd recettes-blog
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env.local` à la racine:
```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/recettes-blog

# NextAuth
NEXTAUTH_SECRET=votre-secret-super-securise
NEXTAUTH_URL=http://localhost:3000

# Google AdSense (optionnel)
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```

5. **Créer le compte admin**
- Allez sur `http://localhost:3000/admin/login`
- Cliquez sur "Premier accès? Créer un compte admin"
- Remplissez le formulaire

## 📁 Structure du Projet

```
src/
├── app/
│   ├── admin/              # Dashboard admin
│   │   ├── dashboard/      # Page principale
│   │   ├── login/          # Connexion
│   │   └── recipes/[id]/   # Éditeur de recettes
│   ├── api/
│   │   ├── auth/           # API NextAuth
│   │   └── recipes/        # API CRUD recettes
│   ├── recettes/           # Pages publiques
│   │   └── [slug]/         # Page recette
│   ├── layout.js           # Layout principal
│   └── page.js             # Homepage
├── components/
│   ├── AdBanner.jsx        # Composant publicité
│   ├── BlogHeader.jsx      # Header
│   ├── BlogFooter.jsx      # Footer
│   └── RecipeSchema.jsx    # Schema.org
├── lib/
│   └── mongodb.js          # Connexion DB
└── models/
    ├── Recipe.js           # Modèle recette
    └── User.js             # Modèle utilisateur
```

## 💰 Configuration Google AdSense

1. **Créer un compte AdSense**
   - Allez sur https://www.google.com/adsense
   - Créez un compte et attendez l'approbation

2. **Ajouter votre ID AdSense**
   - Copiez votre ID (format: ca-pub-XXXXXXXXXXXXXXXX)
   - Ajoutez-le dans `.env.local`:
   ```env
   NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXXXXXXXX
   ```

3. **Créer des blocs d'annonces**
   - Dans AdSense, créez des blocs d'annonces
   - Les emplacements disponibles:
     - `home-top`, `home-middle`, `home-bottom`
     - `recipe-top`, `recipe-middle`, `recipe-bottom`
     - `top-banner`, `in-feed`, `bottom-banner`

## 🔧 Scripts Disponibles

```bash
npm run dev      # Développement
npm run build    # Build production
npm run start    # Lancer en production
npm run lint     # Vérification ESLint
```

## 🌐 Déploiement

### Vercel (Recommandé)
1. Connectez votre repo GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez!

## 📈 Optimisation SEO

Le blog est optimisé pour le SEO:
- ✅ Métadonnées dynamiques
- ✅ Schema.org pour les recettes
- ✅ Sitemap automatique
- ✅ OpenGraph & Twitter Cards
- ✅ URLs propres avec slugs

---

Créé avec ❤️ pour les passionnés de cuisine

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
