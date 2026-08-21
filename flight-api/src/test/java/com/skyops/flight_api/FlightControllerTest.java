package com.skyops.flight_api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(FlightController.class)
class FlightControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void flightsReturnsTheBoard() throws Exception {
		mockMvc.perform(get("/api/flights"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.length()").value(3))
			.andExpect(jsonPath("$[0].flight").value("EK202"))
			.andExpect(jsonPath("$[0].status").value("ON TIME"));
	}

	@Test
	void chaosDefaultsToNoDelay() throws Exception {
		mockMvc.perform(get("/api/flights/chaos"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.slept").value("0ms"));
	}

	@Test
	void chaosSleepsForTheRequestedMillis() throws Exception {
		mockMvc.perform(get("/api/flights/chaos").param("ms", "50"))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.slept").value("50ms"));
	}
}
