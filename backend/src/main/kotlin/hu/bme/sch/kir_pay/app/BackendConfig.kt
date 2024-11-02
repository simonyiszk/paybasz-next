package hu.bme.sch.kir_pay.app

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.EnableConfigurationProperties

@EnableConfigurationProperties
@ConfigurationProperties(prefix = "hu.bme.sch.kir-pay.backend")
data class BackendConfig(val frontendUrl: String)
