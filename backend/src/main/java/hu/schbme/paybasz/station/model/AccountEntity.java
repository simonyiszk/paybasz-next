package hu.schbme.paybasz.station.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "accounts")
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({"id", "name", "email", "phone", "card", "balance", "minimumBalance", "allowed", "comment"})
public class AccountEntity {

	@Id
	@Column
	@GeneratedValue
	private Integer id;

	@Column(nullable = false)
	private String name;

	@Column(nullable = false)
	private String card;

	@Column(nullable = false)
	private String phone;

	@Column(nullable = false)
	private String email;

	@Column(nullable = false)
	private int balance;

	@Column(nullable = false)
	private int minimumBalance;

	@Column(nullable = false)
	private boolean allowed;

	@Column(nullable = false)
	private String comment;

	@Transient
	@JsonIgnore
	public int getMaxLoan() {
		return -minimumBalance;
	}

	@Transient
	@JsonIgnore
	public String getFormattedCard() {
		return card.length() < 9 ? card : card.substring(0, 9);
	}

}
