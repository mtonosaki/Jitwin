package com.tomarika.jitwinapi.service

import com.tomarika.jitwinapi.model.UserModel
import com.tomarika.jitwinapi.repository.UsersRepository
import org.springframework.stereotype.Service

@Service
class UsersService(val usersRepository: UsersRepository) {

    fun getMe(accessToken: String): UserModel {
        val userDetail = usersRepository.getMe(accessToken)
        return UserModel(displayName = userDetail.displayName, userId = userDetail.userId)
    }
}
