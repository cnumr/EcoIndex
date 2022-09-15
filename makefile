COMPOSE = docker-compose -f docker-compose.yml
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
	docker rm $$(docker ps -qa --no-trunc --filter "status=exited" --filter "name=ecoindex_*")

clean-all: ## Remove all unused Docker objetcs
	docker stop $$(docker ps -a -q --filter "name=ecoindex_*")
	docker system prune
	docker volume prune

stop-all: ## Stop all docker container
	docker stop $$(docker ps -a -q)

bash:
	$(EXEC) bash
