package hu.schbme.paybasz.station.mapper;

import hu.schbme.paybasz.station.dto.UserListItem;
import hu.schbme.paybasz.station.model.AccountEntity;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface AccountMapper {
	AccountMapper INSTANCE = Mappers.getMapper(AccountMapper.class);

	UserListItem toListItem(AccountEntity entity);
}
