package hu.bme.sch.paybasz.order

import hu.bme.sch.paybasz.account.AccountService
import hu.bme.sch.paybasz.principal.getLoggedInPrincipal
import org.springframework.context.ApplicationEventPublisher
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Clock

@Service
@Transactional
class OrderService(
  private val accountService: AccountService,
  private val orderRepository: OrderRepository,
  private val voucherService: VoucherService,
  private val itemService: ItemService,
  private val events: ApplicationEventPublisher,
  private val clock: Clock
) {
  fun findAll() = orderRepository.findAllOrderByTimestampDesc()


  fun findPaginated(page: Int, size: Int): List<Order> =
    orderRepository.findAllOrderByTimestampDescPaginated(page.toLong() * size, size)


  fun checkout(card: String, dto: OrderTerminalController.CheckoutDto) {
    val order = newOrder(card)
    events.publishEvent(OrderCreatedEvent(order.id, order.accountId, getLoggedInPrincipal(), clock.millis()))

    for (line in dto.orderLines) {
      if (line.usedVoucher) {
        voucherService.processVoucherRedemptionAuthorized(order, line)
      } else {
        itemService.processSaleAuthorized(order, line)
      }
    }
  }


  private fun newOrder(card: String): Order {
    val account = accountService.findActiveByCard(card)
    return orderRepository.save(Order(id = null, accountId = account.id!!, timestamp = clock.millis()))
  }

}
