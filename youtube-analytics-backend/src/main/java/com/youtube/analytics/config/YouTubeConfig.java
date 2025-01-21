package com.youtube.analytics.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class YouTubeConfig {

    @Value("${youtube.api.key}")
    private String apiKey;

    public String getApiKey() {
        return apiKey;
    }
}
