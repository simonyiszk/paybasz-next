package hu.schbme.paybasz.station.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({"name", "amount", "price", "abbreviation"})
public class ItemImportDto {

	private String name;
	private Integer amount;
	private Integer price;
	private String abbreviation;

}
