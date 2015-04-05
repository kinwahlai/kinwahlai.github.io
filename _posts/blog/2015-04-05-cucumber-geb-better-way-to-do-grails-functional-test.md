---
layout: post
title: "Cucumber + Geb = Better Way to Do Grails Functional Test"
date: 2015-04-05T19:05:47+08:00
modified:
categories: blog
excerpt:
tags: [grails, cucumber, geb, functional test]
comments: true
share: false
image:
  feature:
---

Many weeks ago, i suggested the team (my client's) to replace the Geb-Spock testing with Cucumber-Geb. Last week, i wrote a cucumber feature with Geb in parallel with the existing Geb-Spock spec as an example.

##### Why i suggested to use cucumber? Because

* i can write the spec without writing the implementation, unlike Geb-spock.
* steps defined are more reusable especially when combine with Geb page.
* special `@tagged` hook can use on for certain scenario. For example, start the fake SMTP server before a scenario that will send email.

However there are some issues with using cucumber which i will address in later part.

#### Get started

The simplest way to use cucumber with grails is to install [Grails cucumber plugin](https://grails.org/plugin/cucumber). Add this plugin to `plugins` in `BuildConfig.groovy` :

~~~
plugins {
    test ":cucumber:<version>"
}
~~~

Then i need to setup specify where the feature files and stepdef files is located.

~~~ groovy
cucumber {
  tags = ["~@ignore"]
  features = ["test/cucumber/features"]
  glue = ["test/functional/com/huubhr/steps"]
}
~~~

This configuration tells the plugin to look for feature and stepdef files in the path specified and ignore scenario tagged with `@ignore`. Tag at the feature level will be inherited by scenario, meaning you just need to put `@ignore` before Feature if you want to skip the whole feature file. More information about tag can be found [here](https://github.com/cucumber/cucumber/wiki/Tags)

#### Start writing feature

~~~
@clearCompanyCreated
Feature: Basic spring security applied to all registered user
  Background:
    Given setup company "huubHR Company", user "loginlogout.feature@h.c" and role "ROLE_ADMIN"
    Given go to index page

  Scenario: Registered user can login with valid password
    When user click on sign in button
    Then sign in form should appear
    And user enters username "loginlogout.feature@h.c" and password "pass"
    And user click signin button
    And user can see the employee list page
~~~


There is no different in writing a feature in Grails and writing a feature in Rails. Because grails-cucumber plugin is base on cucumber-jvm.

#### Implementing steps

Because i wish to use (in this case, re-use) the Geb page object to simplify my browser automation. I need bind the Geb browser in order to use page content directly. I used the [env.groovy](https://github.com/geb/geb-example-cucumber-jvm/blob/master/src/cucumber/resources/env/env.groovy) from geb-example-cucumber-jvm and added my helper class into it.

~~~ groovy
def theBrowser = null

Before() { scenario ->
  System.setProperty("geb.cucumber.step.packages", "pages")
  if(!binding.hasVariable('browser')) {
    theBrowser = new Browser()
    bindingUpdater = new BindingUpdater(binding, theBrowser)
    bindingUpdater.initialize()
  } else {
    // save for later screenshot taking
    theBrowser = browser
  }
}
~~~

Both Before and After will be executed at the start of a scenario and at the end of a scenario. In this code, we initialize and kept the browser for screenshot later. You can also create Before/After block for specify tag like below. I find it very useful and powerful to execute certain code before and after a certain scenario.

~~~ groovy
After ("@clearResetCode") {
  removeResetCodeIfNeeded()
}
~~~

Now i can use Geb command inside the stepdef, just an example (a snippet from my stepdef)

~~~ groovy
When(~/^go to reset password page with token "([^"]*)"$/) { String token ->
  to ResetPasswordPage, t: token
  at ResetPasswordPage
}
~~~

#### A better world

There is 1 more thing i forgot to mention, that is World.groovy. What is world? world is just an instance of object but all scenarios run in a world. Meaning, all step definitions will run in the context of the current World instance. You can use world to pass data between scenarios, for example setting a variable in the binding. `binding.setVariable('sessionId', sessionId)`

~~~ groovy
class huubHRWorld {
  def binding
  FunctionalTestSeedData seedData
  huubHRWorld(def binding){
    this.binding = binding
    this.seedData = new FunctionalTestSeedData(new RemoteControl())
  }
}

World() {
  def world = new huubHRWorld(binding)
  world.metaClass.mixin Requests
  world
}
~~~

You can use world.metaclass.mixin to merge multiple world and use it as if it is 1 world.

#### Conclusion

Overall, i still like to use cucumber if possible because of the benefits i mentioned at the begining. But there are some points need to take note of

* no global hook to execute code before and after feature, this is a drawback if compare with Geb-Spock which has SetupSpec.
* it is slow, due to Grails jvm startup and Selenium driver.
* no `@IgnoreRest` like in Geb-Spock, and not sure how can i run single scenario
