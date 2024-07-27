package hu.schbme.paybasz.station.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "item_tokens", uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "item_id"})})
@NoArgsConstructor
@AllArgsConstructor
public class ItemTokenEntity {

	@Id
	@Column
	@GeneratedValue
	private Long id;

	@Column(nullable = false, name = "user_id")
	private Long userId; // no Hibernate magic needed

	@Column(nullable = false, name = "item_id")
	private Long itemId; // no Hibernate magic needed

	@Column(nullable = false)
	private Integer count;
}
