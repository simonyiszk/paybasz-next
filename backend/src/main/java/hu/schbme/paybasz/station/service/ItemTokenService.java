package hu.schbme.paybasz.station.service;

import hu.schbme.paybasz.station.dto.ItemTokenView;
import hu.schbme.paybasz.station.model.AccountEntity;
import hu.schbme.paybasz.station.model.ItemEntity;
import hu.schbme.paybasz.station.model.ItemTokenEntity;
import hu.schbme.paybasz.station.repo.ItemTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ItemTokenService {

	private final ItemTokenRepository itemTokenRepository;

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
	List<ItemTokenView> getAllItemTokenViews() {
		return itemTokenRepository.getAllItemTokenViews();
	}

}
