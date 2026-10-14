package com.aicodereview.controller;

import com.aicodereview.dto.RepositoryRequest;
import com.aicodereview.model.Repository;
import com.aicodereview.service.RepositoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/repositories")
@RequiredArgsConstructor
public class RepositoryController {
    private final RepositoryService repositoryService;
    @PostMapping public ResponseEntity<Repository> addRepository(@Valid @RequestBody RepositoryRequest request, Authentication auth) { return ResponseEntity.ok(repositoryService.addRepository(auth.getName(), request)); }
    @GetMapping public ResponseEntity<List<Repository>> listRepositories(Authentication auth) { return ResponseEntity.ok(repositoryService.listRepositories(auth.getName())); }
    @GetMapping("/{id}") public ResponseEntity<Repository> getRepository(@PathVariable Long id, Authentication auth) { return ResponseEntity.ok(repositoryService.getRepository(id, auth.getName())); }
    @DeleteMapping("/{id}") public ResponseEntity<Void> deleteRepository(@PathVariable Long id, Authentication auth) { repositoryService.deleteRepository(id, auth.getName()); return ResponseEntity.noContent().build(); }
}
