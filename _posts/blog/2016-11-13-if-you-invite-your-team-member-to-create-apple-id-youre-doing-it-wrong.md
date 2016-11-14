---
layout: post
title: If You Invite Your Team Member to Create Apple Id, You're Doing It Wrong
modified:
categories: blog
excerpt:
tags: [iOS, iOS development, automation, fastlane, match]
comments: true
share: true
image:
  feature:
date: 2016-11-13T17:37:11-08:00
---


> I invite my new member to join the apple development team. He may need to create a new Apple id. Then he has to create a CSR to create a development cert and import into keychain access. He has to do all these before he can start development on actual device. On top of that, if he want/need to build adhoc or production ipa, then I need to share with him the distribution cert and provision.

This is the typical scenario when a new member join my team. This is just the beginning. It may takes up to 30 mins ~ 1 hr if everything works fine. Usually, I face some problem with provision profile during the process.

I found a new way to do it, which is using **match** in fastlane framework. Here is the snippet from [match website](https://github.com/fastlane/fastlane/tree/master/match)

> A new approach to iOS code signing: Share one code signing identity across your development team to simplify your codesigning setup and prevent code signing issues.
>
>**match** is the implementation of the [https://codesigning.guide](https://codesigning.guide concept). match creates all required certificates & provisioning profiles and stores them in a separate git repository. Every team member with access to the repo can use those credentials for code signing. match also automatically repairs broken and expired credentials. It's the easiest way to share signing credentials across teams

In short, it stores all certificates and provision profiles for the shared Apple ID account in a git repo. Then share those with everyone in the team.

#### Using match with your new project

Using **match** with a new project is quite straightforward. I create a new Apple ID with a new shared email and a new empty repo for this purpose. I run this command `match init` at my project directory ![](https://github.com/fastlane/fastlane/raw/master/match/assets/match_init.gif)

The command will create the Matchfile that looks like this

```ruby
git_url "git@github:kinwahlai/certificates.git"
type "development" # The default type, can be: appstore, adhoc or development
username "shared@kinwahlai.com" # Your Apple Developer Portal username
team_id "XYZ1234567"
# For all available options run `match --help`
# Remove the # in the beginning of the line to enable the other options
```

When I run the command `match` now:
1. `git clone` repo to tmp folder, then ask you for password to decrypt the files in the repo because all files are encrypted before commit and push to repo.
2. Check the certificates in repo for validity in Apple Developer portal, **match** will create new certificate if missing or expired. Then install the certificates into keychain access.
3. Install provision profiles.
4. Set special environment variables, example sigh_com.kinwahlai.App_development, sigh_com.kinwahlai.App_development_team-id and etc

###### PRO TIP:
* Use `--readonly` at the end of the command if I do not want match to create certificate automatically.
* Use `--verbose` at the end of the command to see more print out of the execution.
* I can use specific command like `adhoc, development, appstore` to install the specific set of certificate and profile.
* I can always use `--help` to see more options with **match**

#### Make sure everyone is using the same provision profile

Like I said before, I always has a problem with provision profile when setting up a new development environment. **match** creates special environment variables `sigh_<app bundle identifier>_<profile type>` for each profile type. Now I can modify my build setting's *provisiong profile* to use these special variable.
![](/images/match/fastlane-match.png)

###### New lane - certs_profiles
My team can now use the new lane 'certs_profiles' to install the same set of certificates and provision profiles.

```ruby
desc "Download and refresh provision profile (readonly)"
lane :certs_profiles do
  match(type: "development", force_for_new_devices: true, readonly: true, verbose: true)
  match(type: "adhoc", force_for_new_devices: true, readonly: true, verbose: true)
  match(type: "appstore", readonly: true, verbose: true)
end
```

Take note that `force_for_new_device` option will cause profile to be updated when new device added to Apple Developer portal.


#### Using match within Enterprise distribution

**Match** disable enterprise by default. The reason for not supporting enterprise by default is listed here [Enterprise Profiles](https://github.com/fastlane/fastlane/tree/master/match#enterprise-profiles)

To support enterprise, I need to set the environment variable "MATCH_FORCE_ENTERPRISE" = true before running match command, example: `MATCH_FORCE_ENTERPRISE=1 match enterprise --readonly`
