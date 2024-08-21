package hu.bme.sch.paybasz.account

import hu.bme.sch.paybasz.common.TERMINAL_API
import jakarta.validation.Valid
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping(TERMINAL_API)
class AccountTerminalController(
  private val accountService: AccountService,
  private val balanceService: AccountBalanceService
) {

  @GetMapping("/accounts")
  fun getAllAccounts() = accountService.findAll()


  @GetMapping("/accounts/{accountId}")
  fun getAccount(@PathVariable accountId: Int) = accountService.findActive(accountId)


  data class BalanceAmountDto(@field:Min(0) val amount: Long)

  @PostMapping("/account-by-card/{card}/pay")
  @PreAuthorize("hasRole(T(hu.bme.sch.paybasz.principal.Permission).SELL_ITEMS.name())")
  fun pay(
    @PathVariable card: String,
    @Valid @RequestBody dto: BalanceAmountDto
  ) = balanceService.pay(card, dto.amount, logEvent = true)


  @PostMapping("/account-by-card/{card}/upload")
  @PreAuthorize("hasRole(T(hu.bme.sch.paybasz.principal.Permission).UPLOAD_FUNDS.name())")
  fun upload(
    @PathVariable card: String,
    @Valid @RequestBody dto: BalanceAmountDto
  ) = balanceService.upload(card, dto.amount)


  data class BalanceTransferDto(@field:NotBlank val recipientCard: String, @field:Min(0) val amount: Long)

  @PostMapping("/account-by-card/{card}/transfer")
  @PreAuthorize("hasRole(T(hu.bme.sch.paybasz.principal.Permission).TRANSFER_FUNDS.name())")
  fun transfer(
    @PathVariable card: String,
    @Valid @RequestBody dto: BalanceTransferDto
  ) = balanceService.transfer(card, dto.recipientCard, dto.amount)


  data class CardAssignDto(@field:NotBlank val card: String)

  @PostMapping("/accounts/{accountId}/card")
  @PreAuthorize("hasRole(T(hu.bme.sch.paybasz.principal.Permission).ASSIGN_CARDS.name())")
  fun assignCard(
    @Valid @RequestBody dto: CardAssignDto,
    @PathVariable accountId: Int
  ) = accountService.assignCard(accountId, dto.card)


  @GetMapping("/account-by-card/{card}")
  fun getCardAccount(@PathVariable card: String) = accountService.findActiveByCard(card)

}