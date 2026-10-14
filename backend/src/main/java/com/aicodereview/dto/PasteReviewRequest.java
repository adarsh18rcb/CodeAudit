package com.aicodereview.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PasteReviewRequest {
    @NotBlank
    private String code;

    /** Optional - used for display and as a hint for language detection.
     * If omitted, a generic placeholder is used and language is detected
     * from the code content itself. */
    private String fileName;

    private String language;

    /** Optional friendly label; defaults to "Pasted snippet" if left blank. */
    private String repositoryName;
}
