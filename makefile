COMPOSE = docker compose
EXEC?= $(COMPOSE) exec nodejs

install: pull build start
######################
# Docker management  #
######################

pull: ## pull docker images
	$(COMPOSE) pull --ignore-pull-failures

build: ## build images from Dockerfiles
	$(COMPOSE) build --force-rm

start: ## start docker containers
	$(COMPOSE) up -d --remove-orphans

start-attached: ## start docker containers
	$(COMPOSE) up --remove-orphans

stop: ## stop docker containers
	$(COMPOSE) stop

clean: ## Clean docker container with "exited" status
	$(COMPOSE) rm -v

clean-all: ## Remove all unused Docker objetcs
	$(COMPOSE) down -v --remove-orphans --rmi local

stop-all: ## Stop all docker container
	docker stop $$(docker ps -a -q)

bash:
	$(EXEC) bash
