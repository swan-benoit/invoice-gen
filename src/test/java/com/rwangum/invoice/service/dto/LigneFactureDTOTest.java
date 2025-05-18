package com.rwangum.invoice.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.rwangum.invoice.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LigneFactureDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(LigneFactureDTO.class);
        LigneFactureDTO ligneFactureDTO1 = new LigneFactureDTO();
        ligneFactureDTO1.setId(1L);
        LigneFactureDTO ligneFactureDTO2 = new LigneFactureDTO();
        assertThat(ligneFactureDTO1).isNotEqualTo(ligneFactureDTO2);
        ligneFactureDTO2.setId(ligneFactureDTO1.getId());
        assertThat(ligneFactureDTO1).isEqualTo(ligneFactureDTO2);
        ligneFactureDTO2.setId(2L);
        assertThat(ligneFactureDTO1).isNotEqualTo(ligneFactureDTO2);
        ligneFactureDTO1.setId(null);
        assertThat(ligneFactureDTO1).isNotEqualTo(ligneFactureDTO2);
    }
}
