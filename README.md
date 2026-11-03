# MASKANI

Application mobile de location immobilière longue durée au Maroc (maisons et appartements).
Projet réalisé en équipe de quatre personnes, en suivant le plan de livraison `MASKANI_Task_Plan.pdf`.

## Stack technique

| Outil | Rôle |
| --- | --- |
| [Expo](https://docs.expo.dev/) (SDK 58) + [React Native](https://reactnative.dev/) | Application mobile Android / iOS / web |
| TypeScript (mode `strict`) | Typage du code |
| [Expo Router](https://docs.expo.dev/router/introduction/) | Navigation basée sur les fichiers du dossier `app/` |
| [NativeWind](https://www.nativewind.dev/) | Style avec des classes Tailwind |
| [React Native Reusables](https://reactnativereusables.com) | Composants UI de base (`components/ui/`) |
| [Supabase](https://supabase.com/docs) | Backend : base PostgreSQL, authentification, stockage, règles d'accès (RLS) |

## Installation

Prérequis : une version LTS récente de Node.js (projet testé avec Node 24), et l'application **Expo Go** sur le téléphone.

```bash
git clone https://github.com/Pedroxsbai/maskani.git
cd maskani
npm install
cp .env.example .env
npm run dev
```

Avant `npm run dev`, remplir `.env` avec les valeurs du projet Supabase de l'équipe (voir « Variables d'environnement »). Sous PowerShell, remplacer `cp` par `Copy-Item`.

Scanner le QR code affiché avec Expo Go (Android) ou l'appareil photo (iOS). Le téléphone et le PC doivent être sur le même réseau Wi-Fi ; sinon, utiliser `npx expo start --tunnel`.

## Scripts

| Commande | Effet |
| --- | --- |
| `npm run dev` | Démarre le serveur Expo en vidant le cache |
| `npm run android` / `npm run ios` / `npm run web` | Démarre et ouvre directement la plateforme choisie |
| `npm run typecheck` | Vérifie les types TypeScript sans lancer l'application |

## Variables d'environnement

| Variable | Où la trouver |
| --- | --- |
| `EXPO_PUBLIC_SUPABASE_URL` | Tableau de bord Supabase > Project Settings > API Keys (URL du projet) |
| `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Même page : clé *publishable* (`sb_publishable_...`) |

Les variables préfixées par `EXPO_PUBLIC_` sont intégrées à l'application : n'y mettre que des valeurs publiques.
La clé secrète (`sb_secret_...` ou `service_role`) ne doit jamais apparaître dans l'application ni dans Git.
Les vrais fichiers `.env` ne doivent jamais être commités (ils sont ignorés par `.gitignore`).

## Base de données

Les migrations SQL sont dans `supabase/migrations/`, à appliquer dans l'ordre de leur nom.
Pour chaque fichier : tableau de bord Supabase > SQL Editor > coller le contenu > Run.

| Migration | Contenu |
| --- | --- |
| `20261103000000_create_profiles.sql` | Table `profiles` (contrat `User`), règles d'accès, création automatique du profil à l'inscription |

## Structure du projet

```
app/                  Écrans : chaque fichier devient une route (Expo Router)
  _layout.tsx         Cadre commun : thème, pile de navigation
  index.tsx           Route "/"
  +not-found.tsx      Écran affiché pour une route inconnue
components/
  ui/                 Composants de base React Native Reusables (Button, Text, Icon…)
lib/                  Code partagé sans interface : thème, utilitaires, client Supabase
types/                Contrats de données partagés par toute l'équipe
supabase/migrations/  Scripts SQL de la base de données
assets/images/        Logos, icône, splash screen
global.css            Variables de couleur (mode clair et sombre)
```

Dossiers ajoutés au fur et à mesure du Turn 01 :

| Dossier | Contenu | Étape |
| --- | --- | --- |
| `app/(auth)/` | Bienvenue, connexion, inscription | 4 et 7 |
| `app/(tabs)/` | Barre d'onglets : Explorer, Favoris, Messages, Visites, Profil | 4 |
| `components/` | Composants propres à MASKANI, construits à partir de `components/ui/` | 3 |
| `types/` | Contrats de données : User, Listing, Favourite, Visit, Conversation, Message, Report | 5 |
| `lib/` | Client du backend et services d'authentification | 6 et 8 |
| `providers/` | Fournisseur de session partagé dans toute l'application | 9 |

## Conventions

- Noms de variables, fonctions et fichiers en anglais ; interface utilisateur en français.
- Fichiers en `kebab-case` (`sign-in.tsx`), composants en `PascalCase` (`SignInForm`).
- Imports avec l'alias `@/` depuis la racine : `import { Button } from '@/components/ui/button'`.
- Ajouter un composant Reusables : `npx @react-native-reusables/cli@latest add <nom>`.
- Avant chaque commit : `npm run typecheck`.
