plugins {
  kotlin("jvm") version "2.0.20"
  kotlin("plugin.spring") version "2.0.20"
  id("org.springframework.boot") version "3.3.3"
  id("io.spring.dependency-management") version "1.1.6"
  id("org.sonarqube") version "4.4.1.3373"
}

group = "hu.bme.sch"
version = "1.0.1"

java {
  toolchain {
    languageVersion = JavaLanguageVersion.of(21)
  }
}

configurations {
  compileOnly {
    extendsFrom(configurations.annotationProcessor.get())
  }
}

repositories {
  mavenCentral()
}

sonar {
  properties {
    property("sonar.projectKey", "simonyiszk_paybasz-next-backend")
    property("sonar.organization", "simonyiszk")
    property("sonar.host.url", "https://sonarcloud.io")
  }
}

extra["springModulithVersion"] = "1.2.3"

dependencies {
  implementation("org.springframework.boot:spring-boot-starter-data-jdbc")
  implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.6.0")
  implementation("org.springframework.boot:spring-boot-starter-security")
  implementation("org.springframework.boot:spring-boot-starter-web")
  implementation("org.springframework.boot:spring-boot-starter-validation")
  implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
  implementation("com.fasterxml.jackson.dataformat:jackson-dataformat-csv")
  implementation("org.jetbrains.kotlin:kotlin-reflect")
  implementation("org.springframework.modulith:spring-modulith-starter-core")
  implementation("org.springframework.modulith:spring-modulith-starter-jdbc")
  developmentOnly("org.springframework.boot:spring-boot-starter-actuator")
  developmentOnly("org.springframework.boot:spring-boot-devtools")
  runtimeOnly("org.postgresql:postgresql")
  annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")
}

dependencyManagement {
  imports {
    mavenBom("org.springframework.modulith:spring-modulith-bom:${property("springModulithVersion")}")
  }
}

kotlin {
  compilerOptions {
    freeCompilerArgs.addAll("-Xjsr305=strict")
  }
}

tasks.getByName<org.springframework.boot.gradle.tasks.bundling.BootBuildImage>("bootBuildImage") {
  environment = mapOf(
    "BP_NATIVE_IMAGE" to "false",
    "BP_JVM_VERSION" to java.toolchain.languageVersion.get().asInt().toString()
  )
}
