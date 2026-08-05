# SnakeRescue

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is ready ✨.

[Learn more about this workspace setup and its capabilities](https://nx.dev/nx-api/js?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects) or run `npx nx graph` to visually explore what was created. Now, let's get you up to speed!

## Generate a library

```sh
npx nx g @nx/js:lib packages/pkg1 --publishable --importPath=@my-org/pkg1
```

## Run tasks

To build the library use:

```sh
npx nx build pkg1
```

To run any task with Nx use:

```sh
npx nx <target> <project-name>
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Versioning and releasing

To version and release the library use

```
npx nx release
```

Pass `--dry-run` to see what would happen without actually releasing the library.

[Learn more about Nx release &raquo;](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Keep TypeScript project references up to date

Nx automatically updates TypeScript [project references](https://www.typescriptlang.org/docs/handbook/project-references.html) in `tsconfig.json` files to ensure they remain accurate based on your project dependencies (`import` or `require` statements). This sync is automatically done when running tasks such as `build` or `typecheck`, which require updated references to function correctly.

To manually trigger the process to sync the project graph dependencies information to the TypeScript project references, run the following command:

```sh
npx nx sync
```

You can enforce that the TypeScript project references are always in the correct state when running in CI by adding a step to your CI job configuration that runs the following command:

```sh
npx nx sync:check
```

[Learn more about nx sync](https://nx.dev/reference/nx-commands#sync)

## Set up CI!

### Step 1

To connect to Nx Cloud, run the following command:

```sh
npx nx connect
```

Connecting to Nx Cloud ensures a [fast and scalable CI](https://nx.dev/ci/intro/why-nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

- [Remote caching](https://nx.dev/ci/features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task distribution across multiple machines](https://nx.dev/ci/features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Automated e2e test splitting](https://nx.dev/ci/features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task flakiness detection and rerunning](https://nx.dev/ci/features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Step 2

Use the following command to configure a CI workflow for your workspace:

```sh
npx nx g ci-workflow
```

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/js?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

```
snake-rescue
├─ .agents
│  └─ skills
│     ├─ prisma-cli
│     │  ├─ references
│     │  │  ├─ db-execute.md
│     │  │  ├─ db-pull.md
│     │  │  ├─ db-push.md
│     │  │  ├─ db-seed.md
│     │  │  ├─ debug.md
│     │  │  ├─ dev.md
│     │  │  ├─ format.md
│     │  │  ├─ generate.md
│     │  │  ├─ init.md
│     │  │  ├─ mcp.md
│     │  │  ├─ migrate-deploy.md
│     │  │  ├─ migrate-dev.md
│     │  │  ├─ migrate-diff.md
│     │  │  ├─ migrate-reset.md
│     │  │  ├─ migrate-resolve.md
│     │  │  ├─ migrate-status.md
│     │  │  ├─ studio.md
│     │  │  └─ validate.md
│     │  └─ SKILL.md
│     ├─ prisma-client-api
│     │  ├─ references
│     │  │  ├─ client-methods.md
│     │  │  ├─ constructor.md
│     │  │  ├─ filters.md
│     │  │  ├─ model-queries.md
│     │  │  ├─ query-options.md
│     │  │  ├─ raw-queries.md
│     │  │  ├─ relations.md
│     │  │  └─ transactions.md
│     │  └─ SKILL.md
│     ├─ prisma-compute
│     │  ├─ references
│     │  │  ├─ app-deploy-cli.md
│     │  │  ├─ compute-config.md
│     │  │  ├─ create-prisma.md
│     │  │  ├─ frameworks.md
│     │  │  ├─ sdk-api.md
│     │  │  └─ troubleshooting.md
│     │  └─ SKILL.md
│     ├─ prisma-database-setup
│     │  ├─ references
│     │  │  ├─ cockroachdb.md
│     │  │  ├─ mongodb.md
│     │  │  ├─ mysql.md
│     │  │  ├─ postgresql.md
│     │  │  ├─ prisma-client-setup.md
│     │  │  ├─ prisma-postgres.md
│     │  │  ├─ sqlite.md
│     │  │  └─ sqlserver.md
│     │  └─ SKILL.md
│     ├─ prisma-driver-adapter-implementation
│     │  └─ SKILL.md
│     ├─ prisma-mongodb-upgrade
│     │  ├─ references
│     │  │  ├─ client-api-mapping.md
│     │  │  ├─ decision-stay-or-migrate.md
│     │  │  ├─ migrations-mapping.md
│     │  │  ├─ schema-contract-mapping.md
│     │  │  └─ verify-cutover-checklist.md
│     │  └─ SKILL.md
│     ├─ prisma-postgres
│     │  ├─ references
│     │  │  ├─ console-and-connections.md
│     │  │  ├─ create-db-cli.md
│     │  │  ├─ management-api-sdk.md
│     │  │  └─ management-api.md
│     │  └─ SKILL.md
│     ├─ prisma-postgres-setup
│     │  ├─ references
│     │  │  ├─ api-basics.md
│     │  │  ├─ auth.md
│     │  │  ├─ endpoints.md
│     │  │  └─ prisma7-client.md
│     │  └─ SKILL.md
│     └─ prisma-upgrade-v7
│        ├─ references
│        │  ├─ accelerate-users.md
│        │  ├─ driver-adapters.md
│        │  ├─ env-variables.md
│        │  ├─ esm-support.md
│        │  ├─ prisma-config.md
│        │  ├─ removed-features.md
│        │  └─ schema-changes.md
│        └─ SKILL.md
├─ .claude
│  └─ skills
│     ├─ prisma-cli
│     │  ├─ references
│     │  │  ├─ db-execute.md
│     │  │  ├─ db-pull.md
│     │  │  ├─ db-push.md
│     │  │  ├─ db-seed.md
│     │  │  ├─ debug.md
│     │  │  ├─ dev.md
│     │  │  ├─ format.md
│     │  │  ├─ generate.md
│     │  │  ├─ init.md
│     │  │  ├─ mcp.md
│     │  │  ├─ migrate-deploy.md
│     │  │  ├─ migrate-dev.md
│     │  │  ├─ migrate-diff.md
│     │  │  ├─ migrate-reset.md
│     │  │  ├─ migrate-resolve.md
│     │  │  ├─ migrate-status.md
│     │  │  ├─ studio.md
│     │  │  └─ validate.md
│     │  └─ SKILL.md
│     ├─ prisma-client-api
│     │  ├─ references
│     │  │  ├─ client-methods.md
│     │  │  ├─ constructor.md
│     │  │  ├─ filters.md
│     │  │  ├─ model-queries.md
│     │  │  ├─ query-options.md
│     │  │  ├─ raw-queries.md
│     │  │  ├─ relations.md
│     │  │  └─ transactions.md
│     │  └─ SKILL.md
│     ├─ prisma-compute
│     │  ├─ references
│     │  │  ├─ app-deploy-cli.md
│     │  │  ├─ compute-config.md
│     │  │  ├─ create-prisma.md
│     │  │  ├─ frameworks.md
│     │  │  ├─ sdk-api.md
│     │  │  └─ troubleshooting.md
│     │  └─ SKILL.md
│     ├─ prisma-database-setup
│     │  ├─ references
│     │  │  ├─ cockroachdb.md
│     │  │  ├─ mongodb.md
│     │  │  ├─ mysql.md
│     │  │  ├─ postgresql.md
│     │  │  ├─ prisma-client-setup.md
│     │  │  ├─ prisma-postgres.md
│     │  │  ├─ sqlite.md
│     │  │  └─ sqlserver.md
│     │  └─ SKILL.md
│     ├─ prisma-driver-adapter-implementation
│     │  └─ SKILL.md
│     ├─ prisma-mongodb-upgrade
│     │  ├─ references
│     │  │  ├─ client-api-mapping.md
│     │  │  ├─ decision-stay-or-migrate.md
│     │  │  ├─ migrations-mapping.md
│     │  │  ├─ schema-contract-mapping.md
│     │  │  └─ verify-cutover-checklist.md
│     │  └─ SKILL.md
│     ├─ prisma-postgres
│     │  ├─ references
│     │  │  ├─ console-and-connections.md
│     │  │  ├─ create-db-cli.md
│     │  │  ├─ management-api-sdk.md
│     │  │  └─ management-api.md
│     │  └─ SKILL.md
│     ├─ prisma-postgres-setup
│     │  ├─ references
│     │  │  ├─ api-basics.md
│     │  │  ├─ auth.md
│     │  │  ├─ endpoints.md
│     │  │  └─ prisma7-client.md
│     │  └─ SKILL.md
│     └─ prisma-upgrade-v7
│        ├─ references
│        │  ├─ accelerate-users.md
│        │  ├─ driver-adapters.md
│        │  ├─ env-variables.md
│        │  ├─ esm-support.md
│        │  ├─ prisma-config.md
│        │  ├─ removed-features.md
│        │  └─ schema-changes.md
│        └─ SKILL.md
├─ .env
├─ .nx
├─ .prettierignore
├─ .prettierrc
├─ .windsurf
│  └─ skills
│     ├─ prisma-cli
│     │  ├─ references
│     │  │  ├─ db-execute.md
│     │  │  ├─ db-pull.md
│     │  │  ├─ db-push.md
│     │  │  ├─ db-seed.md
│     │  │  ├─ debug.md
│     │  │  ├─ dev.md
│     │  │  ├─ format.md
│     │  │  ├─ generate.md
│     │  │  ├─ init.md
│     │  │  ├─ mcp.md
│     │  │  ├─ migrate-deploy.md
│     │  │  ├─ migrate-dev.md
│     │  │  ├─ migrate-diff.md
│     │  │  ├─ migrate-reset.md
│     │  │  ├─ migrate-resolve.md
│     │  │  ├─ migrate-status.md
│     │  │  ├─ studio.md
│     │  │  └─ validate.md
│     │  └─ SKILL.md
│     ├─ prisma-client-api
│     │  ├─ references
│     │  │  ├─ client-methods.md
│     │  │  ├─ constructor.md
│     │  │  ├─ filters.md
│     │  │  ├─ model-queries.md
│     │  │  ├─ query-options.md
│     │  │  ├─ raw-queries.md
│     │  │  ├─ relations.md
│     │  │  └─ transactions.md
│     │  └─ SKILL.md
│     ├─ prisma-compute
│     │  ├─ references
│     │  │  ├─ app-deploy-cli.md
│     │  │  ├─ compute-config.md
│     │  │  ├─ create-prisma.md
│     │  │  ├─ frameworks.md
│     │  │  ├─ sdk-api.md
│     │  │  └─ troubleshooting.md
│     │  └─ SKILL.md
│     ├─ prisma-database-setup
│     │  ├─ references
│     │  │  ├─ cockroachdb.md
│     │  │  ├─ mongodb.md
│     │  │  ├─ mysql.md
│     │  │  ├─ postgresql.md
│     │  │  ├─ prisma-client-setup.md
│     │  │  ├─ prisma-postgres.md
│     │  │  ├─ sqlite.md
│     │  │  └─ sqlserver.md
│     │  └─ SKILL.md
│     ├─ prisma-driver-adapter-implementation
│     │  └─ SKILL.md
│     ├─ prisma-mongodb-upgrade
│     │  ├─ references
│     │  │  ├─ client-api-mapping.md
│     │  │  ├─ decision-stay-or-migrate.md
│     │  │  ├─ migrations-mapping.md
│     │  │  ├─ schema-contract-mapping.md
│     │  │  └─ verify-cutover-checklist.md
│     │  └─ SKILL.md
│     ├─ prisma-postgres
│     │  ├─ references
│     │  │  ├─ console-and-connections.md
│     │  │  ├─ create-db-cli.md
│     │  │  ├─ management-api-sdk.md
│     │  │  └─ management-api.md
│     │  └─ SKILL.md
│     ├─ prisma-postgres-setup
│     │  ├─ references
│     │  │  ├─ api-basics.md
│     │  │  ├─ auth.md
│     │  │  ├─ endpoints.md
│     │  │  └─ prisma7-client.md
│     │  └─ SKILL.md
│     └─ prisma-upgrade-v7
│        ├─ references
│        │  ├─ accelerate-users.md
│        │  ├─ driver-adapters.md
│        │  ├─ env-variables.md
│        │  ├─ esm-support.md
│        │  ├─ prisma-config.md
│        │  ├─ removed-features.md
│        │  └─ schema-changes.md
│        └─ SKILL.md
├─ apps
│  ├─ backend
│  │  ├─ .spec.swcrc
│  │  ├─ eslint.config.mjs
│  │  ├─ jest.config.cts
│  │  ├─ package.json
│  │  ├─ src
│  │  │  ├─ assets
│  │  │  └─ main.ts
│  │  ├─ tsconfig.app.json
│  │  ├─ tsconfig.json
│  │  └─ tsconfig.spec.json
│  ├─ backend-e2e
│  │  ├─ .spec.swcrc
│  │  ├─ eslint.config.mjs
│  │  ├─ jest.config.cts
│  │  ├─ package.json
│  │  ├─ src
│  │  │  ├─ backend
│  │  │  │  └─ backend.spec.ts
│  │  │  └─ support
│  │  │     ├─ global-setup.ts
│  │  │     ├─ global-teardown.ts
│  │  │     └─ test-setup.ts
│  │  └─ tsconfig.json
│  ├─ frontend
│  │  ├─ .swcrc
│  │  ├─ eslint.config.mjs
│  │  ├─ index.d.ts
│  │  ├─ next-env.d.ts
│  │  ├─ next.config.js
│  │  ├─ package.json
│  │  ├─ public
│  │  │  └─ favicon.ico
│  │  ├─ src
│  │  │  └─ app
│  │  │     ├─ api
│  │  │     │  └─ hello
│  │  │     ├─ global.css
│  │  │     ├─ page.module.css
│  │  │     └─ page.tsx
│  │  └─ tsconfig.json
│  └─ frontend-e2e
│     ├─ cypress.config.ts
│     ├─ eslint.config.mjs
│     ├─ package.json
│     ├─ src
│     │  ├─ e2e
│     │  │  └─ app.cy.ts
│     │  ├─ fixtures
│     │  │  └─ example.json
│     │  └─ support
│     │     ├─ app.po.ts
│     │     ├─ commands.ts
│     │     └─ e2e.ts
│     └─ tsconfig.json
├─ eslint.config.mjs
├─ jest.config.ts
├─ jest.preset.js
├─ libs
│  ├─ auth
│  │  ├─ eslint.config.mjs
│  │  ├─ package.json
│  │  ├─ README.md
│  │  ├─ src
│  │  │  ├─ index.ts
│  │  │  └─ lib
│  │  │     └─ auth.ts
│  │  ├─ tsconfig.json
│  │  └─ tsconfig.lib.json
│  ├─ backend
│  │  ├─ core
│  │  │  ├─ eslint.config.mjs
│  │  │  ├─ package.json
│  │  │  ├─ README.md
│  │  │  ├─ src
│  │  │  │  ├─ index.ts
│  │  │  │  └─ lib
│  │  │  │     └─ core.ts
│  │  │  ├─ tsconfig.json
│  │  │  └─ tsconfig.lib.json
│  │  └─ modules
│  │     ├─ eslint.config.mjs
│  │     ├─ package.json
│  │     ├─ README.md
│  │     ├─ src
│  │     │  ├─ index.ts
│  │     │  └─ lib
│  │     │     └─ modules.ts
│  │     ├─ tsconfig.json
│  │     └─ tsconfig.lib.json
│  ├─ contracts
│  │  ├─ eslint.config.mjs
│  │  ├─ package.json
│  │  ├─ README.md
│  │  ├─ src
│  │  │  ├─ index.ts
│  │  │  └─ lib
│  │  │     └─ contracts.ts
│  │  ├─ tsconfig.json
│  │  └─ tsconfig.lib.json
│  ├─ database
│  │  ├─ eslint.config.mjs
│  │  ├─ package.json
│  │  ├─ README.md
│  │  ├─ src
│  │  │  ├─ index.ts
│  │  │  └─ lib
│  │  │     └─ database.ts
│  │  ├─ tsconfig.json
│  │  └─ tsconfig.lib.json
│  ├─ frontend
│  │  ├─ features
│  │  │  ├─ .babelrc
│  │  │  ├─ eslint.config.mjs
│  │  │  ├─ package.json
│  │  │  ├─ README.md
│  │  │  ├─ src
│  │  │  │  ├─ index.ts
│  │  │  │  └─ lib
│  │  │  │     └─ features.tsx
│  │  │  ├─ tsconfig.json
│  │  │  └─ tsconfig.lib.json
│  │  └─ ui
│  │     ├─ .babelrc
│  │     ├─ eslint.config.mjs
│  │     ├─ package.json
│  │     ├─ README.md
│  │     ├─ src
│  │     │  ├─ index.ts
│  │     │  └─ lib
│  │     │     ├─ ui.module.css
│  │     │     └─ ui.tsx
│  │     ├─ tsconfig.json
│  │     └─ tsconfig.lib.json
│  └─ shared
│     ├─ eslint.config.mjs
│     ├─ package.json
│     ├─ README.md
│     ├─ src
│     │  ├─ index.ts
│     │  └─ lib
│     │     └─ shared.ts
│     ├─ tsconfig.json
│     └─ tsconfig.lib.json
├─ nx.json
├─ package-lock.json
├─ package.json
├─ packages
├─ prisma
│  └─ schema.prisma
├─ prisma.config.ts
├─ README.md
├─ skills-lock.json
├─ tsconfig.base.json
├─ tsconfig.json
└─ yarn.lock

```