.PHONY: build push compose deploy clean

IMAGE_NAME = apaluch/downloader-98
TAG = latest

clean:
	docker-compose down --rmi all && docker image prune -f

build:
	docker build -t $(IMAGE_NAME):$(TAG) .

push:
	docker push $(IMAGE_NAME):$(TAG)

compose:
	docker-compose up -d

deploy: build push compose