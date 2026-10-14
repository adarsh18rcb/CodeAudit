package com.aicodereview.repository;

import com.aicodereview.model.Issue;
import com.aicodereview.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByReviewOrderBySeverityDesc(Review review);
    List<Issue> findByReviewId(Long reviewId);
}
