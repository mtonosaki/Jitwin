package com.tomarika.jitwinapi.model

data class GraphAPIUserResponse(val displayName: String, val id: String)
data class GraphAPIUsersResponse(val value: List<GraphAPIUserResponse>)
