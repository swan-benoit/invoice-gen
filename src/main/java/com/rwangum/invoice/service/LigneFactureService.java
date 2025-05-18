package com.rwangum.invoice.service;

import com.rwangum.invoice.service.dto.LigneFactureDTO;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.rwangum.invoice.domain.LigneFacture}.
 */
public interface LigneFactureService {
    /**
     * Save a ligneFacture.
     *
     * @param ligneFactureDTO the entity to save.
     * @return the persisted entity.
     */
    LigneFactureDTO save(LigneFactureDTO ligneFactureDTO);

    /**
     * Updates a ligneFacture.
     *
     * @param ligneFactureDTO the entity to update.
     * @return the persisted entity.
     */
    LigneFactureDTO update(LigneFactureDTO ligneFactureDTO);

    /**
     * Partially updates a ligneFacture.
     *
     * @param ligneFactureDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<LigneFactureDTO> partialUpdate(LigneFactureDTO ligneFactureDTO);

    /**
     * Get all the ligneFactures.
     *
     * @return the list of entities.
     */
    List<LigneFactureDTO> findAll();

    /**
     * Get the "id" ligneFacture.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<LigneFactureDTO> findOne(Long id);

    /**
     * Delete the "id" ligneFacture.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
