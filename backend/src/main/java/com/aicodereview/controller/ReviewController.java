package com.aicodereview.controller;

import com.aicodereview.dto.PasteReviewRequest;
import com.aicodereview.model.Issue;
import com.aicodereview.model.Repository;
import com.aicodereview.model.Review;
import com.aicodereview.repository.IssueRepository;
import com.aicodereview.service.RepositoryService;
import com.aicodereview.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;
    private final RepositoryService repositoryService;
    private final IssueRepository issueRepository;
    @PostMapping public ResponseEntity<Review> createReview(@RequestBody Map<String, Long> body, Authentication auth) {
        Repository repository = repositoryService.getRepository(body.get("repositoryId"), auth.getName());
        return ResponseEntity.ok(reviewService.runReview(repository));
    }
    @PostMapping("/paste") public ResponseEntity<Review> createPasteReview(@Valid @RequestBody PasteReviewRequest request, Authentication auth) {
        Repository repository = repositoryService.createPasteRepository(auth.getName(), request.getRepositoryName(), request.getLanguage());
        String fileName = request.getFileName() == null || request.getFileName().isBlank() ? "snippet.txt" : request.getFileName();
        return ResponseEntity.ok(reviewService.runReviewWithFiles(repository, java.util.Map.of(fileName, request.getCode())));
    }
    @GetMapping public ResponseEntity<List<Review>> listReviews(@RequestParam Long repositoryId, Authentication auth) {
        Repository repository = repositoryService.getRepository(repositoryId, auth.getName());
        return ResponseEntity.ok(reviewService.listReviews(repository));
    }
    @GetMapping("/{id}") public ResponseEntity<Review> getReview(@PathVariable Long id) { return ResponseEntity.ok(reviewService.getReview(id)); }
    @GetMapping("/{id}/issues") public ResponseEntity<List<Issue>> getIssues(@PathVariable Long id) { return ResponseEntity.ok(issueRepository.findByReviewId(id)); }
}
