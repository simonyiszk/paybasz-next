package hu.bme.sch.paybasz.event

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import org.springframework.modulith.ApplicationModule

@ApplicationModule
@Table("events")
data class Event(
  @Id var id: Int?,
  val type: EventType,
  val timestamp: Long,
  val message: String
)

enum class EventType {
  SUCCESS,
  INFO,
  ERROR
}
