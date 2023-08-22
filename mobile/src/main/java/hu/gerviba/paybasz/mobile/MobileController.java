package hu.gerviba.paybasz.mobile;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class MobileController {

    @GetMapping("/")
    public String index(Model model) {
        return "index";
    }

    @GetMapping("/{terminalName}/{token}")
    public String index(Model model, @PathVariable String terminalName, @PathVariable String token) {
        model.addAttribute("gatewayName", terminalName);
        model.addAttribute("token", token);
        return "mobile";
    }


}
