SHELL := /bin/bash
.SHELLFLAGS := -o errexit -o nounset -o pipefail -c
.DEFAULT_GOAL := help

OM := ./bin/om
EDITOR ?= vim
PROFILE ?= all
AREA ?= all
TARGET ?= all
OPEN ?= code

.PHONY: help
help: ## Show the root command catalog
	@printf '%s\n' \
		'OnlyMen root commands' \
		'' \
		'  Environment and services' \
		'    make bootstrap              Install the pinned toolchains and dependencies' \
		'    make doctor                 Check WSL, Docker, ports, Git, and toolchains' \
		'    make start [PROFILE=all]    Start all, stack, backend, or agents' \
		'    make status                 Show managed services and endpoints' \
		'    make logs [TARGET=all]      Read a tmux service log' \
		'    make stop                   Stop managed services' \
		'    make restart [PROFILE=all]  Restart all, stack, backend, or agents' \
		'    make verify [AREA=all]      Verify all, app, atproto, or smoke' \
		'' \
		'  Aggregate project commands' \
		'    make install                Install app and atproto dependencies' \
		'    make build                  Build app web and atproto' \
		'    make test                   Test app and atproto' \
		'    make lint                   Lint/type-check app and atproto' \
		'' \
		'  Focused commands' \
		'    make app-{install,build,test,lint,typecheck,format}' \
		'    make atproto-{install,codegen,build,test,lint,format}' \
		'    make pds-{build,test}' \
		'    make appview-build' \
		'    make agents-{list,docs,verify}' \
		'' \
		'  Direct escape hatch' \
		'    om run app <pnpm arguments>' \
		'    om run atproto <pnpm arguments>' \
		'' \
		'  Documentation' \
		'    make handoff | make changelog | make pds-docs | make appview-docs'

.PHONY: bootstrap doctor auth start status logs attach stop restart verify open shell
bootstrap: ## Install tools and project dependencies
	$(OM) bootstrap

doctor: ## Check the development environment
	$(OM) doctor

auth: ## Check CLI authentication
	$(OM) auth

start: ## Start PROFILE=all, stack, backend, or agents
	$(OM) start $(PROFILE)

status: ## Show managed service status
	$(OM) status

logs: ## Show TARGET=all or one managed service log
	$(OM) logs $(TARGET)

attach: ## Attach to the managed tmux session
	$(OM) attach

stop: ## Stop managed services
	$(OM) stop

restart: ## Restart PROFILE=all, stack, backend, or agents
	$(OM) restart $(PROFILE)

verify: ## Verify AREA=all, app, atproto, or smoke
	$(OM) verify $(AREA)

open: ## Open OPEN=code, app, or agents
	$(OM) open $(OPEN)

shell: ## Open a login shell in the repository root
	$(OM) shell

.PHONY: install build test lint
install: atproto-install app-install ## Install every project

build: atproto-build app-build ## Build every project

test: app-test atproto-test ## Test every project

lint: app-lint app-typecheck atproto-lint agents-verify ## Check every project

.PHONY: app-install app-build app-test app-lint app-typecheck app-format
app-install: ## Install app dependencies
	$(OM) run app install --frozen-lockfile

app-build: ## Build the app web bundle without starting an EAS mobile build
	$(OM) run app intl:build
	$(OM) run app build-web

app-test: ## Run app unit tests
	$(OM) run app test

app-lint: ## Lint app source
	$(OM) run app lint

app-typecheck: ## Type-check app web, Android, and iOS targets
	$(OM) run app typecheck

app-format: ## Check app formatting without rewriting files
	$(OM) run app prettier

.PHONY: atproto-install atproto-codegen atproto-build atproto-test atproto-lint atproto-format
atproto-install: ## Install AT Protocol dependencies
	$(OM) run atproto install --frozen-lockfile

atproto-codegen: ## Generate AT Protocol clients and schemas
	$(OM) run atproto codegen

atproto-build: atproto-codegen ## Build the AT Protocol workspace
	$(OM) run atproto build --force

atproto-test: ## Run the full AT Protocol test suite with Docker test services
	$(OM) run atproto test

atproto-lint: ## Check AT Protocol style and lint
	$(OM) run atproto verify

atproto-format: ## Rewrite AT Protocol formatting
	$(OM) run atproto format

.PHONY: pds-build pds-test
pds-build: ## Build the PDS and its transitive workspace dependencies
	$(OM) run atproto --filter '@atproto/jwk' build
	$(OM) run atproto --recursive --stream --filter '@atproto/pds...' build
	$(OM) run atproto --filter pds-service build

pds-test: ## Test the production PDS service wrapper
	$(OM) run atproto --filter pds-service test

.PHONY: appview-build
appview-build: ## Build the AppView, Ozone, and Bsync packages and transitive deps
	$(OM) run atproto --recursive --stream --filter '@atproto/bsky...' build
	$(OM) run atproto --recursive --stream --filter '@atproto/ozone...' build
	$(OM) run atproto --recursive --stream --filter '@atproto/bsync...' build
# No appview-test target: unlike pds-service, the bsky/ozone/bsync/bsky-indexer
# service wrappers have no test scripts of their own (upstream precedent) -
# their package-level tests already run as part of `make atproto-test`.

.PHONY: agents-list agents-docs agents-verify
agents-list: ## List the archived OnlyMen agent roster
	node bin/agents.ts list

agents-docs: ## Regenerate docs/agents/*.md from docs/agents/characters/*.json
	node bin/agents.ts docs

agents-verify: ## Validate docs/agents/characters/*.json structure
	node bin/agents.ts validate

.PHONY: handoff changelog log update pds-docs appview-docs
handoff: ## Edit the project handoff
	@$(EDITOR) docs/HANDOFF.md

changelog: ## Edit the changelog
	@$(EDITOR) docs/CHANGELOG.md

update: handoff changelog ## Edit the handoff and changelog

log: ## Append ENTRY to the Unreleased changelog section
	@test -n "$(ENTRY)" || { echo 'Usage: make log ENTRY="- Change summary"' >&2; exit 1; }
	@sed -i "/^## Unreleased/a $(ENTRY)" docs/CHANGELOG.md

pds-docs: ## Open the PDS architecture and deployment documentation
	@$(EDITOR) docs/pds/PDS.md deploy/pds/README.md

appview-docs: ## Open the AppView/Ozone architecture and deployment documentation
	@$(EDITOR) docs/appview/APPVIEW.md deploy/appview/README.md
