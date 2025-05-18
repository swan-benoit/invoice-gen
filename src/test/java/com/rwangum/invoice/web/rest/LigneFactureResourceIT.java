package com.rwangum.invoice.web.rest;

import static com.rwangum.invoice.domain.LigneFactureAsserts.*;
import static com.rwangum.invoice.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rwangum.invoice.IntegrationTest;
import com.rwangum.invoice.domain.LigneFacture;
import com.rwangum.invoice.repository.LigneFactureRepository;
import com.rwangum.invoice.service.dto.LigneFactureDTO;
import com.rwangum.invoice.service.mapper.LigneFactureMapper;
import jakarta.persistence.EntityManager;
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
 * Integration tests for the {@link LigneFactureResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LigneFactureResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Integer DEFAULT_QUANTITE = 1;
    private static final Integer UPDATED_QUANTITE = 2;

    private static final Double DEFAULT_PRIX_UNITAIRE_HT = 0D;
    private static final Double UPDATED_PRIX_UNITAIRE_HT = 1D;

    private static final Double DEFAULT_TAUX_TVA = 0D;
    private static final Double UPDATED_TAUX_TVA = 1D;

    private static final String ENTITY_API_URL = "/api/ligne-factures";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private LigneFactureRepository ligneFactureRepository;

    @Autowired
    private LigneFactureMapper ligneFactureMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLigneFactureMockMvc;

    private LigneFacture ligneFacture;

    private LigneFacture insertedLigneFacture;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LigneFacture createEntity() {
        return new LigneFacture()
            .description(DEFAULT_DESCRIPTION)
            .quantite(DEFAULT_QUANTITE)
            .prixUnitaireHT(DEFAULT_PRIX_UNITAIRE_HT)
            .tauxTVA(DEFAULT_TAUX_TVA);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LigneFacture createUpdatedEntity() {
        return new LigneFacture()
            .description(UPDATED_DESCRIPTION)
            .quantite(UPDATED_QUANTITE)
            .prixUnitaireHT(UPDATED_PRIX_UNITAIRE_HT)
            .tauxTVA(UPDATED_TAUX_TVA);
    }

    @BeforeEach
    void initTest() {
        ligneFacture = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedLigneFacture != null) {
            ligneFactureRepository.delete(insertedLigneFacture);
            insertedLigneFacture = null;
        }
    }

    @Test
    @Transactional
    void createLigneFacture() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the LigneFacture
        LigneFactureDTO ligneFactureDTO = ligneFactureMapper.toDto(ligneFacture);
        var returnedLigneFactureDTO = om.readValue(
            restLigneFactureMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ligneFactureDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            LigneFactureDTO.class
        );

        // Validate the LigneFacture in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedLigneFacture = ligneFactureMapper.toEntity(returnedLigneFactureDTO);
        assertLigneFactureUpdatableFieldsEquals(returnedLigneFacture, getPersistedLigneFacture(returnedLigneFacture));

        insertedLigneFacture = returnedLigneFacture;
    }

    @Test
    @Transactional
    void createLigneFactureWithExistingId() throws Exception {
        // Create the LigneFacture with an existing ID
        ligneFacture.setId(1L);
        LigneFactureDTO ligneFactureDTO = ligneFactureMapper.toDto(ligneFacture);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLigneFactureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ligneFactureDTO)))
            .andExpect(status().isBadRequest());

        // Validate the LigneFacture in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        ligneFacture.setDescription(null);

        // Create the LigneFacture, which fails.
        LigneFactureDTO ligneFactureDTO = ligneFactureMapper.toDto(ligneFacture);

        restLigneFactureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ligneFactureDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkQuantiteIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        ligneFacture.setQuantite(null);

        // Create the LigneFacture, which fails.
        LigneFactureDTO ligneFactureDTO = ligneFactureMapper.toDto(ligneFacture);

        restLigneFactureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ligneFactureDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkPrixUnitaireHTIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        ligneFacture.setPrixUnitaireHT(null);

        // Create the LigneFacture, which fails.
        LigneFactureDTO ligneFactureDTO = ligneFactureMapper.toDto(ligneFacture);

        restLigneFactureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ligneFactureDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLigneFactures() throws Exception {
        // Initialize the database
        insertedLigneFacture = ligneFactureRepository.saveAndFlush(ligneFacture);

        // Get all the ligneFactureList
        restLigneFactureMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ligneFacture.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].quantite").value(hasItem(DEFAULT_QUANTITE)))
            .andExpect(jsonPath("$.[*].prixUnitaireHT").value(hasItem(DEFAULT_PRIX_UNITAIRE_HT)))
            .andExpect(jsonPath("$.[*].tauxTVA").value(hasItem(DEFAULT_TAUX_TVA)));
    }

    @Test
    @Transactional
    void getLigneFacture() throws Exception {
        // Initialize the database
        insertedLigneFacture = ligneFactureRepository.saveAndFlush(ligneFacture);

        // Get the ligneFacture
        restLigneFactureMockMvc
            .perform(get(ENTITY_API_URL_ID, ligneFacture.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ligneFacture.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.quantite").value(DEFAULT_QUANTITE))
            .andExpect(jsonPath("$.prixUnitaireHT").value(DEFAULT_PRIX_UNITAIRE_HT))
            .andExpect(jsonPath("$.tauxTVA").value(DEFAULT_TAUX_TVA));
    }

    @Test
    @Transactional
    void getNonExistingLigneFacture() throws Exception {
        // Get the ligneFacture
        restLigneFactureMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLigneFacture() throws Exception {
        // Initialize the database
        insertedLigneFacture = ligneFactureRepository.saveAndFlush(ligneFacture);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the ligneFacture
        LigneFacture updatedLigneFacture = ligneFactureRepository.findById(ligneFacture.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedLigneFacture are not directly saved in db
        em.detach(updatedLigneFacture);
        updatedLigneFacture
            .description(UPDATED_DESCRIPTION)
            .quantite(UPDATED_QUANTITE)
            .prixUnitaireHT(UPDATED_PRIX_UNITAIRE_HT)
            .tauxTVA(UPDATED_TAUX_TVA);
        LigneFactureDTO ligneFactureDTO = ligneFactureMapper.toDto(updatedLigneFacture);

        restLigneFactureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ligneFactureDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(ligneFactureDTO))
            )
            .andExpect(status().isOk());

        // Validate the LigneFacture in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedLigneFactureToMatchAllProperties(updatedLigneFacture);
    }

    @Test
    @Transactional
    void putNonExistingLigneFacture() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ligneFacture.setId(longCount.incrementAndGet());

        // Create the LigneFacture
        LigneFactureDTO ligneFactureDTO = ligneFactureMapper.toDto(ligneFacture);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLigneFactureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ligneFactureDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(ligneFactureDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the LigneFacture in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLigneFacture() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ligneFacture.setId(longCount.incrementAndGet());

        // Create the LigneFacture
        LigneFactureDTO ligneFactureDTO = ligneFactureMapper.toDto(ligneFacture);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLigneFactureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(ligneFactureDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the LigneFacture in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLigneFacture() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ligneFacture.setId(longCount.incrementAndGet());

        // Create the LigneFacture
        LigneFactureDTO ligneFactureDTO = ligneFactureMapper.toDto(ligneFacture);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLigneFactureMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(ligneFactureDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LigneFacture in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLigneFactureWithPatch() throws Exception {
        // Initialize the database
        insertedLigneFacture = ligneFactureRepository.saveAndFlush(ligneFacture);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the ligneFacture using partial update
        LigneFacture partialUpdatedLigneFacture = new LigneFacture();
        partialUpdatedLigneFacture.setId(ligneFacture.getId());

        partialUpdatedLigneFacture.quantite(UPDATED_QUANTITE).prixUnitaireHT(UPDATED_PRIX_UNITAIRE_HT);

        restLigneFactureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLigneFacture.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedLigneFacture))
            )
            .andExpect(status().isOk());

        // Validate the LigneFacture in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertLigneFactureUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedLigneFacture, ligneFacture),
            getPersistedLigneFacture(ligneFacture)
        );
    }

    @Test
    @Transactional
    void fullUpdateLigneFactureWithPatch() throws Exception {
        // Initialize the database
        insertedLigneFacture = ligneFactureRepository.saveAndFlush(ligneFacture);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the ligneFacture using partial update
        LigneFacture partialUpdatedLigneFacture = new LigneFacture();
        partialUpdatedLigneFacture.setId(ligneFacture.getId());

        partialUpdatedLigneFacture
            .description(UPDATED_DESCRIPTION)
            .quantite(UPDATED_QUANTITE)
            .prixUnitaireHT(UPDATED_PRIX_UNITAIRE_HT)
            .tauxTVA(UPDATED_TAUX_TVA);

        restLigneFactureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLigneFacture.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedLigneFacture))
            )
            .andExpect(status().isOk());

        // Validate the LigneFacture in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertLigneFactureUpdatableFieldsEquals(partialUpdatedLigneFacture, getPersistedLigneFacture(partialUpdatedLigneFacture));
    }

    @Test
    @Transactional
    void patchNonExistingLigneFacture() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ligneFacture.setId(longCount.incrementAndGet());

        // Create the LigneFacture
        LigneFactureDTO ligneFactureDTO = ligneFactureMapper.toDto(ligneFacture);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLigneFactureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ligneFactureDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(ligneFactureDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the LigneFacture in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLigneFacture() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ligneFacture.setId(longCount.incrementAndGet());

        // Create the LigneFacture
        LigneFactureDTO ligneFactureDTO = ligneFactureMapper.toDto(ligneFacture);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLigneFactureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(ligneFactureDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the LigneFacture in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLigneFacture() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        ligneFacture.setId(longCount.incrementAndGet());

        // Create the LigneFacture
        LigneFactureDTO ligneFactureDTO = ligneFactureMapper.toDto(ligneFacture);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLigneFactureMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(ligneFactureDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LigneFacture in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLigneFacture() throws Exception {
        // Initialize the database
        insertedLigneFacture = ligneFactureRepository.saveAndFlush(ligneFacture);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the ligneFacture
        restLigneFactureMockMvc
            .perform(delete(ENTITY_API_URL_ID, ligneFacture.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return ligneFactureRepository.count();
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

    protected LigneFacture getPersistedLigneFacture(LigneFacture ligneFacture) {
        return ligneFactureRepository.findById(ligneFacture.getId()).orElseThrow();
    }

    protected void assertPersistedLigneFactureToMatchAllProperties(LigneFacture expectedLigneFacture) {
        assertLigneFactureAllPropertiesEquals(expectedLigneFacture, getPersistedLigneFacture(expectedLigneFacture));
    }

    protected void assertPersistedLigneFactureToMatchUpdatableProperties(LigneFacture expectedLigneFacture) {
        assertLigneFactureAllUpdatablePropertiesEquals(expectedLigneFacture, getPersistedLigneFacture(expectedLigneFacture));
    }
}
