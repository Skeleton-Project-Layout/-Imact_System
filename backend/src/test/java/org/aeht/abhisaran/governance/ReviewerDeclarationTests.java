package org.aeht.abhisaran.governance;

import org.aeht.abhisaran.model.ReviewerDeclaration;
import org.aeht.abhisaran.repository.ReviewerDeclarationRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ReviewerDeclarationTests {

    @Mock
    private ReviewerDeclarationRepository declarationRepository;

    @InjectMocks
    private ReviewerService reviewerService;

    @Test
    @DisplayName("GOVN-03: Valid reviewer declaration with COI clearance and limitation notes succeeds")
    void testSubmitDeclaration_Success() {
        when(declarationRepository.save(any(ReviewerDeclaration.class))).thenAnswer(i -> i.getArgument(0));

        ReviewerDeclaration decl = reviewerService.submitDeclaration(
                "Dr. Sunita K.",
                "Senior Public Health Specialist",
                "Institute of Development Studies",
                "Cross-sector Referral Systems",
                true, // no reporting line
                true, // not AEHT employee in prior 3 years
                true, // confidentiality agreed
                "Descriptive purposive sample of 10 points. Non-causal diagnostic scan.",
                "RBSK referral constraints external to schools",
                "Institutionalize monthly block coordination meetings",
                "ENDORSED_WITH_LIMITATIONS"
        );

        assertNotNull(decl);
        assertEquals("Dr. Sunita K.", decl.getReviewerName());
        assertTrue(decl.getNoReportingLineToFieldTeam());
        assertTrue(decl.getNotAehtEmployeeOrBoard3Years());
        assertTrue(decl.getConfidentialityAgreed());
        assertEquals("PENDING", decl.getDistrictApprovalStatus());
        assertEquals("ENDORSED_WITH_LIMITATIONS", decl.getEndorsementStatus());
    }

    @Test
    @DisplayName("GOVN-03: COI violation (reporting line to field team) rejects reviewer submission")
    void testSubmitDeclaration_ReportingLineCOI_ThrowsException() {
        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                reviewerService.submitDeclaration(
                        "Dr. Candidate",
                        "Consultant",
                        "Field Agency",
                        "Public Health",
                        false, // Has reporting line to field team!
                        true,
                        true,
                        "Some limitations noted",
                        null,
                        null,
                        null
                )
        );

        assertTrue(ex.getMessage().contains("COI Violation"));
    }

    @Test
    @DisplayName("GOVN-03: COI violation (AEHT employee/board within 3 years) rejects reviewer submission")
    void testSubmitDeclaration_AehtAffiliationCOI_ThrowsException() {
        IllegalStateException ex = assertThrows(IllegalStateException.class, () ->
                reviewerService.submitDeclaration(
                        "Former AEHT Staff",
                        "Ex-Advisor",
                        "AEHT Partner",
                        "Education",
                        true,
                        false, // Ex-employee in past 3 years!
                        true,
                        "Some limitations noted",
                        null,
                        null,
                        null
                )
        );

        assertTrue(ex.getMessage().contains("COI Violation"));
    }

    @Test
    @DisplayName("GOVN-03: Missing methodology limitation notes throws exception per AEHT §8.3")
    void testSubmitDeclaration_MissingLimitationNotes_ThrowsException() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                reviewerService.submitDeclaration(
                        "Dr. Candidate",
                        "Professor",
                        "University",
                        "Public Health",
                        true,
                        true,
                        true,
                        "", // Empty limitation notes!
                        null,
                        null,
                        null
                )
        );

        assertTrue(ex.getMessage().contains("Methodology limitation notes must be recorded"));
    }

    @Test
    @DisplayName("GOVN-03: District authority can record acceptance or veto")
    void testRecordDistrictDecision_Veto_Success() {
        UUID id = UUID.randomUUID();
        ReviewerDeclaration existing = ReviewerDeclaration.builder()
                .id(id)
                .districtApprovalStatus("PENDING")
                .build();

        when(declarationRepository.findById(id)).thenReturn(Optional.of(existing));
        when(declarationRepository.save(any(ReviewerDeclaration.class))).thenAnswer(i -> i.getArgument(0));

        ReviewerDeclaration updated = reviewerService.recordDistrictDecision(
                id,
                "VETOED",
                "Alternative reviewer requested by District Magistrate due to geographical proximity",
                "dm_magistrate"
        );

        assertEquals("VETOED", updated.getDistrictApprovalStatus());
        assertEquals("dm_magistrate", updated.getDistrictDecisionBy());
        assertTrue(updated.getDistrictDecisionNotes().contains("Alternative reviewer requested"));
    }
}
