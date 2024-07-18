package hu.schbme.paybasz.station.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BalanceResponse {

	private String username;
	private String email;
	private Integer balance;
	private Integer maxLoan;

}
