package org.aeht.abhisaran.flags;

import lombok.RequiredArgsConstructor;
import org.aeht.abhisaran.model.ActionDefinition;
import org.aeht.abhisaran.model.Evidence;
import org.aeht.abhisaran.model.FlagEvaluation;
import org.aeht.abhisaran.repository.ActionDefinitionRepository;
import org.aeht.abhisaran.repository.EvidenceRepository;
import org.aeht.abhisaran.repository.FlagEvaluationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FlagEngineService {

    private final EvidenceRepository evidenceRepository;
    private final FlagEvaluationRepository flagRepository;
    private final ActionDefinitionRepository actionRepository;

    @Transactional
    public List<FlagEvaluation> evaluateFlagsForDeliveryPoint(String deliveryPointCode) {
        List<Evidence> evidenceList = evidenceRepository.findByDeliveryPointCode(deliveryPointCode);

        // Strict AEHT Invariant: Only VERIFIED evidence may evaluate to official gap flags
        List<Evidence> verifiedEvidence = evidenceList.stream()
                .filter(e -> "VERIFIED".equalsIgnoreCase(e.getVerificationStatus()))
                .toList();

        List<FlagEvaluation> emittedFlags = new ArrayList<>();

        for (Evidence ev : verifiedEvidence) {
            String opt = ev.getSelectedOption() != null ? ev.getSelectedOption().toUpperCase() : "";
            FlagEvaluation flag = null;

            switch (ev.getResultingRuleId()) {
                case "RULE-REFERRAL-001":
                    if (opt.contains("ABSENT") || opt.contains("ANECDOTAL")) {
                        flag = buildFlag(ev, "RULE-REFERRAL-001", "FLAG_TOUCHPOINT_DISCONTINUITY", "HIGH",
                                "Documented Screening and Referral Register Gap",
                                "Outgoing referral screening register is absent or maintained only through anecdotal notes at touchpoint.",
                                "ACT-REF-01");
                    }
                    break;

                case "RULE-READINESS-002":
                    if (opt.contains("UNASSIGNED") || opt.contains("NON_FUNCTIONAL") || opt.contains("ABSENT")) {
                        flag = buildFlag(ev, "RULE-READINESS-002", "FLAG_INSTITUTIONAL_UNREADINESS", "HIGH",
                                "Institutional Readiness and Nodal Duty Order Gap",
                                "Touchpoint lacks designated nodal personnel order or functional screening equipment.",
                                "ACT-READ-02");
                    }
                    break;

                case "RULE-TIME-003":
                    if (opt.contains("NEVER_RECEIVED") || opt.contains("NEVER_RETURNED")) {
                        flag = buildFlag(ev, "RULE-TIME-003", "FLAG_HANDOFF_BREAKDOWN", "HIGH",
                                "14-Day Cross-Departmental Counter-Referral Hand-Off Delay",
                                "Cross-departmental counter-referral loop not completed within standard 14-day protocol window.",
                                "ACT-HANDOFF-03");
                    }
                    break;

                case "RULE-CLOSURE-004":
                    if (opt.contains("UNTRACKED") || opt.contains("NO_TRANSITION")) {
                        flag = buildFlag(ev, "RULE-CLOSURE-004", "FLAG_OUTCOME_LEAKAGE", "HIGH",
                                "Beneficiary Continuity and Care Closure Outcome Gap",
                                "Transition or remedial closure outcome not recorded in beneficiary continuity file.",
                                "ACT-CLOSURE-04");
                    }
                    break;

                case "RULE-SUSTAIN-005":
                    if (opt.contains("NO_REVIEW") || opt.contains("NO_COORDINATION") || opt.contains("NO_JOINT")) {
                        flag = buildFlag(ev, "RULE-SUSTAIN-005", "FLAG_SUSTAINABILITY_DEFICIT", "MEDIUM",
                                "Routine Joint Review and Sustainability Gap",
                                "Routine monthly or block-level coordination review not conducted across departments.",
                                "ACT-SUSTAIN-05");
                    }
                    break;

                default:
                    break;
            }

            if (flag != null) {
                FlagEvaluation saved = flagRepository.save(flag);
                emittedFlags.add(saved);
            }
        }

        return emittedFlags;
    }

    private FlagEvaluation buildFlag(Evidence ev, String ruleId, String flagCode, String severity,
                                     String title, String description, String actionId) {
        ActionDefinition action = actionRepository.findById(actionId).orElse(null);

        return FlagEvaluation.builder()
                .evidenceId(ev.getId())
                .deliveryPointCode(ev.getDeliveryPointCode())
                .sectorId(ev.getSectorId())
                .layer(ev.getLayer())
                .ruleId(ruleId)
                .ruleVersion(1)
                .flagCode(flagCode)
                .severity(severity)
                .title(title)
                .description(description)
                .recommendedAction(action)
                .status("ACTIVE")
                .evaluatedAt(Instant.now())
                .build();
    }

    public List<FlagEvaluation> getActiveFlagsForDeliveryPoint(String dpCode) {
        return flagRepository.findByDeliveryPointCodeAndStatus(dpCode, "ACTIVE");
    }
}
