package com.tomarika.jitwinapi

import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestBuilders.logout
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.header
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@SpringBootTest
@AutoConfigureMockMvc
@DisplayName("Spring Security")
class SpringSecurityTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @DisplayName("/api/logout [POST]")
    @Nested
    inner class ApiLogout {
        @Test
        fun `When access, returns 200`() {
            mockMvc.perform(logout("/api/logout")).andExpect(status().isOk)
        }

        @Test
        fun `When logout, deleted cookie`() {
            mockMvc
                .perform(logout("/api/logout"))
                .andExpect(
                    header().string(
                        "Set-Cookie",
                        "JSESSIONID=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT"
                    )
                )
        }
    }

    @DisplayName("/oauth2/authorization/graph [GET]")
    @Nested
    inner class Oauth2AuthorizationGraph {
        @Test
        fun `Response 302 redirect`() {
            mockMvc.perform(get("/oauth2/authorization/graph"))
                .andExpect(status().is3xxRedirection)
        }
    }
}
