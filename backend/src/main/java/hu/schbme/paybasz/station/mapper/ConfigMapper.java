package hu.schbme.paybasz.station.mapper;

import hu.schbme.paybasz.station.config.MobileConfig;
import hu.schbme.paybasz.station.dto.MobileConfigView;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface ConfigMapper {
	ConfigMapper INSTANCE = Mappers.getMapper(ConfigMapper.class);

	MobileConfigView toView(MobileConfig mobileConfig);
}
