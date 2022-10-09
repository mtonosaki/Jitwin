package com.tomarika.jitwinapi.repository

import com.tomarika.jitwinapi.GraphApiClient
import com.tomarika.jitwinapi.model.UserModel
import org.springframework.stereotype.Repository

interface UsersRepository {
    fun getMe(accessToken: String): UserModel
}

@Repository
class UsersRepositoryImpl(val graphClient: GraphApiClient) : UsersRepository {

    override fun getMe(accessToken: String): UserModel {
        val user = graphClient.getMe(accessToken)
        return UserModel(displayName = user.displayName, userId = user.id, userPrincipalName = user.userPrincipalName)
    }
}
