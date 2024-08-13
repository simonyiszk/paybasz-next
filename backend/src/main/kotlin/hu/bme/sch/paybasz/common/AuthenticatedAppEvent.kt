package hu.bme.sch.paybasz.common

import hu.bme.sch.paybasz.principal.Principal


interface AuthenticatedAppEvent : AppEvent {

  val by: Principal?

}


interface AppEvent {

  val timestamp: Long

}
