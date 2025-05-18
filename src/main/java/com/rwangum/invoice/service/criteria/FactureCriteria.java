package com.rwangum.invoice.service.criteria;

import com.rwangum.invoice.domain.enumeration.FactureStatut;
import java.io.Serializable;
import java.util.Objects;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link com.rwangum.invoice.domain.Facture} entity. This class is used
 * in {@link com.rwangum.invoice.web.rest.FactureResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /factures?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FactureCriteria implements Serializable, Criteria {

    /**
     * Class for filtering FactureStatut
     */
    public static class FactureStatutFilter extends Filter<FactureStatut> {

        public FactureStatutFilter() {}

        public FactureStatutFilter(FactureStatutFilter filter) {
            super(filter);
        }

        @Override
        public FactureStatutFilter copy() {
            return new FactureStatutFilter(this);
        }
    }

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter numero;

    private InstantFilter dateFacture;

    private InstantFilter dateEcheance;

    private FactureStatutFilter statut;

    private StringFilter notes;

    private LongFilter lignesId;

    private LongFilter clientId;

    private Boolean distinct;

    public FactureCriteria() {}

    public FactureCriteria(FactureCriteria other) {
        this.id = other.optionalId().map(LongFilter::copy).orElse(null);
        this.numero = other.optionalNumero().map(StringFilter::copy).orElse(null);
        this.dateFacture = other.optionalDateFacture().map(InstantFilter::copy).orElse(null);
        this.dateEcheance = other.optionalDateEcheance().map(InstantFilter::copy).orElse(null);
        this.statut = other.optionalStatut().map(FactureStatutFilter::copy).orElse(null);
        this.notes = other.optionalNotes().map(StringFilter::copy).orElse(null);
        this.lignesId = other.optionalLignesId().map(LongFilter::copy).orElse(null);
        this.clientId = other.optionalClientId().map(LongFilter::copy).orElse(null);
        this.distinct = other.distinct;
    }

    @Override
    public FactureCriteria copy() {
        return new FactureCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public Optional<LongFilter> optionalId() {
        return Optional.ofNullable(id);
    }

    public LongFilter id() {
        if (id == null) {
            setId(new LongFilter());
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public StringFilter getNumero() {
        return numero;
    }

    public Optional<StringFilter> optionalNumero() {
        return Optional.ofNullable(numero);
    }

    public StringFilter numero() {
        if (numero == null) {
            setNumero(new StringFilter());
        }
        return numero;
    }

    public void setNumero(StringFilter numero) {
        this.numero = numero;
    }

    public InstantFilter getDateFacture() {
        return dateFacture;
    }

    public Optional<InstantFilter> optionalDateFacture() {
        return Optional.ofNullable(dateFacture);
    }

    public InstantFilter dateFacture() {
        if (dateFacture == null) {
            setDateFacture(new InstantFilter());
        }
        return dateFacture;
    }

    public void setDateFacture(InstantFilter dateFacture) {
        this.dateFacture = dateFacture;
    }

    public InstantFilter getDateEcheance() {
        return dateEcheance;
    }

    public Optional<InstantFilter> optionalDateEcheance() {
        return Optional.ofNullable(dateEcheance);
    }

    public InstantFilter dateEcheance() {
        if (dateEcheance == null) {
            setDateEcheance(new InstantFilter());
        }
        return dateEcheance;
    }

    public void setDateEcheance(InstantFilter dateEcheance) {
        this.dateEcheance = dateEcheance;
    }

    public FactureStatutFilter getStatut() {
        return statut;
    }

    public Optional<FactureStatutFilter> optionalStatut() {
        return Optional.ofNullable(statut);
    }

    public FactureStatutFilter statut() {
        if (statut == null) {
            setStatut(new FactureStatutFilter());
        }
        return statut;
    }

    public void setStatut(FactureStatutFilter statut) {
        this.statut = statut;
    }

    public StringFilter getNotes() {
        return notes;
    }

    public Optional<StringFilter> optionalNotes() {
        return Optional.ofNullable(notes);
    }

    public StringFilter notes() {
        if (notes == null) {
            setNotes(new StringFilter());
        }
        return notes;
    }

    public void setNotes(StringFilter notes) {
        this.notes = notes;
    }

    public LongFilter getLignesId() {
        return lignesId;
    }

    public Optional<LongFilter> optionalLignesId() {
        return Optional.ofNullable(lignesId);
    }

    public LongFilter lignesId() {
        if (lignesId == null) {
            setLignesId(new LongFilter());
        }
        return lignesId;
    }

    public void setLignesId(LongFilter lignesId) {
        this.lignesId = lignesId;
    }

    public LongFilter getClientId() {
        return clientId;
    }

    public Optional<LongFilter> optionalClientId() {
        return Optional.ofNullable(clientId);
    }

    public LongFilter clientId() {
        if (clientId == null) {
            setClientId(new LongFilter());
        }
        return clientId;
    }

    public void setClientId(LongFilter clientId) {
        this.clientId = clientId;
    }

    public Boolean getDistinct() {
        return distinct;
    }

    public Optional<Boolean> optionalDistinct() {
        return Optional.ofNullable(distinct);
    }

    public Boolean distinct() {
        if (distinct == null) {
            setDistinct(true);
        }
        return distinct;
    }

    public void setDistinct(Boolean distinct) {
        this.distinct = distinct;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final FactureCriteria that = (FactureCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(numero, that.numero) &&
            Objects.equals(dateFacture, that.dateFacture) &&
            Objects.equals(dateEcheance, that.dateEcheance) &&
            Objects.equals(statut, that.statut) &&
            Objects.equals(notes, that.notes) &&
            Objects.equals(lignesId, that.lignesId) &&
            Objects.equals(clientId, that.clientId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, numero, dateFacture, dateEcheance, statut, notes, lignesId, clientId, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FactureCriteria{" +
            optionalId().map(f -> "id=" + f + ", ").orElse("") +
            optionalNumero().map(f -> "numero=" + f + ", ").orElse("") +
            optionalDateFacture().map(f -> "dateFacture=" + f + ", ").orElse("") +
            optionalDateEcheance().map(f -> "dateEcheance=" + f + ", ").orElse("") +
            optionalStatut().map(f -> "statut=" + f + ", ").orElse("") +
            optionalNotes().map(f -> "notes=" + f + ", ").orElse("") +
            optionalLignesId().map(f -> "lignesId=" + f + ", ").orElse("") +
            optionalClientId().map(f -> "clientId=" + f + ", ").orElse("") +
            optionalDistinct().map(f -> "distinct=" + f + ", ").orElse("") +
        "}";
    }
}
