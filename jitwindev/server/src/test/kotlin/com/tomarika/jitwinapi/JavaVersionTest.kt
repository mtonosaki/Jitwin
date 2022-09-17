package com.tomarika.jitwinapi

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test

class JavaVersionTest {
    @Test
    fun usingCorrectJavaVersion() {
        assertThat(System.getProperty("java.specification.version")).isEqualTo("17")
    }
}
