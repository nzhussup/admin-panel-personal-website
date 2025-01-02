FROM eclipse-temurin:21-jdk AS build
LABEL authors="nzhussup"

RUN apt-get update \
    && apt-get install -y ca-certificates curl git openssh-client --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

ARG MAVEN_VERSION=3.9.9
ARG USER_HOME_DIR="/root"
ENV MAVEN_CONFIG="$USER_HOME_DIR/.m2"

RUN curl -fsSL "https://downloads.apache.org/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz" -o /tmp/maven.tar.gz \
    && tar -xzf /tmp/maven.tar.gz -C /usr/share/ \
    && ln -s /usr/share/apache-maven-${MAVEN_VERSION}/bin/mvn /usr/bin/mvn \
    && rm /tmp/maven.tar.gz

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre AS runtime

WORKDIR /app

COPY --from=build /app/target/*.jar ./app.jar


EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

