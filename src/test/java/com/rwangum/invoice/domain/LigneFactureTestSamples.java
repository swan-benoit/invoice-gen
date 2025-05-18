package com.rwangum.invoice.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class LigneFactureTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static LigneFacture getLigneFactureSample1() {
        return new LigneFacture().id(1L).description("description1").quantite(1);
    }

    public static LigneFacture getLigneFactureSample2() {
        return new LigneFacture().id(2L).description("description2").quantite(2);
    }

    public static LigneFacture getLigneFactureRandomSampleGenerator() {
        return new LigneFacture()
            .id(longCount.incrementAndGet())
            .description(UUID.randomUUID().toString())
            .quantite(intCount.incrementAndGet());
    }
}
