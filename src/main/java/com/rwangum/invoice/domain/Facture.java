package com.rwangum.invoice.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.rwangum.invoice.domain.enumeration.FactureStatut;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

/**
 * A Facture.
 */
@Entity
@Table(name = "facture")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Facture implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "numero", nullable = false, unique = true)
    private String numero;

    @NotNull
    @Column(name = "date_facture", nullable = false)
    private Instant dateFacture;

    @Column(name = "date_echeance")
    private Instant dateEcheance;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "statut", nullable = false)
    private FactureStatut statut;

    @Column(name = "notes")
    private String notes;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "facture")
    @JsonIgnoreProperties(value = { "facture" }, allowSetters = true)
    private Set<LigneFacture> lignes = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "factures" }, allowSetters = true)
    private Client client;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Facture id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNumero() {
        return this.numero;
    }

    public Facture numero(String numero) {
        this.setNumero(numero);
        return this;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public Instant getDateFacture() {
        return this.dateFacture;
    }

    public Facture dateFacture(Instant dateFacture) {
        this.setDateFacture(dateFacture);
        return this;
    }

    public void setDateFacture(Instant dateFacture) {
        this.dateFacture = dateFacture;
    }

    public Instant getDateEcheance() {
        return this.dateEcheance;
    }

    public Facture dateEcheance(Instant dateEcheance) {
        this.setDateEcheance(dateEcheance);
        return this;
    }

    public void setDateEcheance(Instant dateEcheance) {
        this.dateEcheance = dateEcheance;
    }

    public FactureStatut getStatut() {
        return this.statut;
    }

    public Facture statut(FactureStatut statut) {
        this.setStatut(statut);
        return this;
    }

    public void setStatut(FactureStatut statut) {
        this.statut = statut;
    }

    public String getNotes() {
        return this.notes;
    }

    public Facture notes(String notes) {
        this.setNotes(notes);
        return this;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Set<LigneFacture> getLignes() {
        return this.lignes;
    }

    public void setLignes(Set<LigneFacture> ligneFactures) {
        if (this.lignes != null) {
            this.lignes.forEach(i -> i.setFacture(null));
        }
        if (ligneFactures != null) {
            ligneFactures.forEach(i -> i.setFacture(this));
        }
        this.lignes = ligneFactures;
    }

    public Facture lignes(Set<LigneFacture> ligneFactures) {
        this.setLignes(ligneFactures);
        return this;
    }

    public Facture addLignes(LigneFacture ligneFacture) {
        this.lignes.add(ligneFacture);
        ligneFacture.setFacture(this);
        return this;
    }

    public Facture removeLignes(LigneFacture ligneFacture) {
        this.lignes.remove(ligneFacture);
        ligneFacture.setFacture(null);
        return this;
    }

    public Client getClient() {
        return this.client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Facture client(Client client) {
        this.setClient(client);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Facture)) {
            return false;
        }
        return getId() != null && getId().equals(((Facture) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Facture{" +
            "id=" + getId() +
            ", numero='" + getNumero() + "'" +
            ", dateFacture='" + getDateFacture() + "'" +
            ", dateEcheance='" + getDateEcheance() + "'" +
            ", statut='" + getStatut() + "'" +
            ", notes='" + getNotes() + "'" +
            "}";
    }
}
