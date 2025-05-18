package com.rwangum.invoice.service.criteria;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Objects;
import java.util.function.BiFunction;
import java.util.function.Function;
import org.assertj.core.api.Condition;
import org.junit.jupiter.api.Test;

class FactureCriteriaTest {

    @Test
    void newFactureCriteriaHasAllFiltersNullTest() {
        var factureCriteria = new FactureCriteria();
        assertThat(factureCriteria).is(criteriaFiltersAre(Objects::isNull));
    }

    @Test
    void factureCriteriaFluentMethodsCreatesFiltersTest() {
        var factureCriteria = new FactureCriteria();

        setAllFilters(factureCriteria);

        assertThat(factureCriteria).is(criteriaFiltersAre(Objects::nonNull));
    }

    @Test
    void factureCriteriaCopyCreatesNullFilterTest() {
        var factureCriteria = new FactureCriteria();
        var copy = factureCriteria.copy();

        assertThat(factureCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(Objects::isNull)),
            criteria -> assertThat(criteria).isEqualTo(factureCriteria)
        );
    }

    @Test
    void factureCriteriaCopyDuplicatesEveryExistingFilterTest() {
        var factureCriteria = new FactureCriteria();
        setAllFilters(factureCriteria);

        var copy = factureCriteria.copy();

        assertThat(factureCriteria).satisfies(
            criteria ->
                assertThat(criteria).is(
                    copyFiltersAre(copy, (a, b) -> (a == null || a instanceof Boolean) ? a == b : (a != b && a.equals(b)))
                ),
            criteria -> assertThat(criteria).isEqualTo(copy),
            criteria -> assertThat(criteria).hasSameHashCodeAs(copy)
        );

        assertThat(copy).satisfies(
            criteria -> assertThat(criteria).is(criteriaFiltersAre(Objects::nonNull)),
            criteria -> assertThat(criteria).isEqualTo(factureCriteria)
        );
    }

    @Test
    void toStringVerifier() {
        var factureCriteria = new FactureCriteria();

        assertThat(factureCriteria).hasToString("FactureCriteria{}");
    }

    private static void setAllFilters(FactureCriteria factureCriteria) {
        factureCriteria.id();
        factureCriteria.numero();
        factureCriteria.dateFacture();
        factureCriteria.dateEcheance();
        factureCriteria.statut();
        factureCriteria.notes();
        factureCriteria.lignesId();
        factureCriteria.clientId();
        factureCriteria.distinct();
    }

    private static Condition<FactureCriteria> criteriaFiltersAre(Function<Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId()) &&
                condition.apply(criteria.getNumero()) &&
                condition.apply(criteria.getDateFacture()) &&
                condition.apply(criteria.getDateEcheance()) &&
                condition.apply(criteria.getStatut()) &&
                condition.apply(criteria.getNotes()) &&
                condition.apply(criteria.getLignesId()) &&
                condition.apply(criteria.getClientId()) &&
                condition.apply(criteria.getDistinct()),
            "every filter matches"
        );
    }

    private static Condition<FactureCriteria> copyFiltersAre(FactureCriteria copy, BiFunction<Object, Object, Boolean> condition) {
        return new Condition<>(
            criteria ->
                condition.apply(criteria.getId(), copy.getId()) &&
                condition.apply(criteria.getNumero(), copy.getNumero()) &&
                condition.apply(criteria.getDateFacture(), copy.getDateFacture()) &&
                condition.apply(criteria.getDateEcheance(), copy.getDateEcheance()) &&
                condition.apply(criteria.getStatut(), copy.getStatut()) &&
                condition.apply(criteria.getNotes(), copy.getNotes()) &&
                condition.apply(criteria.getLignesId(), copy.getLignesId()) &&
                condition.apply(criteria.getClientId(), copy.getClientId()) &&
                condition.apply(criteria.getDistinct(), copy.getDistinct()),
            "every filter matches"
        );
    }
}
