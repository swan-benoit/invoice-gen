package com.rwangum.invoice.service.mapper;

import com.rwangum.invoice.domain.Client;
import com.rwangum.invoice.domain.Facture;
import com.rwangum.invoice.service.dto.ClientDTO;
import com.rwangum.invoice.service.dto.FactureDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Facture} and its DTO {@link FactureDTO}.
 */
@Mapper(componentModel = "spring")
public interface FactureMapper extends EntityMapper<FactureDTO, Facture> {
    @Mapping(target = "client", source = "client", qualifiedByName = "clientId")
    FactureDTO toDto(Facture s);

    @Named("clientId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ClientDTO toDtoClientId(Client client);
}
