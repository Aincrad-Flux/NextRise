## NextRise – Guide de Style (Palette Pastel & Thème Sombre)

Document de référence unique pour maintenir cohérence visuelle (designers + dev). Version révisée avec palette rose/violet pastel (thème clair) + variante sombre, nouvelles fontes et tokens CSS.

---
### 1. ADN de la Marque
Mots‑clés: moderne, calme, sobre, analytique, chaleureux sans être infantile.

Intention: un univers doux (pastels lavande/rose) en clair, et profond/velouté en sombre. Les accents servent l’information (actions, éléments interactifs, chiffres clés) – jamais de décoration gratuite.

---
### 2. Typographie
Polices chargées via Google Fonts.
• Titres / headings: Montserrat (600–700). Ligne serrée (line-height ~1.1).
• Corps / paragraphes: Open Sans 400–600 (line-height 1.5).
• Labels petits / META: uppercase, tracking léger (letter-spacing +4–6%).
• Ne pas multiplier les variations de poids: (400 / 600 / 700 suffisent).
• Texte en dégradé: uniquement pour un nombre clé / logo interne (max 1 par écran).

Accessibilité: viser contraste AA (ratio ≥ 4.5:1 pour corps). Vérifier si on change une couleur de texte.

---
### 3. Système de Couleurs (Tokens CSS)
Les variables sont définies dans `frontend/src/index.css` sur `:root` (clair) puis sur `.theme-dark`.

#### Palette de base (nuanciers)
| Token | Hex | Usage principal |
|-------|-----|-----------------|
| --violet-500 | #C174F2 | Accent principal, boutons primaires (clair + sombre) |
| --violet-400 | #CB90F1 | Glow / hover accent, dégradés |
| --violet-300 | #D5A8F2 | Fonds tintés subtils (badges légers) |
| --violet-200 | #E4BEF8 | Arrière-plans très doux / survol léger |
| --violet-100 | #EED5FB | Background décoratif subtil |
| --rose-500 | #F18585 | Accent secondaire ponctuel (graphes, chips) |
| --rose-400 | #F49C9C | Accent secondaire (variante douce) |
| --rose-300 | #F6AEAE | Dégradés / surlignage doux |
| --rose-200 | #F8CACF | Fonds pastel de mise en avant faible |

#### Thème Clair (valeurs dérivées)
| Rôle | Token | Valeur | Notes |
|------|-------|--------|-------|
| Fond page | --color-bg | #f6f1f8 | Base lavande diffuse |
| Section alternative | --color-bg-alt | #f4eef9 | Légère différenciation |
| Surface carte | --color-surface | #fcfaff | Cartes par défaut |
| Surface élevée / hover | --color-surface-alt | #f3ecfa | Hover / élévation douce |
| Panel dashboard | --panel-bg | #f9f6fd | Groupes fonctionnels |
| Bordure | --color-border | #e3d6f1 | Séparation discrète |
| Bordure soft | --color-border-soft | #eee3f8 | Diviseurs internes |
| Texte primaire | --color-text | #2a2332 | Forte lisibilité |
| Texte secondaire | --color-text-muted | #6d5f74 | Labels / hints |
| Accent principal | --color-accent | #C174F2 | Action primaire |
| Accent secondaire | --color-accent-2 | #F49C9C | Action secondaire légère |
| Accent glow | --color-accent-glow | #CB90F1 | Anneaux focus / halo |
| Danger base | --color-danger | #e11d48 | Supprimer / erreurs |
| Danger hover | --color-danger-hover | #be123c | État survol |
| Danger active | --color-danger-active | #9f1239 | Pressé |
| Topbar | --color-topbar | gradient | Transparence givrée |

#### Thème Sombre (`.theme-dark`)
| Rôle | Token | Valeur | Notes |
|------|-------|--------|-------|
| Fond page | --color-bg | #141018 | Base profonde |
| Section alt | --color-bg-alt | #1b1522 | Variation douce |
| Surface carte | --color-surface | #1f1827 | Cartes |
| Surface élevée / hover | --color-surface-alt | #261e31 | Hover |
| Panel | --panel-bg | #201a28 | Groupes |
| Bordure | --color-border | #3a2d47 | Contraste modéré |
| Bordure soft | --color-border-soft | #2c2331 | Diviseurs |
| Texte primaire | --color-text | #ece4f2 | Haute lisibilité |
| Texte secondaire | --color-text-muted | #a592b3 | Labels |
| Accents | --color-accent / 2 | #C174F2 / #F49C9C | Cohérence palette |
| Accent glow | --color-accent-glow | #D5A8F2 | Effets focus |
| Danger (x3) | même que clair | | Constance feedback |
| Topbar | --color-topbar | gradient sombre | Légère translucidité |

