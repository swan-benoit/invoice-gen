package com.rwangum.invoice.service.mapper;

import com.rwangum.invoice.domain.Client;
import com.rwangum.invoice.service.dto.ClientDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Client} and its DTO {@link ClientDTO}.
 */
@Mapper(componentModel = "spring")
public interface ClientMapper extends EntityMapper<ClientDTO, Client> {}
