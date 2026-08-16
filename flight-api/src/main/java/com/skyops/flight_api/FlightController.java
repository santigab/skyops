package com.skyops.flight_api;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    @GetMapping
    public List<Map<String, String>> flights() {
        return List.of(
            Map.of("flight", "EK202", "from", "DXB", "to", "JFK", "status", "ON TIME"),
            Map.of("flight", "EK001", "from", "DXB", "to", "LHR", "status", "BOARDING"),
            Map.of("flight", "EK412", "from", "DXB", "to", "SYD", "status", "DELAYED")
        );
    }

    // Endpoint para simular carga/fallos en fases posteriores
    @GetMapping("/chaos")
    public Map<String, String> chaos(@RequestParam(defaultValue = "0") int ms) throws InterruptedException {
        Thread.sleep(ms);
        return Map.of("slept", ms + "ms");
    }
}