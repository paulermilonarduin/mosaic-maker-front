# AGENTS.md - Front

## Objectif
Tu travailles sur le front de MosaicMaker.

## Priorites
- Respecter la spec fonctionnelle V1.
- Preserver un wizard strict et simple.
- Favoriser une UX claire, surtout desktop.
- Garder le code lisible, modulaire et maintenable.

## Regles
- Ne modifie pas le perimetre fonctionnel sans le signaler.
- Ne melange pas logique UI et logique metier complexe.
- Prefere des composants petits et cibles.
- Prefere des noms explicites en anglais pour le code.
- Evite les dependances inutiles.
- Conserve des types clairs et stricts.
- Si une decision est ambigue, propose l'option la plus simple compatible V1.

## Communication
- Ne pose pas des questions "par principe".
- Pose des questions ciblees quand une ambiguite change vraiment le comportement, l'UX, les donnees ou l'architecture.
- Si une hypothese simple et sure permet d'avancer sans risque, prends-la et explicite-la brievement.
- Si une decision a des consequences non evidentes, signale les options et recommande la plus simple compatible V1.

## Attentes fonctionnelles
- Le parcours est un wizard a validation stricte.
- Une etape invalide bloque la suivante.
- Un changement amont invalide les etapes dependantes.
- Le front doit bien refleter les etats metier, pas les contourner.
- La previsualisation, le crop et la grille doivent rester fluides et comprehensibles.

## TypeScript
- Le langage du projet est TypeScript.
- Vise un niveau de rigueur et de clarte attendu d'un developpeur TypeScript experimente.
- Prefere `strict` et les controles de type stricts du projet. N'introduis pas de relachement de typage sans raison explicite.
- Evite `any`. Si le type est reellement inconnu, prefere `unknown` puis affine le type avant usage.
- Modelise le domaine avec des types explicites, des unions discriminees et des etats impossibles a representer quand c'est pertinent.
- Prefere les interfaces et types metier nommes aux objets anonymes repetes.
- Affine les donnees au plus pres de leur frontiere d'entree (API, formulaire, parsing, events), pas au dernier moment dans l'UI.
- Utilise des `switch` exhaustifs ou un garde `never` quand un ensemble de cas doit etre complet.
- Prefere des signatures de fonctions simples, des retours clairement types et des noms qui expriment l'intention metier.
- Limite les assertions de type (`as`, non-null assertion) aux cas vraiment justifies, avec une raison comprenable dans le code.
- Pour les objets de configuration ou de mapping statiques, prefere `satisfies` quand cela aide a verifier la forme sans perdre l'inference utile.
- Garde la logique metier complexe hors des composants UI. Les composants doivent orchestrer l'affichage et les interactions.
- Si du lint TypeScript type-aware est en place, corrige les alertes au lieu de les contourner autant que possible.

## Quand tu codes
- Commence par lire les fichiers de structure existants avant de modifier.
- Reutilise les patterns deja presents dans le projet.
- Pour toute feature, explique brievement :
  1. ce que tu modifies,
  2. pourquoi,
  3. les impacts eventuels.

## A eviter
- Pas de refacto large non demandee.
- Pas de changement de lib ou d'architecture sans raison claire.
- Pas de logique back ou traitement image lourd dans les composants UI.
