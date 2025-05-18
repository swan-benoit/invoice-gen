package com.rwangum.invoice.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.rwangum.invoice.domain.LigneFacture} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LigneFactureDTO implements Serializable {

    private Long id;

    @NotNull
    private String description;

    @NotNull
    @Min(value = 1)
    private Integer quantite;

    @NotNull
    @DecimalMin(value = "0")
    private Double prixUnitaireHT;

    @DecimalMin(value = "0")
    @DecimalMax(value = "100")
    private Double tauxTVA;

    private FactureDTO facture;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getQuantite() {
        return quantite;
    }

    public void setQuantite(Integer quantite) {
        this.quantite = quantite;
    }

    public Double getPrixUnitaireHT() {
        return prixUnitaireHT;
    }

    public void setPrixUnitaireHT(Double prixUnitaireHT) {
        this.prixUnitaireHT = prixUnitaireHT;
    }

    public Double getTauxTVA() {
        return tauxTVA;
    }

    public void setTauxTVA(Double tauxTVA) {
        this.tauxTVA = tauxTVA;
    }

    public FactureDTO getFacture() {
        return facture;
    }

    public void setFacture(FactureDTO facture) {
        this.facture = facture;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LigneFactureDTO)) {
            return false;
        }

        LigneFactureDTO ligneFactureDTO = (LigneFactureDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, ligneFactureDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LigneFactureDTO{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", quantite=" + getQuantite() +
            ", prixUnitaireHT=" + getPrixUnitaireHT() +
            ", tauxTVA=" + getTauxTVA() +
            ", facture=" + getFacture() +
            "}";
    }
}
