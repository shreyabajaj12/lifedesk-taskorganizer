package com.lifedesk.quote.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class QuoteResponse {
    private String text;
    private String author;
}
