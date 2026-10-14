package com.aicodereview.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repository_id", nullable = false)
    @JsonIgnore
    private Repository repository;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.PENDING;

    private Double score;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "completed_at")
    private Instant completedAt;

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Issue> issues = new java.util.ArrayList<>();

    @OneToOne(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private ReviewMetrics metrics;

    public enum Status {
        PENDING, RUNNING, COMPLETED, FAILED
    }
}
