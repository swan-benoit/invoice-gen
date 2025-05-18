package com.rwangum.invoice.service.mapper;

import static com.rwangum.invoice.domain.FactureAsserts.*;
import static com.rwangum.invoice.domain.FactureTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class FactureMapperTest {

    private FactureMapper factureMapper;

    @BeforeEach
    void setUp() {
        factureMapper = new FactureMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getFactureSample1();
        var actual = factureMapper.toEntity(factureMapper.toDto(expected));
        assertFactureAllPropertiesEquals(expected, actual);
    }
}
