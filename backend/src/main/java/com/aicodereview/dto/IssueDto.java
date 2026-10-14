package com.aicodereview.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IssueDto {
    private String fileName;
    private Integer lineNumber;
    private String severity;
    private String category;
    private String description;
    private String suggestion;
    private String correctedCode;
    private String complexity;
    private Double confidence;
}
