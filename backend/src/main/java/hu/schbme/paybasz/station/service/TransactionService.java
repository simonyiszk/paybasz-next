package hu.schbme.paybasz.station.service;

import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import hu.schbme.paybasz.station.config.ImportConfig;
import hu.schbme.paybasz.station.dto.Cart;
import hu.schbme.paybasz.station.dto.CartItem;
import hu.schbme.paybasz.station.dto.CustomCartItem;
import hu.schbme.paybasz.station.dto.PaymentStatus;
import hu.schbme.paybasz.station.model.AccountEntity;
import hu.schbme.paybasz.station.model.ItemEntity;
import hu.schbme.paybasz.station.model.TransactionEntity;
import hu.schbme.paybasz.station.repo.AccountRepository;
import hu.schbme.paybasz.station.repo.ItemRepository;
import hu.schbme.paybasz.station.repo.TransactionRepository;
import hu.schbme.paybasz.station.util.Pair;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

import static hu.schbme.paybasz.station.service.GatewayService.WEB_TERMINAL_NAME;

@Slf4j
@Service
@RequiredArgsConstructor
public class TransactionService {

	private final TransactionRepository transactions;
	private final AccountRepository accounts;
	private final GatewayService gateways;
	private final ItemRepository items;
	private final LoggingService logger;
	private final CsvMapper csvMapper;

	@Transactional(readOnly = false)
	public PaymentStatus proceedPayment(String card, int amount, String message, String gateway) {
		Optional<AccountEntity> possibleAccount = this.accounts.findByCard(card);
		var result = checkAccount(possibleAccount, gateway);
		if (result.isPresent()) {
			return result.get();
		}
		var accountEntity = possibleAccount.get();
		if (accountEntity.getBalance() - amount < accountEntity.getMinimumBalance()) {
			logger.failure("Sikertelen fizetés: <color>" + accountEntity.getName() + ", nincs elég fedezet</color>"
					+ "(terminál: " + gateway + ")");
			return PaymentStatus.NOT_ENOUGH_CASH;
		}

		var transaction = new TransactionEntity(null, System.currentTimeMillis(), card, accountEntity.getId(),
				accountEntity.getName(), accountEntity.getName() + " paid " + amount + " with message: " + message,
				amount, message, gateway, "SYSTEM", true);
		accountEntity.setBalance(accountEntity.getBalance() - amount);
		accounts.save(accountEntity);
		transactions.save(transaction);
		log.info("Payment proceed: {} with amount: {} at gateway: {}", transaction.getId(), transaction.getAmount(),
				transaction.getGateway());
		logger.success(
				"<badge>" + accountEntity.getName() + "</badge> sikeres fizetés: <color>" + amount + " JMF</color>"
						+ "(terminál: " + gateway + (message.isBlank() ? "" : ", megjegyzés: " + message) + ")");
		return PaymentStatus.ACCEPTED;
	}

	@Transactional()
	public PaymentStatus checkout(String card, Cart cart, String gateway) {
		Optional<AccountEntity> possibleAccount = this.accounts.findByCard(card);
		var result = checkAccount(possibleAccount, gateway);
		if (result.isPresent()) {
			return result.get();
		}
		var accountEntity = possibleAccount.get();
		// Believe me, I tried to do it without loops, but it's uglier than this
		final List<Pair<ItemEntity, CartItem>> itemPairs = new ArrayList<>();
		for (var cartItem : cart.getItems()) {
			var possibleItem = items.findById(cartItem.getId());
			if (possibleItem.isEmpty()) {
				logger.failure("Sikertelen fizetés: <color>termék nem található</color> " + "(terminál: " + gateway + ")");
				return PaymentStatus.VALIDATION_ERROR;
			}

			var item = possibleItem.get();
			if (item.getQuantity() < cartItem.getQuantity()) {
				logger.failure("Sikertelen fizetés: <color>termékből nincs elég raktáron</color> " + "(terminál: " + gateway + ")");
				return PaymentStatus.VALIDATION_ERROR;
			}

			item.setQuantity(item.getQuantity() - cartItem.getQuantity());
			itemPairs.add(new Pair<>(item, cartItem));
		}

		int amount = getTotalAmount(itemPairs, cart.getCustomItems());
		if (accountEntity.getBalance() - amount < accountEntity.getMinimumBalance()) {
			logger.failure("Sikertelen fizetés: <color>" + accountEntity.getName() + ", nincs elég fedezet</color>"
					+ "(terminál: " + gateway + ")");
			return PaymentStatus.NOT_ENOUGH_CASH;
		}

		var normalItemTransactions = itemPairs.stream()
				.map(pair -> new TransactionEntity(null, System.currentTimeMillis(), card, accountEntity.getId(),
						accountEntity.getName(), accountEntity.getName() + " paid " + pair.getFirst().getPrice() * pair.getSecond().getQuantity(),
						pair.getFirst().getPrice() * pair.getSecond().getQuantity(), pair.getFirst().getName(), gateway, "SYSTEM", true));
		var customItemTransactions = cart.getCustomItems().stream().map(item -> new TransactionEntity(null, System.currentTimeMillis(), card, accountEntity.getId(),
				accountEntity.getName(), accountEntity.getName() + " paid " + item.getPrice() * item.getQuantity(),
				item.getPrice() * item.getQuantity(), item.getName(), gateway, "SYSTEM", true));
		var transactionEntities = Stream.concat(normalItemTransactions, customItemTransactions).toList();

		accountEntity.setBalance(accountEntity.getBalance() - amount);
		accounts.save(accountEntity);
		items.saveAll(itemPairs.stream().map(Pair::getFirst).toList());
		transactions.saveAll(transactionEntities);
		logger.success("<badge>" + accountEntity.getName() + "</badge> sikeres fizetés: <color>" + amount + " JMF</color>" + "(terminál: " + gateway + ")");

		return PaymentStatus.ACCEPTED;
	}

