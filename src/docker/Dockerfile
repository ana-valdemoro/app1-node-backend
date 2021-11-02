FROM node:10.15.3-alpine

WORKDIR /app

# Install ssh and git. Git is for test
RUN apk update && apk upgrade && \
    apk add --no-cache git

# Install more dependencies
RUN apk add -t build-deps python build-base

# Run project in mode dev
ENTRYPOINT ["./docker/docker-entrypoint.sh"]
CMD ["dev"]

EXPOSE 4000
