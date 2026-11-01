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

Backend et base de données : choix d'équipe à venir (Turn 01, étape 6).

## Installation

Prérequis : une version LTS récente de Node.js (projet testé avec Node 24), et l'application **Expo Go** sur le téléphone.

```bash
git clone https://github.com/Pedroxsbai/maskani.git
cd maskani
npm install
npm run dev
```

Scanner le QR code affiché avec Expo Go (Android) ou l'appareil photo (iOS). Le téléphone et le PC doivent être sur le même réseau Wi-Fi ; sinon, utiliser `npx expo start --tunnel`.

## Scripts

| Commande | Effet |
| --- | --- |
| `npm run dev` | Démarre le serveur Expo en vidant le cache |
| `npm run android` / `npm run ios` / `npm run web` | Démarre et ouvre directement la plateforme choisie |
| `npm run typecheck` | Vérifie les types TypeScript sans lancer l'application |

## Variables d'environnement

Aucune pour le moment. Elles seront listées ici, avec un fichier `.env.example`, lors de la configuration du backend.
Les vrais fichiers `.env` ne doivent jamais être commités (ils sont ignorés par `.gitignore`).

## Structure du projet

```
app/                  Écrans : chaque fichier devient une route (Expo Router)
  _layout.tsx         Cadre commun : thème, pile de navigation
  index.tsx           Route "/"
  +not-found.tsx      Écran affiché pour une route inconnue
components/
  ui/                 Composants de base React Native Reusables (Button, Text, Icon…)
lib/                  Code partagé sans interface : thème, utilitaires
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
