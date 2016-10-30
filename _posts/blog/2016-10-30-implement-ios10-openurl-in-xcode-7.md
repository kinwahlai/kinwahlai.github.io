---
layout: post
title: "Implement iOS10 openURL in Xcode 7"
date: 2016-10-30T10:25:21-07:00
modified:
categories: blog
excerpt:
tags: [swift, objective c]
comments: true
share: true
image:
  feature:
---

My team released a version of our app before the iOS 10 is available. We have in-app upgrade screen which will open the itms-services url and allow user to perform upgrade. To my surprise, our users see the alert "failed to upgrade please contact customer support" when we release a new version v5.3 in mid of October.

After doing some searching on Google, I landed on Apple document about [What's New in iOS10](https://developer.apple.com/library/content/releasenotes/General/WhatsNewIniOS/Articles/iOS10.html) and then I notice that openURL function has been deprecated from iOS10.

Oh no. what should I do now, I can't fix the previous version that is out there. I decided to make my 5.3 to use the right function "openURL:options:completionHandler:" for iOS10 and "openURL:" for iOS9.

I think I should have pay more attention to the OS release and what's new in it and also the warnings when I compile our code. 😌

I wanted to upgrade my code base to Swift3 and using Xcode 8, but it is time consuming and i need to replace the 5.3 now before everyone upgraded. Plus I still cant go to Xcode 8 and use swift 2.3 because some pod I use doesn't have 2.3 support. So in short, i'm stuck in Xcode 7.3.1 and swift 2.2 now.

Xcode 7.3.1 doesn't have iOS10 SDK and it doesn't know there is a function "openURL:options:completionHandler:" in UIApplication. It failed when i try to compile and run.

Let's try using "performSelector:withObject" but it doesn't work because the new function has more than 2 parameters. Since that doesn't work, i try to use NSInvocation invoke a method dynamically, but from what i know NSInvocation is not available in Swift. Well, time to go back to Objective-C. Luckily, it is not that hard.

First, I need to create a new Objective-C class with name GoToURL and I will have the .h and .m files. Then I add the import statement to the Bridging-Header.h so that I can use the class in Swift environment. These are the simple steps.

This class is like a kind of wrapper to the original iOS10 openURL. I add a class method to GoToURL class "openURL:options:completionHandler:". This class method is the statement to the iOS10 openURL method definition.

```obj-c
#import <UIKit/UIKit.h>

@interface GoToURL : NSObject
+ (void) openURL:(nonnull NSURL *) url options:(nonnull NSDictionary *) dictOptions completionHandler:(nullable void (^)(BOOL success))completion;
@end
```

Let's go to the detail implementation of the class method. Actually, there is nothing special in the method if you know how to use NSInvocation.

```obj-c
#import "GoToURL.h"

@implementation GoToURL
+ (void) openURL:(NSURL *) url options:(NSDictionary *) dictOptions completionHandler:(void (^)(BOOL success))completion {
    SEL selOpenUrl = NSSelectorFromString(@"openURL:options:completionHandler:");
    NSMethodSignature *signature = [[UIApplication sharedApplication] methodSignatureForSelector:selOpenUrl];
    NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:signature];
    [invocation setTarget:[UIApplication sharedApplication]];
    [invocation setSelector:selOpenUrl];
    [invocation setArgument:&url atIndex:2];
    [invocation setArgument:&dictOptions atIndex:3];
    [invocation setArgument:&completion atIndex:4];
    [invocation invoke];
}
```

I can now use the new class in Swift to handle openURL for iOS10. I going to use the `#available` attribute to allow me to use GoToURL.openURL for iOS10 and old openURL for iOS9.

```swift
public func upgradeNow() -> Bool {
    let iosDownloadPrefix = "itms-services://?action=download-manifest&url="
    guard let appLocationUrl = appLocationUrl, let url = NSURL(string: iosDownloadPrefix + appLocationUrl.urlEncode()) else {
        return false
    }

    if #available(iOS 10, *) {
        return upgradeNow10(url)
    } else {
        return upgradeNow9(url)
    }
}

private func upgradeNow10(url: NSURL) -> Bool {
    if UIApplication.sharedApplication().canOpenURL(url){
        GoToURL.openURL(url, options:[NSObject : AnyObject]()) { (success) in
            UIControl().sendAction(#selector(NSURLSessionTask.suspend), to: UIApplication.sharedApplication(), forEvent: nil)
        }
        return true
    }
    return false
}

private func upgradeNow9(url: NSURL) -> Bool {
    if UIApplication.sharedApplication().openURL(url) {
        UIControl().sendAction(#selector(NSURLSessionTask.suspend), to: UIApplication.sharedApplication(), forEvent: nil)
        return true
    }
    return false
}
```

Now, I can compile and run my code on iOS9 and iOS10 using Xcode 7 without a problem.

### EXTRA:
Another tip to build and run the app on iOS10 device using Xcode 7.

*Prerequisites: You need to have Xcode 8 installed in the same machine*

Open up a terminal, then type this command
```bash
ln -s /Applications/Xcode\ 8.app/Contents/Developer/Platforms/iPhoneOS.platform/DeviceSupport/10.0\ \(14A345\)/ /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/DeviceSupport
```

This command is to put a iOS10 device support symlink to the Xcode 7.
