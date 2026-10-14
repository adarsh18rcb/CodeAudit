package com.aicodereview.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Reads source files from a public GitHub repository for analysis. */
@Service
public class GitHubService {
    private static final Pattern URL = Pattern.compile("github\\.com/([\\w.-]+)/([\\w.-]+?)(?:\\.git)?/?$");
    private static final Set<String> EXTENSIONS = Set.of(".java", ".py", ".js", ".jsx", ".ts", ".tsx", ".cpp", ".c", ".go");
    private final WebClient client = WebClient.builder().baseUrl("https://api.github.com").defaultHeader("Accept", "application/vnd.github+json").build();

    public Map<String, String> fetchRepositoryFiles(String githubUrl, int limit) {
        Matcher matcher = URL.matcher(githubUrl == null ? "" : githubUrl);
        if (!matcher.find()) throw new IllegalArgumentException("Invalid GitHub URL: " + githubUrl);
        String owner = matcher.group(1), repo = matcher.group(2);
        ObjectMapper mapper = new ObjectMapper();
        Map<String, String> files = new HashMap<>();
        try {
            String metadata = client.get().uri("/repos/{owner}/{repo}", owner, repo).retrieve().bodyToMono(String.class).block();
            String branch = mapper.readTree(metadata).path("default_branch").asText("main");
            String treeJson = client.get().uri("/repos/{owner}/{repo}/git/trees/{branch}?recursive=1", owner, repo, branch).retrieve().bodyToMono(String.class).block();
            JsonNode tree = mapper.readTree(treeJson).path("tree");
            for (JsonNode node : tree) {
                if (files.size() >= limit) break;
                if (!"blob".equals(node.path("type").asText())) continue;
                String path = node.path("path").asText();
                if (EXTENSIONS.stream().noneMatch(path::endsWith)) continue;
                String json = client.get().uri("/repos/{owner}/{repo}/contents/{path}?ref={branch}", owner, repo, path, branch).retrieve().bodyToMono(String.class).block();
                String encoded = mapper.readTree(json).path("content").asText("").replace("\n", "");
                files.put(path, new String(Base64.getDecoder().decode(encoded), StandardCharsets.UTF_8));
                Thread.sleep(250);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch repository from GitHub: " + e.getMessage(), e);
        }
        return files;
    }
}
