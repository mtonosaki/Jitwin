package com.tomarika.jitwinapi

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.servlet.view.RedirectView
import javax.servlet.http.HttpServletRequest

@Controller
class HomeController(@Autowired val appConfig: AppConfiguration) {
    @RequestMapping("/")
    fun index(request: HttpServletRequest): Any {
        if (appConfig.activeProfile == "development") {
            val redirectUrl = if (request.queryString == null) "https://localhost:3000" else "https://localhost:3000?${request.queryString}"
            return RedirectView(redirectUrl)
        }
        return "index.html"
    }
}
