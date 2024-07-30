package hu.schbme.paybasz.station.dto;

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
public class ClaimTokenRequest extends AuthorizedApiRequest {

	@NotBlank
	private String card;

	@NotNull
	private Integer itemId;

}
