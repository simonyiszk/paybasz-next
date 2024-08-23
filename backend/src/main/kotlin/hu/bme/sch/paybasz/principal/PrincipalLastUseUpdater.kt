package hu.bme.sch.paybasz.principal

import org.springframework.context.annotation.Configuration
import org.springframework.context.event.EventListener
import org.springframework.transaction.annotation.Transactional

@Configuration
class PrincipalLastUseUpdater(private val principalService: PrincipalService) {

  @EventListener
  @Transactional
  fun on(event: PrincipalAuthenticatedEvent) {
    principalService.updateLastUsed(event.principal.id)
  }

}
