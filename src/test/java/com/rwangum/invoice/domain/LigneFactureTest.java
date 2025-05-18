package com.rwangum.invoice.domain;

import static com.rwangum.invoice.domain.FactureTestSamples.*;
import static com.rwangum.invoice.domain.LigneFactureTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.rwangum.invoice.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LigneFactureTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LigneFacture.class);
        LigneFacture ligneFacture1 = getLigneFactureSample1();
        LigneFacture ligneFacture2 = new LigneFacture();
        assertThat(ligneFacture1).isNotEqualTo(ligneFacture2);

        ligneFacture2.setId(ligneFacture1.getId());
        assertThat(ligneFacture1).isEqualTo(ligneFacture2);

        ligneFacture2 = getLigneFactureSample2();
        assertThat(ligneFacture1).isNotEqualTo(ligneFacture2);
    }

    @Test
    void factureTest() {
        LigneFacture ligneFacture = getLigneFactureRandomSampleGenerator();
        Facture factureBack = getFactureRandomSampleGenerator();

        ligneFacture.setFacture(factureBack);
        assertThat(ligneFacture.getFacture()).isEqualTo(factureBack);

        ligneFacture.facture(null);
        assertThat(ligneFacture.getFacture()).isNull();
    }
}
