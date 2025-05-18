package com.rwangum.invoice.service;

import com.rwangum.invoice.domain.*; // for static metamodels
import com.rwangum.invoice.domain.Client;
import com.rwangum.invoice.repository.ClientRepository;
import com.rwangum.invoice.service.criteria.ClientCriteria;
import com.rwangum.invoice.service.dto.ClientDTO;
import com.rwangum.invoice.service.mapper.ClientMapper;
import jakarta.persistence.criteria.JoinType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link Client} entities in the database.
 * The main input is a {@link ClientCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link Page} of {@link ClientDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class ClientQueryService extends QueryService<Client> {

    private static final Logger LOG = LoggerFactory.getLogger(ClientQueryService.class);

    private final ClientRepository clientRepository;

    private final ClientMapper clientMapper;

    public ClientQueryService(ClientRepository clientRepository, ClientMapper clientMapper) {
        this.clientRepository = clientRepository;
        this.clientMapper = clientMapper;
    }

    /**
     * Return a {@link Page} of {@link ClientDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<ClientDTO> findByCriteria(ClientCriteria criteria, Pageable page) {
        LOG.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Client> specification = createSpecification(criteria);
        return clientRepository.findAll(specification, page).map(clientMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(ClientCriteria criteria) {
        LOG.debug("count by criteria : {}", criteria);
        final Specification<Client> specification = createSpecification(criteria);
        return clientRepository.count(specification);
    }

    /**
     * Function to convert {@link ClientCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Client> createSpecification(ClientCriteria criteria) {
        Specification<Client> specification = Specification.where(null);
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            specification = Specification.allOf(
                Boolean.TRUE.equals(criteria.getDistinct()) ? distinct(criteria.getDistinct()) : null,
                buildRangeSpecification(criteria.getId(), Client_.id),
                buildStringSpecification(criteria.getNom(), Client_.nom),
                buildStringSpecification(criteria.getEmail(), Client_.email),
                buildStringSpecification(criteria.getTelephone(), Client_.telephone),
                buildStringSpecification(criteria.getSiret(), Client_.siret),
                buildStringSpecification(criteria.getAdresseLigne1(), Client_.adresseLigne1),
                buildStringSpecification(criteria.getAdresseLigne2(), Client_.adresseLigne2),
                buildStringSpecification(criteria.getCodePostal(), Client_.codePostal),
                buildStringSpecification(criteria.getVille(), Client_.ville),
                buildSpecification(criteria.getFacturesId(), root -> root.join(Client_.factures, JoinType.LEFT).get(Facture_.id))
            );
        }
        return specification;
    }
}
