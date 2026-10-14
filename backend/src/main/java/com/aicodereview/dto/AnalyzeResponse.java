package com.aicodereview.dto;

import lombok.Data;

import java.util.List;

@Data
public class AnalyzeResponse {
    private List<IssueDto> issues;
    private Double score;
    private Integer bugs;
    private Integer securityIssues;
    private Integer codeSmells;
    private Double complexityScore;
    private Double maintainabilityScore;
}
