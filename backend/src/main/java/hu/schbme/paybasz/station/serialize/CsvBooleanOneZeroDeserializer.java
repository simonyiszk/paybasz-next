package hu.schbme.paybasz.station.serialize;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;

public class CsvBooleanOneZeroDeserializer extends JsonDeserializer<Boolean> {
	@Override
	public Boolean deserialize(JsonParser jsonParser, DeserializationContext deserializationContext) throws IOException {
		if ("1".equals(jsonParser.getText())) {
			return Boolean.TRUE;
		}
		if ("0".equals(jsonParser.getText())) {
			return Boolean.FALSE;
		}
		return null;
	}
}
