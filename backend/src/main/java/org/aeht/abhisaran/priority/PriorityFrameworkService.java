package org.aeht.abhisaran.priority;

import lombok.RequiredArgsConstructor;
import org.aeht.abhisaran.model.Evidence;
import org.aeht.abhisaran.model.FlagEvaluation;
import org.aeht.abhisaran.model.PriorityActionItem;
import org.aeht.abhisaran.model.User;
import org.aeht.abhisaran.repository.EvidenceRepository;
import org.aeht.abhisaran.repository.FlagEvaluationRepository;
import org.aeht.abhisaran.repository.PriorityActionItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PriorityFrameworkService {

    public static final String STATUTORY_PLANNING_DISCLAIMER =
            "Mandatory Planning Notice (AEHT §15): This action priority rating and decision record provide diagnostic inputs for district administrative convergence. They do not constitute an expenditure sanction, fiscal release, or individual employee performance evaluation.";

    private final PriorityActionItemRepository priorityRepository;
    private final FlagEvaluationRepository flagRepository;
    private final EvidenceRepository evidenceRepository;

    public static String calculatePriorityBand(int score) {
        if (score >= 20) {
            return "VERY_HIGH";
        } else if (score >= 12) {
            return "HIGH";
        } else if (score >= 6) {
            return "MEDIUM";
        } else {
            return "LOW";
        }
    }

    public static String getFeasibilityLabel(int feasibility) {
        return switch (feasibility) {
            case 5 -> "Immediate Administrative Action";
            case 4 -> "Operational Adjustment (Within 30 Days)";
            case 3 -> "Inter-Departmental Circular Needed";
            case 2 -> "Budgetary Allocation Needed";
            case 1 -> "Policy / Capital Infrastructure Requirement";
            default -> "Unspecified Feasibility";
        };
    }

    @Transactional
    public PriorityActionItem assignPriority(
            UUID flagEvaluationId,
            int urgency,
            int reach,
            int feasibility,
            String rationale,
            User decisionOwner
    ) {
        if (urgency < 1 || urgency > 5) {
            throw new IllegalArgumentException("Urgency must be an integer between 1 and 5.");
        }
        if (reach < 1 || reach > 5) {
            throw new IllegalArgumentException("Reach must be an integer between 1 and 5.");
        }
        if (feasibility < 1 || feasibility > 5) {
            throw new IllegalArgumentException("Feasibility must be an integer between 1 and 5.");
        }
        if (rationale == null || rationale.trim().length() < 5) {
            throw new IllegalArgumentException("Decision rationale of at least 5 characters is mandatory.");
        }

        FlagEvaluation flag = flagRepository.findById(flagEvaluationId)
                .orElseThrow(() -> new IllegalArgumentException("FlagEvaluation not found: " + flagEvaluationId));

        // Strict AEHT Invariant: Reject unverified evidence from receiving priority action score
        Evidence evidence = evidenceRepository.findById(flag.getEvidenceId())
                .orElseThrow(() -> new IllegalStateException("Evidence associated with flag not found."));

        if (!"VERIFIED".equalsIgnoreCase(evidence.getVerificationStatus())) {
            throw new IllegalStateException("Unverified gap cannot receive official administrative priority rating.");
        }

        // Deterministic Priority Score: Urgency * Reach (1 to 25)
        // Feasibility is strictly independent and does NOT alter the score
        int priorityScore = urgency * reach;
        String priorityBand = calculatePriorityBand(priorityScore);
        String feasibilityLabel = getFeasibilityLabel(feasibility);

        Optional<PriorityActionItem> existing = priorityRepository.findByFlagEvaluationId(flagEvaluationId);
        PriorityActionItem item;

        if (existing.isPresent()) {
            item = existing.get();
            item.setUrgency(urgency);
            item.setReach(reach);
            item.setPriorityScore(priorityScore);
            item.setPriorityBand(priorityBand);
            item.setFeasibility(feasibility);
            item.setFeasibilityLabel(feasibilityLabel);
            item.setRationale(rationale);
            item.setDecisionOwnerId(decisionOwner != null ? decisionOwner.getId() : null);
            item.setDecisionOwnerRole(decisionOwner != null && decisionOwner.getRole() != null ? decisionOwner.getRole().getId() : "DISTRICT_OFFICER");
            item.setUpdatedAt(Instant.now());
        } else {
            item = PriorityActionItem.builder()
                    .flagEvaluationId(flag.getId())
                    .deliveryPointCode(flag.getDeliveryPointCode())
                    .urgency(urgency)
                    .reach(reach)
                    .priorityScore(priorityScore)
                    .priorityBand(priorityBand)
                    .feasibility(feasibility)
                    .feasibilityLabel(feasibilityLabel)
                    .rationale(rationale)
                    .decisionOwnerId(decisionOwner != null ? decisionOwner.getId() : null)
                    .decisionOwnerRole(decisionOwner != null && decisionOwner.getRole() != null ? decisionOwner.getRole().getId() : "DISTRICT_OFFICER")
                    .status("PROPOSED")
                    .assignedAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();
        }

        return priorityRepository.save(item);
    }

    public List<PriorityActionItem> getPrioritiesForDeliveryPoint(String dpCode) {
        return priorityRepository.findByDeliveryPointCodeOrderByPriorityScoreDesc(dpCode);
    }

    public List<PriorityActionItem> getAllDistrictPriorities() {
        return priorityRepository.findAllByOrderByPriorityScoreDesc();
    }
}