	@Transactional()
	public PaymentStatus decreaseItemCountAndBuy(String card, String gateway, Integer itemId) {
		Optional<AccountEntity> possibleAccount = this.accounts.findByCard(card);
		var result = checkAccount(possibleAccount, gateway);
		if (result.isPresent()) {
			return result.get();
		}

		Optional<ItemEntity> possibleItem = this.items.findById(itemId);
		if (possibleItem.isEmpty()) {
			logger.failure("Sikertelen fizetés: <color>termék nem található</color> " + "(terminál: " + gateway + ")");
			return PaymentStatus.VALIDATION_ERROR;
		}

		var itemEntity = possibleItem.get();
		if (!itemEntity.isActive()) {
			logger.failure("Sikertelen fizetés: <color>termék nem elérhető</color> " + "(terminál: " + gateway + ")");
			return PaymentStatus.VALIDATION_ERROR;
		}

		if (itemEntity.getQuantity() <= 0) {
			logger.failure("Sikertelen fizetés: <color>termék elfogyott</color> " + "(terminál: " + gateway + ")");
			return PaymentStatus.VALIDATION_ERROR;
		}

		var accountEntity = possibleAccount.get();
		if (accountEntity.getBalance() - itemEntity.getPrice() < accountEntity.getMinimumBalance()) {
			return PaymentStatus.NOT_ENOUGH_CASH;
		}

		var transaction = new TransactionEntity(null, System.currentTimeMillis(), card, accountEntity.getId(),
				accountEntity.getName(), accountEntity.getName() + " paid " + itemEntity.getPrice(),
				itemEntity.getPrice(), itemEntity.getName(), gateway, "SYSTEM", true);

		accountEntity.setBalance(accountEntity.getBalance() - itemEntity.getPrice());
		itemEntity.setQuantity(itemEntity.getQuantity() - 1);
		accounts.save(accountEntity);
		items.save(itemEntity);
		transactions.save(transaction);
		logger.success("<badge>" + accountEntity.getName() + "</badge> sikeres fizetés: <color>" + itemEntity.getPrice() + " JMF</color>" + "(terminál: " + gateway + ")");

		return PaymentStatus.ACCEPTED;
	}

	@Transactional(readOnly = false)
	public boolean addMoneyToAccount(Integer accountId, int amount, String message) {
		Optional<AccountEntity> possibleAccount = this.accounts.findById(accountId);
		var result = checkAccount(possibleAccount, null);
		if (result.isPresent()) {
			return false;
		}
		var accountEntity = possibleAccount.get();
		var transaction = new TransactionEntity(null, System.currentTimeMillis(), "NO-CARD-USED", -1,
				"SYSTEM", "SYSTEM paid " + amount + " with message: " + message,
				amount, message, WEB_TERMINAL_NAME, accountEntity.getName(), false);

		gateways.uploadInGateway(WEB_TERMINAL_NAME, amount);
		accountEntity.setBalance(accountEntity.getBalance() + amount);
		accounts.save(accountEntity);
		transactions.save(transaction);
		log.info("{} money added to: {}", transaction.getAmount(), accountEntity.getName());
		logger.success("<badge>" + accountEntity.getName() + "</badge> számlájára feltöltve: <color>" + amount
				+ " JMF</color>" + (message.isBlank() ? "" : " (megjegyzés: " + message + ")"));
		return true;
	}

