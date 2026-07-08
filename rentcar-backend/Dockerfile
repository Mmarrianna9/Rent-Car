# Fase 1: Compilazione con Java 17 e Maven
FROM maven:3.8.5-openjdk-21 AS build
COPY . .
RUN mvn clean package -DskipTests

# Fase 2: Avvio dell'applicazione
FROM openjdk:21-jdk-slim
COPY --from=build /target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]