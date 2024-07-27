package hu.schbme.paybasz.station.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemTokenView {

	private Integer itemTokenId;
	private String itemName;
	private String accountName;
	private Integer count;

}
