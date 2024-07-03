package hu.schbme.paybasz.station.mapper;

import hu.schbme.paybasz.station.dto.ItemView;
import hu.schbme.paybasz.station.model.ItemEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ItemMapper {
	ItemMapper INSTANCE = Mappers.getMapper(ItemMapper.class);

	@Mapping(source = "id", target = "id")
	@Mapping(source = "code", target = "code")
	@Mapping(source = "name", target = "name")
	@Mapping(source = "price", target = "price")
	@Mapping(source = "quantity", target = "quantity")
	@Mapping(source = "abbreviation", target = "abbreviation")
	ItemView toView(ItemEntity entity);
}
