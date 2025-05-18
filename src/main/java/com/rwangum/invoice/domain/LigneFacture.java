package com.rwangum.invoice.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;

/**
 * A LigneFacture.
 */
@Entity
@Table(name = "ligne_facture")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LigneFacture implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @NotNull
    @Min(value = 1)
    @Column(name = "quantite", nullable = false)
    private Integer quantite;

    @NotNull
    @DecimalMin(value = "0")
    @Column(name = "prix_unitaire_ht", nullable = false)
    private Double prixUnitaireHT;

    @DecimalMin(value = "0")
    @DecimalMax(value = "100")
    @Column(name = "taux_tva")
    private Double tauxTVA;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "lignes", "client" }, allowSetters = true)
    private Facture facture;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public LigneFacture id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return this.description;
    }

    public LigneFacture description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getQuantite() {
        return this.quantite;
    }

    public LigneFacture quantite(Integer quantite) {
        this.setQuantite(quantite);
        return this;
    }

    public void setQuantite(Integer quantite) {
        this.quantite = quantite;
    }

    public Double getPrixUnitaireHT() {
        return this.prixUnitaireHT;
    }

    public LigneFacture prixUnitaireHT(Double prixUnitaireHT) {
        this.setPrixUnitaireHT(prixUnitaireHT);
        return this;
    }

    public void setPrixUnitaireHT(Double prixUnitaireHT) {
        this.prixUnitaireHT = prixUnitaireHT;
    }

    public Double getTauxTVA() {
        return this.tauxTVA;
    }

    public LigneFacture tauxTVA(Double tauxTVA) {
        this.setTauxTVA(tauxTVA);
        return this;
    }

    public void setTauxTVA(Double tauxTVA) {
        this.tauxTVA = tauxTVA;
    }

    public Facture getFacture() {
        return this.facture;
    }

    public void setFacture(Facture facture) {
        this.facture = facture;
    }

    public LigneFacture facture(Facture facture) {
        this.setFacture(facture);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LigneFacture)) {
            return false;
        }
        return getId() != null && getId().equals(((LigneFacture) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LigneFacture{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", quantite=" + getQuantite() +
            ", prixUnitaireHT=" + getPrixUnitaireHT() +
            ", tauxTVA=" + getTauxTVA() +
            "}";
    }
}
