package com.tomarika.jitwinapi

import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class JitwinApiApplicationTest {
    @Test
    fun usingCorrectJavaVersion() {
        Assertions.assertThat(System.getProperty("java.specification.version")).isEqualTo("17")
    }
}
