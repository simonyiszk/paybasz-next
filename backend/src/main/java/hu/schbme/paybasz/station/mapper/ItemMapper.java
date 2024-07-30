package hu.schbme.paybasz.station.mapper;

import hu.schbme.paybasz.station.dto.IdSelectEntry;
import hu.schbme.paybasz.station.dto.ItemView;
import hu.schbme.paybasz.station.model.ItemEntity;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ItemMapper {
	ItemMapper INSTANCE = Mappers.getMapper(ItemMapper.class);

	ItemView toView(ItemEntity entity);

	IdSelectEntry toIdSelectEntry(ItemEntity entity);
}
