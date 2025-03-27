# BUILD STAGE
FROM golang:1.24.1 AS builder
ARG TARGETOS
ARG TARGETARCH
ENV CGO_ENABLED=1 GOOS=${TARGETOS} GOARCH=${TARGETARCH}
WORKDIR /app
# LIBDE265 INSTALLATION
RUN apt-get update && apt-get install -y libde265-dev pkg-config
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o bin/image-service ./cmd/api

# RUN STAGE
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/bin/image-service .
COPY ./var/ ./var/
EXPOSE 8085
CMD ["./image-service"]
