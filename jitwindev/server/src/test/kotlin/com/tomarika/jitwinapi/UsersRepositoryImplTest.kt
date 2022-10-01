package com.tomarika.jitwinapi

import com.tomarika.jitwinapi.model.GraphAPIUserResponse
import com.tomarika.jitwinapi.repository.UsersRepositoryImpl
import io.mockk.every
import io.mockk.mockk
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class UsersRepositoryImplTest {

    private lateinit var repos: UsersRepositoryImpl
    private val stubGraphClient = mockk<GraphApiClient>()

    @BeforeEach
    fun setup() {
        repos = UsersRepositoryImpl(stubGraphClient)
    }

    @Test
    fun `getMe accesses to me of GraphApi via client`() {
        every { stubGraphClient.getMe("test-aad-access-token") } returns GraphAPIUserResponse(id = "1111-2222-9999", displayName = "Sophie White")

        val me = repos.getMe("test-aad-access-token")
        assertEquals(me.userId, "1111-2222-9999")
        assertEquals(me.displayName, "Sophie White")
    }
}
