package com.rwangum.invoice.repository;

import com.rwangum.invoice.domain.LigneFacture;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the LigneFacture entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LigneFactureRepository extends JpaRepository<LigneFacture, Long> {}
