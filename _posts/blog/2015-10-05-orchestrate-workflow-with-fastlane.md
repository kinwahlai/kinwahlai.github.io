---
layout: post
title: Orchestrate workflow With Fastlane
modified:
categories: blog
excerpt:
tags: [Xcode, Workflow, IPA, Distribution, xctool, xcodebuild, provision profile, cert, keychain]
comments: true
share: true
image:
  feature:
date: 2015-10-05T15:14:16+08:00
---

I've been writing a shell script with tools like [Nomad](http://nomad-cli.com) to build, test and even distribute the IPA. It works but not very organize/documented and you will need to find all the necessary parts yourself. Plus you need to have some shell scripting skill.

The good news is that I found this tool - [Fastlane](https://Fastlane.tools). Fastlane is a ruby gem created by Felix Krause to help to facilitate all the 3rd party tools and automate the building, packaging and distributing the IPA. Actually it can do more than that. An example of what you can do:-

* git pull latest code
* increment build number
* git commit and push the new build number to remote
* using 'sigh' to download latest provision profiles
* using 'gym' to build and test and package
* upload and distribute via crashlytics

Fastlane has a ruby script call Fastfile(which is the main script) located in the folder /fastlane after install. Fastlane can support multiple platforms and multiple lanes for different needs. For example: osx, ios, watch platforms which can have different lanes.

There are 2 types of lanes, lane and private_lane. Lane is like a wrapper of an action or multiple actions, personally i put 1 action into 1 lane.

~~~ ruby
lane :build do | options |
  # build action
  verify_checksum()
end

private_lane :verify_checksum do | options |
  # verify checksum
end
~~~

You can execute 'build' lane from command line, like `fastlane build`, but you cannot do the same for 'verify_checksum' because it is private. You can switch/call from 1 lane to another and back. From my understanding, each lane will implicitly return the last line of code in that lane.

For every platform, there are before_all, after_all and error. before_all and after_all is quite self explain from the name. Error method will be executed if any error happened in between, so you can handle the error differently.

The power of Fastlane is that it is a ruby script, an active open source project and it comes with many (over 100 actions now) actions which maintain and support by the community. You can list all the supported actions with this command `fastlane actions` or visit the github page [Actions](https://github.com/KrauseFx/fastlane/blob/master/docs/Actions.md). You can easily orchestrate a workflow with all the actions provided. You can also create your own action if you want, checkout this section in the [ReadMe](https://github.com/KrauseFx/fastlane/blob/master/docs/README.md#extensions).

I found it works very well with CI server too. Give it a try, you will probably like it.
