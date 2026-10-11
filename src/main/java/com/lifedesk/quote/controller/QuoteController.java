package com.lifedesk.quote.controller;

import com.lifedesk.quote.dto.QuoteResponse;
import com.lifedesk.quote.service.QuoteService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/quotes")
public class QuoteController {

    private final QuoteService quoteService;

    public QuoteController(QuoteService quoteService) {
        this.quoteService = quoteService;
    }

    @GetMapping("/random")
    public QuoteResponse getRandomQuote() {
        return quoteService.getRandomQuote();
    }
}