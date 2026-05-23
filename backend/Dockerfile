# ETAPA 1: Build del backend
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copiamos pom.xml primero para aprovechar la cache de Docker
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiamos el código fuente y compilamos
COPY src ./src
RUN mvn clean package -DskipTests -B

# ETAPA 2: Imagen final
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copiamos el JAR generado en la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Puerto que expone el backend
EXPOSE 8080

# Comando de arranque
ENTRYPOINT ["java", "-jar", "app.jar"]