package hu.schbme.paybasz.station.controller;

import hu.schbme.paybasz.station.config.AppUtil;
import hu.schbme.paybasz.station.dto.*;
import hu.schbme.paybasz.station.error.UnauthorizedGateway;
import hu.schbme.paybasz.station.error.UserNotFoundException;
import hu.schbme.paybasz.station.mapper.ItemMapper;
import hu.schbme.paybasz.station.model.AccountEntity;
import hu.schbme.paybasz.station.model.ItemEntity;
import hu.schbme.paybasz.station.repo.AccountRepository;
import hu.schbme.paybasz.station.service.GatewayService;
import hu.schbme.paybasz.station.service.LoggingService;
import hu.schbme.paybasz.station.service.TransactionService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import static hu.schbme.paybasz.station.PaybaszApplication.VERSION;

@SuppressWarnings("SpellCheckingInspection")
@Slf4j
@RestController
@RequestMapping("/mapi")
@CrossOrigin
@RequiredArgsConstructor
public class MobileController {

	private final TransactionService system;
	private final GatewayService gateways;
	private final LoggingService logger;
	private final AccountRepository accounts;

	@PostMapping("/app/{gatewayName}")
	public ResponseEntity<AppResponse> app(@PathVariable String gatewayName, @RequestBody AppRequest request) {
		final boolean isUploader = gateways.authorizeUploaderGateway(gatewayName, request.getGatewayCode());
		if (!isUploader && !gateways.authorizeGateway(gatewayName, request.getGatewayCode())) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		}

