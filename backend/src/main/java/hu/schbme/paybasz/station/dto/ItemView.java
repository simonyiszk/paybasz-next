package hu.schbme.paybasz.station.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemView {
	Integer id;
	String name;
	Integer quantity;
	String code;
	String abbreviation;
	Integer price;
}
