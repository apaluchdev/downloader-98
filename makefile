IMAGE_NAME = apaluch/downloader-98
TAG = latest

build:
	docker build -t $(IMAGE_NAME):$(TAG) .

push:
	docker push $(IMAGE_NAME):$(TAG)

deploy: build push