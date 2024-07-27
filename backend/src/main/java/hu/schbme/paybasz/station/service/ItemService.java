package hu.schbme.paybasz.station.service;

import hu.schbme.paybasz.station.dto.ItemCreateDto;
import hu.schbme.paybasz.station.dto.ItemQueryResult;
import hu.schbme.paybasz.station.model.ItemEntity;
import hu.schbme.paybasz.station.repo.ItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Slf4j
@Service
@RequiredArgsConstructor
public class ItemService {

	private final LoggingService logger;
	private final ItemRepository items;

	@Transactional(readOnly = false)
	public void createItem(String name, int quantity, String code, String abbreviation, int price, boolean active) {
		log.info("New item was created: {} ({}) {} JMF", name, quantity, price);
		logger.note("<badge>" + name + "</badge> termék hozzáadva");
		items.save(new ItemEntity(null, name, quantity, code, abbreviation, price, active));
	}

	@Transactional(readOnly = false)
	public void setItemActive(Integer itemId, boolean activate) {
		items.findById(itemId).ifPresent(itemEntity -> {
			itemEntity.setActive(activate);
			items.save(itemEntity);
		});
	}

	@Transactional(readOnly = true)
	public String exportItems() {
		return "id;name;quantity;code;abbreviation;price;active"
				+ System.lineSeparator()
				+ items.findAllByOrderById().stream()
				.map(it -> Stream
						.of("" + it.getId(), it.getName(), "" + it.getQuantity(), it.getCode(),
								it.getAbbreviation(),
								"" + it.getPrice(), "" + it.isActive())
						.map(attr -> attr.replace(";", "\\;"))
						.collect(Collectors.joining(";")))
				.collect(Collectors.joining(System.lineSeparator()));
	}

	@Transactional(readOnly = true)
	public List<ItemEntity> getAllItems() {
		return items.findAll();
	}

	@Transactional(readOnly = true)
	public Optional<ItemEntity> getItem(Integer id) {
		return items.findById(id);
	}

	@Transactional(readOnly = false)
	public void modifyItem(ItemCreateDto itemDto) {
		Optional<ItemEntity> itemEntity = items.findById(itemDto.getId());
		if (itemEntity.isPresent()) {
			final var item = itemEntity.get();

			item.setCode(itemDto.getCode());
			item.setName(itemDto.getName());
			item.setQuantity(itemDto.getQuantity());
			item.setAbbreviation(itemDto.getAbbreviation());
			item.setPrice(itemDto.getPrice());
			logger.action("<color>" + item.getName() + "</color> termék adatai módosultak");
			items.save(item);
		}
	}

	@Transactional(readOnly = false)
	public void createItem(ItemCreateDto itemDto) {
		var item = new ItemEntity();
		item.setCode(itemDto.getCode());
		item.setName(itemDto.getName());
		item.setQuantity(itemDto.getQuantity());
		item.setAbbreviation(itemDto.getAbbreviation());
		item.setPrice(itemDto.getPrice());
		item.setActive(false);
		logger.note("<badge>" + item.getName() + "</badge> termék hozzáadva");
		items.save(item);
	}

	@Transactional(readOnly = true)
	public ItemQueryResult resolveItemQuery(String query) {
		if (query.startsWith("#"))
			query = query.substring(1);

		final String[] parts = query.split("\\*", 2);
		String code = parts[0];
		int amount = parts.length > 1 ? Integer.parseInt(parts[1]) : 1;

		return items.findAllByCodeAndActiveTrueOrderByPriceDesc(code)
				.stream().findFirst()
				.map(it -> new ItemQueryResult(true,
						it.getAbbreviation() + (amount > 1 ? ("x" + amount) : ""),
						it.getPrice() * amount))
				.orElseGet(() -> new ItemQueryResult(false, "not found", 0));
	}

	@Transactional(readOnly = true)
	public List<ItemEntity> getAllActiveItems() {
		return items.findAllByActiveTrueOrderByName();
	}
}
