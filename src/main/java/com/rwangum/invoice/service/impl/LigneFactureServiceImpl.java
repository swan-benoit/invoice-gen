package com.rwangum.invoice.service.impl;

import com.rwangum.invoice.domain.LigneFacture;
import com.rwangum.invoice.repository.LigneFactureRepository;
import com.rwangum.invoice.service.LigneFactureService;
import com.rwangum.invoice.service.dto.LigneFactureDTO;
import com.rwangum.invoice.service.mapper.LigneFactureMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.rwangum.invoice.domain.LigneFacture}.
 */
@Service
@Transactional
public class LigneFactureServiceImpl implements LigneFactureService {

    private static final Logger LOG = LoggerFactory.getLogger(LigneFactureServiceImpl.class);

    private final LigneFactureRepository ligneFactureRepository;

    private final LigneFactureMapper ligneFactureMapper;

    public LigneFactureServiceImpl(LigneFactureRepository ligneFactureRepository, LigneFactureMapper ligneFactureMapper) {
        this.ligneFactureRepository = ligneFactureRepository;
        this.ligneFactureMapper = ligneFactureMapper;
    }

    @Override
    public LigneFactureDTO save(LigneFactureDTO ligneFactureDTO) {
        LOG.debug("Request to save LigneFacture : {}", ligneFactureDTO);
        LigneFacture ligneFacture = ligneFactureMapper.toEntity(ligneFactureDTO);
        ligneFacture = ligneFactureRepository.save(ligneFacture);
        return ligneFactureMapper.toDto(ligneFacture);
    }

    @Override
    public LigneFactureDTO update(LigneFactureDTO ligneFactureDTO) {
        LOG.debug("Request to update LigneFacture : {}", ligneFactureDTO);
        LigneFacture ligneFacture = ligneFactureMapper.toEntity(ligneFactureDTO);
        ligneFacture = ligneFactureRepository.save(ligneFacture);
        return ligneFactureMapper.toDto(ligneFacture);
    }

    @Override
    public Optional<LigneFactureDTO> partialUpdate(LigneFactureDTO ligneFactureDTO) {
        LOG.debug("Request to partially update LigneFacture : {}", ligneFactureDTO);

        return ligneFactureRepository
            .findById(ligneFactureDTO.getId())
            .map(existingLigneFacture -> {
                ligneFactureMapper.partialUpdate(existingLigneFacture, ligneFactureDTO);

                return existingLigneFacture;
            })
            .map(ligneFactureRepository::save)
            .map(ligneFactureMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LigneFactureDTO> findAll() {
        LOG.debug("Request to get all LigneFactures");
        return ligneFactureRepository.findAll().stream().map(ligneFactureMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<LigneFactureDTO> findOne(Long id) {
        LOG.debug("Request to get LigneFacture : {}", id);
        return ligneFactureRepository.findById(id).map(ligneFactureMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete LigneFacture : {}", id);
        ligneFactureRepository.deleteById(id);
    }
}
