package hu.schbme.paybasz.station.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemTokenDto {

	private Integer id;
	private Integer itemId;
	private Integer userId;
	private Integer count;

}
