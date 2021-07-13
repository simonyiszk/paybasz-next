package hu.schbme.paybasz.station.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddCardRequest {

    private String card;
    private Integer userId;
    private String gatewayCode;

}
