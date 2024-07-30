package hu.schbme.paybasz.station.controller;

import hu.schbme.paybasz.station.dto.ItemCreateDto;
import hu.schbme.paybasz.station.model.ItemEntity;
import hu.schbme.paybasz.station.service.ItemService;
import hu.schbme.paybasz.station.service.LoggingService;
import hu.schbme.paybasz.station.service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.stream.Collectors;

@SuppressWarnings("SpellCheckingInspection")
@Slf4j
@Controller
@RequestMapping("/admin")
@RequiredArgsConstructor
public class ItemsController {

	private final TransactionService transactionService;
	private final LoggingService logger;
	private final ItemService itemService;

	@GetMapping("/items")
	public String items(Model model) {
		final var items = itemService.getAllItems();
		model.addAttribute("items", items);
		model.addAttribute("invalid", items.stream()
				.filter(ItemEntity::isActive)
				.collect(Collectors.groupingBy(ItemEntity::getCode))
				.entrySet().stream()
				.filter(it -> it.getValue().size() > 1)
				.map(it -> "#" + it.getKey())
				.collect(Collectors.joining(", ")));

		return "items";
	}

	@GetMapping("/create-item")
	public String createItem(Model model) {
		model.addAttribute("item", null);
		model.addAttribute("createMode", true);
		return "item-manipulate";
	}

	@PostMapping("/create-item")
	public String createItem(ItemCreateDto itemDto) {
		itemDto.setAbbreviation(itemDto.getAbbreviation().trim());
		itemService.createItem(itemDto);
		return "redirect:/admin/items";
	}

	@GetMapping("/modify-item/{itemId}")
	public String modifyItem(@PathVariable Integer itemId, Model model) {
		Optional<ItemEntity> item = itemService.getItem(itemId);
		model.addAttribute("createMode", false);
		item.ifPresentOrElse(
				acc -> model.addAttribute("item", acc),
				() -> model.addAttribute("item", null));
		return "item-manipulate";
	}

	@PostMapping("/modify-item")
	public String modifyItem(ItemCreateDto itemDto) {
		if (itemDto.getId() == null)
			return "redirect:/admin/items";

		itemDto.setAbbreviation(itemDto.getAbbreviation().trim());
		Optional<ItemEntity> item = itemService.getItem(itemDto.getId());
		if (item.isPresent()) {
			itemService.modifyItem(itemDto);
		}
		return "redirect:/admin/items";
	}

	@PostMapping("/items/activate")
	public String activateItem(@RequestParam Integer id) {
		Optional<ItemEntity> item = itemService.getItem(id);
		item.ifPresent(it -> {
			itemService.setItemActive(id, true);
			logger.action("<color>" + it.getName() + "</color> termék rendelhető");
			log.info("Item purchase activated for {} ({})", it.getName(), it.getQuantity());
		});
		return "redirect:/admin/items";
	}

	@PostMapping("/items/deactivate")
	public String deactivateItem(@RequestParam Integer id) {
		Optional<ItemEntity> item = itemService.getItem(id);
		item.ifPresent(it -> {
			itemService.setItemActive(id, false);
			logger.failure("<color>" + it.getName() + "</color> termék nem redelhető");
			log.info("Item purchase deactivated for {} ({})", it.getName(), it.getQuantity());
		});
		return "redirect:/admin/items";
	}

}
