package hu.schbme.paybasz.station.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import hu.schbme.paybasz.station.serialize.CsvSerializable;
import hu.schbme.paybasz.station.serialize.CsvSerializer;

@JsonSerialize(using = CsvSerializer.class)
public enum AddCardStatus implements CsvSerializable {
	ACCEPTED,
	INTERNAL_ERROR,
	USER_NOT_FOUND,
	ALREADY_ADDED,
	USER_HAS_CARD,
	UNAUTHORIZED_TERMINAL;

	@Override
	public String csvSerialize() {
		return name();
	}

}
