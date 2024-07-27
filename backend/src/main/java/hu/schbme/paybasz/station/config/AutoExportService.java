package hu.schbme.paybasz.station.config;

import hu.schbme.paybasz.station.service.AccountService;
import hu.schbme.paybasz.station.service.ItemService;
import hu.schbme.paybasz.station.service.LoggingService;
import hu.schbme.paybasz.station.service.TransactionService;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

@Slf4j
@Configuration
@EnableScheduling
@RequiredArgsConstructor
public class AutoExportService implements CommandLineRunner {

	private final TransactionService transactionService;
	private final LoggingService logger;
	private final AccountService accountService;
	private final ItemService itemService;

	@Value("${server.port}")
	private int port;

	@PostConstruct
	public void onStarted() {
		logger.serverInfo("A backend szolgáltatás elindult. Az esemény napló mindig az aktuális futást mutatja.");
	}

	@Override
	public void run(String... args) {
		System.out.println("|");
		System.out.println("| Admin panel available on: http://127.0.0.1:" + port + "/admin/");
		System.out.println("|");
	}

	@Scheduled(fixedRate = 1000 * 60 * 10)
	public void autoSave10m() {
		save("10m");
	}

	@Scheduled(fixedRate = 1000 * 60 * 60)
	public void autoSave1h() {
		save("1h");
	}

	@Scheduled(fixedRate = 1000 * 60 * 30)
	public void autoSave30mAndPersist() {
		save("30m-" + AppUtil.DATE_TIME_FILE_FORMATTER.format(System.currentTimeMillis()));
	}

	@PreDestroy
	public void autoSaveOnStop() {
		save("stop-at-" + AppUtil.DATE_TIME_FILE_FORMATTER.format(System.currentTimeMillis()));
	}

	private void save(String tag) {
		var saves = new File("saves");
		saves.mkdir();
		try {
			var filePattern = "saves/autosave-%s-%s.csv";
			Files.writeString(Path.of(String.format(filePattern, tag, "accounts")), accountService.exportAccounts());
			Files.writeString(Path.of(String.format(filePattern, tag, "transactions")), transactionService.exportTransactions());
			Files.writeString(Path.of(String.format(filePattern, tag, "logs")), logger.exportLogs());
			Files.writeString(Path.of(String.format(filePattern, tag, "items")), itemService.exportItems());
			log.info("Auto ({}) log saved to '{}' folder", tag, saves.getAbsolutePath());
		} catch (IOException e) {
			log.error("Exception happened during {} auto-save", tag, e);
		}
	}

}
