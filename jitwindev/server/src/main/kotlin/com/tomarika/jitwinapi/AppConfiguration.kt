package com.tomarika.jitwinapi

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component

@Component
class AppConfiguration {
    @Value("\${spring.profiles.active}")
    val activeProfile = "na"

    @Value("\${jitwin.host.frontend}")
    val frontendHost = "http://localhost"
}
