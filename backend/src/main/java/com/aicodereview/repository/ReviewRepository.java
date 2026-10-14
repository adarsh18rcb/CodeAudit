package com.aicodereview.repository;

import com.aicodereview.model.Repository;
import com.aicodereview.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRepositoryOrderByCreatedAtDesc(Repository repository);
    List<Review> findByRepository_User_IdOrderByCreatedAtDesc(Long userId);
}
