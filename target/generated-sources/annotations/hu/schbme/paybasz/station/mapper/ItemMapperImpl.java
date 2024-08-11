package hu.schbme.paybasz.station.mapper;

import hu.schbme.paybasz.station.dto.IdSelectEntry;
import hu.schbme.paybasz.station.dto.ItemView;
import hu.schbme.paybasz.station.model.ItemEntity;
import javax.annotation.processing.Generated;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-08-10T19:01:25+0200",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 21.0.4 (Eclipse Adoptium)"
)
public class ItemMapperImpl implements ItemMapper {

    @Override
    public ItemView toView(ItemEntity entity) {
        if ( entity == null ) {
            return null;
        }

        ItemView itemView = new ItemView();

        itemView.setId( entity.getId() );
        itemView.setName( entity.getName() );
        itemView.setQuantity( entity.getQuantity() );
        itemView.setCode( entity.getCode() );
        itemView.setAbbreviation( entity.getAbbreviation() );
        itemView.setPrice( entity.getPrice() );

        return itemView;
    }

    @Override
    public IdSelectEntry toIdSelectEntry(ItemEntity entity) {
        if ( entity == null ) {
            return null;
        }

        IdSelectEntry idSelectEntry = new IdSelectEntry();

        idSelectEntry.setId( entity.getId() );
        idSelectEntry.setName( entity.getName() );

        return idSelectEntry;
    }
}
