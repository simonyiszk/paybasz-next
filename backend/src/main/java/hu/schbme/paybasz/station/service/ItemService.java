package hu.schbme.paybasz.station.service;

import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import hu.schbme.paybasz.station.config.ImportConfig;
import hu.schbme.paybasz.station.dto.ItemCreateDto;
import hu.schbme.paybasz.station.dto.ItemImportDto;
import hu.schbme.paybasz.station.dto.ItemQueryResult;
import hu.schbme.paybasz.station.model.ItemEntity;
import hu.schbme.paybasz.station.repo.ItemRepository;
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
public class ItemService {

	private final LoggingService logger;
	private final ItemRepository items;
	private final ImportConfig.CsvMapperProvider csvMapperProvider;

	@Transactional(readOnly = false)
	public void createItem(ItemImportDto dto) {
		log.info("New item was created: {} ({}) {} JMF", dto.getName(), dto.getAmount(), dto.getPrice());
		logger.note("<badge>" + dto.getName() + "</badge> termék hozzáadva");
		items.save(new ItemEntity(null, dto.getName(), dto.getAmount(), dto.getName(), dto.getAbbreviation(), dto.getPrice(), false));
	}

	@Transactional(readOnly = false)
	public void setItemActive(Integer itemId, boolean activate) {
		items.findById(itemId).ifPresent(itemEntity -> {
			itemEntity.setActive(activate);
			items.save(itemEntity);
		});
	}

	@Transactional(readOnly = true)
	public String exportItems() throws IOException {
		var writer = new StringWriter();
		ImportConfig.getCsvWriter(csvMapperProvider.getCsvMapper(), ItemEntity.class)
				.writeValues(writer)
				.writeAll(items.findAllByOrderById())
				.close();
		return writer.toString();
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
