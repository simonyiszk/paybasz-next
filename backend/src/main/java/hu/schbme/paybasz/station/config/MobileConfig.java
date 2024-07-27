package hu.schbme.paybasz.station.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "paybasz.mobile")
public class MobileConfig {

	private boolean showUploadTab = true;
	private boolean showPayTab = true;
	private boolean showBalanceTab = true;
	private boolean showCartTab = true;
	private boolean showTokenTab = true;

}
