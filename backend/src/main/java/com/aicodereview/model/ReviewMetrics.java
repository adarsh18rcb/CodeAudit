package com.aicodereview.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "review_metrics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewMetrics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false, unique = true)
    @JsonIgnore
    private Review review;

    private Integer bugs;

    @Column(name = "security_issues")
    private Integer securityIssues;

    @Column(name = "code_smells")
    private Integer codeSmells;

    @Column(name = "complexity_score")
    private Double complexityScore;

    @Column(name = "maintainability_score")
    private Double maintainabilityScore;
}
