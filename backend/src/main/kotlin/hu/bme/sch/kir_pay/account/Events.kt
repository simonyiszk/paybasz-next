package hu.bme.sch.kir_pay.account

import hu.bme.sch.kir_pay.common.AuthenticatedAppEvent
import hu.bme.sch.kir_pay.principal.Principal


data class AccountCreatedEvent(
  val account: Account,
  override val by: Principal?,
  override val timestamp: Long
) : AuthenticatedAppEvent


data class AccountCardAssignedEvent(
  val account: Account,
  override val by: Principal?,
  override val timestamp: Long
) : AuthenticatedAppEvent


data class AccountUpdatedEvent(
  val account: Account,
  override val by: Principal?,
  override val timestamp: Long
) : AuthenticatedAppEvent


data class AccountDeletedEvent(
  val account: Account,
  override val by: Principal?,
  override val timestamp: Long
) : AuthenticatedAppEvent


data class AccountPayEvent(
  val account: Account,
  val amount: Long,
  override val by: Principal?,
  override val timestamp: Long
) : AuthenticatedAppEvent


data class AccountUploadEvent(
  val account: Account,
  val amount: Long,
  override val by: Principal?,
  override val timestamp: Long
) : AuthenticatedAppEvent


data class AccountBalanceTransferEvent(
  val sender: Account,
  val recipient: Account,
  val amount: Long,
  override val by: Principal?,
  override val timestamp: Long
) : AuthenticatedAppEvent
