IMAGE_NAME = bitcoin-price-microservice
CONTAINER_NAME = bitcoin-price-microservice

build:
	@source .env && docker build -t $(IMAGE_NAME) .

start:
	@source .env && docker run -d --name $(CONTAINER_NAME) -p $$PORT:$$PORT $(IMAGE_NAME)

stop:
	docker stop $(CONTAINER_NAME)

remove:
	docker rm $(CONTAINER_NAME)

clean:
	docker rmi $(IMAGE_NAME)

dev:
	make build
	make start
	docker logs -f $(CONTAINER_NAME)

dev-clean:
	make stop
	make remove
	make clean
