package com.aicodereview.repository;

import com.aicodereview.model.Repository;
import com.aicodereview.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RepositoryRepository extends JpaRepository<Repository, Long> {
    List<Repository> findByUserOrderByCreatedAtDesc(User user);
    List<Repository> findByUserIdOrderByCreatedAtDesc(Long userId);
}
