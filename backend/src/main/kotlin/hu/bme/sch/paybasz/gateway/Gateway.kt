package hu.bme.sch.paybasz.gateway

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import org.springframework.modulith.ApplicationModule

@ApplicationModule
@Table("gateways")
data class Gateway(
  @Id var id: Int?,
  val name: String,
  val secret: String,
  val enabled: Boolean,
  val canUpload: Boolean,
  val canTransfer: Boolean,
  val canSellItems: Boolean,
  val canRedeemVouchers: Boolean,
  val createdAt: Long,
  val lastUsed: Long
)
