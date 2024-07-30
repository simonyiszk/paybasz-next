package hu.schbme.paybasz.station.serialize;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;

public class CsvBooleanOneZeroSerializer extends JsonSerializer<Boolean> {
	@Override
	public void serialize(Boolean aBoolean, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
		jsonGenerator.writeString(Boolean.TRUE.equals(aBoolean) ? "1" : "0");
	}
}
