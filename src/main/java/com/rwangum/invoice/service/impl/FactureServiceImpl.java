package com.rwangum.invoice.service.impl;

import com.rwangum.invoice.domain.Facture;
import com.rwangum.invoice.repository.FactureRepository;
import com.rwangum.invoice.service.FactureService;
import com.rwangum.invoice.service.dto.FactureDTO;
import com.rwangum.invoice.service.mapper.FactureMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.rwangum.invoice.domain.Facture}.
 */
@Service
@Transactional
public class FactureServiceImpl implements FactureService {

    private static final Logger LOG = LoggerFactory.getLogger(FactureServiceImpl.class);

    private final FactureRepository factureRepository;

    private final FactureMapper factureMapper;

    public FactureServiceImpl(FactureRepository factureRepository, FactureMapper factureMapper) {
        this.factureRepository = factureRepository;
        this.factureMapper = factureMapper;
    }

    @Override
    public FactureDTO save(FactureDTO factureDTO) {
        LOG.debug("Request to save Facture : {}", factureDTO);
        Facture facture = factureMapper.toEntity(factureDTO);
        facture = factureRepository.save(facture);
        return factureMapper.toDto(facture);
    }

    @Override
    public FactureDTO update(FactureDTO factureDTO) {
        LOG.debug("Request to update Facture : {}", factureDTO);
        Facture facture = factureMapper.toEntity(factureDTO);
        facture = factureRepository.save(facture);
        return factureMapper.toDto(facture);
    }

    @Override
    public Optional<FactureDTO> partialUpdate(FactureDTO factureDTO) {
        LOG.debug("Request to partially update Facture : {}", factureDTO);

        return factureRepository
            .findById(factureDTO.getId())
            .map(existingFacture -> {
                factureMapper.partialUpdate(existingFacture, factureDTO);

                return existingFacture;
            })
            .map(factureRepository::save)
            .map(factureMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<FactureDTO> findOne(Long id) {
        LOG.debug("Request to get Facture : {}", id);
        return factureRepository.findById(id).map(factureMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete Facture : {}", id);
        factureRepository.deleteById(id);
    }
}
