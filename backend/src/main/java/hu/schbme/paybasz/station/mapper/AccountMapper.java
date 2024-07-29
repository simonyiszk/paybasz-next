package hu.schbme.paybasz.station.mapper;

import hu.schbme.paybasz.station.dto.*;
import hu.schbme.paybasz.station.model.AccountEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

@Mapper
public interface AccountMapper {
	AccountMapper INSTANCE = Mappers.getMapper(AccountMapper.class);

	@Named("isNotEmpty")
	static boolean isNotEmpty(String text) {
		return !text.isEmpty();
	}

	@Mapping(source = "card", target = "hasCardAssigned", qualifiedByName = "isNotEmpty")
	UserListItem toListItem(AccountEntity entity);

	@Mapping(source = "name", target = "username")
	BalanceResponse toBalance(AccountEntity entity);

	IdSelectEntry toIdSelectEntry(AccountEntity entity);

}
