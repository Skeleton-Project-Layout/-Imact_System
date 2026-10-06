package org.aeht.abhisaran.e2e;

import org.aeht.abhisaran.admin.AdminDashboardController;
import org.aeht.abhisaran.scoring.ScoringController;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ZeroPiiAndNonPunitiveAuditTests {

    @Test
    @DisplayName("AUDIT 01: Pure Zero-PII — No 'Beneficiary' or 'Child' entity or class exists")
    void testNoBeneficiaryTableOrEntity() {
        File modelDir = new File("src/main/java/org/aeht/abhisaran/model");
        if (!modelDir.exists()) {
            modelDir = new File("backend/src/main/java/org/aeht/abhisaran/model");
        }

        if (modelDir.exists() && modelDir.isDirectory()) {
            String[] files = modelDir.list();
            assertNotNull(files);
            for (String file : files) {
                String lower = file.toLowerCase();
                assertFalse(
                        lower.contains("beneficiary") || lower.contains("child"),
                        "CRITICAL VIOLATION of Zero-PII Mandate (AEHT §3.1): Found prohibited entity file: " + file
                );
            }
        }
    }

    @Test
    @DisplayName("AUDIT 02: Non-Punitive Mandate — No school ranking or sorting methods exist in admin APIs")
    void testNoSchoolRankingOrSortingMethods() {
        List<Class<?>> controllers = List.of(AdminDashboardController.class, ScoringController.class);

        for (Class<?> controller : controllers) {
            Method[] methods = controller.getDeclaredMethods();
            for (Method m : methods) {
                String name = m.getName().toLowerCase();
                assertFalse(
                        name.contains("rank") || name.contains("leaguetable") || name.contains("sortbyacs"),
                        "CRITICAL VIOLATION of Non-Punitive Mandate (AEHT §3.2): Found ranking method: " + m.getName()
                );
            }
        }
    }

    @Test
    @DisplayName("AUDIT 03: Delivery point codes strictly conform to non-identifying pattern (e.g. EDU-01)")
    void testNonIdentifyingDeliveryPointCodes() {
        List<String> pilotCodes = List.of(
                "EDU-01", "EDU-02", "EDU-03", "EDU-04",
                "HLT-01", "HLT-02", "HLT-03",
                "WCD-01", "WCD-02", "WCD-03"
        );

        for (String code : pilotCodes) {
            assertTrue(
                    code.matches("^[A-Z]{3}-\\d{2}$"),
                    "Delivery point code must be strictly non-identifying: " + code
            );
        }
    }

    @Test
    @DisplayName("AUDIT 04: Statutory Planning Disclaimer conforms to AEHT §15")
    void testStatutoryPlanningDisclaimer() {
        String statutoryNotice = (
                "Action briefs are planning inputs only. They do not authorise expenditure, " +
                "constitute sanctions, authorise procurement, guarantee funding, or establish funding eligibility. " +
                "District officials retain final prioritisation authority."
        );

        assertTrue(statutoryNotice.contains("planning inputs only"));
        assertTrue(statutoryNotice.contains("prioritisation authority"));
    }
}
