package com.rwangum.invoice.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ClientTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Client getClientSample1() {
        return new Client()
            .id(1L)
            .nom("nom1")
            .email("email1")
            .telephone("telephone1")
            .siret("siret1")
            .adresseLigne1("adresseLigne11")
            .adresseLigne2("adresseLigne21")
            .codePostal("codePostal1")
            .ville("ville1");
    }

    public static Client getClientSample2() {
        return new Client()
            .id(2L)
            .nom("nom2")
            .email("email2")
            .telephone("telephone2")
            .siret("siret2")
            .adresseLigne1("adresseLigne12")
            .adresseLigne2("adresseLigne22")
            .codePostal("codePostal2")
            .ville("ville2");
    }

    public static Client getClientRandomSampleGenerator() {
        return new Client()
            .id(longCount.incrementAndGet())
            .nom(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString())
            .telephone(UUID.randomUUID().toString())
            .siret(UUID.randomUUID().toString())
            .adresseLigne1(UUID.randomUUID().toString())
            .adresseLigne2(UUID.randomUUID().toString())
            .codePostal(UUID.randomUUID().toString())
            .ville(UUID.randomUUID().toString());
    }
}
