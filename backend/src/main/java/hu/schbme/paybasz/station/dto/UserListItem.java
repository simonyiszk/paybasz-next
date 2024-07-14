package hu.schbme.paybasz.station.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserListItem {

	private String name;
	private String email;
	private boolean hasCardAssigned;
	private Integer id;

}
