package hu.schbme.paybasz.station.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CheckoutRequest extends AuthorizedApiRequest {

	@NotBlank
	private String card;

	@NotNull
	@Valid
	private Cart cart;

}
