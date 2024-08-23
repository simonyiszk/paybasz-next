package hu.bme.sch.paybasz.app

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.EnableConfigurationProperties

@EnableConfigurationProperties
@ConfigurationProperties(prefix = "hu.bme.sch.paybasz.backend")
data class BackendConfig(val frontendUrl: String)
