package com.tomarika.jitwinapi.repository

import com.tomarika.jitwinapi.GraphApiClient
import com.tomarika.jitwinapi.model.UserModel
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Component
import org.springframework.stereotype.Repository

interface UsersRepository {
    fun getMe(accessToken: String): UserModel
    fun getMyPhoto(accessToken: String): ByteArray
}

@Repository
@Component
class UsersRepositoryGraphApi(val graphClient: GraphApiClient) : UsersRepository {

    override fun getMe(accessToken: String): UserModel {
        val me = graphClient.getMe(accessToken)
        return UserModel(displayName = me.displayName, userId = me.id, userPrincipalName = me.userPrincipalName, givenName = me.givenName)
    }

    @Cacheable("profile")
    override fun getMyPhoto(accessToken: String): ByteArray {
        val image = graphClient.getMyPhoto(accessToken)
        return image
    }
}
