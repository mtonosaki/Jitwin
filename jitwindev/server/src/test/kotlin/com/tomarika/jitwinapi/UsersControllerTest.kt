package com.tomarika.jitwinapi

import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.client.AutoConfigureMockRestServiceServer
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.security.oauth2.core.OAuth2AccessToken
import org.springframework.security.oauth2.core.OAuth2AccessToken.TokenType.BEARER
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oauth2Client
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.oauth2Login
import org.springframework.test.web.client.MockRestServiceServer
import org.springframework.test.web.client.match.MockRestRequestMatchers.header
import org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo
import org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess
import org.springframework.test.web.client.response.MockRestResponseCreators.withUnauthorizedRequest
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.content
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.util.Collections

@SpringBootTest
@AutoConfigureMockRestServiceServer
@AutoConfigureMockMvc
@DisplayName("/api/users")
class UsersControllerTest() {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var mockGraphApiServer: MockRestServiceServer

    @DisplayName("/me [GET]")
    @Nested
    inner class ApiMe {
        @Test
        fun `Given login, when collect access, response the user`() {
            mockGraphApiServer.expect(requestTo("https://graph.microsoft.com/v1.0/me"))
                .andExpect(header("Authorization", "Bearer graph-api-sample-token")).andRespond(
                    withSuccess(
                        """
                            {
                                "@odata.context": "https://graph.microsoft.com/v1.0/metadata#users/entity",
                                "businessPhones": [
                                    "+1 411 333 1212"
                                ],
                                "displayName": "Megan Bowen",
                                "givenName": "Megan",
                                "jobTitle": "Auditor",
                                "mail": "meganb@example.com",
                                "mobilePhone": null,
                                "officeLocation": "12/1110",
                                "preferredLanguage": "en-US",
                                "surname": "Bowen",
                                "userPrincipalName": "meganb@example.onmicrosoft.com",
                                "id": "12ac3456-77ab-89cd-abcd-111122223333"
                            }
                        """.trimIndent(),
                        MediaType.APPLICATION_JSON
                    )
                )
            // When
            mockMvc.perform(
                get("/api/users/me").with(csrf()).with(oauth2Login()).with(
                    oauth2Client("graph").apply {
                        accessToken(
                            OAuth2AccessToken(
                                BEARER, "graph-api-sample-token", null, null, Collections.singleton("message:read")
                            )
                        )
                    }
                )
            )
                // Then
                .andExpect(status().isOk).andExpect(jsonPath("$.userId").value("12ac3456-77ab-89cd-abcd-111122223333"))
                .andExpect(jsonPath("$.displayName").value("Megan Bowen"))
                .andExpect(jsonPath("$.givenName").value("Megan"))
                .andExpect(jsonPath("$.userPrincipalName").value("meganb@example.onmicrosoft.com"))
        }

        @Test
        fun `Some item can be null from GraphAPI`() {
            mockGraphApiServer.expect(requestTo("https://graph.microsoft.com/v1.0/me"))
                .andExpect(header("Authorization", "Bearer graph-api-sample-token-001")).andRespond(
                    withSuccess(
                        """
                            {
                                "@odata.context": "https://graph.microsoft.com/v1.0/metadata#users/entity",
                                "businessPhones": [],
                                "displayName": "ソフィー ブラウン/Sophie Brown",
                                "givenName": null,
                                "jobTitle": null,
                                "mail": null,
                                "mobilePhone": null,
                                "officeLocation": null,
                                "preferredLanguage": null,
                                "surname": null,
                                "userPrincipalName": "bsophie@example.onmicrosoft.com",
                                "id": "12ac3456-77ab-89cd-abcd-111122223333"
                            }
                        """.trimIndent(),
                        MediaType.APPLICATION_JSON
                    )
                )
            // When
            mockMvc.perform(
                get("/api/users/me").with(csrf()).with(oauth2Login()).with(
                    oauth2Client("graph").apply {
                        accessToken(
                            OAuth2AccessToken(
                                BEARER, "graph-api-sample-token-001", null, null, Collections.singleton("message:read")
                            )
                        )
                    }
                )
            )
                // Then
                .andExpect(status().isOk).andExpect(jsonPath("$.userId").value("12ac3456-77ab-89cd-abcd-111122223333"))
                .andExpect(jsonPath("$.displayName").value("ソフィー ブラウン/Sophie Brown"))
                .andExpect(jsonPath("$.givenName").value(null))
                .andExpect(jsonPath("$.userPrincipalName").value("bsophie@example.onmicrosoft.com"))
        }

        @Test
        fun `user data should be cached by accessToken`() {
            // Given
            mockGraphApiServer.expect(requestTo("https://graph.microsoft.com/v1.0/me"))
                .andExpect(header("Authorization", "Bearer graph-api-sample-token-132")).andRespond(
                    withSuccess(
                        """
                            {
                                "@odata.context": "https://graph.microsoft.com/v1.0/metadata#users/entity",
                                "displayName": "Megan Bowen",
                                "userPrincipalName": "meganb@example.onmicrosoft.com",
                                "id": "12ac3456-77ab-89cd-abcd-111122223333"
                            }
                        """.trimIndent(),
                        MediaType.APPLICATION_JSON
                    )
                )
            mockGraphApiServer.expect(requestTo("https://graph.microsoft.com/v1.0/me"))
                .andExpect(header("Authorization", "Bearer graph-api-sample-token-132")).andRespond(
                    withSuccess(
                        """
                            {
                                "@odata.context": "https://graph.microsoft.com/v1.0/metadata#users/entity",
                                "displayName": "Hideyoshi Toyotomi",
                                "userPrincipalName": "htoyotomi@example.onmicrosoft.com",
                                "id": "12ac3456-77ab-89cd-abcd-111122223333"
                            }
                        """.trimIndent(),
                        MediaType.APPLICATION_JSON
                    )
                )

            // When/Then - 1
            mockMvc.perform(
                get("/api/users/me").with(csrf()).with(oauth2Login()).with(
                    oauth2Client("graph").apply {
                        accessToken(
                            OAuth2AccessToken(
                                BEARER, "graph-api-sample-token-132", null, null, Collections.singleton("message:read")
                            )
                        )
                    }
                )
            )
                .andExpect(jsonPath("$.displayName").value("Megan Bowen"))

            // When/Then - 2
            mockMvc.perform(
                get("/api/users/me").with(csrf()).with(oauth2Login()).with(
                    oauth2Client("graph").apply {
                        accessToken(
                            OAuth2AccessToken(
                                BEARER, "graph-api-sample-token-132", null, null, Collections.singleton("message:read")
                            )
                        )
                    }
                )
            )
                // Then
                .andExpect(jsonPath("$.displayName").value("Megan Bowen"))
        }

        @Test
        fun `When un-authorized request, response 401`() {
            mockGraphApiServer.expect(requestTo("https://graph.microsoft.com/v1.0/me"))
                .andExpect(header("Authorization", "Bearer graph-api-sample-token"))
                .andRespond(withUnauthorizedRequest())
            // When
            mockMvc.perform(
                get("/api/users/me").with(csrf()).with(oauth2Login()).with(
                    oauth2Client("graph").apply {
                        accessToken(
                            OAuth2AccessToken(
                                BEARER, "graph-api-sample-token", null, null, Collections.singleton("message:read")
                            )
                        )
                    }
                )
            )
                // Then
                .andExpect(status().isUnauthorized)
        }

        @Test
        fun `When not login yet, response 403`() {
            // When
            mockMvc.perform(
                get("/api/people/me").with(csrf())
            )
                // Then
                .andExpect(status().isForbidden)
        }
    }

