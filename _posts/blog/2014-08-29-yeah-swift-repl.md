---
layout: post
title: "Yeah, Swift REPL"
modified:
categories: blog
excerpt:
tags: [repl, swift]
comments: true
share: false
image:
  feature:
date: 2014-08-29 13:57:37.000000000 +08:00
---

Swift, XCode 6 had been around for couple months now. Something new comes to me yesterday, that is REPL for Swift. REPL stands for Read-Eval-Print-Loop and it should not be foreign to Rubyist or Pythonista.

### We already had Playground
What is the different between playground and REPL? Well, from what i know now, they have different use cases.
I think i'll prototyping and try new code with Playground and REPL mainly for debugging purpose.

As we already knew, we can prototype our application in Playground, but this doesn't mean you cannot do it in REPL. Doing it in REPL just a lot harder. Playground always start from a clean slate and cannot access to current stack variables of any application.
REPL is very handy when it comes to debugging. 
For example, i hit a breakpoint for my application and then i write a small code to verify my existing code. REPL can access to the current stack variables of your application. If you notice, the cool stuff here is that you can inject your application from command line interactively.

### 2 ways you can access REPL
Via XCode debug during breakpoint, by typing repl
![](/images/2014-08-29-yeah-swift-repl/xcode-repl.png)

Via terminal, by typing `xcrun swift` or `lldb --repl` ( You will have installed xcode6 command line tools in order to use anything related to Swift)
![](/images/2014-08-29-yeah-swift-repl/terminal-repl.png)

*TIPS*: You can exit a REPL session by typing `:` and ask for help using `:help`
So give it a try today and share with me how would you use the REPL.
