# BUILD STAGE
FROM golang:1.24.1 AS builder
ARG TARGETOS
ARG TARGETARCH
ENV CGO_ENABLED=0 GOOS=${TARGETOS} GOARCH=${TARGETARCH}
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o bin/image-service ./cmd/api


# RUN STAG
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/bin/image-service .
COPY ./var/ ./var/
EXPOSE 8085
CMD ["./image-service"]
