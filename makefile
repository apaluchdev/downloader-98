.PHONY: build build-prod push compose deploy clean run

IMAGE_NAME = apaluch/downloader-98
TAG = latest
TAG_PROD = prod

clean:
	docker-compose down --rmi all && docker image prune -f

build:
	docker build -t $(IMAGE_NAME):$(TAG) .

build-prod:
	docker build -t $(IMAGE_NAME):$(TAG_PROD) .

run:
	docker run -d -p 3000:3000 --name downloader98 --rm $(IMAGE_NAME):$(TAG)

push:
	docker push $(IMAGE_NAME):$(TAG)

push-prod:
	docker push $(IMAGE_NAME):$(TAG_PROD)

compose:
	docker-compose up -d

deploy: build push compose

deploy-prod: build-prod push-prod