---
layout: post
title: "Having a remote member in the team"
date: 2015-03-14T18:14:21+08:00
modified:
categories: blog
excerpt:
tags: [scrum, team, google spreadsheet, floobits, tmate, cacoo]
comments: true
share: false
image:
  feature:
---

Why do we want to have co-located team? Co-located team means a team works together in a single location. Team can get benefits like face-to-face interactions, building team relationships, instant/ad-hoc discussion and etc. from co-location.

I am working with a client that have a development team in Singapore. However for certain reason, we have 1 member located in Japan office. I'm going to share how the team work out the challenging situation.

##### Being effective in all meetings
Luckily, we are still closer in term of timezone because the remote member is in Japan office. Now we rely a lot more on various electronic tools to facilitate the meeting. Team bought a pair of PS3 with cam and put 1 each office. So they can see each other's office and tried to use it to do daily scrum, sprint planning and others. However, team find it not very effective, so they use Skype to have video call for all the meetings. But still use the PS3 to show the office environment.

Team do not have physical task board, so they use google spreadsheet to track the product backlog and sprint backlog. Team find it effective and appropriate for now although there are some drawbacks like 1 person typing and the rest is waiting.

To mitigate the "typist" problem, team using a web application call __[Cacoo](https://cacoo.com)__ for their sprint planning 2 and retrospective. It is a online collaborative diagram application, so all member can contribute at the same time. 1 drawback of using Cacoo is that someone need to copy the task back to spreadsheet's sprint backlog.

There are some ad-hoc discussion about various topics from time to time in Singapore office. They need to keep reminding themselves to include the remote member when this happens.

##### How to do remote pair programming
Team practice pair programming and TDD. They use another service __[Floobits](https://floobits.com)__ to code together. After install Floobits plugin into their IntelliJ IDE, they can edit the same code and see changes in real time. Team has another problem is that they cannot share the terminal that they using to execute the test. Now they are using Skype screen sharing but it is bad because of bad performance. I did recommend team to try __[Tmate](http://tmate.io)__ to share their terminal. Tmate is a fork of tmux with a server.

I personally don't see having a remote member is a problem for the team, instead i think it is an opportunity for team to define and work out how they want to work together. I believe team dynamic with change if the remote member can relocate to Singapore.
