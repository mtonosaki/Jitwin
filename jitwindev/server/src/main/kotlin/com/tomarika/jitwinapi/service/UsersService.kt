package com.tomarika.jitwinapi.service

import com.tomarika.jitwinapi.model.UserModel
import com.tomarika.jitwinapi.repository.UsersRepository
import org.springframework.stereotype.Service

@Service
class UsersService(val usersRepository: UsersRepository) {

    fun getMe(accessToken: String): UserModel {
        val userDetail = usersRepository.getMe(accessToken)
        return userDetail
    }

    fun getMyPhoto(accessToken: String): ByteArray {
        val image = usersRepository.getMyPhoto(accessToken)
        return image
    }
}
