package hu.schbme.paybasz.station.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import hu.schbme.paybasz.station.serialize.CsvSerializeable;
import hu.schbme.paybasz.station.serialize.CsvSerializer;

@JsonSerialize(using = CsvSerializer.class)
public enum AddCardStatus implements CsvSerializeable {
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
