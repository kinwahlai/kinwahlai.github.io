---
layout: post
title: "Basic of the basic - Part 1"
modified:
categories: blog
excerpt:
tags: [swift]
comments: true
share: false
image:
  feature:
date: 2014-09-17 01:55:39.000000000 +08:00
---

I'll highlight some basic that need to pay attention to in this post. I think the following are the areas that I'll cover.

* Part 1
	* Variable and constant
	* Flow control
	* Function and closure
* Part 2
	* Struct, enum and class
	* Protocol and extension
	* Generic

### Variable and constant
Swift introduce a "*var*" and "*let*" to make a variable. Compare to Objective-c, this is clearly more simpler, for example

{% highlight Swift %}
NSString *variable = @"hello world";
var variable = "hello world"
const NSString *name = @"darren";
let variable = "darren"
{% endhighlight %}

As you notice by now, that Swift compiler infer the data type for the variable but you can also specify the type by writing it after the variable, separated by a colon.

{% highlight Swift %}let name: String = "darren"{% endhighlight %}

*let* is like constant that you cannot change the value of the variable after define while *var* allow you to modify the value. You will see compile error when you try to do so. Data type inference also apply to collections.
Swift provides 2 collection types, known as arrays and dictionaries. Take note that Swift use "*[]*" for both array and dictionary compare to Objective-c that using "*@{}*" for dictionary

{% highlight Swift %}
let array = [1,2,3]
let dictionary = ["no":1]
{% endhighlight %}

Tuple groups multiple values into a single compound value. Tuple is not foreign for newer language. Take note that values within do not have to be the same type like array. For example

{% highlight Swift %}
let http404error = (404, "Not Found")
{% endhighlight %}

Swift introduces a new concept - Optional. Optional let you indicate the absence of a value for any type without the need for special constants. For example, a variable can has a value of x or no value at all. Place a question mark(?) after the type to indicate a variable is an optional, like

{% highlight Swift %}
var count:Int?
{% endhighlight %}

You no longer allow/need to assign *nil* to variable like in Objective-c. You will need to use optional if your variable may contain no value at all.
Since optional may not have any value it make sense to check before using. if optional has an value, it will return true otherwise false. After checking if optional has a value, then you can force unwrap the optional by adding exclamation mark(!) at the end. For example:

{% highlight Swift %}
var name:String?
if name {
  println(name!)
}
{% endhighlight %}

Take note that using force unwrap on optional that has no value will trigger a runtime error.
Swift provides an alternative way to check optional contains a value, that is optional binding. You can use optional binding with *if* and *while* to check for a value and extract the value into a constant/variable, the syntax is like

{% highlight Swift %}
if let ##constantName## = ##someOptional## { ##statements## }
{% endhighlight %}

### Flow control
Controlling the flow is important and Swift provides *if-else*, *switch-case*, *for-condition-increment loop*, *for-in loop*, *while loop*, *do-while loop*.
I want to bring attention to switch-case in Swift, that is considerably more powerful than Objective-c. First thing to take note is that switch statement do not "fall through" to the next case in Swift. Meaning you do not need to put *break* for each case. Cases in switch can match many different types of pattern, including range matches, tuples and complex matching conditions that can be expressed with a *where* clause. Here are some examples

{% highlight Swift %}
for index in 1...5 {
  println("\(index) times 5 is \(index * 5)")
}

switch age {
  case let x where x <= 20:
    println("Group A")
  case 21...40:
    println("Group B")
  case 41...60:
    println("Group C")
  case let x where x > 60:
    println("Group D")
  default:
    println("age fall out of any group")
}
{% endhighlight %}

### Function and closure
Comparing to the complex Objective-c-style method, swift function has a simpler style like C-style function. Functions can also be written within another function. Function in Swift has a syntax like this

{% highlight Swift %}
func ##funcName## () { }
func ##funcName## ( ##params## ) -> ##returntype## { }
func ##funcName## ( externalParameterName localParameterName: Int ) { }

func sayHello(#name:String) {
  func createGreeting() -> String {
    return "Hello, \(name)"
  }
  println(createGreeting())
}
{% endhighlight %}

If you provide an external parameter name, that name must always be used when calling the function. You can also use the shorthand external parameter name by prefix the local parameter name with hash symbol(#). Putting *inout* keyword to the parameter allows the function to modify the value of the parameter directly.
Function type in Swift means you can use a function like any other types. For example, you can define and assign a function to that variable. You can pass function type as parameter into a function or use as the return as well. Given this flexibility, we can eventually build a quite complex function.

{% highlight Swift %}
var greetingFunc:(String)->() = sayHello
{% endhighlight %}

#### Closure
Closures to me are like the blocks in Objective-c and lambdas in other programming languages.
As described in The Swift Programming Language book, functions are actually special cases of closures. Closure has this general form, take note of the *in* in the syntax.

{% highlight Swift %}
{ (##parameter##) -> ##return type## in
  ##statement##
}
{% endhighlight %}

Closures in Swift have the following optimizations

* Inferring parameter
* Implicit returns from single-expression closure
  * Meaning the return keyword can be omitted
* Shorthand argument name
  * $0, $1, $2 refers to the closure's arguments
* Trailing syntax
  * If function's final argument is a closure, you can write the closure outside of (and after) the parentheses.

Examples:

{% highlight Swift %}
let array = [1,2,3]
let reserved = array.sorted({ $0 > $1 }) 
let reserved = array.sorted() { $0 > $1 } // trailing syntax
{% endhighlight %}

There is 1 more thing about closure before i wrap up part 1; that is capture values. incrementor() capture the amount and runningTotal from it's surrounding context in this example

{% highlight Swift %}
func makeIncrementor(forIncrement amount: Int) -> () -> Int {
    var runningTotal = 0
    func incrementor() -> Int {
        runningTotal += amount
        return runningTotal
    }
    return incrementor
}
{% endhighlight %}

Swift determines what should be captured by reference and what should be copied by value. You don’t need to annotate amount or runningTotal to say that they can be used within the nested incrementor function. Swift also handles all memory management involved in disposing of runningTotal when it is no longer needed by the incrementor function.
