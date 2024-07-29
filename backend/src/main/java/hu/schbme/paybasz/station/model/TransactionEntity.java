package hu.schbme.paybasz.station.model;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import static hu.schbme.paybasz.station.config.AppUtil.DATE_TIME_FORMATTER;

@Data
@Entity
@Table(name = "transactions")
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({"id", "time", "formattedTime", "cardHolder", "receiver", "amount", "cardId", "paymentDescription", "message", "regular"})
public class TransactionEntity {

	@Id
	@Column
	@GeneratedValue
	private Long id;

	@Column(nullable = false)
	private long time;

	@Column(nullable = false)
	private String cardId;

	@Column(nullable = false)
	private Integer account;

	//sender
	@Column(nullable = false)
	private String cardHolder;

	@Column(nullable = false)
	private String paymentDescription;

	@Column(nullable = false)
	private int amount;

	@Column(nullable = false)
	private String message;

	@Column(nullable = false)
	private String gateway;

	@Column(nullable = false)
	private String receiver;

	@Column(nullable = false)
	private boolean regular;

	@Transient
	public String formattedTime() {
		return DATE_TIME_FORMATTER.format(getTime());
	}

}
