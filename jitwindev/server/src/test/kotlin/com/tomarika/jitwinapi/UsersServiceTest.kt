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
        val expectedUser = UserModel(displayName = "Hoge Taro/ホゲ 太郎", userId = "1112-1111-9999-1234", userPrincipalName = "thoge@tomarika.onmicrosoft.com")
        val expectedAccessToken = "sample-access-token-of-graph-api-here"
        every { mockUsersRepository.getMe(expectedAccessToken) } returns expectedUser

        // When
        val me = service.getMe(expectedAccessToken)

        // Then
        assertThat(me.userId, equalTo(expectedUser.userId))
        assertThat(me.displayName, equalTo(expectedUser.displayName))
        assertThat(me.userPrincipalName, equalTo(expectedUser.userPrincipalName))
    }

    @Test
    fun `getMyPhoto returns a user profile from usersRepository`() {
        // Given
        val expectedImage = byteArrayOf(1, 2, 3, 11, 22, 33)
        val expectedAccessToken = "sample-access-token-of-graph-api-here"
        every { mockUsersRepository.getMyPhoto(expectedAccessToken) } returns expectedImage

        // When
        val result = service.getMyPhoto(expectedAccessToken)

        // Then
        assertThat(result, equalTo(expectedImage))
    }
}
