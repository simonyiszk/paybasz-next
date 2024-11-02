package hu.bme.sch.kir_pay.common

import hu.bme.sch.kir_pay.principal.Principal


interface AuthenticatedAppEvent : AppEvent {

  val by: Principal?

}


interface AppEvent {

  val timestamp: Long

}
