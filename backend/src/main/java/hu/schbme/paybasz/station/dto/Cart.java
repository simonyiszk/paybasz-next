package hu.schbme.paybasz.station.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Cart {

	@NotNull
	private List<@NotNull @Valid CartItem> items;

	@NotNull
	private List<@NotNull @Valid CustomCartItem> customItems;

}
