package hu.schbme.paybasz.station.controller;

import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import hu.schbme.paybasz.station.config.AppUtil;
import hu.schbme.paybasz.station.config.ImportConfig;
import hu.schbme.paybasz.station.dto.AccountImportDto;
import hu.schbme.paybasz.station.dto.ItemImportDto;
import hu.schbme.paybasz.station.dto.ItemTokenImportDto;
import hu.schbme.paybasz.station.service.*;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import static hu.schbme.paybasz.station.config.AppUtil.formatNumber;

@SuppressWarnings("SpellCheckingInspection")
@Slf4j
@Controller
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

	public static final String DUPLICATE_CARD_ERROR = "DUPLICATE_CARD";
	private final TransactionService transactionService;
	private final LoggingService logger;
	private final AccountService accountService;
	private final ItemService itemService;
	private final CsvMapper csvMapper;
	private final ItemTokenService itemTokenService;

	@RequestMapping("/")
	public String index(Model model) {
		model.addAttribute("userCount", accountService.getUserCount());
		model.addAttribute("txCount", transactionService.getTransactionCount());
		model.addAttribute("sumOfIncome", formatNumber(transactionService.getSumOfIncome()));

		model.addAttribute("logs", logger.getEntries());

		model.addAttribute("sumOfLoans", formatNumber(accountService.getSumOfLoans()));
		model.addAttribute("sumOfBalances", formatNumber(accountService.getSumOfBalances()));
		model.addAttribute("sumOfPayIns", formatNumber(transactionService.getSumOfPayIns()));
		return "analytics";
	}

	@GetMapping("/transactions")
	public String transactions(Model model) {
		model.addAttribute("transactions", transactionService.getAllTransactions());
		return "transactions";
	}

	@GetMapping("/transactions/{gateway}")
	public String transactions(Model model, @PathVariable String gateway) {
		model.addAttribute("transactions", transactionService.getTransactionsByGateway(gateway));
		model.addAttribute("gateway", gateway);
		return "transactions";
	}

	@GetMapping("/export")
	public String export() {
		return "export";
	}

	@GetMapping("/export/accounts")
	@ResponseBody
	public String exportAccounts(HttpServletResponse response) throws IOException {
		response.setContentType("text/csv");
		response.setHeader("Content-Disposition", "attachment; filename=\"paybasz-accounts-"
				+ AppUtil.DATE_TIME_FILE_FORMATTER.format(System.currentTimeMillis()) + ".csv\"");

		String csvExport = accountService.exportAccounts();
		logger.action("Felhasználók kiexportálva");
		return csvExport;
	}

	@Transactional
	@PostMapping("/import/accounts")
	public String importAccount(Model model, @RequestParam("csv") MultipartFile csv) throws IOException {
		ImportConfig.getCsvReader(csvMapper, AccountImportDto.class)
				.<AccountImportDto>readValues(csv.getInputStream()).readAll()
				.forEach(accountService::createAccount);
		logger.action("Felhasználói adatok importálva");
		model.addAttribute("accountImportMsg", "Adatok importálva");

		return "export";
	}

	@GetMapping("/export/transactions")
	@ResponseBody
	public String exportTransactions(HttpServletResponse response) throws IOException {
		response.setContentType("text/csv");
		response.setHeader("Content-Disposition", "attachment; filename=\"paybasz-transactions-"
				+ AppUtil.DATE_TIME_FILE_FORMATTER.format(System.currentTimeMillis()) + ".csv\"");

		String csvExport = transactionService.exportTransactions();
		logger.action("Tranzakciók kiexportálva");
		return csvExport;
	}

	@GetMapping("/export/logs")
	@ResponseBody
	public String exportLogs(HttpServletResponse response) throws IOException {
		response.setContentType("text/csv");
		response.setHeader("Content-Disposition", "attachment; filename=\"paybasz-logs-"
				+ AppUtil.DATE_TIME_FILE_FORMATTER.format(System.currentTimeMillis()) + ".csv\"");

		String csvExport = logger.exportLogs();
		logger.action("Eseménynapló kiexportálva");
		return csvExport;
	}

	@GetMapping("/export/items")
	@ResponseBody
	public String exportItems(HttpServletResponse response) throws IOException {
		response.setContentType("text/csv");
		response.setHeader("Content-Disposition", "attachment; filename=\"paybasz-items-"
				+ AppUtil.DATE_TIME_FILE_FORMATTER.format(System.currentTimeMillis()) + ".csv\"");

		String csvExport = itemService.exportItems();
		logger.action("Termék lista kiexportálva");
		return csvExport;
	}

	@Transactional
	@PostMapping("/import/items")
	public String importItems(Model model, @RequestParam("csv") MultipartFile csv) throws IOException {
		ImportConfig.getCsvReader(csvMapper, ItemImportDto.class)
				.<ItemImportDto>readValues(csv.getInputStream()).readAll()
				.forEach(itemService::createItem);
		logger.action("Felhasználói adatok importálva");
		model.addAttribute("accountImportMsg", "Adatok importálva");

		return "export";
	}


	@GetMapping("/export/tokens")
	@ResponseBody
	public String exportTokens(HttpServletResponse response) throws IOException {
		response.setContentType("text/csv");
		response.setHeader("Content-Disposition", "attachment; filename=\"paybasz-tokens-"
				+ AppUtil.DATE_TIME_FILE_FORMATTER.format(System.currentTimeMillis()) + ".csv\"");

		String csvExport = itemTokenService.exportTokens();
		logger.action("Tokenek kiexportálva");
		return csvExport;
	}

	@Transactional
	@PostMapping("/import/tokens")
	public String importTokens(Model model, @RequestParam("csv") MultipartFile csv) throws IOException {
		ImportConfig.getCsvReader(csvMapper, ItemTokenImportDto.class)
				.<ItemTokenImportDto>readValues(csv.getInputStream()).readAll()
				.forEach(itemTokenService::setItemToken);
		logger.action("Felhasználói adatok importálva");
		model.addAttribute("accountImportMsg", "Adatok importálva");

		return "export";
	}
}
