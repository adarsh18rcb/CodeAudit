package com.aicodereview.service;

import com.aicodereview.dto.AnalyzeRequest;
import com.aicodereview.dto.AnalyzeResponse;
import com.aicodereview.dto.IssueDto;
import com.aicodereview.model.*;
import com.aicodereview.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final GitHubService gitHubService;
    private final WebClient aiEngineWebClient;

    public Review runReview(Repository repository) {
        Map<String, String> files = gitHubService.fetchRepositoryFiles(repository.getGithubUrl(), 15);
        return runReviewWithFiles(repository, files);
    }

    public Review runReviewWithFiles(Repository repository, Map<String, String> files) {
        Review review = reviewRepository.save(Review.builder().repository(repository).status(Review.Status.RUNNING).build());
        try {
            AnalyzeRequest request = new AnalyzeRequest();
            request.setFiles(files);
            request.setLanguage(repository.getLanguage());
            AnalyzeResponse analysis = aiEngineWebClient.post().uri("/api/analyze").bodyValue(request).retrieve().bodyToMono(AnalyzeResponse.class).block();
            if (analysis == null) throw new RuntimeException("AI engine returned no response");
            final Review reviewRef = review;
            List<Issue> issues = new java.util.ArrayList<>(analysis.getIssues().stream().map(dto -> mapIssue(dto, reviewRef)).toList());
            ReviewMetrics metrics = ReviewMetrics.builder().review(review).bugs(analysis.getBugs()).securityIssues(analysis.getSecurityIssues()).codeSmells(analysis.getCodeSmells()).complexityScore(analysis.getComplexityScore()).maintainabilityScore(analysis.getMaintainabilityScore()).build();
            review.getIssues().clear();
            review.getIssues().addAll(issues);
            review.setMetrics(metrics);
            review.setScore(analysis.getScore());
            review.setStatus(Review.Status.COMPLETED);
            review.setCompletedAt(Instant.now());
        } catch (Exception e) {
            log.error("Review failed for repository {}: {}", repository.getId(), e.getMessage(), e);
            review.setStatus(Review.Status.FAILED);
            review.setCompletedAt(Instant.now());
        }
        return reviewRepository.save(review);
    }

    private Issue mapIssue(IssueDto dto, Review review) {
        return Issue.builder().review(review).fileName(dto.getFileName()).lineNumber(dto.getLineNumber())
                .severity(Issue.Severity.valueOf(dto.getSeverity().toUpperCase()))
                .category(Issue.Category.valueOf(dto.getCategory().toUpperCase()))
                .description(dto.getDescription()).suggestion(dto.getSuggestion()).correctedCode(dto.getCorrectedCode())
                .complexity(dto.getComplexity()).confidence(dto.getConfidence()).build();
    }

    public List<Review> listReviews(Repository repository) { return reviewRepository.findByRepositoryOrderByCreatedAtDesc(repository); }
    public Review getReview(Long id) { return reviewRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found")); }
}
