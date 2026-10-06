package org.aeht.abhisaran.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class RbacSecurityTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Public health endpoint is accessible without authentication")
    void publicHealthEndpointIsAccessible() throws Exception {
        mockMvc.perform(get("/api/v1/health"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Unauthenticated request to protected endpoint is rejected")
    void unauthenticatedRequestIsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/v1/oversight/pilot-status"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "field_worker", roles = {"ARYABHATA_FIELD_TEAM"})
    @DisplayName("Field team is DENIED administrative oversight access (AEHT §11 constraint)")
    void fieldTeamDeniedOversightAccess() throws Exception {
        mockMvc.perform(get("/api/v1/oversight/pilot-status"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "dm_magistrate", roles = {"DISTRICT_MAGISTRATE"})
    @DisplayName("District Magistrate is authorized for administrative oversight")
    void districtMagistrateCanAccessOversight() throws Exception {
        // Even if the endpoint handler does not exist, authorization passes before 404
        mockMvc.perform(get("/api/v1/oversight/pilot-status"))
                .andExpect(status().isNotFound()); // Passed security, reached dispatcher
    }

    @Test
    @WithMockUser(username = "institution_head", roles = {"INSTITUTION_HEAD"})
    @DisplayName("Institution head is DENIED field evidence capture access across district")
    void institutionHeadDeniedFieldSourceAccess() throws Exception {
        mockMvc.perform(get("/api/v1/source/questionnaire"))
                .andExpect(status().isForbidden());
    }
}
