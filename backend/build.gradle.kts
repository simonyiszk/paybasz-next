plugins {
  kotlin("jvm") version "1.9.24"
  kotlin("plugin.spring") version "1.9.24"
  id("org.springframework.boot") version "3.3.2"
  id("io.spring.dependency-management") version "1.1.6"
  id("org.graalvm.buildtools.native") version "0.10.2"
}

group = "hu.bme.sch"
version = "1.0.0"

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

extra["springModulithVersion"] = "1.2.1"

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
