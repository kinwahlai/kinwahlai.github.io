---
layout: post
title: "Auto login Grails functional test"
date: 2015-07-12T17:02:20+08:00
modified:
categories: blog
excerpt:
tags: [grails, cucumber, geb, functional test, RememberMeServices, RememberMeAuthenticationFilter]
comments: true
share: true
image:
  feature:
---

I set on a quest to reduce the Grails cucumber/functional test time, I noticed there are a lot of login and logout actions.
These 2 actions seem very simple and cheap, but it will be very costly when you have many cases/scenarios and involving a few clicks on the Geb Page every time.

I wish the test in future can be simpler like this; Given user already login to the system, then i can straight away perform the test i want and not distracted by the login steps. For the logout part, I tried to understand from the team, why must we logout for every test? Their answer is not really a must but it helps to ensure that no residual effect from previous test.

### What are my options?

I can use [RestAssured](https://code.google.com/p/rest-assured/) to login via ajax endpoint provided by Spring Security Core plugin and then share the session id with the Geb browser. I tried it and it works pretty well. But i want to try something else.

Another option is using the Remember Me functionality. I want to "trick" the system to think that i already logged in before. How it works?

1. RememberMeAuthenticationFilter intercept the request.
2. Pass the request to RememberMeServices to process the cookie and login.
3. Set the authentication into the security context and continue on the filter chain.

So this post is to show how to create a custom RememberMeServices, setting up the service and using the service.

### Creating custom RememberMeServices

First, I create a new class extends TokenBasedRememberMeServices from the Spring security package. In this class, i override the most important method `processAutoLogin` to handle the autologin. I also override `decodeCookie` and `encodeCookie`, to convert the Base64 string into token array that contain the username and password.
Note that it does not have the expiry token because we do not really care about expiry in cucumber/functional test.

~~~ groovy
@Override
protected UserDetails processAutoLoginCookie(String[] cookieTokens, HttpServletRequest request,
                                             HttpServletResponse response) {
  if (cookieTokens.length != 2) {
    throw new InvalidCookieException("Cookie token did not contain 2" +
            " tokens, but contained '" + Arrays.asList(cookieTokens) + "'");
  }
  UserDetails userDetails = getUserDetailsService().loadUserByUsername(cookieTokens[0]);
  return userDetails;
}

@Override
protected String[] decodeCookie(String cookieValue) throws InvalidCookieException {
  if (!Base64.isBase64(cookieValue.getBytes())) {
    throw new InvalidCookieException( "Cookie token was not Base64 encoded; value was '" + cookieValue + "'");
  }
  String cookieAsPlainText = new String(Base64.decode(cookieValue.getBytes()));
  return StringUtils.delimitedListToStringArray(cookieAsPlainText, DELIMITER);
}

@Override
protected String encodeCookie(String[] cookieTokens) {
  StringBuilder sb
  String value = StringUtils.arrayToDelimitedString(cookieTokens, ":")
  sb = new StringBuilder(new String(Base64.encode(value.getBytes())));
  return sb.toString();
}
~~~

Cool, so now i have the custom RememberMeServices, how can i use this service? Well, it turn out to be quite simple, thanks to the example code i found in `SpringSecurityCoreGrailsPlugin.groovy`. All you need to do is "wire" the service in the Grails `resources.groovy` file.

~~~ groovy
if (SpringSecurityUtils.securityConfig.FTRememberMeService.load) {
  rememberMeServices(FTRememberMeService, SpringSecurityUtils.securityConfig.rememberMe.key, ref('userDetailsService')) {
    // token/cookie format will be Base64 encoded "username:password"
    cookieName = "HuubHR_Functional_Test_Token"
    alwaysRemember = false
    tokenValiditySeconds = 60 * 10
    authenticationDetailsSource = ref('authenticationDetailsSource')
    userDetailsChecker = ref('userDetailsChecker')
    authoritiesMapper = ref('authoritiesMapper')
  }
}
~~~

If you notice, I wrap the loading of my custom RememberMeServices with a config so that i can load it only in certain environment.

### Using the new service with Geb

Ok, the Grails service is ready now, how do auto login my Geb browser? For me, i created the method below in my cucumber World. I tried to address the logout issue by deleting all cookies. This will ensure that new session id created for new login.

~~~ groovy
public void injectLoginCookie(String username, String password = "pass") {
  assert gebBrowser != null
  ((RemoteWebDriver) gebBrowser.getDriver()).manage().deleteAllCookies()
  ((RemoteWebDriver) gebBrowser.getDriver()).manage().addCookie(new Cookie(COOKIE_NAME, encodeCookie([username, password] as String[])))
}
~~~

Before accessing a secured page, i call `injectLoginCookie` method. Like the snippet below. **NOTES**: You will see this exception if you try to inject cookie to a new browser that did not go to any page yet. So `go "/version"` is to set the browser's currentUrl to a valid url and to avoid the exception.

> org.openqa.selenium.WebDriverException: <unknown>: Failed to set the 'cookie' property on 'Document': Cookies are disabled inside 'data:' URLs.

~~~ groovy
  go "/version"
  injectLoginCookie(browserAdminname, "pass")
  to EmployeeListPage
~~~

The result is quite promising, i manage cut down about 40% for the same test before i change to auto login. Besides login, you can use the same trick to set a lot other things. It is a useful trick i believe.
