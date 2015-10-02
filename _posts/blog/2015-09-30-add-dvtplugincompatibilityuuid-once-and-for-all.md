---
layout: post
title: Add DVTPlugInCompatibilityUUID once and for All?
modified:
categories: blog
excerpt:
tags: [Xcode, objective-c, DVTPlugInCompatibilityUUID, Xcode plugin]
comments: true
share: true
image:
  feature:
date: 2015-09-30T21:30:34+08:00
---

Whenever there is a new version of Xcode release, plugin maintainer will need to insert the new DVTPlugInCompatibilityUUID into their Info.plist, otherwise the plugin will not work with the new Xcode. This seems to be a trivial thing to do, but I wonder how can I make my plugin to support new Xcode without me adding manually.

I realize that [Alcatraz](http://alcatraz.io/) will clone the plugin repo and build it to install the plugin. So i can use this opportunity to insert new DVTPlugInCompatibilityUUID into the Info.plist. Note: it is the same when you install plugin manually.

#### My attempt to solve this problem
I wrote this shell script [inject_DVTPlugInCompatibilityUUID.sh](https://gist.github.com/kinwahlai/361220d7de10793d1649) and
added a new `Run Script Phase` to my project build phase.
![](/images/2015-09-30-add-dvtplugincompatibilityuuid-once-and-for-all/inject_DVTPlugInCompatibilityUUID.png)

What the script did are the following

1. Get the new UUID by reading the DVTPlugInCompatibilityUUID from Xcode Info.plist

2. Check if the new UUID already added to DVTPlugInCompatibilityUUIDs array

3. Add it to the Info.plist using plistbuddy if not exist.

I know that some of us do install 2 Xcode in parallel, so the script has a loop to process all Xcode with installed in the /Applications.

I guess i will know whether my solution works in the next release of Xcode. Feel free to use the script or fork to modify the script.
