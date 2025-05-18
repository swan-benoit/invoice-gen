package com.rwangum.invoice.domain;

import static com.rwangum.invoice.domain.ClientTestSamples.*;
import static com.rwangum.invoice.domain.FactureTestSamples.*;
import static com.rwangum.invoice.domain.LigneFactureTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.rwangum.invoice.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class FactureTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Facture.class);
        Facture facture1 = getFactureSample1();
        Facture facture2 = new Facture();
        assertThat(facture1).isNotEqualTo(facture2);

        facture2.setId(facture1.getId());
        assertThat(facture1).isEqualTo(facture2);

        facture2 = getFactureSample2();
        assertThat(facture1).isNotEqualTo(facture2);
    }

    @Test
    void lignesTest() {
        Facture facture = getFactureRandomSampleGenerator();
        LigneFacture ligneFactureBack = getLigneFactureRandomSampleGenerator();

        facture.addLignes(ligneFactureBack);
        assertThat(facture.getLignes()).containsOnly(ligneFactureBack);
        assertThat(ligneFactureBack.getFacture()).isEqualTo(facture);

        facture.removeLignes(ligneFactureBack);
        assertThat(facture.getLignes()).doesNotContain(ligneFactureBack);
        assertThat(ligneFactureBack.getFacture()).isNull();

        facture.lignes(new HashSet<>(Set.of(ligneFactureBack)));
        assertThat(facture.getLignes()).containsOnly(ligneFactureBack);
        assertThat(ligneFactureBack.getFacture()).isEqualTo(facture);

        facture.setLignes(new HashSet<>());
        assertThat(facture.getLignes()).doesNotContain(ligneFactureBack);
        assertThat(ligneFactureBack.getFacture()).isNull();
    }

    @Test
    void clientTest() {
        Facture facture = getFactureRandomSampleGenerator();
        Client clientBack = getClientRandomSampleGenerator();

        facture.setClient(clientBack);
        assertThat(facture.getClient()).isEqualTo(clientBack);

        facture.client(null);
        assertThat(facture.getClient()).isNull();
    }
}
