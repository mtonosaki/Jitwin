package com.tomarika.jitwinapi

import com.tomarika.jitwinapi.model.GraphAPIUserResponse
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Component
import org.springframework.web.client.RestTemplate
import org.springframework.web.client.exchange

@Component
class GraphApiClient(restTemplateBuilder: RestTemplateBuilder) {
    lateinit var restTemplate: RestTemplate

    init {
        restTemplate = restTemplateBuilder.build()
    }

    private inline fun <reified T> get(accessToken: String, endpoint: String): T {
        val headers = HttpHeaders()
        headers.add("Authorization", "Bearer $accessToken")
        val entity = HttpEntity(null, headers)
        val response =
            restTemplate.exchange<T>("https://graph.microsoft.com/v1.0$endpoint", HttpMethod.GET, entity)
        return response.body!!
    }

    fun getMe(accessToken: String): GraphAPIUserResponse {
        return this.get(accessToken, "/me")
    }
}
