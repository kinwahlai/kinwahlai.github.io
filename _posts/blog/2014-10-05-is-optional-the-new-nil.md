---
layout: post
title: "Is Optional the New Nil"
modified:
categories: blog
excerpt:
tags: [swift]
comments: true
share: false
image:
  feature:
date: 2014-10-05T13:37:04+08:00
---

Let's talk a bit more about optional. In the previous post, i briefly touch what is optional. So this post i'll try to cover a bit more about optional. 

Optional is essential for interacting with Objective-C library because at any point of time, there maybe a nil return but it is not just about handle the nil value.

Optional chaining in brief is that you chain a series of optional and at end it will return a value if the chaining call successful or not succeed due to a nil value in the chain. 
Let's take a look how optional chaining works? 

<pre><code>class Address {
    var line1:String
    var line2:String?
    var postcode: Int
    init(line1:String, line2:String?, postcode: Int) {
        self.line1 = line1
        self.line2 = line2
        self.postcode = postcode
    }
}
class Customer {
    let name: String
    var mailing: Address?
    init(name: String) {
        self.name = name
    }
}

var darren:Customer = Customer(name:"Darren Lai")
if let line1 = darren.mailing?.line1 {
    println("\(darren.name) stays at \(line1)")
} else {
    println("Customer does not have a mailing address")
}

darren.mailing = Address(line1: "MBS", line2:"Singapore", postcode: 12345)
if let line2 = darren.mailing?.line2? {
    println("Address has line 2 - \(line2)")
} else {
    println("Address does not have line 2")
}</code></pre>

Optional chaining can work on method too, even method that doesn't return a value!

There is another interesting "usage" (can not think of a better word now) of optional is the implicitly unwrapped optional properties. 

To define an implicitly unwrapped optional properties, we just need to suffix the type with (!). Like:
<pre><code>var line2:String!</code></pre>
 
It took me a while to understand why i want to use implicitly unwrapped optional properties, here are some reasons that i can think of.

* You can directly use the properties without unwrapping. 
* It is still treated like an optional, meaning you can assign nil to the properties.
* Combining unowned keyword to break strong reference cycle.

I took an example from "The Swift Programming Language" used to demonstrate ARC.
<pre><code>class Country {
    let name: String
    let capitalCity: City!
    init(name: String, capitalName: String) {
        self.name = name
        self.capitalCity = City(name: capitalName, country: self)
    }
}
 
class City {
    let name: String
    unowned let country: Country
    init(name: String, country: Country) {
        self.name = name
        self.country = country
    }
}</code></pre>

Optional shows 2 possibles, has value or no value. Sometimes we just need a little more verbose than that, for example getting a JSON string from an URL. There are other possibilities than just no value, like network error. 
Tuple does help in such situation but i'm thinking to try using the powerful enumeration.

Let's see some example

<pre><code>enum JSONResult {
    case Success(String)
    case Failure(Int,String)
    
    func unwrap() -> Any {
        switch self {
        case .Success(let json):
            return json
        case .Failure(let errorCode,let errorMessage):
            return "\(errorCode) - \(errorMessage)"
        }
    }
}

func getOptionalJSON(#url:String)->JSONResult {
//    return JSONResult.Success("Successful")
    return JSONResult.Failure(404, "Website not found")
}

var result = getOptionalJSON(url: "http://www.idontcare.com")
println(result.unwrap())</code></pre>

That's all i have for optional this time :) 



