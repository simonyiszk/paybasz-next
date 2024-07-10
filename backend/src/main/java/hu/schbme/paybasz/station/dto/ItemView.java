package hu.schbme.paybasz.station.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemView {
	private Integer id;
	private String name;
	private Integer quantity;
	private String code;
	private String abbreviation;
	private Integer price;
}
