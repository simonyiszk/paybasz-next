package hu.bme.sch.paybasz.order

import hu.bme.sch.paybasz.account.Account
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import org.springframework.modulith.ApplicationModule

@ApplicationModule
@Table("orders")
data class Order(
  @Id var id: Int?,
  val account: Account,
  val timestamp: Long
)

@Table("order_lines")
data class OrderLine(
  @Id var id: Int?,
  val order: Order?,
  val item: Item?,
  val itemCount: Int,
  val usedVoucher: Boolean,
  val paidAmount: Long
)

@Table("items")
data class Item(
  @Id var id: Int?,
  val name: String,
  val alias: String?,
  val cost: Long,
  val stock: Int,
  val enabled: Boolean
)

@Table("vouchers")
data class Voucher(
  @Id var id: Long?,
  val account: Account?,
  val item: Item,
  val count: Int
)