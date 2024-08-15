package hu.schbme.paybasz.station.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class AppResponse {

	private final boolean isUploader;
	private final boolean canReassignCards;
	private final boolean canTransferFunds;
	private final List<ItemView> items;
	private final MobileConfigView mobileConfig;

}
