package hu.bme.sch.paybasz

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class PaybaszApplication

fun main(args: Array<String>) {
  runApplication<PaybaszApplication>(*args)
}
