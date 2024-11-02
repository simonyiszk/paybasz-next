package hu.bme.sch.kir_pay.principal

import hu.bme.sch.kir_pay.common.AppEvent
import hu.bme.sch.kir_pay.common.AuthenticatedAppEvent


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
