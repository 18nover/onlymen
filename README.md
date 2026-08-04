# OnlyMen

OnlyMen is a decentralized social media platform built for gay men 18+. It is designed around privacy, user agency, portability, and community — giving users a social experience built on open, federated infrastructure rather than a platform controlled by a single company.

OnlyMen is built on the [AT Protocol](https://atproto.com), the open and federated protocol that powers Bluesky. This means identities, content, and social relationships can be designed for portability across compatible services rather than being permanently locked to one company's infrastructure.

The initial launch targets **web and Android**, with **iOS planned for a later release**.

> **Project status:** OnlyMen is currently under active development. The architecture, branding, user experience, moderation systems, and AI-assisted engineering workflows are all evolving as the project moves toward production.

---

## Project Goals

OnlyMen aims to build a modern social network that combines:

* 🌐 **Open infrastructure** — Built on the AT Protocol and designed around federation and portability.
* 🔐 **User ownership** — Users should have meaningful control over their identity and data.
* 🧑‍🤝‍🧑 **Community-first design** — Features and policies designed specifically for the needs of adult gay men.
* 🛡️ **Safety and moderation** — Strong, transparent moderation systems designed to protect users while supporting healthy communities.
* 🤖 **AI-assisted development** — A coordinated AI engineering organization that works alongside human developers.
* 📱 **Cross-platform experiences** — Web and Android first, with iOS following.
* 🧩 **Modular architecture** — Clear separation between the client, protocol infrastructure, and AI engineering organization.
* 🚀 **Open-source foundations** — Building on established open-source projects while developing OnlyMen-specific functionality, branding, and product experiences.

---

## Repository Layout

```text
onlymen/
├── app/
│   └── The OnlyMen client application
│
├── atproto/
│   └── AT Protocol infrastructure
│
├── deploy/
│   └── Production deployment templates and host scripts
│
├── docs/
│   └── Architecture, operations, and project handoff documentation
│
├── bin/
│   └── Universal OnlyMen command-line entrypoints
│
├── .devcontainer/
│   └── Reproducible development container configuration
│
└── .vscode/
    └── Workspace settings, tasks, debugging, and extensions
```

### `app/`

The `app/` directory contains the OnlyMen client application.

It is based on a fork of the Bluesky social app and is being progressively rebranded, redesigned, and customized into the OnlyMen experience.

The client is intended to support:

* Web
* Android
* iOS (planned)

The application layer is responsible for the user-facing experience, including profiles, feeds, messaging and social interactions, discovery, notifications, settings, moderation interfaces, and other OnlyMen-specific functionality.

---

### `atproto/`

The `atproto/` directory contains the AT Protocol infrastructure used by OnlyMen.

This area includes the protocol and service infrastructure required to operate a decentralized social platform, including components for identity, repositories, content distribution, feeds, moderation, and related services.

The architecture is designed around the principles of the AT Protocol, including:

* Decentralized identity
* Portable accounts
* User-owned repositories
* Federated infrastructure
* Interoperability
* Algorithmic choice
* Moderation services

OnlyMen-specific infrastructure and services may be added as the platform evolves.

---

### AI engineering organization (archived)

OnlyMen was developed with the help of a 13-agent AI engineering organization built on the elizaOS framework, previously living in `eliza/`. It was not a collection of generic chatbot personas — each agent was a specialist grounded in the actual OnlyMen codebase, organized around engineering disciplines including backend, React Native/Expo frontend, AT Protocol/Lexicon design, moderation, DevOps, QA, security, performance, documentation, project management, accessibility, and design.

That framework has been removed while other options for running these agents are evaluated. The agent definitions (personalities, system prompts, expertise), per-agent knowledge base, shared engineering standards, and skill playbooks are archived at [`docs/agents/`](docs/agents/README.md) for reference.

---

## Development Environment

OnlyMen's primary development environment is **Ubuntu 26.04 on WSL 2**. The
authoritative checkout lives at `/home/jerry/onlymen`; Git and all development
tools run in Linux. Windows PowerShell, VS Code, Docker Desktop, and the browser
remain the desktop control surface.

Run the project from `~/onlymen`. The root Makefile is the command catalog;
`om` is the service launcher and direct package-manager escape hatch:

```bash
make help
make doctor
make start PROFILE=stack
make status
make pds-test
make stop
```

Focused commands are also available from the root:

```bash
make app-build
make atproto-build
om run atproto --filter pds-service test
```

The launcher supervises the seeded ATProto stack and Expo web app, then makes
them available to Windows through `localhost`. Setup, commands, ports,
troubleshooting, and PDS operations are documented in:

```text
docs/WSL_DEVELOPMENT.md
docs/pds/PDS.md
```

VS Code workspace configuration is maintained in:

```text
.vscode/
├── extensions.json
├── settings.json
└── tasks.json
```

The project should be opened as the `onlymen/` workspace so that:

```text
${workspaceFolder}
```

resolves to the project root.

---

## Architecture Principles

OnlyMen development follows several core principles:

### 1. Build on Open Standards

Prefer open protocols, interoperable formats, and established standards whenever practical.

### 2. Understand Before Changing

Agents and developers should inspect the existing implementation before proposing architectural changes.

### 3. Small, Reviewable Changes

Prefer focused changes that can be tested, reviewed, and reverted independently.

### 4. Security by Design

Security, privacy, abuse prevention, and data protection should be considered during design rather than added after implementation.

### 5. Accessibility Is a Requirement

Accessibility should be treated as a core product requirement across web and mobile experiences.

### 6. Test Real Behavior

Tests should validate actual user and system behavior rather than simply maximizing code coverage.

### 7. Agents Must Challenge Each Other

AI agents should not automatically accept another agent's proposal. Technical decisions should be reviewed by the appropriate specialists, and disagreements should be surfaced rather than hidden.

### 8. Humans Remain Accountable

AI agents assist with engineering work, analysis, review, and automation. Human developers remain responsible for final decisions, production changes, security-sensitive actions, and project direction.

---

## Current Focus

The project is currently focused on:

* Establishing the OnlyMen monorepo architecture.
* Rebranding and customizing the client application.
* Integrating and configuring AT Protocol infrastructure.
* Building the OnlyMen AI Engineering Organization.
* Establishing agent-to-agent coordination and review workflows.
* Creating reproducible development environments.
* Defining engineering standards and project conventions.
* Building moderation, safety, and abuse-prevention systems.
* Preparing the platform for web and Android development.

---

## Long-Term Vision

OnlyMen aims to become a sustainable, community-focused social platform built on open infrastructure.

The long-term vision is to create an ecosystem where users can participate in a social network designed specifically for gay men while benefiting from the portability, federation, and interoperability enabled by the AT Protocol.

The platform will continue to evolve through a combination of:

* Community feedback
* Human engineering
* AI-assisted development
* Open-source collaboration
* Security and privacy research
* Accessibility-focused design
* Transparent moderation practices

---

## License

License information will be added as the project establishes its final licensing structure and clarifies the licenses of the upstream projects incorporated into the OnlyMen codebase.
