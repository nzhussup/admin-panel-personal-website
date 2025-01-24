FROM eclipse-temurin:21-jdk AS build
LABEL authors="nzhussup"

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl git openssh-client ca-certificates \
    && curl -fsSL "https://downloads.apache.org/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.tar.gz" | tar -xz -C /usr/share \
    && ln -s /usr/share/apache-maven-3.9.9/bin/mvn /usr/bin/mvn \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre AS runtime

WORKDIR /app

COPY --from=build /app/target/*.jar ./app.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"]
