package hu.schbme.paybasz.station.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"name", "email", "mobile", "amount"})
public class AccountImportDto {

	private String name;
	private String email;
	private String mobile;
	private Integer amount;

}
