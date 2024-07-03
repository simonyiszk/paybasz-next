package hu.schbme.paybasz.station.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class AppResponse {
	final boolean isUploader;
	final List<ItemView> items;
}
