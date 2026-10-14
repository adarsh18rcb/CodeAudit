package com.aicodereview.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${app.ai-engine.base-url}")
    private String aiEngineBaseUrl;

    @Bean
    public WebClient aiEngineWebClient() {
        return WebClient.builder()
                .baseUrl(aiEngineBaseUrl)
                .codecs(c -> c.defaultCodecs().maxInMemorySize(10 * 1024 * 1024))
                .build();
    }
}
