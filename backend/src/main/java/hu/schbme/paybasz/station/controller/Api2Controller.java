package hu.schbme.paybasz.station.controller;

import hu.schbme.paybasz.station.config.AppUtil;
import hu.schbme.paybasz.station.dto.*;
import hu.schbme.paybasz.station.error.UnauthorizedGateway;
import hu.schbme.paybasz.station.model.AccountEntity;
import hu.schbme.paybasz.station.model.ItemEntity;
import hu.schbme.paybasz.station.repo.AccountRepository;
import hu.schbme.paybasz.station.service.GatewayService;
import hu.schbme.paybasz.station.service.LoggingService;
import hu.schbme.paybasz.station.service.TransactionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static hu.schbme.paybasz.station.PaybaszApplication.VERSION;

@SuppressWarnings("SpellCheckingInspection")
@Slf4j
@RestController
@RequestMapping("/api/v2")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "true")
public class Api2Controller {

    @Autowired
    private TransactionService system;

    @Autowired
    private AccountRepository accounts;

    @Autowired
    private GatewayService gateways;

    @Autowired
    private LoggingService logger;

    @PostMapping("/pay/{gatewayName}")
    public PaymentStatus pay(@PathVariable String gatewayName, @RequestBody PaymentRequest request) {
        if (!gateways.authorizeGateway(gatewayName, request.getGatewayCode()))
            return PaymentStatus.UNAUTHORIZED_TERMINAL;
        gateways.updateLastUsed(gatewayName);
        if (request.getAmount() < 0)
            return PaymentStatus.INTERNAL_ERROR;

        try {
            return system.proceedPayment(request.getCard().toUpperCase(), request.getAmount(),
                    request.getDetails() == null ? "" : request.getDetails(),
                    gatewayName);
        } catch (Exception e) {
            log.error("Error during proceeding payment", e);
            logger.failure("Sikertelen fizetés: belső szerver hiba (terminál: " + gatewayName + ")");
            return PaymentStatus.INTERNAL_ERROR;
        }
    }

    /**
     * NOTE: Do not use for transaction purposes. Might be effected by dirty read.
     */
    @PostMapping("/balance/{gatewayName}")
    public int balance(@PathVariable String gatewayName, @RequestBody BalanceRequest request) {
        if (!gateways.authorizeGateway(gatewayName, request.getGatewayCode()))
            throw new UnauthorizedGateway();

        gateways.updateLastUsed(gatewayName);
        log.info("New balance from gateway '" + gatewayName + "' card hash: '" + request.getCard().toUpperCase() + "'");
        Optional<AccountEntity> account = system.getAccountByCard(request.getCard().toUpperCase());
        var accountBalance = account.map(accountEntity -> new AccountBalance(accountEntity.getBalance(), isLoadAllowed(accountEntity), accountEntity.isAllowed()))
                .orElseGet(() -> new AccountBalance(0, false, false));

        logger.action("<badge>" + account.map(AccountEntity::getName).orElse("n/a")
                + "</badge> egyenlege leolvasva: <color>" + accountBalance.getBalance() + " JMF</color> (terminál: " + gatewayName + ")");
        return accountBalance.getBalance();
    }

    @PostMapping("/validate/{gatewayName}")
    public ValidationStatus validate(@PathVariable String gatewayName, @RequestBody ValidateRequest request) {
        boolean valid = gateways.authorizeGateway(gatewayName, request.getGatewayCode());
        log.info("Gateways auth request: " + gatewayName + " (" + (valid ? "OK" : "INVALID") + ")");
        if (valid) {
            gateways.updateLastUsed(gatewayName);
            logger.action("Terminál authentikáció sikeres: <color>" + gatewayName + "</color>");
        } else {
            logger.failure("Terminál authentikáció sikertelen: <color>" + gatewayName + "</color>");
        }
        return valid ? ValidationStatus.OK : ValidationStatus.INVALID;
    }

