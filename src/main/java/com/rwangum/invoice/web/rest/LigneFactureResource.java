package com.rwangum.invoice.web.rest;

import com.rwangum.invoice.repository.LigneFactureRepository;
import com.rwangum.invoice.service.LigneFactureService;
import com.rwangum.invoice.service.dto.LigneFactureDTO;
import com.rwangum.invoice.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.rwangum.invoice.domain.LigneFacture}.
 */
@RestController
@RequestMapping("/api/ligne-factures")
public class LigneFactureResource {

    private static final Logger LOG = LoggerFactory.getLogger(LigneFactureResource.class);

    private static final String ENTITY_NAME = "ligneFacture";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LigneFactureService ligneFactureService;

    private final LigneFactureRepository ligneFactureRepository;

    public LigneFactureResource(LigneFactureService ligneFactureService, LigneFactureRepository ligneFactureRepository) {
        this.ligneFactureService = ligneFactureService;
        this.ligneFactureRepository = ligneFactureRepository;
    }

    /**
     * {@code POST  /ligne-factures} : Create a new ligneFacture.
     *
     * @param ligneFactureDTO the ligneFactureDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ligneFactureDTO, or with status {@code 400 (Bad Request)} if the ligneFacture has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<LigneFactureDTO> createLigneFacture(@Valid @RequestBody LigneFactureDTO ligneFactureDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save LigneFacture : {}", ligneFactureDTO);
        if (ligneFactureDTO.getId() != null) {
            throw new BadRequestAlertException("A new ligneFacture cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ligneFactureDTO = ligneFactureService.save(ligneFactureDTO);
        return ResponseEntity.created(new URI("/api/ligne-factures/" + ligneFactureDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, ligneFactureDTO.getId().toString()))
            .body(ligneFactureDTO);
    }

    /**
     * {@code PUT  /ligne-factures/:id} : Updates an existing ligneFacture.
     *
     * @param id the id of the ligneFactureDTO to save.
     * @param ligneFactureDTO the ligneFactureDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ligneFactureDTO,
     * or with status {@code 400 (Bad Request)} if the ligneFactureDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ligneFactureDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<LigneFactureDTO> updateLigneFacture(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody LigneFactureDTO ligneFactureDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update LigneFacture : {}, {}", id, ligneFactureDTO);
        if (ligneFactureDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ligneFactureDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ligneFactureRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        ligneFactureDTO = ligneFactureService.update(ligneFactureDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ligneFactureDTO.getId().toString()))
            .body(ligneFactureDTO);
    }

    /**
     * {@code PATCH  /ligne-factures/:id} : Partial updates given fields of an existing ligneFacture, field will ignore if it is null
     *
     * @param id the id of the ligneFactureDTO to save.
     * @param ligneFactureDTO the ligneFactureDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ligneFactureDTO,
     * or with status {@code 400 (Bad Request)} if the ligneFactureDTO is not valid,
     * or with status {@code 404 (Not Found)} if the ligneFactureDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the ligneFactureDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LigneFactureDTO> partialUpdateLigneFacture(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody LigneFactureDTO ligneFactureDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update LigneFacture partially : {}, {}", id, ligneFactureDTO);
        if (ligneFactureDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ligneFactureDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ligneFactureRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LigneFactureDTO> result = ligneFactureService.partialUpdate(ligneFactureDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, ligneFactureDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /ligne-factures} : get all the ligneFactures.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ligneFactures in body.
     */
    @GetMapping("")
    public List<LigneFactureDTO> getAllLigneFactures() {
        LOG.debug("REST request to get all LigneFactures");
        return ligneFactureService.findAll();
    }

    /**
     * {@code GET  /ligne-factures/:id} : get the "id" ligneFacture.
     *
     * @param id the id of the ligneFactureDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ligneFactureDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<LigneFactureDTO> getLigneFacture(@PathVariable("id") Long id) {
        LOG.debug("REST request to get LigneFacture : {}", id);
        Optional<LigneFactureDTO> ligneFactureDTO = ligneFactureService.findOne(id);
        return ResponseUtil.wrapOrNotFound(ligneFactureDTO);
    }

    /**
     * {@code DELETE  /ligne-factures/:id} : delete the "id" ligneFacture.
     *
     * @param id the id of the ligneFactureDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLigneFacture(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete LigneFacture : {}", id);
        ligneFactureService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
