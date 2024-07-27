package hu.schbme.paybasz.station.controller;

import hu.schbme.paybasz.station.config.AppUtil;
import hu.schbme.paybasz.station.service.AccountService;
import hu.schbme.paybasz.station.service.ItemService;
import hu.schbme.paybasz.station.service.LoggingService;
import hu.schbme.paybasz.station.service.TransactionService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

import static hu.schbme.paybasz.station.config.AppUtil.formatNumber;

@SuppressWarnings("SpellCheckingInspection")
@Slf4j
@Controller
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

	public static final String DUPLICATE_CARD_ERROR = "DUPLICATE_CARD";
	public static String UPLOAD_DIRECTORY = "import";
	private final TransactionService transactionService;
	private final LoggingService logger;
	private final AccountService accountService;
	private final ItemService itemService;

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
	public String exportAccounts(HttpServletResponse response) {
		response.setContentType("text/csv");
		response.setHeader("Content-Disposition", "attachment; filename=\"paybasz-accounts-"
				+ AppUtil.DATE_TIME_FILE_FORMATTER.format(System.currentTimeMillis()) + ".csv\"");

		String csvExport = accountService.exportAccounts();
		logger.action("Felhasználók kiexportálva");
		return csvExport;
	}

	@GetMapping("/export/transactions")
	@ResponseBody
	public String exportTransactions(HttpServletResponse response) {
		response.setContentType("text/csv");
		response.setHeader("Content-Disposition", "attachment; filename=\"paybasz-transactions-"
				+ AppUtil.DATE_TIME_FILE_FORMATTER.format(System.currentTimeMillis()) + ".csv\"");

		String csvExport = transactionService.exportTransactions();
		logger.action("Tranzakciók kiexportálva");
		return csvExport;
	}

	@GetMapping("/export/logs")
	@ResponseBody
	public String exportLogs(HttpServletResponse response) {
		response.setContentType("text/csv");
		response.setHeader("Content-Disposition", "attachment; filename=\"paybasz-logs-"
				+ AppUtil.DATE_TIME_FILE_FORMATTER.format(System.currentTimeMillis()) + ".csv\"");

		String csvExport = logger.exportLogs();
		logger.action("Eseménynapló kiexportálva");
		return csvExport;
	}

	@GetMapping("/export/items")
	@ResponseBody
	public String exportItems(HttpServletResponse response) {
		response.setContentType("text/csv");
		response.setHeader("Content-Disposition", "attachment; filename=\"paybasz-items-"
				+ AppUtil.DATE_TIME_FILE_FORMATTER.format(System.currentTimeMillis()) + ".csv\"");

		String csvExport = itemService.exportItems();
		logger.action("Termék lista kiexportálva");
		return csvExport;
	}

	@PostMapping("/import")
	public String importAccount(Model model, @RequestParam("csv") MultipartFile csv) throws IOException {
		(new File(UPLOAD_DIRECTORY)).mkdir();
		Path path = Path.of(UPLOAD_DIRECTORY + "/" + csv.getOriginalFilename());
		if (Files.exists(path)) {
			model.addAttribute("msg", "Ezzel a névvel már létezik fájl");
			return "export";
		}
		Path file = Files.createFile(path);
		Files.copy(csv.getInputStream(), file, StandardCopyOption.REPLACE_EXISTING);

		if (Files.exists(file)) {
			try (final var lines = Files.lines(file)) {
				lines.map(it -> it.split(";"))
						// format: name; email; mobile; amount
						.forEach(it -> accountService.createAccount(it[0].trim(), it[1].trim(), it[2].trim(), "", Integer.parseInt(it[3].trim()), 0, true));
			}
			logger.action("Felhasználói adatok importálva");
			model.addAttribute("msg", "Adatok importálva");
		}
		return "export";
	}
}
