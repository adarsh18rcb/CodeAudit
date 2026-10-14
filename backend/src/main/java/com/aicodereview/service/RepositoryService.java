package com.aicodereview.service;

import com.aicodereview.dto.RepositoryRequest;
import com.aicodereview.model.Repository;
import com.aicodereview.model.User;
import com.aicodereview.repository.RepositoryRepository;
import com.aicodereview.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class RepositoryService {
    private final RepositoryRepository repositoryRepository;
    private final UserRepository userRepository;
    private static final Pattern GITHUB_URL_PATTERN = Pattern.compile("github\\.com/([\\w.-]+)/([\\w.-]+?)(\\.git)?/?$");

    public Repository addRepository(String userEmail, RepositoryRequest request) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        String repoName = request.getRepositoryName();
        if (repoName == null || repoName.isBlank()) {
            Matcher m = GITHUB_URL_PATTERN.matcher(request.getGithubUrl());
            repoName = m.find() ? m.group(1) + "/" + m.group(2) : request.getGithubUrl();
        }
        return repositoryRepository.save(Repository.builder().user(user).githubUrl(request.getGithubUrl()).repositoryName(repoName).language(request.getLanguage()).build());
    }

    public Repository createPasteRepository(String userEmail, String repositoryName, String language) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return repositoryRepository.save(Repository.builder().user(user).githubUrl(null).repositoryName(repositoryName == null || repositoryName.isBlank() ? "Pasted snippet" : repositoryName).language(language).build());
    }

    public List<Repository> listRepositories(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return repositoryRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Repository getRepository(Long id, String userEmail) {
        Repository repo = repositoryRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Repository not found"));
        if (!repo.getUser().getEmail().equals(userEmail)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not your repository");
        return repo;
    }

    public void deleteRepository(Long id, String userEmail) { repositoryRepository.delete(getRepository(id, userEmail)); }
}
