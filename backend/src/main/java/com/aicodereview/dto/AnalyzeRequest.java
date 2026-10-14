package com.aicodereview.dto;

import lombok.Data;

import java.util.Map;

@Data
public class AnalyzeRequest {
    /** Map of relative file path -> file source contents to analyze. */
    private Map<String, String> files;
    private String language;
}
