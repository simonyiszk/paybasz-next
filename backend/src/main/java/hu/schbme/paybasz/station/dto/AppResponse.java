package hu.schbme.paybasz.station.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

import hu.schbme.paybasz.station.model.ItemEntity;

@Data
@Builder
@AllArgsConstructor
public class AppResponse {
	final boolean isUploader;
	final List<ItemEntity> items;
}