	@Transactional(readOnly = false)
	public PaymentStatus addMoneyToCard(String card, int amount, String message, String gateway) {
		Optional<AccountEntity> possibleAccount = this.accounts.findByCard(card);
		var result = checkAccount(possibleAccount, gateway);
		if (result.isPresent()) {
			return result.get();
		}
		var accountEntity = possibleAccount.get();
		if (amount > 50000) {
			logger.failure("Sikertelen feltöltés: <color>" + accountEntity.getName() + ", túl magas összeg</color>"
					+ "(terminál: " + gateway + ")");
			return PaymentStatus.NOT_ENOUGH_CASH;
		}

		var transaction = new TransactionEntity(null, System.currentTimeMillis(), card, accountEntity.getId(),
				"SYSTEM", accountEntity.getName() + " uploaded " + amount + " with message: " + message,
				amount, message, gateway, accountEntity.getName(), true);
		gateways.uploadInGateway(gateway, amount);
		accountEntity.setBalance(accountEntity.getBalance() + amount);
		accounts.save(accountEntity);
		transactions.save(transaction);
		log.info("Upload proceed: {} with amount: {} at gateway: {}", transaction.getId(), transaction.getAmount(),
				transaction.getGateway());
		logger.success(
				"<badge>" + accountEntity.getName() + "</badge> sikeres feltöltés: <color>" + amount + " JMF</color>"
						+ "(terminál: " + gateway + (message.isBlank() ? "" : ", megjegyzés: " + message) + ")");
		return PaymentStatus.ACCEPTED;
	}

	@Transactional(readOnly = true)
	public Iterable<TransactionEntity> getAllTransactions() {
		return transactions.findAll();
	}

	@Transactional(readOnly = true)
	public Iterable<TransactionEntity> getTransactionsByGateway(String gateway) {
		return transactions.findAllByGateway(gateway);
	}

	@Transactional(readOnly = true)
	public long getTransactionCount() {
		return transactions.count();
	}

	@Transactional(readOnly = true)
	public long getSumOfIncome() {
		return transactions.findAllByReceiver("SYSTEM").stream()
				.mapToInt(TransactionEntity::getAmount)
				.sum();
	}

	@Transactional(readOnly = true)
	public long getSumOfPayIns() {
		return transactions.findAllByCardHolder("SYSTEM").stream()
				.mapToInt(TransactionEntity::getAmount)
				.sum();
	}

	@Transactional(readOnly = false)
	public PaymentStatus createTransactionToSystem(Integer accountId, Integer amount, String message) {
		Optional<AccountEntity> possibleAccount = this.accounts.findById(accountId);
		var result = checkAccount(possibleAccount, WEB_TERMINAL_NAME);
		if (result.isPresent()) {
			return result.get();
		}
		var accountEntity = possibleAccount.get();
		if (accountEntity.getBalance() - amount < accountEntity.getMinimumBalance()) {
			logger.failure("Sikertelen fizetés: <color>" + accountEntity.getName() + ", nincs elég fedezet</color>");
			return PaymentStatus.NOT_ENOUGH_CASH;
		}

		var transaction = new TransactionEntity(null, System.currentTimeMillis(), "NO-CARD-USED", accountEntity.getId(),
				accountEntity.getName(), accountEntity.getName() + " paid " + amount + " with message: WEBTERM",
				amount, message, WEB_TERMINAL_NAME, "SYSTEM", true);

		accountEntity.setBalance(accountEntity.getBalance() - amount);
		accounts.save(accountEntity);
		transactions.save(transaction);
		log.info("Payment proceed: {} with amount: {} at gateway: {}", transaction.getId(), transaction.getAmount(),
				transaction.getGateway());
		logger.success("<badge>" + accountEntity.getName() + "</badge> sikeres fizetés: <color>" + amount
				+ " JMF</color>" + (message.isBlank() ? "" : " (megjegyzés: " + message + ")"));
		return PaymentStatus.ACCEPTED;
	}

	@Transactional(readOnly = true)
	public String exportTransactions() throws IOException {
		var writer = new StringWriter();
		ImportConfig.getCsvWriter(csvMapper, TransactionEntity.class)
				.writeValues(writer)
				.writeAll(transactions.findAllByOrderById())
				.close();
		return writer.toString();
	}

	Optional<PaymentStatus> checkAccount(Optional<AccountEntity> possibleAccount, String gateway) {
		if (possibleAccount.isEmpty()) {
			logger.failure("Sikertelen Tranzakció: <color>kártya nem található</color> " + "(terminál: " + gateway + ")");
			return Optional.of(PaymentStatus.VALIDATION_ERROR);
		}

		var accountEntity = possibleAccount.get();
		if (!accountEntity.isAllowed()) {
			logger.failure("Sikertelen tranzakció: <badge>" + accountEntity.getName()
					+ "</badge>  <color>le van tiltva</color>" + "(terminál: " + gateway + ")");
			return Optional.of(PaymentStatus.CARD_REJECTED);
		}
		return Optional.empty();
	}


	private int getTotalAmount(List<Pair<ItemEntity, CartItem>> itemPairs, List<CustomCartItem> customItems) {
		int normalItemSum = itemPairs
				.stream()
				.mapToInt(pair -> pair.getFirst().getPrice() * pair.getSecond().getQuantity())
				.sum();

		int customItemSum = customItems
				.stream()
				.mapToInt(item -> item.getQuantity() * item.getPrice())
				.sum();

		return normalItemSum + customItemSum;
	}

}