Règles d’usage:
1. Accent principal ≤ ~12% de surface visuelle (éviter la saturation).
2. N’utiliser qu’UN niveau d’élévation par zone (pas d’empilement d’ombres).
3. Rouge exclusivement pour erreurs / actions destructrices.
4. Les états (hover/focus/active) modulent luminosité ou bordure, pas changer totalement la couleur.
5. Le thème sombre ne doit pas inverser la hiérarchie (mêmes rôles, autres valeurs).

---
### 4. Espacement & Rondeurs
Rythme simple (échelle interne: 4 / 8 / 12 / 16 / 24). Choisir le plus petit suffisant.
• Padding carte: 16–20px.
• Gap entre sections majeures: 32px.
• Rondeurs: `--radius-sm:6px`, `--radius-md:10px`, `--radius-lg:14px`. Utiliser md pour cartes, sm pour champs, lg pour sections héro / modales.
• Ombres: privilégier `--shadow-sm` (par défaut) et `--shadow-md` seulement pour overlays / modale.

---
### 5. Composants (Description Fonctionnelle)
Boutons:
• Primaire: fond violet dégradé ou plein (`--color-accent`), texte contrasté (#fff ou `--color-text`).
• Secondaire: surface neutre (`--color-surface` clair / `--color-surface-alt` sombre) + bordure soft.
• Danger: rouge (token danger).
États: hover = légère élévation + intensification 4–6%; active = légère obscurcissement + translation 1px; disabled = opacité ~0.5 + curseur interdit.

Cards / Panels:
• Contenu cohérent (titre optionnel en haut, actions groupées à droite).
• Pas d’ombre lourde + gradient simultané.
• Espacement interne homogène.

Formulaires:
• Label toujours au-dessus du champ.
• Erreur: bordure danger + message court (1 phrase).
• Focus: anneau / glow via `--color-accent-glow` (ombre portée externe douce).
• N’afficher une validation succès que si utile (ex: sauvegarde distante).

Listes & Tableaux:
• Ligne header: légère variation de surface (`--color-surface-alt` clair / assombrie sombre).
• Hover ligne: fond subtil (pas d’inversion totale).
• Densité verticale régulière (ligne ~40–48px selon contenu).

Badges / Status (futur): utiliser teintures très légères (transparence 12–18%) + texte contrasté.

---
### 6. Thèmes & Implémentation
Activation du sombre: ajouter `.theme-dark` sur l’élément racine (ex: `<body>`). Les composants ne doivent pas surcharger les couleurs en dur mais consommer les tokens. Toute nouvelle couleur = nouvelle variable documentée ici avant usage.

Checklist dev avant merge:
1. Variables utilisées ? (pas d’hex inline sauf cas exception décoratif discret)
2. Contraste accessible vérifié ?
3. État focus visible clavier ?
4. Responsive (≥320px) sans rupture ?

---
### 7. Accessibilité
• Focus: contour ou halo accent clair/sombre visible.
• Ne pas transmettre l’info uniquement par couleur (ajouter icône/texte).
• Taille cible interactive ≥ 40px haut (mobile).
• Réduire animations futures si `prefers-reduced-motion` (TODO).

---
### 8. Motion
Micro transitions (150–220ms, easing cubic-bezier standard: `ease-out`). Fades, translations ≤ 8px. Aucune animation décorative en boucle.

---
### 9. Roadmap d’Amélioration
1. Pack composants (Button, Badge, Input, Modal) unifiés.
2. Système de status (success / warning / info) avec tokens dédiés.
3. Page vitrine /storybook interne.
4. Mode contraste renforcé.
5. Règles d’illustrations & pictogrammes.
6. Tokens spacing codifiés (`--space-…`).
7. Animation d’apparition standardisée (util class).

---
### 10. Gouvernance
Toute nouvelle variation de couleur / style passe revue design. Les modifications de tokens sont versionnées et annoncées (CHANGELOG UI).

---
### 11. Résumé Express
Palette pastel contrôlée, accents mesurés, hiérarchie lisible, même structure en clair & sombre, sobriété avant effet. Cohérence > originalité ponctuelle.

---
NOTE: Mettre à jour ce document à chaque ajout de variable CSS ou pattern réutilisable.

