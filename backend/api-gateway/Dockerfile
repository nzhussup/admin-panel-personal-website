# BUILD STAGE
FROM golang:1.24.1 AS builder
ARG TARGETOS
ARG TARGETARCH
ENV CGO_ENABLED=0 GOOS=${TARGETOS} GOARCH=${TARGETARCH}
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o bin/api-gateway ./cmd/main.go

# RUN STAGE
FROM alpine:latest
WORKDIR /app

# # Install dependencies required by CGO
# RUN apk add --no-cache libc6-compat libstdc++ gcc libgcc

COPY --from=builder /app/bin/api-gateway /app/api-gateway
COPY public /app/public
EXPOSE 8082
CMD ["/app/api-gateway"]


