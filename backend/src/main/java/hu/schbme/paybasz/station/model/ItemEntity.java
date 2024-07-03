package hu.schbme.paybasz.station.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "items")
@NoArgsConstructor
@AllArgsConstructor
public class ItemEntity {

	@Id
	@Column
	@GeneratedValue
	private Integer id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private Integer quantity;

	@Column(nullable = false)
	private String code;

	@Column(nullable = false)
	private String abbreviation;

	@Column(nullable = false)
	private Integer price;

	@Column(nullable = false)
	private boolean active;

}
