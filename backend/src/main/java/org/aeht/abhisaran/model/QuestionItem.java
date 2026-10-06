package org.aeht.abhisaran.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "question_catalogue")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "question_number", nullable = false)
    private Integer questionNumber;

    @Column(name = "sector_id", nullable = false, length = 50)
    private String sectorId;

    @Column(nullable = false)
    private Integer layer;

    @Column(name = "convergence_question", nullable = false, length = 10)
    private String convergenceQuestion; // 'Q1' to 'Q5'

    @Column(name = "question_text", columnDefinition = "TEXT", nullable = false)
    private String questionText;

    @Column(name = "explanation_why", columnDefinition = "TEXT", nullable = false)
    private String explanationWhy;

    @Column(name = "evidence_requirement", nullable = false, length = 100)
    private String evidenceRequirement;

    @Column(name = "resulting_rule_id", nullable = false, length = 50)
    private String resultingRuleId;

    @Column(name = "options_json", columnDefinition = "jsonb", nullable = false)
    private String optionsJson;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
