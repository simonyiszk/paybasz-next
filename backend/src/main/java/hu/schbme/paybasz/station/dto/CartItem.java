package hu.schbme.paybasz.station.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {

	@NotNull
	private Integer id;

	@Positive
	@NotNull
	private Integer quantity;

}
