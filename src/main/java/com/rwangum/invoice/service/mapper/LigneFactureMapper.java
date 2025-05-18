package com.rwangum.invoice.service.mapper;

import com.rwangum.invoice.domain.Facture;
import com.rwangum.invoice.domain.LigneFacture;
import com.rwangum.invoice.service.dto.FactureDTO;
import com.rwangum.invoice.service.dto.LigneFactureDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link LigneFacture} and its DTO {@link LigneFactureDTO}.
 */
@Mapper(componentModel = "spring")
public interface LigneFactureMapper extends EntityMapper<LigneFactureDTO, LigneFacture> {
    @Mapping(target = "facture", source = "facture", qualifiedByName = "factureId")
    LigneFactureDTO toDto(LigneFacture s);

    @Named("factureId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    FactureDTO toDtoFactureId(Facture facture);
}
