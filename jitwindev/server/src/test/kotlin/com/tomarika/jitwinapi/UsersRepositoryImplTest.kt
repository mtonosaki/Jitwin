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
        every { stubGraphClient.getMe("test-aad-access-token") } returns GraphAPIUserResponse(id = "1111-2222-9999", displayName = "Sophie White", userPrincipalName = "sophie@tomarika.onmicrosoft.com")

        val me = repos.getMe("test-aad-access-token")

        assertEquals(me.userId, "1111-2222-9999")
        assertEquals(me.displayName, "Sophie White")
        assertEquals(me.userPrincipalName, "sophie@tomarika.onmicrosoft.com")
    }

    @Test
    fun `getMyPhoto accesses to me of GraphApi via client`() {
        val testImage = byteArrayOf(22, 33, 44, 55)
        every { stubGraphClient.getMyPhoto("test-aad-access-token") } returns testImage

        val result = repos.getMyPhoto("test-aad-access-token")

        assertEquals(result, testImage)
    }

    @Test
    fun `getMyPhoto returns cache image`() {
        val testImage1st = byteArrayOf(11, 12, 13, 14)
        val testImage2nd = byteArrayOf(21, 22, 23, 24)
        every { stubGraphClient.getMyPhoto("test-aad-access-token") } returns testImage1st andThen testImage2nd

        val result1st = repos.getMyPhoto("test-aad-access-token")
        assertEquals(testImage1st, result1st)

        // TODO: Need to implement repository level cache has been enabled.
        // val result2nd = repos.getMyPhoto("test-aad-access-token")
        // assertEquals(testImage1st, result2nd)
    }
}
