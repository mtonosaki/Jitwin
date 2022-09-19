package com.tomarika.jitwinapi

import com.azure.spring.cloud.autoconfigure.aad.AadWebSecurityConfigurerAdapter
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
class SecurityServerConfig {
    @Configuration
    class HtmlWebSecurityConfigurerAdapter : AadWebSecurityConfigurerAdapter() {
        @Throws(Exception::class)
        override fun configure(http: HttpSecurity) {
            super.configure(http)
            http.headers().frameOptions().disable()
                .and()
                .oauth2Login {
                    it.successHandler { _, response, _ ->
                        response?.sendRedirect("/?login_redirect=true")
                    }
                    it.failureHandler { _, response, exception ->
                        response?.sendRedirect("/?error=${exception.message}")
                    }
                }
                .logout {
                    it.logoutUrl("/api/logout")
                    it.logoutSuccessHandler { _, response, _ ->
                        response?.status = 200
                    }
                    it.deleteCookies("JSESSIONID")
                }
                .csrf().ignoringAntMatchers("/api/**")
                .and()
                .authorizeRequests {
                    it.antMatchers("/api/**")
                        .authenticated()
                }
                .exceptionHandling()
                .authenticationEntryPoint { _, response, _ ->
                    response?.status = HttpStatus.FORBIDDEN.value()
                }
        }
    }
}
