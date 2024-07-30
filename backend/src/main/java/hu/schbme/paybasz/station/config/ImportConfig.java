package hu.schbme.paybasz.station.config;

import com.fasterxml.jackson.databind.ObjectReader;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvParser;
import hu.schbme.paybasz.station.serialize.CsvBooleanOneZeroDeserializer;
import hu.schbme.paybasz.station.serialize.CsvBooleanOneZeroSerializer;
import lombok.Getter;
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
	CsvMapperProvider csvMapper() {
		var booleanSerializerModule = new SimpleModule()
				.addSerializer(Boolean.class, new CsvBooleanOneZeroSerializer())
				.addDeserializer(Boolean.class, new CsvBooleanOneZeroDeserializer());
		var csvMapper = CsvMapper.builder()
				.enable(CsvParser.Feature.TRIM_SPACES)
				.enable(CsvParser.Feature.ALLOW_TRAILING_COMMA)
				.enable(CsvParser.Feature.FAIL_ON_MISSING_COLUMNS)
				.addModule(booleanSerializerModule)
				.build();
		return new CsvMapperProvider(csvMapper);
	}

	// This class is needed because CsvMapper is an ObjectMapper, and it would override the default json serializer in the controllers
	@Getter
	@RequiredArgsConstructor
	public static class CsvMapperProvider {

		private final CsvMapper csvMapper;

	}

}
