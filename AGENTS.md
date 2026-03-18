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

## Restitution pedagogique
- Quand tu modifies le projet, explique toujours clairement :
  1. ce que tu as change,
  2. pourquoi tu l'as change,
  3. les impacts eventuels,
  4. les hypothese prises,
  5. ce que tu as verifie ou pas pu verifier.
- Quand une modification repose sur une API, une convention, une bonne pratique ou un comportement non trivial, donne les sources utiles pour que je puisse apprendre.
- Prefere des sources officielles en priorite. Si tu utilises une source non officielle, dis pourquoi elle est credible.
- Ne balance pas juste des liens : relie chaque source a la decision prise dans le code.
- Quand plusieurs options existaient, explique brievement pourquoi celle retenue est la plus simple ou la plus robuste pour V1.

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

## Vue
- Le framework du projet est Vue.
- Par defaut, pense en Vue 3 avec Single-File Components et TypeScript.
- Prefere `script setup` avec `lang="ts"` quand cela est compatible avec les patterns deja presents dans le projet.
- Prefere des composants a responsabilite unique, avec un nom multi-mot explicite.
- Separe clairement composants de page, composants de wizard, composants purement presentationnels et composables metier.
- Declare explicitement et type proprement `props`, `emits` et modeles de donnees exposes par un composant.
- Prefere `defineProps`, `defineEmits` et `withDefaults` explicites plutot que des contrats implicites.
- Si un composant expose un `v-model`, garde une convention claire et previsible. N'utilise pas le two-way binding comme raccourci pour cacher des effets de bord.
- Respecte le flux de donnees descendant : ne mute jamais une prop. Si un enfant doit demander un changement, fais-le via un event ou un mecanisme explicite.
- Limite `provide/inject` aux dependances transverses ou plugin-like. Ne t'en sers pas pour contourner des props ou masquer un flux de donnees central.
- N'utilise `defineExpose` que si l'API imperative du composant est vraiment necessaire.
- Garde les templates lisibles. Deplace les transformations, branchements complexes et regles metier dans le script, idealement via des `computed` ou des fonctions nommees.
- Prefere `computed` pour l'etat derive, et reserve `watch` / `watchEffect` aux effets de bord reels.
- Evite les `watch` profonds ou tres larges sans justification claire. Prefere des sources precises et explicites.
- Nettoie toujours les effets de bord : listeners, timers, observers, requetes annulables, integrations DOM.
- Extrait la logique reutilisable et stateful dans des composables nommes `useX`, plutot que de grossir les composants.
- Les composables doivent avoir une responsabilite claire, nettoyer leurs effets de bord, et exposer une API simple a consommer.
- Prefere retourner depuis un composable une API stable et lisible (`state`, `computed`, actions nommees) plutot qu'un objet informe difficile a comprendre.
- Evite les mixins en Vue 3. Prefere composables, composants cibles et props/slots explicites.
- Utilise les slots quand cela clarifie la composition UI, pas pour dissimuler une logique de controle difficile a suivre.
- Dans les listes, utilise des `key` stables et metier. N'utilise pas l'index comme cle si l'ordre ou le contenu peut changer.
- Evite de combiner `v-if` et `v-for` sur le meme element sauf raison claire et assumee.
- Conserve une source de verite evidente pour chaque etat d'ecran, surtout dans le wizard.
- Pour le wizard, separe nettement :
  1. l'etat source saisi par l'utilisateur,
  2. l'etat derive de validation,
  3. l'etat de navigation entre etapes.
- Une etape ne doit jamais paraitre valide si ses preconditions amont ont change. Recalcule et invalide explicitement les dependances.
- Les boutons de navigation, messages d'erreur, resumes et apercus doivent tous refleter le meme etat metier source.
- Prefere des transitions d'etat explicites et testables aux enchainements implicites de watchers.
- Dans les formulaires, garde une strategie claire pour :
  1. valeurs,
  2. erreurs,
  3. touched / dirty si necessaire,
  4. statut de soumission.
- Les validations synchrones et asynchrones doivent etre visibles dans l'UI et ne pas creer d'etats intermediaires ambigus.
- Les composants de formulaire doivent exposer une API simple, previsible et typable.
- Gere explicitement les etats `loading`, `empty`, `error` et `success` quand un composant depend d'une source asynchrone.
- Evite les `ref` de DOM ou de composant quand une solution declarative suffit.
- Si tu utilises `ref`, `reactive`, `shallowRef` ou `computed`, choisis l'outil le plus simple qui rend l'intention evidente.
- Evite de rendre reactifs de gros objets immuables si seule une petite partie doit etre observee.
- Pour les performances, prefere des props stables, limite les abstractions de composants inutiles, et lazy-load les parties lourdes non critiques du wizard.
- Pour l'accessibilite, pense labels, messages d'erreur relies aux champs, navigation clavier, focus visible et gestion correcte du focus lors des changements d'etape.
- Quand une etape devient invalide ou qu'une erreur bloque la suite, l'utilisateur doit comprendre immediatement quoi corriger et ou.
- N'utilise pas `v-html` avec du contenu non nettoye. N'injecte jamais de templates non fiables.
- Si le projet a un store global, n'y mets que l'etat reellement partage ou transverse. Garde l'etat purement local dans le composant ou le composable approprie.
- Si une logique devient centrale pour le domaine, prefere un module metier testable plutot qu'un composable trop couple au framework.
- Si une logique devient trop grosse pour un composant, deplace-la vers un composable, un module metier ou une couche d'etat adaptee plutot que d'alourdir le template.
- Si le projet utilise `eslint-plugin-vue` ou des regles de style Vue, corrige les problemes au lieu de les contourner autant que possible.

