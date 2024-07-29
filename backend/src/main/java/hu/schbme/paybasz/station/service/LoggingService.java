package hu.schbme.paybasz.station.service;

import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import hu.schbme.paybasz.station.config.ImportConfig;
import hu.schbme.paybasz.station.dto.LogSeverity;
import hu.schbme.paybasz.station.dto.LoggingEntry;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.StringWriter;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

@Service
public class LoggingService {

	@Getter
	private final List<LoggingEntry> entries = Collections.synchronizedList(new LinkedList<>());
	private final CsvMapper csvMapper;

	public LoggingService(CsvMapper csvMapper) {
		this.csvMapper = csvMapper;
	}

	public void note(String message) {
		entries.add(new LoggingEntry(System.currentTimeMillis(), LogSeverity.NOTE, message));
	}

	public void success(String message) {
		entries.add(new LoggingEntry(System.currentTimeMillis(), LogSeverity.SUCCESS, message));
	}

	public void failure(String message) {
		entries.add(new LoggingEntry(System.currentTimeMillis(), LogSeverity.FAILURE, message));
	}

	public void error(String message) {
		entries.add(new LoggingEntry(System.currentTimeMillis(), LogSeverity.ERROR, message));
	}

	public void action(String message) {
		entries.add(new LoggingEntry(System.currentTimeMillis(), LogSeverity.ACTION, message));
	}

	public void serverInfo(String message) {
		entries.add(new LoggingEntry(System.currentTimeMillis(), LogSeverity.SERVER_INFO, message));
	}

	public void serverWarning(String message) {
		entries.add(new LoggingEntry(System.currentTimeMillis(), LogSeverity.SERVER_WARNING, message));
	}

	public String exportLogs() throws IOException {
		var writer = new StringWriter();
		ImportConfig.getCsvWriter(csvMapper, LoggingEntry.class)
				.writeValues(writer)
				.writeAll(entries)
				.close();
		return writer.toString().replace("&nbsp;", " ");
	}

}
