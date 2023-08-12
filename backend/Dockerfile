FROM openjdk:11-jdk
LABEL authors="balazs"

COPY target/paybasz-0.0.1-SNAPSHOT.jar app.jar

CMD ["java", "-jar", "app.jar", "--spring.profiles.active=docker"]