package org.aeht.abhisaran.ai;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/ai/assist")
@RequiredArgsConstructor
public class AiAssistiveController {

    private final AiAssistiveClient aiClient;

    @Data
    public static class RequestDraftBriefDto {
        @NotBlank
        private String issueTitle;
        @NotEmpty
        private List<String> verifiedEvidenceIds;
        @NotBlank
        private String sector;
        @NotBlank
        private String pathway;
    }

    @Data
    public static class ScreenTextDto {
        @NotBlank
        private String text;
    }

    @PostMapping("/draft-brief")
    public ResponseEntity<?> draftBrief(@Valid @RequestBody RequestDraftBriefDto dto) {
        try {
            AiAssistiveClient.DraftBriefResponseDto result = aiClient.requestDraftBrief(
                    dto.getIssueTitle(),
                    dto.getVerifiedEvidenceIds(),
                    dto.getSector(),
                    dto.getPathway()
            );
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/screen-text")
    public ResponseEntity<?> screenText(@Valid @RequestBody ScreenTextDto dto) {
        AiAssistiveClient.PiiScreenResponseDto result = aiClient.screenTextForPii(dto.getText());
        return ResponseEntity.ok(result);
    }
}
