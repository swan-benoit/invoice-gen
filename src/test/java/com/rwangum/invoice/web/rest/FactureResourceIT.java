package com.rwangum.invoice.web.rest;

import static com.rwangum.invoice.domain.FactureAsserts.*;
import static com.rwangum.invoice.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rwangum.invoice.IntegrationTest;
import com.rwangum.invoice.domain.Client;
import com.rwangum.invoice.domain.Facture;
import com.rwangum.invoice.domain.enumeration.FactureStatut;
import com.rwangum.invoice.repository.FactureRepository;
import com.rwangum.invoice.service.dto.FactureDTO;
import com.rwangum.invoice.service.mapper.FactureMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link FactureResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FactureResourceIT {

    private static final String DEFAULT_NUMERO = "AAAAAAAAAA";
    private static final String UPDATED_NUMERO = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE_FACTURE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_FACTURE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATE_ECHEANCE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE_ECHEANCE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final FactureStatut DEFAULT_STATUT = FactureStatut.BROUILLON;
    private static final FactureStatut UPDATED_STATUT = FactureStatut.ENVOYEE;

    private static final String DEFAULT_NOTES = "AAAAAAAAAA";
    private static final String UPDATED_NOTES = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/factures";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private FactureRepository factureRepository;

    @Autowired
    private FactureMapper factureMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFactureMockMvc;

    private Facture facture;

    private Facture insertedFacture;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Facture createEntity() {
        return new Facture()
            .numero(DEFAULT_NUMERO)
            .dateFacture(DEFAULT_DATE_FACTURE)
            .dateEcheance(DEFAULT_DATE_ECHEANCE)
            .statut(DEFAULT_STATUT)
            .notes(DEFAULT_NOTES);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Facture createUpdatedEntity() {
        return new Facture()
            .numero(UPDATED_NUMERO)
            .dateFacture(UPDATED_DATE_FACTURE)
            .dateEcheance(UPDATED_DATE_ECHEANCE)
            .statut(UPDATED_STATUT)
            .notes(UPDATED_NOTES);
    }

    @BeforeEach
    void initTest() {
        facture = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedFacture != null) {
            factureRepository.delete(insertedFacture);
            insertedFacture = null;
        }
    }

    @Test
    @Transactional
    void createFacture() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Facture
        FactureDTO factureDTO = factureMapper.toDto(facture);
        var returnedFactureDTO = om.readValue(
            restFactureMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(factureDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            FactureDTO.class
        );

        // Validate the Facture in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedFacture = factureMapper.toEntity(returnedFactureDTO);
        assertFactureUpdatableFieldsEquals(returnedFacture, getPersistedFacture(returnedFacture));

        insertedFacture = returnedFacture;
    }

    @Test
    @Transactional
    void createFactureWithExistingId() throws Exception {
        // Create the Facture with an existing ID
        facture.setId(1L);
        FactureDTO factureDTO = factureMapper.toDto(facture);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFactureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(factureDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Facture in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNumeroIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        facture.setNumero(null);

        // Create the Facture, which fails.
        FactureDTO factureDTO = factureMapper.toDto(facture);

        restFactureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(factureDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDateFactureIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        facture.setDateFacture(null);

        // Create the Facture, which fails.
        FactureDTO factureDTO = factureMapper.toDto(facture);

        restFactureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(factureDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkStatutIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        facture.setStatut(null);

        // Create the Facture, which fails.
        FactureDTO factureDTO = factureMapper.toDto(facture);

        restFactureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(factureDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFactures() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        // Get all the factureList
        restFactureMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(facture.getId().intValue())))
            .andExpect(jsonPath("$.[*].numero").value(hasItem(DEFAULT_NUMERO)))
            .andExpect(jsonPath("$.[*].dateFacture").value(hasItem(DEFAULT_DATE_FACTURE.toString())))
            .andExpect(jsonPath("$.[*].dateEcheance").value(hasItem(DEFAULT_DATE_ECHEANCE.toString())))
            .andExpect(jsonPath("$.[*].statut").value(hasItem(DEFAULT_STATUT.toString())))
            .andExpect(jsonPath("$.[*].notes").value(hasItem(DEFAULT_NOTES)));
    }

    @Test
    @Transactional
    void getFacture() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        // Get the facture
        restFactureMockMvc
            .perform(get(ENTITY_API_URL_ID, facture.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(facture.getId().intValue()))
            .andExpect(jsonPath("$.numero").value(DEFAULT_NUMERO))
            .andExpect(jsonPath("$.dateFacture").value(DEFAULT_DATE_FACTURE.toString()))
            .andExpect(jsonPath("$.dateEcheance").value(DEFAULT_DATE_ECHEANCE.toString()))
            .andExpect(jsonPath("$.statut").value(DEFAULT_STATUT.toString()))
            .andExpect(jsonPath("$.notes").value(DEFAULT_NOTES));
    }

    @Test
    @Transactional
    void getFacturesByIdFiltering() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        Long id = facture.getId();

        defaultFactureFiltering("id.equals=" + id, "id.notEquals=" + id);

        defaultFactureFiltering("id.greaterThanOrEqual=" + id, "id.greaterThan=" + id);

        defaultFactureFiltering("id.lessThanOrEqual=" + id, "id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllFacturesByNumeroIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        // Get all the factureList where numero equals to
        defaultFactureFiltering("numero.equals=" + DEFAULT_NUMERO, "numero.equals=" + UPDATED_NUMERO);
    }

    @Test
    @Transactional
    void getAllFacturesByNumeroIsInShouldWork() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        // Get all the factureList where numero in
        defaultFactureFiltering("numero.in=" + DEFAULT_NUMERO + "," + UPDATED_NUMERO, "numero.in=" + UPDATED_NUMERO);
    }

    @Test
    @Transactional
    void getAllFacturesByNumeroIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        // Get all the factureList where numero is not null
        defaultFactureFiltering("numero.specified=true", "numero.specified=false");
    }

    @Test
    @Transactional
    void getAllFacturesByNumeroContainsSomething() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        // Get all the factureList where numero contains
        defaultFactureFiltering("numero.contains=" + DEFAULT_NUMERO, "numero.contains=" + UPDATED_NUMERO);
    }

    @Test
    @Transactional
    void getAllFacturesByNumeroNotContainsSomething() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        // Get all the factureList where numero does not contain
        defaultFactureFiltering("numero.doesNotContain=" + UPDATED_NUMERO, "numero.doesNotContain=" + DEFAULT_NUMERO);
    }

    @Test
    @Transactional
    void getAllFacturesByDateFactureIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        // Get all the factureList where dateFacture equals to
        defaultFactureFiltering("dateFacture.equals=" + DEFAULT_DATE_FACTURE, "dateFacture.equals=" + UPDATED_DATE_FACTURE);
    }

    @Test
    @Transactional
    void getAllFacturesByDateFactureIsInShouldWork() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        // Get all the factureList where dateFacture in
        defaultFactureFiltering(
            "dateFacture.in=" + DEFAULT_DATE_FACTURE + "," + UPDATED_DATE_FACTURE,
            "dateFacture.in=" + UPDATED_DATE_FACTURE
        );
    }

    @Test
    @Transactional
    void getAllFacturesByDateFactureIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        // Get all the factureList where dateFacture is not null
        defaultFactureFiltering("dateFacture.specified=true", "dateFacture.specified=false");
    }

    @Test
    @Transactional
    void getAllFacturesByDateEcheanceIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        // Get all the factureList where dateEcheance equals to
        defaultFactureFiltering("dateEcheance.equals=" + DEFAULT_DATE_ECHEANCE, "dateEcheance.equals=" + UPDATED_DATE_ECHEANCE);
    }

    @Test
    @Transactional
    void getAllFacturesByDateEcheanceIsInShouldWork() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        // Get all the factureList where dateEcheance in
        defaultFactureFiltering(
            "dateEcheance.in=" + DEFAULT_DATE_ECHEANCE + "," + UPDATED_DATE_ECHEANCE,
            "dateEcheance.in=" + UPDATED_DATE_ECHEANCE
        );
    }

    @Test
    @Transactional
    void getAllFacturesByDateEcheanceIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        // Get all the factureList where dateEcheance is not null
        defaultFactureFiltering("dateEcheance.specified=true", "dateEcheance.specified=false");
    }

    @Test
    @Transactional
    void getAllFacturesByStatutIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        // Get all the factureList where statut equals to
        defaultFactureFiltering("statut.equals=" + DEFAULT_STATUT, "statut.equals=" + UPDATED_STATUT);
    }

    @Test
    @Transactional
    void getAllFacturesByStatutIsInShouldWork() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        // Get all the factureList where statut in
        defaultFactureFiltering("statut.in=" + DEFAULT_STATUT + "," + UPDATED_STATUT, "statut.in=" + UPDATED_STATUT);
    }

    @Test
    @Transactional
    void getAllFacturesByStatutIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        // Get all the factureList where statut is not null
        defaultFactureFiltering("statut.specified=true", "statut.specified=false");
    }

    @Test
    @Transactional
    void getAllFacturesByNotesIsEqualToSomething() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        // Get all the factureList where notes equals to
        defaultFactureFiltering("notes.equals=" + DEFAULT_NOTES, "notes.equals=" + UPDATED_NOTES);
    }

    @Test
    @Transactional
    void getAllFacturesByNotesIsInShouldWork() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        // Get all the factureList where notes in
        defaultFactureFiltering("notes.in=" + DEFAULT_NOTES + "," + UPDATED_NOTES, "notes.in=" + UPDATED_NOTES);
    }

    @Test
    @Transactional
    void getAllFacturesByNotesIsNullOrNotNull() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        // Get all the factureList where notes is not null
        defaultFactureFiltering("notes.specified=true", "notes.specified=false");
    }

    @Test
    @Transactional
    void getAllFacturesByNotesContainsSomething() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        // Get all the factureList where notes contains
        defaultFactureFiltering("notes.contains=" + DEFAULT_NOTES, "notes.contains=" + UPDATED_NOTES);
    }

    @Test
    @Transactional
    void getAllFacturesByNotesNotContainsSomething() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        // Get all the factureList where notes does not contain
        defaultFactureFiltering("notes.doesNotContain=" + UPDATED_NOTES, "notes.doesNotContain=" + DEFAULT_NOTES);
    }

    @Test
    @Transactional
    void getAllFacturesByClientIsEqualToSomething() throws Exception {
        Client client;
        if (TestUtil.findAll(em, Client.class).isEmpty()) {
            factureRepository.saveAndFlush(facture);
            client = ClientResourceIT.createEntity();
        } else {
            client = TestUtil.findAll(em, Client.class).get(0);
        }
        em.persist(client);
        em.flush();
        facture.setClient(client);
        factureRepository.saveAndFlush(facture);
        Long clientId = client.getId();
        // Get all the factureList where client equals to clientId
        defaultFactureShouldBeFound("clientId.equals=" + clientId);

        // Get all the factureList where client equals to (clientId + 1)
        defaultFactureShouldNotBeFound("clientId.equals=" + (clientId + 1));
    }

    private void defaultFactureFiltering(String shouldBeFound, String shouldNotBeFound) throws Exception {
        defaultFactureShouldBeFound(shouldBeFound);
        defaultFactureShouldNotBeFound(shouldNotBeFound);
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultFactureShouldBeFound(String filter) throws Exception {
        restFactureMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(facture.getId().intValue())))
            .andExpect(jsonPath("$.[*].numero").value(hasItem(DEFAULT_NUMERO)))
            .andExpect(jsonPath("$.[*].dateFacture").value(hasItem(DEFAULT_DATE_FACTURE.toString())))
            .andExpect(jsonPath("$.[*].dateEcheance").value(hasItem(DEFAULT_DATE_ECHEANCE.toString())))
            .andExpect(jsonPath("$.[*].statut").value(hasItem(DEFAULT_STATUT.toString())))
            .andExpect(jsonPath("$.[*].notes").value(hasItem(DEFAULT_NOTES)));

        // Check, that the count call also returns 1
        restFactureMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultFactureShouldNotBeFound(String filter) throws Exception {
        restFactureMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restFactureMockMvc
            .perform(get(ENTITY_API_URL + "/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingFacture() throws Exception {
        // Get the facture
        restFactureMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFacture() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the facture
        Facture updatedFacture = factureRepository.findById(facture.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedFacture are not directly saved in db
        em.detach(updatedFacture);
        updatedFacture
            .numero(UPDATED_NUMERO)
            .dateFacture(UPDATED_DATE_FACTURE)
            .dateEcheance(UPDATED_DATE_ECHEANCE)
            .statut(UPDATED_STATUT)
            .notes(UPDATED_NOTES);
        FactureDTO factureDTO = factureMapper.toDto(updatedFacture);

        restFactureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, factureDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(factureDTO))
            )
            .andExpect(status().isOk());

        // Validate the Facture in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedFactureToMatchAllProperties(updatedFacture);
    }

    @Test
    @Transactional
    void putNonExistingFacture() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        facture.setId(longCount.incrementAndGet());

        // Create the Facture
        FactureDTO factureDTO = factureMapper.toDto(facture);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFactureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, factureDTO.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(factureDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Facture in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFacture() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        facture.setId(longCount.incrementAndGet());

        // Create the Facture
        FactureDTO factureDTO = factureMapper.toDto(facture);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFactureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(factureDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Facture in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFacture() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        facture.setId(longCount.incrementAndGet());

        // Create the Facture
        FactureDTO factureDTO = factureMapper.toDto(facture);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFactureMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(factureDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Facture in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFactureWithPatch() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the facture using partial update
        Facture partialUpdatedFacture = new Facture();
        partialUpdatedFacture.setId(facture.getId());

        partialUpdatedFacture.dateFacture(UPDATED_DATE_FACTURE).notes(UPDATED_NOTES);

        restFactureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFacture.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedFacture))
            )
            .andExpect(status().isOk());

        // Validate the Facture in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertFactureUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedFacture, facture), getPersistedFacture(facture));
    }

    @Test
    @Transactional
    void fullUpdateFactureWithPatch() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the facture using partial update
        Facture partialUpdatedFacture = new Facture();
        partialUpdatedFacture.setId(facture.getId());

        partialUpdatedFacture
            .numero(UPDATED_NUMERO)
            .dateFacture(UPDATED_DATE_FACTURE)
            .dateEcheance(UPDATED_DATE_ECHEANCE)
            .statut(UPDATED_STATUT)
            .notes(UPDATED_NOTES);

        restFactureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFacture.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedFacture))
            )
            .andExpect(status().isOk());

        // Validate the Facture in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertFactureUpdatableFieldsEquals(partialUpdatedFacture, getPersistedFacture(partialUpdatedFacture));
    }

    @Test
    @Transactional
    void patchNonExistingFacture() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        facture.setId(longCount.incrementAndGet());

        // Create the Facture
        FactureDTO factureDTO = factureMapper.toDto(facture);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFactureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, factureDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(factureDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Facture in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFacture() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        facture.setId(longCount.incrementAndGet());

        // Create the Facture
        FactureDTO factureDTO = factureMapper.toDto(facture);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFactureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(factureDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Facture in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFacture() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        facture.setId(longCount.incrementAndGet());

        // Create the Facture
        FactureDTO factureDTO = factureMapper.toDto(facture);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFactureMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(factureDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Facture in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFacture() throws Exception {
        // Initialize the database
        insertedFacture = factureRepository.saveAndFlush(facture);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the facture
        restFactureMockMvc
            .perform(delete(ENTITY_API_URL_ID, facture.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return factureRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Facture getPersistedFacture(Facture facture) {
        return factureRepository.findById(facture.getId()).orElseThrow();
    }

    protected void assertPersistedFactureToMatchAllProperties(Facture expectedFacture) {
        assertFactureAllPropertiesEquals(expectedFacture, getPersistedFacture(expectedFacture));
    }

    protected void assertPersistedFactureToMatchUpdatableProperties(Facture expectedFacture) {
        assertFactureAllUpdatablePropertiesEquals(expectedFacture, getPersistedFacture(expectedFacture));
    }
}
