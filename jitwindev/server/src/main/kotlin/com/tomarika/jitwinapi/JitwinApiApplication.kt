package com.tomarika.jitwinapi

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching

@SpringBootApplication
@EnableCaching
class JitwinApiApplication

fun main(args: Array<String>) {
    runApplication<JitwinApiApplication>(*args)
}
