package hu.schbme.paybasz.station.controller;

import hu.schbme.paybasz.station.dto.*;
import hu.schbme.paybasz.station.service.GatewayService;
import hu.schbme.paybasz.station.service.LoggingService;
import hu.schbme.paybasz.station.service.TransactionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.*;

@SuppressWarnings("SpellCheckingInspection")
@Slf4j
@RestController
@RequestMapping("/mapi")
//@Profile("mobile")
@CrossOrigin(origins = "*", allowedHeaders = "*", allowCredentials = "true")
public class MobileController extends Api2Controller {

    @Autowired
    private TransactionService system;

    @Autowired
    private GatewayService gateways;

    @Autowired
    private LoggingService logger;

    @PostMapping("/upload/{gatewayName}")
    public PaymentStatus upload(@PathVariable String gatewayName, @RequestBody PaymentRequest request) {
        if (!gateways.authorizeUploaderGateway(gatewayName, request.getGatewayCode()))
            return PaymentStatus.UNAUTHORIZED_TERMINAL;
        gateways.updateLastUsed(gatewayName);
        if (request.getAmount() < 0)
            return PaymentStatus.INTERNAL_ERROR;

        try {
            return system.addMoneyToCard(request.getCard().toUpperCase(), request.getAmount(),
                    request.getDetails() == null ? "" : request.getDetails(),
                    gatewayName);
        } catch (Exception e) {
            log.error("Error during proceeding payment", e);
            logger.failure("Sikertelen fizetés: belső szerver hiba");
            return PaymentStatus.INTERNAL_ERROR;
        }
    }

    @PostMapping("/validate-uploader/{gatewayName}")
    public ValidationStatus validateUploader(@PathVariable String gatewayName, @RequestBody ValidateRequest request) {
        boolean valid = gateways.authorizeUploaderGateway(gatewayName, request.getGatewayCode());
        log.info("Gateways auth uploader request: " + gatewayName + " (" + (valid ? "OK" : "INVALID") + ")");
        if (valid) {
            gateways.updateLastUsed(gatewayName);
            logger.action("Feltöltő terminál authentikáció sikeres: <color>" + gatewayName + "</color>");
        } else {
            logger.failure("Feltöltő terminál authentikáció sikertelen: <color>" + gatewayName + "</color>");
        }
        return valid ? ValidationStatus.OK : ValidationStatus.INVALID;
    }

    @PostMapping("/free-beer/{gatewayName}")
    public PaymentStatus freeBeer(@PathVariable String gatewayName, @RequestBody PaymentRequest request) {
        if (!gateways.authorizeUploaderGateway(gatewayName, request.getGatewayCode()))
            return PaymentStatus.UNAUTHORIZED_TERMINAL;
        gateways.updateLastUsed(gatewayName);

        try {
            return system.getBeer(request.getCard().toUpperCase(), request.getDetails() == null ? "" : request.getDetails(),
                    gatewayName);
        } catch (Exception e) {
            log.error("Error during proceeding free beer", e);
            logger.failure("Sikertelen ingyen sör: belső szerver hiba");
            return PaymentStatus.INTERNAL_ERROR;
        }
    }
}