## Architecture Vue
- Prefere une architecture simple et lisible avant une architecture "enterprise" anticipee trop tot.
- Garde separees les couches suivantes quand le projet grossit :
  1. vues / pages,
  2. composants UI,
  3. composants de wizard,
  4. composables,
  5. modules metier purs,
  6. acces API / adaptateurs d'entree-sortie.
- Les modules metier purs doivent rester testables sans Vue quand c'est possible.
- Ne mets pas de regles metier importantes dans le template, dans le CSS ou dans une cascade de watchers.
- Prefere des fonctions pures pour transformer des donnees ou calculer des etats derivables.
- Si une regle est centrale au produit, donne-lui un nom explicite et un point d'entree unique.
- Evite les helpers fourre-tout. Cree des fonctions ou modules avec une responsabilite precise.
- Quand un composant devient difficile a lire, extrais soit une sous-partie d'UI, soit une logique metier, mais pas un decoupage artificiel.
- Si un composant n'est qu'un habillage visuel, garde-le le plus stateless possible.
- Si un composant porte une logique de workflow, rends ses transitions explicites et faciles a suivre.

## Etat et Wizard
- Le wizard doit etre pilote par des regles de validation et de progression explicites, pas par la simple presence d'elements dans l'UI.
- Chaque etape doit avoir un contrat clair :
  1. preconditions d'entree,
  2. donnees gerees,
  3. criteres de validite,
  4. sorties ou consequences.
- Si une etape depend d'une autre, la dependance doit etre codee explicitement et pas laissee implicite dans plusieurs composants.
- Les invalidations amont doivent etre deterministes, previsibles et faciles a retracer.
- Evite les "flags booleens" multiples qui representent mal un workflow. Prefere des etats nommes quand cela clarifie le parcours.
- Si plusieurs morceaux d'UI representent la meme etape, ils doivent tous lire la meme source de verite.
- Les donnees temporaires, brouillons, erreurs et etats confirmes ne doivent pas etre confondus.
- Si une operation est asynchrone, l'utilisateur doit savoir si l'etape est en attente, validee, invalide ou bloquee.
- Ne laisse pas la navigation contourner une regle metier juste parce que le composant precedent n'est plus monte.
- Lorsqu'une etape est reinitialisee, rends explicite ce qui est efface, ce qui est conserve et pourquoi.

## Formulaires et Validation
- Prefere des modeles de formulaire simples, explicitement types et proches du domaine.
- Normalise les donnees utilisateur a l'entree si necessaire, mais sans masquer des transformations surprenantes.
- Les messages d'erreur doivent etre actionnables, specifiques et relies au bon champ ou a la bonne etape.
- Evite de disperser la validation entre trop de composants. Centralise les regles quand elles appartiennent au meme concept metier.
- Distingue clairement validation de saisie, validation metier et validation serveur si plusieurs niveaux coexistent.
- Ne bloque pas silencieusement l'utilisateur : si une action est impossible, l'interface doit dire pourquoi.
- Si une valeur derivee est affichee a partir d'un formulaire, elle doit etre mise a jour de facon coherente et comprehensible.
- Pour les champs complexes comme crop, grille ou previsualisation, privilegie une boucle de feedback immediate et lisible.

## Accessibilite et UX
- Une interface claire prime sur une interface "magique". Evite les comportements implicites difficiles a deviner.
- Chaque action importante doit avoir un label, un etat et un retour visible.
- Les changements d'etape doivent gerer le focus proprement, surtout apres erreur ou blocage.
- La navigation clavier doit rester fonctionnelle sur l'ensemble du wizard.
- Les contrastes, tailles de cible et hierarchies visuelles doivent favoriser une comprehension rapide sur desktop.
- Les etats des controles desactives doivent rester comprehensibles : un bouton desactive doit s'accompagner d'une raison visible quand c'est utile.
- Les apercus et grilles doivent privilegier la lisibilite avant l'effet visuel.

## Performance et Robustesse
- Optimise d'abord les chemins critiques visibles : previsualisation, crop, grille, recalculs de wizard.
- Evite les recalculs inutiles dans les renders et les `computed` trop larges.
- Debounce ou throttle les traitements reactifs seulement quand cela repond a un vrai probleme observable.
- Si un calcul couteux existe, isole-le, nomme-le et documente sa raison d'etre.
- Prefere charger tard ce qui n'est pas necessaire au premier affichage de l'etape courante.
- Gere proprement les erreurs reseau, les annulations, les reessais et les etats intermediaires.
- N'introduis pas de complexite de performance speculative sans mesure ou symptome credible.

## Tests et verification
- Pour toute modification non triviale, verifie au minimum les chemins nominaux, les etats d'erreur et les regressions evidentes.
- Priorise les tests ou verifications sur :
  1. progression du wizard,
  2. invalidation des etapes dependantes,
  3. affichage correct des erreurs,
  4. derivation correcte des etats metier,
  5. interactions critiques de formulaire.
- Prefere tester le comportement observable plutot que l'implementation interne quand c'est raisonnable.
- Si tu n'ajoutes pas de test, dis pourquoi.
- Si tu ne peux pas verifier quelque chose localement, signale explicitement la limite.

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
