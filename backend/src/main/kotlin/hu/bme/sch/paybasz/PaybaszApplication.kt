package hu.bme.sch.paybasz

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.ConfigurationPropertiesScan
import org.springframework.boot.runApplication
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity

@SpringBootApplication
@EnableMethodSecurity
@ConfigurationPropertiesScan
class PaybaszApplication


fun main(args: Array<String>) {
  runApplication<PaybaszApplication>(*args)
}
