package hu.schbme.paybasz.station.mapper;

import hu.schbme.paybasz.station.dto.ItemTokenDto;
import hu.schbme.paybasz.station.model.ItemTokenEntity;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ItemTokenMapper {
	ItemTokenMapper INSTANCE = Mappers.getMapper(ItemTokenMapper.class);

	ItemTokenEntity toEntity(ItemTokenDto dto);

}
