#
# Build stage
#
FROM maven:3.9.8-eclipse-temurin-21-alpine AS build
COPY src /home/app/src
COPY pom.xml /home/app
RUN mvn -f /home/app/pom.xml clean package

#
# Package stage
#
FROM eclipse-temurin:21-jre-alpine
EXPOSE 8080
COPY --from=build /home/app/target/paybasz-0.0.2.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=docker"]
