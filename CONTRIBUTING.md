## Le projet

Le site EcoIndex est réalisé avec [Astro](https://astro.build/) (contenu MDX, i18n FR/EN, TypeScript client pour l’analyse et la page résultat).

Les données de référence (couleurs des notes A–G, cibles de score) sont synchronisées depuis
[`ecoindex_reference`](https://github.com/cnumr/ecoindex_reference).

### Prérequis

- [mise](https://mise.jdx.dev/) (gestion des runtimes)
- [Bun](https://bun.sh/) (installés via mise)

```bash
mise trust    # une seule fois, pour activer .mise.toml
mise install
```

### Installation

1. Clonez ce dépôt :
    ```bash
    git clone https://github.com/cnumr/EcoIndex.git
    # ou en SSH :
    git clone git@github.com:cnumr/EcoIndex.git
    ```
2. Installez les dépendances et lancez le serveur de développement :
    ```bash
    bun install
    mise run dev       # http://localhost:4321
    ```
3. Autres commandes utiles :
    ```bash
    mise run build     # génère dist/
    mise run preview   # prévisualise le build
    mise run test      # tests unitaires (Vitest)
    mise run format    # vérifie le formatage
    mise run lint      # vérifie le linting
    mise run typecheck # vérifie le typage
    ```

### Synchronisation `ecoindex_reference`

Les couleurs de notes et les cibles (poids, DOM, requêtes) sont générées depuis la référence officielle :

```bash
mise run reference:sync    # régénère CSS + targets
```

La synchronisation est **automatique** : mise surveille les changements dans `bun.lock` et déclenche `reference:sync` si nécessaire.

Source : dépendance `ecoindex_reference`, ou fichier local via `ECOINDEX_REFERENCE_PATH`.

### Architecture

```
src/
├── components/
│   ├── layout/          # Header, Footer, LanguageSwitcher
│   ├── shortcodes/      # Composants de contenu (Hero, Grid, Form…)
│   └── widgets/         # Widgets dont page résultat
├── config/
│   ├── site.ts          # Routes i18n, menus, slugs FR/EN
│   ├── api.ts           # URL API EcoIndex + viewport d’analyse
│   ├── result-text.ts   # Textes / bornes d’affichage page résultat
│   └── ecoindex-targets.ts  # Cibles (généré depuis ecoindex_reference)
├── content/
│   ├── fr/              # Pages et widgets FR
│   └── en/              # Pages et widgets EN
├── i18n/                # Chaînes UI
├── layouts/BaseLayout.astro
├── lib/                 # Helpers contenu et widgets
├── scripts/             # TS client (API, résultats, dialogues) + *.test.ts
└── styles/              # CSS (dont 0_grade-colors.css généré)
```

#### Routing i18n

| Section           | FR                        | EN                 |
| ----------------- | ------------------------- | ------------------ |
| Accueil           | `/`                       | `/en/`             |
| Comment ça marche | `/comment-ca-marche`      | `/en/how-it-works` |
| Écoconception     | `/ecoconception`          | `/en/ecodesign`    |
| …                 | voir `src/config/site.ts` |                    |

#### Widgets

Chaque page est composée de fragments Markdown / MDX (`_10_*.mdx`) chargés par `<Widgets />`. Les zones nommées utilisent le préfixe `_zone-first_`.

### CI / CD

Quatre workflows GitHub Actions :

| Workflow             | Fichier                               | Déclencheur                      |
| -------------------- | ------------------------------------- | -------------------------------- |
| Code quality checks  | `.github/workflows/quality.yml`       | ouverture / mise à jour d’une PR |
| Deploy preproduction | `.github/workflows/deploy.yml`        | push sur `main`                  |
| Deploy manual        | `.github/workflows/deploy-manual.yml` | manuel (`workflow_dispatch`)     |
| Release              | `.github/workflows/release.yml`       | manuel (`workflow_dispatch`)     |

#### Configurer le déploiement

Créer deux **Environments** GitHub (`Settings` → `Environments`) :

- `preproduction` — utilisé par le deploy automatique sur `main` et le deploy manuel
- `production` — utilisé par le deploy manuel et le workflow **Release**

Dans **chaque** environment, définir les secrets suivants (valeurs propres à la cible) :

| Secret                  | Description                                                |
| ----------------------- | ---------------------------------------------------------- |
| `RSYNC_PRIVATE_SSH_KEY` | Clé privée SSH pour se connecter au serveur                |
| `RSYNC_KNOWN_HOSTS`     | Entrée `known_hosts` du serveur (évite le prompt host key) |
| `RSYNC_REMOTE_PORT`     | Port SSH                                                   |
| `RSYNC_REMOTE_USER`     | Utilisateur SSH                                            |
| `RSYNC_REMOTE_HOST`     | Hôte du serveur                                            |
| `RSYNC_REMOTE_FOLDER`   | Chemin distant où synchroniser le contenu de `dist/`       |

Optionnel (au niveau repository ou environment `production`) :

| Secret                   | Description                                                                    |
| ------------------------ | ------------------------------------------------------------------------------ |
| `MATTERMOST_RELEASE_URL` | Webhook Mattermost pour notifier une release (si absent, la notif est ignorée) |

Les jobs de deploy ont besoin des droits d’accès aux environments (éventuellement protection rules / reviewers sur `production`).

#### Caddy (compression + cache)

Le front est servi par Caddy (`file_server` sur `/srv/preprod` et `/srv/prod`). Pour les bonnes pratiques RWEB 0075 / 0076, appliquer le snippet versionné [`deploy/Caddyfile.snippet`](deploy/Caddyfile.snippet) sur l’hôte (importer `ecoindex_static` dans `www.ecoindex.fr` et `site-tmp.ecoindex.fr`), puis recharger Caddy. Ce fichier n’est **pas** déployé par rsync.

#### Quand on ouvre une PR

Le workflow **Code quality checks** s’exécute automatiquement. Il :

1. installe les runtimes (mise) et les dépendances (`bun install --frozen-lockfile`)
2. lance `format`, `lint`, `typecheck`, `test`, puis `build`

Aucun déploiement n’est effectué. La PR peut être mergée une fois ces checks verts.

#### Quand on merge sur `main`

Le workflow **Deploy preproduction** se déclenche sur le push vers `main`. Il :

1. build le site (la sync `ecoindex_reference` est automatique)
2. déploie `dist/` par **rsync/SSH** vers l’environment `preproduction`

La production n’est **pas** mise à jour à ce stade.

#### Deploy manuel (préprod ou prod)

Pour redéployer une branche / un tag **sans** bump de version ni GitHub Release :

1. Aller dans **Actions** → **Deploy manual** → **Run workflow**
2. Choisir la branche ou le tag à déployer
3. Choisir la cible : `preproduction` ou `production`
4. Lancer le workflow

Le job build le site puis synchronise `dist/` via rsync vers l’environment choisi (mêmes secrets SSH). Utile pour rejouer un deploy préprod, ou pousser en prod un commit déjà tagué sans passer par **Release**.

> **Release** reste le chemin nominal pour la prod (bump + tag + changelog + Mattermost). Le deploy manuel prod ne crée ni tag ni release GitHub.

#### Lancer une release (production)

1. Aller dans **Actions** → **Release** → **Run workflow**
2. Choisir la branche `main` et le bump semver : `patch` / `minor` / `major`
3. Lancer le workflow

Enchaînement automatique :

1. **Bump** — lit la version dans `package.json`, l’incrémente, commit (`chore: bump version to X.Y.Z`), pousse et crée le tag `vX.Y.Z`
2. **Deploy** — checkout du tag, build, rsync vers l’environment `production`
3. **GitHub Release** — génère un changelog depuis le tag précédent _sur l’historique courant_ (les tags Hugo hors historique Astro sont ignorés), publie la release `vX.Y.Z`, puis notifie Mattermost si `MATTERMOST_RELEASE_URL` est défini

## The project

The EcoIndex website is built with [Astro](https://astro.build/) (MDX content, FR/EN i18n, client TypeScript for analysis and the result page).

Reference data (grade A–G colors, score targets) is synced from
[`ecoindex_reference`](https://github.com/cnumr/ecoindex_reference).

### Prerequisites

- [mise](https://mise.jdx.dev/) (runtime manager)
- [Bun](https://bun.sh/) (installed via mise)

```bash
mise trust    # once, to enable .mise.toml
mise install
```

### Setup

1. Clone this repository:
    ```bash
    git clone https://github.com/cnumr/EcoIndex.git
    # or via SSH:
    git clone git@github.com:cnumr/EcoIndex.git
    ```
2. Install dependencies and start the dev server:
    ```bash
    bun install
    mise run dev       # http://localhost:4321
    ```
3. Useful commands:
    ```bash
    mise run build     # outputs dist/
    mise run preview   # preview the production build
    mise run test      # unit tests (Vitest)
    mise run format    # check formatting
    mise run lint      # check linting
    mise run typecheck # check types
    ```

### Syncing `ecoindex_reference`

Grade colors and score targets are generated from the official reference:

```bash
mise run reference:sync    # regenerate CSS + targets
```

Sync is **automatic**: mise watches for changes in `bun.lock` and triggers `reference:sync` as needed.

Source: `ecoindex_reference` dependency, or a local file via `ECOINDEX_REFERENCE_PATH`.

### CI / CD

Four GitHub Actions workflows:

| Workflow             | File                                  | Trigger                      |
| -------------------- | ------------------------------------- | ---------------------------- |
| Code quality checks  | `.github/workflows/quality.yml`       | PR opened / updated          |
| Deploy preproduction | `.github/workflows/deploy.yml`        | push to `main`               |
| Deploy manual        | `.github/workflows/deploy-manual.yml` | manual (`workflow_dispatch`) |
| Release              | `.github/workflows/release.yml`       | manual (`workflow_dispatch`) |

#### Configure deployment

Create two GitHub **Environments** (`Settings` → `Environments`):

- `preproduction` — used by the automatic deploy on `main` and the manual deploy
- `production` — used by the manual deploy and the **Release** workflow

In **each** environment, set these secrets (values specific to that target):

| Secret                  | Description                                          |
| ----------------------- | ---------------------------------------------------- |
| `RSYNC_PRIVATE_SSH_KEY` | SSH private key used to connect to the server        |
| `RSYNC_KNOWN_HOSTS`     | Server `known_hosts` entry (avoids host-key prompts) |
| `RSYNC_REMOTE_PORT`     | SSH port                                             |
| `RSYNC_REMOTE_USER`     | SSH user                                             |
| `RSYNC_REMOTE_HOST`     | Server host                                          |
| `RSYNC_REMOTE_FOLDER`   | Remote path where `dist/` content is synced          |

Optional (repository level or `production` environment):

| Secret                   | Description                                                     |
| ------------------------ | --------------------------------------------------------------- |
| `MATTERMOST_RELEASE_URL` | Mattermost webhook for release notifications (skipped if unset) |

Deploy jobs need access to those environments (you may add protection rules / reviewers on `production`).

#### Caddy (compression + cache)

The front is served by Caddy (`file_server` on `/srv/preprod` and `/srv/prod`). For RWEB 0075 / 0076, apply the versioned snippet [`deploy/Caddyfile.snippet`](deploy/Caddyfile.snippet) on the host (import `ecoindex_static` in `www.ecoindex.fr` and `site-tmp.ecoindex.fr`), then reload Caddy. This file is **not** deployed by rsync.

#### When a PR is opened

The **Code quality checks** workflow runs automatically. It:

1. installs runtimes (mise) and dependencies (`bun install --frozen-lockfile`)
2. runs `format`, `lint`, `typecheck`, `test`, then `build`

Nothing is deployed. Merge once those checks are green.

#### When merging to `main`

The **Deploy preproduction** workflow runs on push to `main`. It:

1. builds the site (the `ecoindex_reference` sync is automatic)
2. deploys `dist/` via **rsync/SSH** to the `preproduction` environment

Production is **not** updated at this stage.

#### Manual deploy (preprod or prod)

To redeploy a branch / tag **without** a version bump or GitHub Release:

1. Go to **Actions** → **Deploy manual** → **Run workflow**
2. Select the branch or tag to deploy
3. Choose the target: `preproduction` or `production`
4. Start the workflow

The job builds the site then rsyncs `dist/` to the selected environment (same SSH secrets). Useful to replay a preprod deploy, or push to prod an already-tagged commit without running **Release**.

> **Release** remains the nominal path for production (bump + tag + changelog + Mattermost). A manual prod deploy does not create a tag or GitHub Release.

#### Ship a release (production)

1. Go to **Actions** → **Release** → **Run workflow**
2. Select branch `main` and the semver bump: `patch` / `minor` / `major`
3. Start the workflow

Automatic sequence:

1. **Bump** — increments `package.json`, commits (`chore: bump version to X.Y.Z`), pushes, and creates tag `vX.Y.Z`
2. **Deploy** — checks out the tag, builds, rsyncs to the `production` environment
3. **GitHub Release** — builds a changelog since the previous tag _on the current history_ (Hugo tags outside the Astro history are ignored), publishes release `vX.Y.Z`, then notifies Mattermost if `MATTERMOST_RELEASE_URL` is set
