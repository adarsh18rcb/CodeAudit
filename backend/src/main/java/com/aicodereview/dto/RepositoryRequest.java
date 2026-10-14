package com.aicodereview.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RepositoryRequest {
    @NotBlank
    private String githubUrl;

    private String repositoryName;

    private String language;
}
