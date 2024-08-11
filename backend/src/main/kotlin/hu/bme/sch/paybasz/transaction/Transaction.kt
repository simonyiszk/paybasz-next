package hu.bme.sch.paybasz.transaction

import hu.bme.sch.paybasz.account.Account
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import org.springframework.modulith.ApplicationModule

@ApplicationModule
@Table("transactions")
data class Transaction(
  @Id var id: Int?,
  val type: TransactionType,
  val sender: Account?,
  val recipient: Account?,
  val amount: Long,
  val message: String?,
  val timestamp: Long
)

enum class TransactionType {
  TOP_UP,
  TRANSFER,
  CHARGE
}
