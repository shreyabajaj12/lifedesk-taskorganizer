package com.lifedesk.quote.service;


//import com.fasterxml.jackson.databind.ObjectMapper;
import com.lifedesk.quote.dto.QuoteResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
public class QuoteService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public QuoteService() {
        this.restClient = RestClient.create();
        this.objectMapper = new ObjectMapper();
    }

    public QuoteResponse getRandomQuote() {

        String response = restClient
                .get()
                .uri("https://zenquotes.io/api/random")
                .retrieve()
                .body(String.class);

        try {
            JsonNode data = objectMapper.readTree(response);

            String text = data.get(0).get("q").asText();
            String author = data.get(0).get("a").asText();

            return new QuoteResponse(text, author);

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse quote response", e);
        }
    }
}