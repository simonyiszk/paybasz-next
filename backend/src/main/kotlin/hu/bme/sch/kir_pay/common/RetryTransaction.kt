package hu.bme.sch.kir_pay.common

import org.springframework.retry.annotation.Backoff
import org.springframework.retry.annotation.Retryable
import java.sql.SQLException

@Retryable(
  retryFor = [SQLException::class],
  maxAttempts = 5,
  backoff = Backoff(delay = 200, maxDelay = 750, multiplier = 1.5, random = true),
)
annotation class RetryTransaction
