package hu.bme.sch.paybasz.principal

import hu.bme.sch.paybasz.common.AppEvent
import hu.bme.sch.paybasz.common.AuthenticatedAppEvent


data class PrincipalAuthenticatedEvent(
  val principal: Principal,
  override val timestamp: Long
) : AppEvent


data class PrincipalCreatedEvent(
  val who: Principal,
  override val by: Principal?,
  override val timestamp: Long
) : AuthenticatedAppEvent


data class PrincipalUpdatedEvent(
  val who: Principal,
  override val by: Principal?,
  override val timestamp: Long
) : AuthenticatedAppEvent


data class PrincipalDeletedEvent(
  val who: Principal,
  override val by: Principal?,
  override val timestamp: Long
) : AuthenticatedAppEvent