    @DisplayName("/me/photo [GET]")
    @Nested
    inner class ApiMePhoto {
        @Test
        fun `Given login, when collect access, response the photo`() {
            val sampleImage = byteArrayOf(8, 7, 6, 5, 4, 3, 2, 1)
            mockGraphApiServer.expect(requestTo("https://graph.microsoft.com/v1.0/me/photos/64x64/${'$'}value"))
                .andExpect(header("Authorization", "Bearer graph-api-sample-token")).andRespond(
                    withSuccess(sampleImage, MediaType.IMAGE_JPEG)
                )
            // When
            mockMvc.perform(
                get("/api/users/me/photo").with(csrf()).with(oauth2Login()).with(
                    oauth2Client("graph").apply {
                        accessToken(
                            OAuth2AccessToken(
                                BEARER, "graph-api-sample-token", null, null, Collections.singleton("message:read")
                            )
                        )
                    }
                )
            )
                // Then
                .andExpect(status().isOk).andExpect(content().contentType(MediaType.IMAGE_JPEG))
                .andExpect(content().bytes(sampleImage))
        }
        @Test
        fun `photo should be cached by accessToken`() {
            mockGraphApiServer.expect(requestTo("https://graph.microsoft.com/v1.0/me/photos/64x64/${'$'}value"))
                .andExpect(header("Authorization", "Bearer graph-api-sample-token-001")).andRespond(
                    withSuccess(byteArrayOf(8, 7, 6, 5, 4, 3, 2, 1), MediaType.IMAGE_JPEG)
                )
            mockGraphApiServer.expect(requestTo("https://graph.microsoft.com/v1.0/me/photos/64x64/${'$'}value"))
                .andExpect(header("Authorization", "Bearer graph-api-sample-token-001")).andRespond(
                    withSuccess(byteArrayOf(18, 17, 16, 15, 14, 13, 12, 11), MediaType.IMAGE_JPEG)
                )

            // When - 1
            mockMvc.perform(
                get("/api/users/me/photo").with(csrf()).with(oauth2Login()).with(
                    oauth2Client("graph").apply {
                        accessToken(
                            OAuth2AccessToken(
                                BEARER, "graph-api-sample-token-001", null, null, Collections.singleton("message:read")
                            )
                        )
                    }
                )
            )
                // Then
                .andExpect(status().isOk).andExpect(content().contentType(MediaType.IMAGE_JPEG))
                .andExpect(content().bytes(byteArrayOf(8, 7, 6, 5, 4, 3, 2, 1)))

            // When - 2
            mockMvc.perform(
                get("/api/users/me/photo").with(csrf()).with(oauth2Login()).with(
                    oauth2Client("graph").apply {
                        accessToken(
                            OAuth2AccessToken(
                                BEARER, "graph-api-sample-token-001", null, null, Collections.singleton("message:read")
                            )
                        )
                    }
                )
            )
                // Then
                .andExpect(status().isOk).andExpect(content().contentType(MediaType.IMAGE_JPEG))
                .andExpect(content().bytes(byteArrayOf(8, 7, 6, 5, 4, 3, 2, 1)))
        }
    }
}
