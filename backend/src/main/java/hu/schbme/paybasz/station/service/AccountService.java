package hu.schbme.paybasz.station.service;

import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import hu.schbme.paybasz.station.config.ImportConfig;
import hu.schbme.paybasz.station.dto.AccountCreateDto;
import hu.schbme.paybasz.station.dto.AccountImportDto;
import hu.schbme.paybasz.station.model.AccountEntity;
import hu.schbme.paybasz.station.repo.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.StringWriter;
import java.util.Comparator;
import java.util.Optional;


@Slf4j
@Service
@RequiredArgsConstructor
public class AccountService {

	private final AccountRepository accounts;
	private final LoggingService logger;
	private final ImportConfig.CsvMapperProvider csvMapperProvider;

	public Optional<AccountEntity> getAccountByCard(String card) {
		return accounts.findByCard(card);
	}

	@Transactional(readOnly = false)
	public void createAccount(AccountImportDto dto) {
		logger.note("<badge>" + dto.getName() + "</badge> regisztrálva");
		accounts.save(new AccountEntity(null, dto.getName(), "", dto.getMobile(), dto.getEmail(), dto.getAmount(), 0, true, ""));
	}

	@Transactional(readOnly = true)
	public long getUserCount() {
		return accounts.count();
	}

	@Transactional(readOnly = true)
	public long getSumOfLoans() {
		return Math.abs(accounts.findAllByBalanceLessThan(0).stream()
				.mapToInt(AccountEntity::getBalance)
				.sum());
	}

	@Transactional(readOnly = true)
	public long getSumOfBalances() {
		return accounts.findAllByBalanceGreaterThan(0).stream()
				.mapToInt(AccountEntity::getBalance)
				.sum();
	}

	@Transactional(readOnly = true)
	public Iterable<AccountEntity> getAllAccounts() {
		final var all = accounts.findAll();
		all.sort(Comparator.comparing(AccountEntity::getName));
		return all;
	}

	@Transactional(readOnly = true)
	public Optional<AccountEntity> getAccount(Integer accountId) {
		return accounts.findById(accountId);
	}

	@Transactional(readOnly = false)
	public void setAccountAllowed(Integer accountId, boolean allow) {
		accounts.findById(accountId).ifPresent(accountEntity -> {
			accountEntity.setAllowed(allow);
			accounts.save(accountEntity);
		});
	}

	@Transactional(readOnly = false)
	public boolean modifyAccount(AccountCreateDto acc) {
		Optional<AccountEntity> cardCheck = acc.getCard().length() > 24 ? accounts.findByCard(acc.getCard())
				: Optional.empty();
		Optional<AccountEntity> user = accounts.findById(acc.getId());
		if (user.isPresent()) {
			final var account = user.get();
			if (acc.getCard().length() > 24 && cardCheck.isPresent()
					&& !cardCheck.get().getId().equals(account.getId()))
				return false;

			account.setName(acc.getName());
			account.setEmail(acc.getEmail());
			account.setPhone(acc.getPhone());
			account.setCard(acc.getCard());
			account.setComment(acc.getComment());
			account.setMinimumBalance((acc.getLoan() == null || acc.getLoan() < 0) ? 0 : -acc.getLoan());
			logger.action("<color>" + account.getName() + "</color> adatai módosultak");
			accounts.save(account);
		}
		return true;
	}

	@Transactional(readOnly = false)
	public boolean createAccount(AccountCreateDto acc) {
		if (acc.getCard().length() > 24 && accounts.findByCard(acc.getCard()).isPresent())
			return false;

		var account = new AccountEntity();
		account.setName(acc.getName());
		account.setEmail(acc.getEmail());
		account.setPhone(acc.getPhone());
		account.setCard(acc.getCard());
		account.setComment(acc.getComment());
		account.setMinimumBalance((acc.getLoan() == null || acc.getLoan() < 0) ? 0 : -acc.getLoan());
		account.setAllowed(true);
		logger.note("<badge>" + account.getName() + "</badge> regisztrálva");
		accounts.save(account);
		return true;
	}

	@Transactional(readOnly = true)
	public String exportAccounts() throws IOException {
		var writer = new StringWriter();
		ImportConfig.getCsvWriter(csvMapperProvider.getCsvMapper(), AccountEntity.class)
				.writeValues(writer)
				.writeAll(accounts.findAllByOrderById())
				.close();
		return writer.toString();
	}

}
