package com.tomarika.jitwinapi

import com.tomarika.jitwinapi.model.UserModel
import com.tomarika.jitwinapi.repository.UsersRepository
import com.tomarika.jitwinapi.service.UsersService
import io.mockk.every
import io.mockk.mockk
import org.hamcrest.CoreMatchers.equalTo
import org.hamcrest.MatcherAssert.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class UsersServiceTest {
    private lateinit var service: UsersService
    private val mockUsersRepository = mockk<UsersRepository>()

    @BeforeEach
    fun setup() {
        service = UsersService(mockUsersRepository)
    }

    @Test
    fun `getMe returns a user from usersRepository`() {
        // Given
        val expectedUser = UserModel(displayName = "Manabu, Tonosaki/トノサキ マナブ", userId = "1112-1111-9999-1234")
        val expectedAccessToken = "sample-access-token-of-graph-api-here"
        every { mockUsersRepository.getMe(expectedAccessToken) } returns expectedUser

        // When
        val me = service.getMe(expectedAccessToken)

        // Then
        assertThat(me.userId, equalTo(expectedUser.userId))
        assertThat(me.displayName, equalTo(expectedUser.displayName))
    }
}
