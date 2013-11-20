---
layout: post
title: "BinaryDrawable for Android: easily bundle small images into Android JAR files"
excerpt: "Include Android Bitmaps in your library JAR files with BinaryDrawable."
author: "Femi Omojola"
releasedate: "November 14, 2013"
pagename: binarydrawableforandroid
---
<span style="font-style: italic">Customers Expect Great Support Even Inside Your Mobile App. Hipmob provides a helpdesk and live chat for mobile apps. Increase sales, convert more subscribers, and grow customer loyalty. <a href="https://manage.hipmob.com/register" class="btn btn-success" style="font-weight: bold">Check it out</a></span>

<span style="font-weight: bold">TL;DR</span>: <a href="https://github.com/Hipmob/binarydrawable">BinaryDrawable</a> is a simple library to let you convert image files into Java source files for the Android platform.</span>

[Hipmob](https://www.hipmob.com "Hipmob") provides an SDK for helpdesk and real-time customer support that can be added to any mobile app; it's as simple as downloading our libraries for iOS or Android, integrating them into your apps with an app key we provide and then your app has a help desk and live chat (so your users can find help for any issues they are having or talk to you without having to leave your app). No server setup or code to write, just real time communication that scales with you.

On the Android platform our SDK is really simple: we provide a JAR file that has the implementations of the helpdesk, contextual help and live chat Activity classes, as well as a number of support classes. But: we have icons we use in the Activity classes, and we really didn't want to have to use an Android library project. We like the simplicity of just using a single JAR file. In the desktop Java world, distributing images and other non-code resources inside JAR files is fairly common. However on Android the build tools process any JAR files and only include class files in the final output: resources need to go into the **res** folder. For most libraries you can use a library project to have your resources included, but for an extra 10kB of images that seemed excessive to us.

Our first thought was to draw the images on-demand: pop open a <code>Picture</code>, grab the canvas and then paint onto that, then stick it into a <code>PictureDrawable</code> so we can use it on <code>Button</code>s and <code>ImageView</code>s.

Since the images were all small, this seemed like a great idea. But then we figured that if the images are so small, why bother manually painting the images: can we directly convert the image bytes into painting code? And of course the answer was yes.

Enter BinaryDrawable: a tiny little code generator that takes in an image file and outputs a Java source file that will return an Android Bitmap of the source image. We read the file, generate a byte array with the data and then decode that byte array on demand using the Android BitmapFactory class. You'll get a Java source file you can add to your Android project, and that file will get nicely bundled into your apk file by the Android build tools.

Usage is simple: just invoke the jar file with the image file and the output class name (with an optional package name).

```bash
java -jar binarydrawable.jar -i &lt;image file&gt; -o &lt;class name&gt; -p &lt;package name&gt;
```

As an example:

```bash
java -jar binarydrawable.jar -i disconnected.png -o Disconnected -p com.hipmob.android.binary
```

will produce the file ***com.hipmob.android.binary.Disconnected.java***. Once you add it to your project, you can get a <code>Bitmap</code> using

```bash
Bitmap b = com.hipmob.android.binary.Disconnected.getBitmap();
```

or a <code>BitmapDrawable</code> using

```bash
BitmapDrawable d = com.hipmob.android.binary.Disconnected.getBitmapDrawable();
```

The code is available at <a href="https://github.com/Hipmob/binarydrawable">https://github.com/Hipmob/binarydrawable</a>: take a look and see if its helpful for you.

P.S. If you're building a mobile app and want [great support for your app with helpdesk search, contextual help and live chat you should check out Hipmob](https://www.hipmob.com/)!

<a href="https://manage.hipmob.com/register" class="btn btn-large btn-success" style="font-weight: bold">Get Started with Hipmob</a>