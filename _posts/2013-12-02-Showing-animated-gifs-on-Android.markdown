---
layout: post
title: "Showing	animated GIFs on Android: GifAnimatedDrawable"
excerpt: "A neat, tidy way to use animated GIFs in Android apps as easily as static images using GifAnimatedDrawable."
author: "Femi Omojola"
releasedate: "December 2, 2013"
pagename: gifanimateddrawableforandroid
---
<span style="font-style: italic">Customers Expect Great Support Even Inside Your Mobile App. Hipmob provides a helpdesk and live chat for mobile apps. Increase sales, convert more subscribers, and grow customer loyalty. <a href="https://manage.hipmob.com/register" class="btn btn-success" style="font-weight: bold">Check it out</a></span>

<span style="font-weight: bold">TL;DR</span>: <span><a href="https://github.com/Hipmob/gifanimateddrawable">GifAnimatedDrawable</a> is a simple library to let you load animated GIFs stored as assets, raw resources or even downloaded from the web and use them as Android Drawable objects for backgrounds or ImageViews.</span>

[Hipmob](https://www.hipmob.com "Hipmob") provides an SDK for helpdesk and real-time customer support that can be added to any mobile app; it's as simple as downloading our libraries for iOS or Android, integrating them into your apps with an app key we provide and then your app has a help desk and live chat (so your users can find help for any issues they are having or talk to you without having to leave your app). No server setup or code to write, just real time communication that scales with you.

On the Android platform our live chat implementations support sending images between users: we use the Android platform support for PNG, JPG and GIF formatted images and it works quite nicely. However, we've been interested in extending our image support to animated GIFs (which are all the rage right now). In addition, animated GIFs make transfer of simple animations (for things like stickers, for example) quite straightforward.

There generally hasn't been great support for animated GIFs on the Android platform: the [Movie](http://developer.android.com/reference/android/graphics/Movie.html) class can be used, but it doesn't really do all the things you'd like (you can't use it as a View background, for example). [You see people recommending the use of <code>WebView</code>s](http://www.roman10.net/android-animation-playback-display-gif-animation-in-webview/), which feels like swatting a fly with a sledgehammer.

There have been a couple of other interesting efforts, including [this one](http://commonsware.com/blog/2013/10/01/converting-animated-gifs-animationdrawables.html), which is a Ruby-based command line tool that uses ImageMagick to extract the frames from the animated GIF file and dump them into the **res** folder with the appropriate drawable XML. Besides the need for Ruby this doesn't work for files that are downloaded at runtime.

[Johannes Borchardt](http://droid-blog.net/) has come up with the closest thing we could find: [http://code.google.com/p/animated-gifs-in-android/](http://code.google.com/p/animated-gifs-in-android/) provides a <code>GifDecoderView</code> class that provides a dedicated View implementation using a custom GIF decoder. The missing link was just the actual Drawable implementation, and the built-in [AnimationDrawable](http://developer.android.com/reference/android/graphics/drawable/AnimationDrawable.html) lets us get there.

Enter GifAnimationDrawable: using a slightly modified version of the GifDecoder from [http://code.google.com/p/animated-gifs-in-android/](http://code.google.com/p/animated-gifs-in-android/), we can create an <code>AnimationDrawable</code> that can be used anywhere a <code>Drawable</code> implementation is accepted. A small modification of the existing GifDecoder lets us pull out only the first frame and then defer processing the rest of the frames to a separate thread. We can then call <code>setVisible</code> or <code>start</code> on the GifAnimationDrawable at any time (such as when a button gets pressed) and everything just works as expected.

The parsing is a little slow: it would be optimal if there was a way to access the GIF processing code implemented in the BitmapFactory.decodeByteArray implementation (which we assume uses native code and will outperform our implementation) and use that to extract the individual frames. We'll be looking at baking that into place in a future update.

Usage is simple: just pass the <code>File</code> or <code>InputStream</code> into the constructor, and you'll get a Drawable. The example below loads up a raw resource: you could just as easily pass it the InputStream from an http download or a file on the SD card:

```java
GifAnimationDrawable anim = new GifAnimationDrawable(getResources().openRawResource(R.raw.anim1));
```

The source code is available at <a href="https://github.com/Hipmob/gifanimationdrawable">https://github.com/Hipmob/gifanimationdrawable</a>: take a look and see if its useful. For the folks who just want to get cracking there's a handy jar file you can just add to your project.

P.S. If you're building a mobile app and want [great support for your app with helpdesk search, contextual help and live chat you should check out Hipmob](https://www.hipmob.com/)!

<a href="https://manage.hipmob.com/register" class="btn btn-large btn-success" style="font-weight: bold">Get Started with Hipmob</a>
