package com.IFSP.Prototipo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class ConfigController {
    
    @Value("${gemini.api.key:}")
    private String geminiApiKey;
    
    @Value("${google.maps.key:}")
    private String googleMapsKey;
    
    //MUDE O ENDPOINT PARA EVITAR CONFLITO
    @GetMapping("/config/keys")
    public Map<String, String> getApiKeys() {  // Mude o nome do método
        Map<String, String> config = new HashMap<>();
        config.put("geminiKey", geminiApiKey);
        config.put("googleMapsKey", googleMapsKey);
        config.put("status", "active");
        return config;
    }
}