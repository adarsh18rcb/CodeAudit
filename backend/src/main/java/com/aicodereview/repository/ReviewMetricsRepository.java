package com.aicodereview.repository;

import com.aicodereview.model.ReviewMetrics;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewMetricsRepository extends JpaRepository<ReviewMetrics, Long> {
}
