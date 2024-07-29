package hu.schbme.paybasz.station.config;

import com.fasterxml.jackson.databind.ObjectReader;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvParser;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class ImportConfig {

	public static <T> ObjectReader getCsvReader(CsvMapper mapper, Class<T> clazz) {
		var schema = mapper.schemaFor(clazz)
				.withColumnSeparator(';')
				.withoutHeader();
		return mapper.readerWithSchemaFor(clazz).with(schema);
	}

	public static <T> ObjectWriter getCsvWriter(CsvMapper mapper, Class<T> clazz) {
		var schema = mapper.schemaFor(clazz)
				.withColumnSeparator(';')
				.withHeader();
		return mapper.writer(schema);
	}

	@Bean
	CsvMapper csvMapper() {
		return CsvMapper.builder()
				.enable(CsvParser.Feature.TRIM_SPACES)
				.enable(CsvParser.Feature.ALLOW_TRAILING_COMMA)
				.enable(CsvParser.Feature.FAIL_ON_MISSING_COLUMNS)
				.build();
	}

}
