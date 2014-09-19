---
layout: post
title: "Swift Singapore Meetup - Collections challenge"
modified:
categories: blog
excerpt:
tags: [meetup, swift]
comments: true
share: false
image:
  feature:
date: 2014-09-02 10:00:32.000000000 +08:00
---

I prepared 2 simple challenge to learn array and dictionary in Swift. You will also learn a bit of the flow control like for-loop and switch-case.
### Challenge #1:
Given the array below, count the color in array and return a dictionary like ["yellow": 4, "black": 4]

{% highlight swift %}
let colors = ["red","blue","white","grey","red","blue","white","pink","yellow","green","black","pink","red","blue","white","grey","red","blue","white","pink","yellow","green","black","red","blue","white","grey","red","blue","white","pink","yellow","green","black","red","blue","white","grey","red","blue","white","pink","yellow","green","black"]
{% endhighlight %}

### Challenge #2:
A bit similar with previous challenge, but with a little extra work.
Given the array of participant's age for an event, group the age array into dictionary like ["Group A": 4, "Group B": 4]

According to this rule:-

* Group A - &lt; 20
* Group B - 21 ~ 40
* Group C - 41 ~ 60
* Group D - &gt; 61

{% highlight swift %}
let ages = [18,22,34,41,32,18,65,54,33,45,56,34,51,63,62,18,22,34,41,32,18,65,54,33,45,56,34,51,63,62,57,43,21,33,19,28,18,22,34,41,32,18,65,54,33,45,56,34,51,63,62,18,22,34,41,32,18,65,54,33,45,56,34,51,63,62]
{% endhighlight %}

Feel free to share with me your solution to these 2 challenges.

