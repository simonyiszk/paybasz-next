package hu.schbme.paybasz.station.dto;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import hu.schbme.paybasz.station.serialize.CsvSerializable;
import hu.schbme.paybasz.station.serialize.CsvSerializer;

@JsonSerialize(using = CsvSerializer.class)
public enum ValidationStatus implements CsvSerializable {
    OK,
    INVALID;

    @Override
    public String csvSerialize() {
        return name();
    }

}
