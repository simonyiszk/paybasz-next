package hu.schbme.paybasz.station.service;

import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import hu.schbme.paybasz.station.config.ImportConfig;
import hu.schbme.paybasz.station.dto.ItemTokenDto;
import hu.schbme.paybasz.station.dto.ItemTokenImportDto;
import hu.schbme.paybasz.station.dto.ItemTokenView;
import hu.schbme.paybasz.station.mapper.ItemTokenMapper;
import hu.schbme.paybasz.station.model.AccountEntity;
import hu.schbme.paybasz.station.model.ItemEntity;
import hu.schbme.paybasz.station.model.ItemTokenEntity;
import hu.schbme.paybasz.station.repo.ItemTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.StringWriter;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ItemTokenService {

	private final ItemTokenRepository itemTokenRepository;
	private final AccountService accountService;
	private final ItemService itemService;
	private final ImportConfig.CsvMapperProvider csvMapperProvider;

	@Transactional
	public boolean giftItemToken(AccountEntity user, ItemEntity item, int count) {
		if (count <= 0 || !item.isActive()) {
			log.error("Attempted to add {} tokens to {}:{}, which is inactive", count, item.getId(), item.getName());
			return false;
		}

		var tokenExists = itemTokenRepository.findItemToken(user.getId(), item.getId()).isPresent();
		if (tokenExists) {
			log.info("Added {} entries of {}:{} item tokens for {}", count, item.getId(), item.getName(), user.getName());
			itemTokenRepository.addToItemTokenCount(user.getId(), item.getId(), count);
			return true;
		}

		itemTokenRepository.save(new ItemTokenEntity(null, user.getId(), item.getId(), count));
		log.info("Created {} entries of {}:{} item tokens for {}", count, item.getId(), item.getName(), user.getName());
		return true;
	}

	@Transactional
	public boolean setItemToken(AccountEntity user, ItemEntity item, int count) {
		if (count <= 0 || !item.isActive()) {
			log.error("Attempted to set {} tokens to {}:{}, which is inactive", count, item.getId(), item.getName());
			return false;
		}

		var token = itemTokenRepository.findItemToken(user.getId(), item.getId()).orElse(null);
		if (token != null) {
			log.info("Updated {} entries of {}:{} item tokens for {}", count, item.getId(), item.getName(), user.getName());
			token.setCount(count);
			itemTokenRepository.save(token);
			return true;
		}

		itemTokenRepository.save(new ItemTokenEntity(null, user.getId(), item.getId(), count));
		log.info("Created {} entries of {}:{} item tokens for {}", count, item.getId(), item.getName(), user.getName());
		return true;
	}

	@Transactional
	public void setItemToken(ItemTokenDto tokenDto) {
		if (tokenDto.getUserId() == null || tokenDto.getItemId() == null)
			return;

		var user = accountService.getAccount(tokenDto.getUserId());
		if (user.isEmpty())
			return;

		var item = itemService.getItem(tokenDto.getItemId());
		if (item.isEmpty())
			return;

		if (tokenDto.getId() == null) {
			setItemToken(user.get(), item.get(), tokenDto.getCount());
			return;
		}

		itemTokenRepository.save(ItemTokenMapper.INSTANCE.toEntity(tokenDto));
	}

	@Transactional
	public void setItemToken(ItemTokenImportDto tokenDto) {
		setItemToken(new ItemTokenDto(null, tokenDto.getItemId(), tokenDto.getUserId(), tokenDto.getAmount()));
	}

	@Transactional
	public boolean deleteItemToken(AccountEntity user, ItemEntity item) {
		var tokenExists = itemTokenRepository.findItemToken(user.getId(), item.getId()).isPresent();
		if (!tokenExists) {
			log.error("Cannot delete item token item: {}, user: {}, because it doesn't exist", item.getId(), user.getId());
			return false;
		}

		itemTokenRepository.deleteItemToken(user.getId(), item.getId());
		log.info("Deleted item token item: {}, user: {}", item.getId(), user.getId());
		return true;
	}

	@Transactional
	public boolean claimItemToken(AccountEntity user, ItemEntity item, int count) {
		if (count <= 0 || !item.isActive()) {
			log.error("Attempted to remove {} tokens to {}:{}, which is inactive", count, item.getId(), item.getName());
			return false;
		}

		var itemToken = itemTokenRepository.findItemToken(user.getId(), item.getId()).orElse(null);
		if (itemToken == null || itemToken.getCount() < count) {
			log.error("Attempted to remove {} tokens from {}:{}, which is more than the stock", count, item.getId(), item.getName());
			return false;
		}

		if (itemToken.getCount() == count) {
			itemTokenRepository.deleteItemToken(user.getId(), item.getId());
		} else {
			itemTokenRepository.addToItemTokenCount(user.getId(), item.getId(), -count);
		}
		log.info("Removed {} entries of {}:{} item tokens for {}", count, item.getId(), item.getName(), user.getName());

		return true;
	}

	@Transactional
	public List<ItemTokenView> getAllItemTokenViews() {
		return itemTokenRepository.getAllItemTokenViews();
	}

	@Transactional
	public Optional<ItemTokenEntity> getToken(Integer tokenId) {
		return itemTokenRepository.findById(tokenId);
	}

	@Transactional
	public void deleteItemToken(Integer tokenId) {
		itemTokenRepository.deleteById(tokenId);
	}

	public String exportTokens() throws IOException {
		var writer = new StringWriter();
		ImportConfig.getCsvWriter(csvMapperProvider.getCsvMapper(), ItemTokenEntity.class)
				.writeValues(writer)
				.writeAll(itemTokenRepository.findAll())
				.close();
		return writer.toString();

	}
}
