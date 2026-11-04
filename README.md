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

Sur un checkout neuf, lancer `npm run dev` au moins une fois avant `npm run typecheck` : Expo génère alors `expo-env.d.ts` et les types de routes (`.expo/types/`), ignorés par Git. Sans eux, TypeScript signale `Cannot find module ... '@/global.css'`.

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

### Vérifier les règles d'accès

`supabase/checks/profiles_rls.sql` vérifie qu'un utilisateur connecté ne lit que son profil, ne modifie pas celui des autres ni son propre rôle, et qu'un visiteur ne lit aucun profil.
Le lancer dans le SQL Editor une fois au moins deux comptes créés. Il ne modifie aucune donnée (transaction annulée). Résultat attendu : `All profiles access checks passed`.

### Réglages Supabase Auth (Authentication > Sign In / Providers > Email)

| Réglage | Valeur en développement |
| --- | --- |
| Confirm email | Désactivé (à réactiver avant la livraison finale) |
| Minimum password length | 8 |

## Structure du projet

```
app/
  _layout.tsx           Cadre commun : session, thème, pile de navigation
  index.tsx             Redirige vers /explore si connecté, sinon vers /welcome
  +not-found.tsx        Écran affiché pour une route inconnue
  (auth)/               Bienvenue, connexion, inscription (pile)
  (tabs)/               Explorer, Favoris, Messages, Visites, Profil (onglets)
components/
  ui/                   Composants de base React Native Reusables (Button, Input, Checkbox…)
  *.tsx                 Composants MASKANI : logo, champs de formulaire, états vides…
lib/
  supabase.ts           Le seul client Supabase de l'application
  auth.ts               Inscription, connexion, déconnexion
  auth-validation.ts    Règles de validation des formulaires
  theme.ts, utils.ts    Couleurs pour la navigation, fusion de classes
providers/
  session-provider.tsx  Session partagée : useSession()
types/                  Contrats de données partagés par toute l'équipe
supabase/
  migrations/           Scripts SQL de la base, à appliquer dans l'ordre
  checks/               Vérifications SQL répétables
assets/images/          Logos, icône, splash screen
global.css              Variables de couleur (mode clair et sombre)
```

## Authentification et session

- Utiliser la session dans un écran : `const { session } = useSession();` (`null` si visiteur).
- Appeler Supabase uniquement via `lib/` ; les écrans n'importent pas `supabase` pour l'authentification.
- Les visiteurs peuvent parcourir les onglets sans compte ; les actions personnelles (favoris, visites, messages) devront vérifier `session` et les règles RLS côté base.

## État du Turn 01 (Personne 1)

Fait : thème MASKANI, composants communs, navigation `(auth)` + `(tabs)`, contrats de données, Supabase, inscription, connexion, déconnexion, session persistante.

Limites connues, prévues dans le plan :

- Réinitialisation du mot de passe, sessions expirées et comptes suspendus : Turn 09.
- Écran Profil complet (photo, modification, mode propriétaire) : Turn 04.
- Les tables autres que `profiles` sont à créer par chaque Turn à partir des contrats de `types/`.
- La version web n'est pas une cible : son rendu statique n'a pas été validé.

## Conventions

- Noms de variables, fonctions et fichiers en anglais ; interface utilisateur en français.
- Fichiers en `kebab-case` (`sign-in.tsx`), composants en `PascalCase` (`SignInForm`).
- Imports avec l'alias `@/` depuis la racine : `import { Button } from '@/components/ui/button'`.
- Ajouter un composant Reusables : `npx @react-native-reusables/cli@latest add <nom>`.
- Avant chaque commit : `npm run typecheck`.
