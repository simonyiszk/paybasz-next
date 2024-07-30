package hu.schbme.paybasz.station.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({"userId", "itemId", "amount"})
public class ItemTokenImportDto {

	private Integer userId;
	private Integer itemId;
	private Integer amount;

}
