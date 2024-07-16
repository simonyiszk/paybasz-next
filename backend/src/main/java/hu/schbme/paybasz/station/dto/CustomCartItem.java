package hu.schbme.paybasz.station.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomCartItem {

	@NotBlank
	private String name;

	@Positive
	@NotNull
	private Integer price;

	@Positive
	@NotNull
	private Integer quantity;

}
