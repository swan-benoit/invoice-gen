package com.rwangum.invoice.service.mapper;

import static com.rwangum.invoice.domain.LigneFactureAsserts.*;
import static com.rwangum.invoice.domain.LigneFactureTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class LigneFactureMapperTest {

    private LigneFactureMapper ligneFactureMapper;

    @BeforeEach
    void setUp() {
        ligneFactureMapper = new LigneFactureMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getLigneFactureSample1();
        var actual = ligneFactureMapper.toEntity(ligneFactureMapper.toDto(expected));
        assertLigneFactureAllPropertiesEquals(expected, actual);
    }
}
