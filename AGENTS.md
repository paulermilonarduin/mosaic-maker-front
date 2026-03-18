# AGENTS.md - Front

## Objectif
Tu travailles sur le front de MosaicMaker.

## Priorités
- Respecter la spec fonctionnelle V1.
- Préserver un wizard strict et simple.
- Favoriser une UX claire, surtout desktop.
- Garder le code lisible, modulaire et maintenable.

## Règles
- Ne modifie pas le périmètre fonctionnel sans le signaler.
- Ne mélange pas logique UI et logique métier complexe.
- Préfère des composants petits et ciblés.
- Préfère des noms explicites en anglais pour le code.
- Évite les dépendances inutiles.
- Conserve des types clairs et stricts.
- Si une décision est ambiguë, propose l’option la plus simple compatible V1.

## Attentes fonctionnelles
- Le parcours est un wizard à validation stricte.
- Une étape invalide bloque la suivante.
- Un changement amont invalide les étapes dépendantes.
- Le front doit bien refléter les états métier, pas les contourner.
- La prévisualisation, le crop et la grille doivent rester fluides et compréhensibles.

## Quand tu codes
- Commence par lire les fichiers de structure existants avant de modifier.
- Réutilise les patterns déjà présents dans le projet.
- Pour toute feature, explique brièvement :
  1. ce que tu modifies,
  2. pourquoi,
  3. les impacts éventuels.

## À éviter
- Pas de refacto large non demandée.
- Pas de changement de lib ou d’architecture sans raison claire.
- Pas de logique back ou traitement image lourd dans les composants UI.