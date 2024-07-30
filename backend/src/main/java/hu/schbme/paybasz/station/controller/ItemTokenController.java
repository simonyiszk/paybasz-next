package hu.schbme.paybasz.station.controller;

import hu.schbme.paybasz.station.dto.ItemTokenDto;
import hu.schbme.paybasz.station.dto.ItemTokenView;
import hu.schbme.paybasz.station.mapper.AccountMapper;
import hu.schbme.paybasz.station.mapper.ItemMapper;
import hu.schbme.paybasz.station.model.ItemTokenEntity;
import hu.schbme.paybasz.station.service.AccountService;
import hu.schbme.paybasz.station.service.ItemService;
import hu.schbme.paybasz.station.service.ItemTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Comparator;
import java.util.stream.StreamSupport;

@Slf4j
@Controller
@RequestMapping("/admin")
@RequiredArgsConstructor
public class ItemTokenController {

	private final ItemTokenService tokenService;
	private final AccountService accountService;
	private final ItemService itemService;

	@GetMapping("/tokens")
	public String tokens(Model model) {
		var tokens = tokenService.getAllItemTokenViews().stream()
				.sorted(Comparator
						.comparing(ItemTokenView::getAccountName)
						.thenComparing(ItemTokenView::getItemName))
				.toList();
		model.addAttribute("itemTokens", tokens);

		return "item-tokens";
	}

	@Transactional
	@GetMapping("/create-token")
	public String createToken(Model model) {
		model.addAttribute("token", (ItemTokenEntity) null);
		model.addAttribute("createMode", true);
		addItemsAndUsers(model);
		return "item-token-manipulate";
	}

	@Transactional
	@PostMapping("/set-token")
	public String createToken(ItemTokenDto tokenDto) {
		tokenService.setItemToken(tokenDto);
		return "redirect:/admin/tokens";
	}

	@Transactional
	@GetMapping("/modify-token/{tokenId}")
	public String modifyItem(@PathVariable Integer tokenId, Model model) {
		model.addAttribute("createMode", false);
		model.addAttribute("token", tokenService.getToken(tokenId).orElse(null));
		addItemsAndUsers(model);
		return "item-token-manipulate";
	}

	@PostMapping("/delete-token/{tokenId}")
	public String deleteToken(@PathVariable Integer tokenId) {
		tokenService.deleteItemToken(tokenId);
		return "redirect:/admin/tokens";
	}

	private void addItemsAndUsers(Model model) {
		var users = StreamSupport.stream(accountService.getAllAccounts().spliterator(), false)
				.map(AccountMapper.INSTANCE::toIdSelectEntry)
				.toList();
		model.addAttribute("users", users);

		var items = itemService.getAllActiveItems()
				.stream()
				.map(ItemMapper.INSTANCE::toIdSelectEntry)
				.toList();
		model.addAttribute("items", items);
	}

}
