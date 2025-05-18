package com.rwangum.invoice.service.criteria;

import java.io.Serializable;
import java.util.Objects;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link com.rwangum.invoice.domain.Client} entity. This class is used
 * in {@link com.rwangum.invoice.web.rest.ClientResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /clients?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ClientCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter nom;

    private StringFilter email;

    private StringFilter telephone;

    private StringFilter siret;

    private StringFilter adresseLigne1;

    private StringFilter adresseLigne2;

    private StringFilter codePostal;

    private StringFilter ville;

    private LongFilter facturesId;

    private Boolean distinct;

    public ClientCriteria() {}

    public ClientCriteria(ClientCriteria other) {
        this.id = other.optionalId().map(LongFilter::copy).orElse(null);
        this.nom = other.optionalNom().map(StringFilter::copy).orElse(null);
        this.email = other.optionalEmail().map(StringFilter::copy).orElse(null);
        this.telephone = other.optionalTelephone().map(StringFilter::copy).orElse(null);
        this.siret = other.optionalSiret().map(StringFilter::copy).orElse(null);
        this.adresseLigne1 = other.optionalAdresseLigne1().map(StringFilter::copy).orElse(null);
        this.adresseLigne2 = other.optionalAdresseLigne2().map(StringFilter::copy).orElse(null);
        this.codePostal = other.optionalCodePostal().map(StringFilter::copy).orElse(null);
        this.ville = other.optionalVille().map(StringFilter::copy).orElse(null);
        this.facturesId = other.optionalFacturesId().map(LongFilter::copy).orElse(null);
        this.distinct = other.distinct;
    }

    @Override
    public ClientCriteria copy() {
        return new ClientCriteria(this);
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

    public StringFilter getNom() {
        return nom;
    }

    public Optional<StringFilter> optionalNom() {
        return Optional.ofNullable(nom);
    }

    public StringFilter nom() {
        if (nom == null) {
            setNom(new StringFilter());
        }
        return nom;
    }

    public void setNom(StringFilter nom) {
        this.nom = nom;
    }

    public StringFilter getEmail() {
        return email;
    }

    public Optional<StringFilter> optionalEmail() {
        return Optional.ofNullable(email);
    }

    public StringFilter email() {
        if (email == null) {
            setEmail(new StringFilter());
        }
        return email;
    }

    public void setEmail(StringFilter email) {
        this.email = email;
    }

    public StringFilter getTelephone() {
        return telephone;
    }

    public Optional<StringFilter> optionalTelephone() {
        return Optional.ofNullable(telephone);
    }

    public StringFilter telephone() {
        if (telephone == null) {
            setTelephone(new StringFilter());
        }
        return telephone;
    }

    public void setTelephone(StringFilter telephone) {
        this.telephone = telephone;
    }

    public StringFilter getSiret() {
        return siret;
    }

    public Optional<StringFilter> optionalSiret() {
        return Optional.ofNullable(siret);
    }

    public StringFilter siret() {
        if (siret == null) {
            setSiret(new StringFilter());
        }
        return siret;
    }

    public void setSiret(StringFilter siret) {
        this.siret = siret;
    }

    public StringFilter getAdresseLigne1() {
        return adresseLigne1;
    }

    public Optional<StringFilter> optionalAdresseLigne1() {
        return Optional.ofNullable(adresseLigne1);
    }

    public StringFilter adresseLigne1() {
        if (adresseLigne1 == null) {
            setAdresseLigne1(new StringFilter());
        }
        return adresseLigne1;
    }

    public void setAdresseLigne1(StringFilter adresseLigne1) {
        this.adresseLigne1 = adresseLigne1;
    }

    public StringFilter getAdresseLigne2() {
        return adresseLigne2;
    }

    public Optional<StringFilter> optionalAdresseLigne2() {
        return Optional.ofNullable(adresseLigne2);
    }

    public StringFilter adresseLigne2() {
        if (adresseLigne2 == null) {
            setAdresseLigne2(new StringFilter());
        }
        return adresseLigne2;
    }

    public void setAdresseLigne2(StringFilter adresseLigne2) {
        this.adresseLigne2 = adresseLigne2;
    }

    public StringFilter getCodePostal() {
        return codePostal;
    }

    public Optional<StringFilter> optionalCodePostal() {
        return Optional.ofNullable(codePostal);
    }

    public StringFilter codePostal() {
        if (codePostal == null) {
            setCodePostal(new StringFilter());
        }
        return codePostal;
    }

    public void setCodePostal(StringFilter codePostal) {
        this.codePostal = codePostal;
    }

    public StringFilter getVille() {
        return ville;
    }

    public Optional<StringFilter> optionalVille() {
        return Optional.ofNullable(ville);
    }

    public StringFilter ville() {
        if (ville == null) {
            setVille(new StringFilter());
        }
        return ville;
    }

    public void setVille(StringFilter ville) {
        this.ville = ville;
    }

    public LongFilter getFacturesId() {
        return facturesId;
    }

    public Optional<LongFilter> optionalFacturesId() {
        return Optional.ofNullable(facturesId);
    }

    public LongFilter facturesId() {
        if (facturesId == null) {
            setFacturesId(new LongFilter());
        }
        return facturesId;
    }

    public void setFacturesId(LongFilter facturesId) {
        this.facturesId = facturesId;
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
        final ClientCriteria that = (ClientCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(nom, that.nom) &&
            Objects.equals(email, that.email) &&
            Objects.equals(telephone, that.telephone) &&
            Objects.equals(siret, that.siret) &&
            Objects.equals(adresseLigne1, that.adresseLigne1) &&
            Objects.equals(adresseLigne2, that.adresseLigne2) &&
            Objects.equals(codePostal, that.codePostal) &&
            Objects.equals(ville, that.ville) &&
            Objects.equals(facturesId, that.facturesId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, nom, email, telephone, siret, adresseLigne1, adresseLigne2, codePostal, ville, facturesId, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ClientCriteria{" +
            optionalId().map(f -> "id=" + f + ", ").orElse("") +
            optionalNom().map(f -> "nom=" + f + ", ").orElse("") +
            optionalEmail().map(f -> "email=" + f + ", ").orElse("") +
            optionalTelephone().map(f -> "telephone=" + f + ", ").orElse("") +
            optionalSiret().map(f -> "siret=" + f + ", ").orElse("") +
            optionalAdresseLigne1().map(f -> "adresseLigne1=" + f + ", ").orElse("") +
            optionalAdresseLigne2().map(f -> "adresseLigne2=" + f + ", ").orElse("") +
            optionalCodePostal().map(f -> "codePostal=" + f + ", ").orElse("") +
            optionalVille().map(f -> "ville=" + f + ", ").orElse("") +
            optionalFacturesId().map(f -> "facturesId=" + f + ", ").orElse("") +
            optionalDistinct().map(f -> "distinct=" + f + ", ").orElse("") +
        "}";
    }
}
