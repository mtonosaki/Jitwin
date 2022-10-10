package com.tomarika.jitwinapi.controller

import com.tomarika.jitwinapi.AppConfiguration
import com.tomarika.jitwinapi.model.UserModel
import com.tomarika.jitwinapi.service.UsersService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient
import org.springframework.security.oauth2.client.annotation.RegisteredOAuth2AuthorizedClient
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/users")
class UsersController(val usersService: UsersService, @Autowired val appConfig: AppConfiguration) {
    @GetMapping("/me")
    fun getMe(@RegisteredOAuth2AuthorizedClient("graph") graphClient: OAuth2AuthorizedClient): UserModel {
        try {
            if (appConfig.activeProfile == "development") {
                println(graphClient.accessToken.tokenValue)
            }
            return usersService.getMe(graphClient.accessToken.tokenValue)
        } catch (e: Exception) {
            throw ResponseStatusException(HttpStatus.UNAUTHORIZED)
        }
    }

    @RequestMapping(value = ["/me/photo"], method = [RequestMethod.GET], produces = [MediaType.IMAGE_JPEG_VALUE])
    fun getMyPhoto(@RegisteredOAuth2AuthorizedClient("graph") graphClient: OAuth2AuthorizedClient): ByteArray {
        try {
            return usersService.getMyPhoto(graphClient.accessToken.tokenValue)
        } catch (e: Exception) {
            throw ResponseStatusException(HttpStatus.UNAUTHORIZED)
        }
    }
}