    @PostMapping("/reading/{gatewayName}")
    public ValidationStatus reading(@PathVariable String gatewayName, @RequestBody ReadingRequest readingRequest) {
        if (!gateways.authorizeGateway(gatewayName, readingRequest.getGatewayCode()))
            return ValidationStatus.INVALID;

        log.info("New reading from gateway '" + gatewayName + "' read card hash: '" + readingRequest.getCard().toUpperCase() + "'");
        logger.action("Leolvasás történt: <badge>" + readingRequest.getCard().toUpperCase() + "</badge> (terminál: " + gatewayName + ")");
        gateways.appendReading(gatewayName, readingRequest.getCard().toUpperCase());
        gateways.updateLastUsed(gatewayName);
        return ValidationStatus.OK;
    }

    @PostMapping("/query/{gatewayName}")
    public ItemQueryResult query(@PathVariable String gatewayName, @RequestBody ItemQueryRequest request) {
        if (!gateways.authorizeGateway(gatewayName, request.getGatewayCode()))
            return new ItemQueryResult(false, "unauthorized", 0);
        gateways.updateLastUsed(gatewayName);

        try {
            return system.resolveItemQuery(request.getQuery());
        } catch (Exception e) {
            logger.failure("Sikertelen termék lekérdezés: " + request.getQuery());
            return new ItemQueryResult(false, "invalid query", 0);
        }
    }

    @GetMapping("/status")
    public String test(HttpServletRequest request) {
        log.info("Status endpoint triggered from IP: " + request.getRemoteAddr());
        logger.serverInfo("Státusz olvasás a <color>" + request.getRemoteAddr() + "</color> címről");
        return "Server: " + VERSION + ";"
                + "by Balázs;" // If you fork it, include your name
                + "Time:;"
                + AppUtil.DATE_ONLY_FORMATTER.format(System.currentTimeMillis()) + ";"
                + AppUtil.TIME_ONLY_FORMATTER.format(System.currentTimeMillis());
    }

    @GetMapping("/items/{gatewayName}")
    public List<ItemEntity> listItems(@PathVariable String gatewayName, @RequestBody ItemQueryRequest request) {
        if (!gateways.authorizeGateway(gatewayName, request.getGatewayCode()))
            return List.of();

        return system.getALlItems().stream()
                .filter(ItemEntity::isActive)
                .collect(Collectors.toUnmodifiableList());
    }

    @PostMapping("/set-card/{gatewayName}")
    public AddCardStatus addCard(@PathVariable String gatewayName, @RequestBody AddCardRequest request) {
        if (!gateways.authorizeGateway(gatewayName, request.getGatewayCode()))
            return AddCardStatus.UNAUTHORIZED_TERMINAL;

        gateways.updateLastUsed(gatewayName);

        if(accounts.findByCard(request.getCard().toUpperCase()).isPresent())
            return AddCardStatus.ALREADY_ADDED;

        Optional<AccountEntity> user = accounts.findById(request.getUserId());
        if(user.isEmpty())
            return AddCardStatus.USER_NOT_FOUND;
        final var account = user.get();
        if(!account.getCard().isEmpty())
            return AddCardStatus.USER_HAS_CARD;

        account.setCard(request.getCard());
        log.info("New card assignment from gateway '" + gatewayName + "' card hash: '" + request.getCard() + "', user: " + account.getName());
        logger.action("<color>" + account.getName() + "</color> felhasználóhoz kártya rendelve: <badge>" + request.getCard() + "</badge>  (terminál: " + gatewayName + ")");
        accounts.save(account);
        return AddCardStatus.ACCEPTED;
    }

    @PostMapping("/get-user/{gatewayName}")
    public String getUser(@PathVariable String gatewayName, @RequestBody GetUserRequest request) {
        if (!gateways.authorizeGateway(gatewayName, request.getGatewayCode()))
            throw new UnauthorizedGateway();

        Optional<AccountEntity> account = accounts.findById(request.getUserId());
        if(account.isEmpty())
            return "USER_NOT_FOUND";

        logger.note("<color>" + account.get().getName() + "</color> felhasználó nevének lekérdezés (terminál: " + gatewayName + ")");
        return account.get().getName();
    }

    private boolean isLoadAllowed(AccountEntity accountEntity) {
        return accountEntity.getMinimumBalance() < 0;
    }

}
