package hu.schbme.paybasz.station.serialize;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;

public class CsvSerializer extends JsonSerializer<CsvSerializable> {

	@Override
	public void serialize(CsvSerializable o,
						  JsonGenerator jsonGenerator,
						  SerializerProvider serializerProvider
	) throws IOException {
		jsonGenerator.writeRaw(o.csvSerialize());
	}

}
