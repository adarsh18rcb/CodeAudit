package com.aicodereview.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "issues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    @JsonIgnore
    private Review review;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "line_number")
    private Integer lineNumber;

    @Enumerated(EnumType.STRING)
    private Severity severity;

    @Enumerated(EnumType.STRING)
    private Category category;

    @Column(length = 2000)
    private String description;

    @Column(length = 2000)
    private String suggestion;

    @Column(name = "corrected_code", length = 4000)
    private String correctedCode;

    private String complexity;

    private Double confidence;

    public enum Severity {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public enum Category {
        BUG, SECURITY, PERFORMANCE, CODE_SMELL, MAINTAINABILITY, DOCUMENTATION
    }
}
