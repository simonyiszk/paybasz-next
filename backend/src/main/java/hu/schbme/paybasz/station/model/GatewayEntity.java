package hu.schbme.paybasz.station.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "gateways")
public class GatewayEntity {

    public static final String TYPE_PHYSICAL = "physical";
    public static final String TYPE_WEB = "web";
    public static final String TYPE_MOBILE = "mobile";
    public static final String TYPE_UPLOADER = "uploader";

    @Id
    @Column
    @GeneratedValue
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String token;

    @Column(nullable = false)
    private String type;

    @Column
    private Integer money;

    public GatewayEntity(String name, String token, String type, Integer money) {
        this.name = name;
        this.token = token;
        this.type = type;
        this.money = money;
    }

    public void upload(Integer append) {
        money += append;
    }
}
