package com.aicodereview.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "repositories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Repository {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "repository_name", nullable = false)
    private String repositoryName;

    private String language;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy = "repository", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    @JsonIgnore
    private List<Review> reviews = new java.util.ArrayList<>();
}
