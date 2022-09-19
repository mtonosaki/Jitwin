package com.tomarika.jitwinapi

import com.tomarika.jitwinapi.controller.HomeController
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.setup.MockMvcBuilders

@SpringBootTest
class HomeControllerTest() {
    private fun getMockMvc(config: AppConfiguration): MockMvc {
        return MockMvcBuilders.standaloneSetup(
            HomeController(config)
        ).build()
    }

    @Test
    fun `When access to api hoge, returns 400`() {
        getMockMvc(StubAppConfiguration("na"))
            .perform(get("/api/hoge"))
            .andExpect(status().isNotFound)
    }

    @DisplayName("Development environment")
    @Nested
    inner class DevelopmentEnvironment {
        private val config = StubAppConfiguration("development")

        @Test
        fun `When access to document root, redirects to https localhost 3000`() {
            getMockMvc(config)
                .perform(get("/"))
                .andExpect(redirectedUrl("https://localhost:3000"))
        }

        @Test
        fun `When access to document root with query strings, redirect to https localhost 3000 with the query string`() {
            getMockMvc(config)
                .perform(get("/?hoge=true"))
                .andExpect(redirectedUrl("https://localhost:3000?hoge=true"))
        }
    }

    @DisplayName("Production environment")
    @Nested
    inner class ProductionEnvironment {
        private val config = StubAppConfiguration("production")

        @Test
        fun `When access to document root, returns 200`() {
            getMockMvc(config)
                .perform(get("/"))
                .andExpect(status().isOk)
        }
    }
}

class StubAppConfiguration(environment: String) : AppConfiguration() {
    override var activeProfile: String = environment
}