		try {
			final var items = system.getAllActiveItems()
					.stream()
					.map(ItemMapper.INSTANCE::toView)
					.toList();
			final var response = AppResponse.builder()
					.isUploader(isUploader)
					.items(items)
					.build();
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("Error creating app response", e);
			logger.failure("Sikertelen app információ lekérés: belső szerver hiba");
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@PostMapping("/upload/{gatewayName}")
	public PaymentStatus upload(@PathVariable String gatewayName, @RequestBody PaymentRequest request) {
		if (!gateways.authorizeUploaderGateway(gatewayName, request.getGatewayCode()))
			return PaymentStatus.UNAUTHORIZED_TERMINAL;
		gateways.updateLastUsed(gatewayName);
		if (request.getAmount() < 0)
			return PaymentStatus.INTERNAL_ERROR;

		try {
			return system.addMoneyToCard(request.getCard().toUpperCase(), request.getAmount(),
					request.getDetails() == null ? "" : request.getDetails(),
					gatewayName);
		} catch (Exception e) {
			log.error("Error during proceeding payment", e);
			logger.failure("Sikertelen fizetés: belső szerver hiba");
			return PaymentStatus.INTERNAL_ERROR;
		}
	}

	@PostMapping("/free-beer/{gatewayName}")
	public PaymentStatus freeBeer(@PathVariable String gatewayName, @RequestBody PaymentRequest request) {
		if (!gateways.authorizeGateway(gatewayName, request.getGatewayCode()))
			return PaymentStatus.UNAUTHORIZED_TERMINAL;
		gateways.updateLastUsed(gatewayName);

		try {
			return system.getBeer(request.getCard().toUpperCase(),
					request.getDetails() == null ? "" : request.getDetails(),
					gatewayName);
		} catch (Exception e) {
			log.error("Error during proceeding free beer", e);
			logger.failure("Sikertelen ingyen sör: belső szerver hiba");
			return PaymentStatus.INTERNAL_ERROR;
		}
	}

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

	@PostMapping("/buy-item/{gatewayName}")
	public PaymentStatus buyItem(@PathVariable String gatewayName, @RequestBody ItemPurchaseRequest request) {
		if (!gateways.authorizeGateway(gatewayName, request.getGatewayCode()))
			return PaymentStatus.UNAUTHORIZED_TERMINAL;
		gateways.updateLastUsed(gatewayName);
		try {
			return system.decreaseItemCountAndBuy(request.getCard().toUpperCase(), gatewayName, request.getId());
		} catch (Exception e) {
			logger.failure("Sikertelen termék vásárlása: " + request.getId());
			return PaymentStatus.INTERNAL_ERROR;
		}
	}

	/**
	 * NOTE: Do not use for transaction purposes. Might be effected by dirty read.
	 */
	@PostMapping("/balance/{gatewayName}")
	public ResponseEntity<BalanceResponse> balance(@PathVariable String gatewayName, @RequestBody BalanceRequest request) {
		if (!gateways.authorizeGateway(gatewayName, request.getGatewayCode()))
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();

		gateways.updateLastUsed(gatewayName);
		log.info("New balance from gateway '{}' card hash: '{}'", gatewayName, request.getCard().toUpperCase());
		Optional<AccountEntity> account = system.getAccountByCard(request.getCard().toUpperCase());
		if (account.isEmpty()) {
			logger.action("<color>Ismeretlen kártya került leolvasásra.</color> (terminál: " + gatewayName + ")");
			return ResponseEntity.notFound().build();
		}

		var accountBalance = account.get();
		logger.action("<badge>" + account.map(AccountEntity::getName).orElse("n/a")
				+ "</badge> egyenlege leolvasva: <color>" + accountBalance.getBalance() + " JMF</color> (terminál: "
				+ gatewayName + ")");

		var response = BalanceResponse.builder()
				.balance(accountBalance.getBalance())
				.maxLoan(accountBalance.getMaxLoan())
				.build();
		return ResponseEntity.ok(response);
	}

	@PostMapping("/reading/{gatewayName}")
	public ValidationStatus reading(@PathVariable String gatewayName, @RequestBody ReadingRequest readingRequest) {
		if (!gateways.authorizeGateway(gatewayName, readingRequest.getGatewayCode()))
			return ValidationStatus.INVALID;

		log.info("New reading from gateway '{}' read card hash: '{}'", gatewayName,
				readingRequest.getCard().toUpperCase());
		logger.action("Leolvasás történt: <badge>" + readingRequest.getCard().toUpperCase() + "</badge> (terminál: "
				+ gatewayName + ")");
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
		log.info("Status endpoint triggered from IP: {}", request.getRemoteAddr());
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

		return system.getAllItems().stream()
				.filter(ItemEntity::isActive)
				.toList();
	}

	@PostMapping("/set-card/{gatewayName}")
	public AddCardStatus addCard(@PathVariable String gatewayName, @RequestBody AddCardRequest request) {
		if (!gateways.authorizeGateway(gatewayName, request.getGatewayCode()))
			return AddCardStatus.UNAUTHORIZED_TERMINAL;

		gateways.updateLastUsed(gatewayName);

		if (accounts.findByCard(request.getCard().toUpperCase()).isPresent())
			return AddCardStatus.ALREADY_ADDED;

		Optional<AccountEntity> user = accounts.findById(request.getUserId());
		if (user.isEmpty())
			return AddCardStatus.USER_NOT_FOUND;
		final var account = user.get();
		if (!account.getCard().isEmpty())
			return AddCardStatus.USER_HAS_CARD;

		account.setCard(request.getCard().toUpperCase());
		log.info("New card assignment from gateway '{}' card hash: '{}', user: {}", gatewayName, request.getCard(),
				account.getName());
		logger.action("<color>" + account.getName() + "</color> felhasználóhoz kártya rendelve: <badge>"
				+ request.getCard() + "</badge>  (terminál: " + gatewayName + ")");
		accounts.save(account);
		return AddCardStatus.ACCEPTED;
	}

	@PostMapping("/get-user/{gatewayName}")
	public String getUser(@PathVariable String gatewayName, @RequestBody GetUserRequest request) {
		if (!gateways.authorizeGateway(gatewayName, request.getGatewayCode()))
			throw new UnauthorizedGateway();

		Optional<AccountEntity> account = accounts.findById(request.getUserId());
		if (account.isEmpty())
			return "USER_NOT_FOUND";

		logger.note("<color>" + account.get().getName() + "</color> felhasználó nevének lekérdezés (terminál: "
				+ gatewayName + ")");
		return account.get().getName();
	}

	@GetMapping("/get-balance/{gatewayName}")
	public int getBalance(@PathVariable String gatewayName, @RequestBody GetUserByEmailRequest request) {
		if (!gateways.authorizeGateway(gatewayName, request.getGatewayCode()))
			throw new UnauthorizedGateway();

		Optional<AccountEntity> account = accounts.findByEmail(request.getEmail());
		if (account.isEmpty())
			throw new UserNotFoundException();

		logger.note("<color>" + account.get().getName()
				+ "</color> felhasználó egyenlegének lekérdezése e-mail alapján (terminál: " + gatewayName + ")");
		return account.get().getBalance();
	}

}
