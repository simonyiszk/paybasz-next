package hu.schbme.paybasz.station.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MobileConfigView {

	private boolean showUploadTab;
	private boolean showPayTab;
	private boolean showBalanceTab;
	private boolean showSetCardTab;
	private boolean showCartTab;
	private boolean showTokenTab;
	private boolean showTransferTab;

}
