package hu.schbme.paybasz.station.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemTokenView {

	private Integer itemTokenId;
	private Integer itemId;
	private String itemName;
	private Integer userId;
	private String accountName;
	private Integer count;

}
