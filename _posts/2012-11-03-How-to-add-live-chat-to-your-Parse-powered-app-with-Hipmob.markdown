---
layout: post
title: "How to add live chat to your Parse-powered app with Hipmob"
excerpt: "Hipmob allows you to add live support and user chat to your Android or iOS mobile app in less than 15 minutes. Parse provides a powerful backend-as-a-service for your mobile app. See how we mix the 2 to leverage Hipmob's ease of use and Parse's powerful targeted push notifications on the Android platform."
author: "Femi Omojola"
releasedate: "November 3, 2012"
pagename: howtoaddlivechattoyourparsepoweredappwithhipmob
---
<span style="font-weight: bold">TL;DR</span>: <span style="font-style: italic">Hipmob allows you to add live support chat and user chat to your Android or iOS mobile app in less than 15 minutes, while Parse provides a powerful backend-as-a-service for your mobile app. In this article we add Hipmob to a simple Parse app, and using the Parse object identifiers we tie the Hipmob connection to the Parse user. We can then leverage Parse's targeted push notifications to ping the mobile app whenever the mobile user is sent a chat message on the Hipmob platform.</span>

[Hipmob](https://www.hipmob.com "Hipmob") provides an SDK for real-time communication that can be used to provide live support to your users (via chat) or to build user-to-user chat or group chat into your mobile or web app; it's as simple as downloading our libraries (for iOS, Android and the web), integrating them into your apps with an app key we provide and then your app has real-time communications (so you can talk to users or they can talk to each other). No server setup or code to write, just real time communication that scales with you.

Backend-as-a-Service providers are becoming more and more powerful: <a target="_blank" href="https://www.parse.com">Parse</a> is very popular, as well as a fellow YC company, and with support for both user authentication and push notifications it seemed like a natural fit for integration. Tens of thousands of apps leverage Parse's services: being able to instantly add chat to all of those apps seemed like a great idea. A couple of hours later, here we are!

### Mission

Take a simple Android app using the Parse platform (in this case, the simple todo list app provided by Parse) and:
<ul style="margin-left: 20px">
<li>Add Hipmob support chat.</li>
<li>Connect the Hipmob connection to the Parse User.</li>
<li>Add support for Parse push notifications to the app.</li>
<li>Configure the Hipmob management interface to send push notifications to the app.</li>
</ul><br />

After that we should be able to send a message to the app's user and receive Parse push notifications in the app.

All the code shown here is available on Github: check it out at <a target="_blank" href="https://github.com/Hipmob/hipmob-parse-android">https://github.com/Hipmob/hipmob-parse-android</a>. If you just want to see the end result you can clone that repo, copy your Parse application ID and client key into the com.hipmob.parse.demo.ToDoListApplication class, copy your Hipmob application id into com.hipmob.parse.demo.ToDoListActivity, and then build it. You'll need to set the Parse application ID and REST API key in the Hipmob management interface so we can send push notifications (<a target="_blank" href="http://www.hipmob.com/documentation/integrations/parse.html#enabling">see the Hipmob Parse docs for how</a>) and you'll be good to go. The full documentation on Hipmob's Parse integration can be found <a target="_blank" href="https://www.hipmob.com/documentation/integration/parse.html">here</a>.

### Setup
There's a bit of prep work before we can start.

<ul style="margin-left: 20px">
<li>If you haven't already done so, sign up for a free account at <a target="_blank" href="https://manage.hipmob.com/">http://manage.hipmob.com</a> with your name and email address. Once you're signed up an app will be automatically created for you. If you already have an account you can just use an existing app (or create a new one).</li>
<li><a href="https://hipmob.s3.amazonaws.com/android-hipmob-1.0-beta-12.jar">Download the latest Hipmob android library</a>.</li>
<li>If you don't already have a Parse account, sign up for free at <a target="_blank" href="https://parse.com/">https://parse.com</a>, then create a new Parse app.</li>
<li><a href="http://parse-android.s3.amazonaws.com/2f1e2427b5742cfeedf6d37a5299810d/Parse-Todo-Project-1.1.8.zip">Download the Parse todo list sample Android app</a>, then open it up in Eclipse.</li>
</ul><br />

And then we're ready to start.

#### Add Hipmob support chat

In Eclipse, we add the Hipmob library to the libs folder: depending on your version of Eclipse and the Android tools, you might need to add it to the build path manually, but more recent versions take care of that for you.

<img style="border: 1px solid #dedede; padding: 0px;margin: 5px auto; display: block" src="/images/2012-11-03/figure1.png" /><br />

Add the <code>HipmobCore</code> Activity to the AndroidManifest.xml file so we can fire up the Hipmob chat activity: you can add it just before the closing <code>&lt;/application&gt;</code> tag.

<pre class="brush: xml">
       &lt;activity android:name="com.hipmob.android.HipmobCore" /&gt;
    &lt;/application&gt;
</pre>

Modify the <code>res\layout\main.xml</code> layout file so we have a button to launch the support chat.

<pre class="brush: xml">
&lt;?xml version="1.0" encoding="utf-8"?&gt;
&lt;RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="fill_parent"
    android:layout_height="fill_parent" &gt;

    &lt;LinearLayout
        android:id="@+id/buttonbar1"
        style="@style/ButtonBar"
        android:layout_width="fill_parent"
        android:layout_height="wrap_content"
        android:layout_alignParentBottom="true"
        android:gravity="right" &gt;

        &lt;Button
            android:id="@+id/support"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/button_support" &gt;
        &lt;/Button&gt;
    &lt;/LinearLayout&gt;

    &lt;LinearLayout
        android:layout_width="fill_parent"
        android:layout_height="fill_parent"
        android:layout_above="@+id/buttonbar1"
        android:layout_alignParentTop="true" &gt;

        &lt;ListView
            android:id="@+id/android:list"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content" /&gt;

        &lt;TextView
            android:id="@+id/android:empty"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:text="@string/empty" /&gt;
    &lt;/LinearLayout&gt;

&lt;/RelativeLayout&gt;
</pre>

which gives us a simple Support button.

<img style="border: 1px solid #dedede; padding: 0px;margin: 5px auto; display: block" src="/images/2012-11-03/figure2.png" /><br />

Create variables to store the support button and the Hipmob application id (taken from the Hipmob management interface during setup) in the <code>ToDoListActivity</code> class (make sure you use a valid application id!).

<pre class="brush: java">
private Button support;
private static final String HIPMOB_KEY = "12345678901234567896948390494558";
</pre>

In the <code>onCreate</code> callback fetch the button.

<pre class="brush: java">
support = (Button)findViewById(R.id.support);
support.setOnClickListener(this);
</pre>

And then add the click listener that will launch the support chat.

<pre class="brush: java">
@Override
	public void onClick(View v)
	{	
		// create an intent
		Intent i = new Intent(this, com.hipmob.android.HipmobCore.class);
		 
		// REQUIRED: set the appid to the key you're provided
		i.putExtra(HipmobCore.KEY_APPID, HIPMOB_KEY);
		 
		// launch the chat window
		startActivity(i);
	}
</pre>

And that is the basics we'll need: we can now launch a support chat client when we push the Support button.

#### Connect the Hipmob connection to the Parse User.

We use Parse's <a target="_blank" href="https://www.parse.com/docs/push_guide#sending-queries/REST">targeted push notifications</a>: this lets us send a push notification using Parse's REST API and specify a Parse query as the target. Here we'll add code to setup the Parse installation and pass the Parse user id to Hipmob.

The <code>ToDoListActivity</code> uses an <code>AsyncTask</code> to connect with Parse: we leverage this to setup the <code>ParseInstallation</code> with the information we'll need for the Parse push query. Add the following code to the beginning of the <code>doInBackground</code> method: this ensures that a Parse User has been created and saved on the Parse backend, adds the user's object ID to the <code>ParseInstallation</code> as a key we can query against and then makes sure the updates to the <code>ParseInstallation</code> are also saved to the Parse backend. 

<pre class="brush:java">
// make sure we have an installation
getApplication();
ParseInstallation pi = ParseInstallation.getCurrentInstallation();
String id = pi.getString("hipmobId");
if(id == null){
      String uid = ParseUser.getCurrentUser().getObjectId();
      try{
		if(uid == null) ParseUser.getCurrentUser().save();
		pi.put("hipmobId", ParseUser.getCurrentUser().getObjectId());
		pi.save();
      }catch(Exception e1){
	android.util.Log.v("ToDoListActivity", 
	"Exception saving installation id ["+e1.getMessage()+"]", e1);
      }
}
</pre>

We'll use the <code>hipmobId</code> as the key for the Parse push query. We just need to pass it off as the Hipmob application identifier by modifying the <code>onClick</code> method.

<pre class="brush: java">
@Override
public void onClick(View v)
{	
	// create an intent
	Intent i = new Intent(this, com.hipmob.android.HipmobCore.class);
	 
	// REQUIRED: set the appid to the key you're provided
	i.putExtra(HipmobCore.KEY_APPID, HIPMOB_KEY);
	 
	// Use the parse user id
	i.putExtra(HipmobCore.KEY_DEVICEID, 
	           ParseInstallation.getCurrentInstallation().getString("hipmobId"));
	
	// launch the chat window
	startActivity(i);
}
</pre>

And now the next time the user opens the chat window we'll get the <code>hipmobId</code> sent to us!

#### Add support for Parse push notifications to the app.

Parse uses a custom push notification system on Android (NOT Google Cloud Messaging): to configure it we just need to add the <code>Service</code> and <code>Receiver</code> to the AndroidManifest.xml file and then register for push notifications.

First the manifest changes: once again add these lines just before the closing <code>&lt;/application&gt;</code> tag.

<pre class="brush: xml">
&lt;service android:name="com.parse.PushService" /&gt;
&lt;receiver android:name="com.parse.ParseBroadcastReceiver" &gt;
   &lt;intent-filter&gt;
      &lt;action android:name="android.intent.action.BOOT_COMPLETED" /&gt;
      &lt;action android:name="android.intent.action.USER_PRESENT" /&gt;
   &lt;/intent-filter&gt;
&lt;/receiver&gt;
</pre>

Then, the push notification subscription: add this to the end of the <code>onCreate</code> callback in the <code>ToDoListActivity</code> class.

<pre class="brush: java">
// subscribe for push
PushService.setDefaultPushCallback(this, 
                              com.hipmob.parse.demo.ToDoListActivity.class);
PushService.subscribe(this, 
                      "", com.hipmob.parse.demo.ToDoListActivity.class);
</pre>

Notice we set a default push callback Activity class: Parse's Android push integration allows custom classes to be specified, but for this simple app we just use the default. We also subscribe to the broadcast channel.

We're now set to receive push notifications: next we need to configure Hipmob to send push notifications.

#### Configure the Hipmob management interface to send push notifications to the app.

The next set of steps are taken from our Parse integration documentation at <a href="https://www.hipmob.com/documentation/integrations/parse.html" target="_blank">https://www.hipmob.com/documentation/integrations/parse.html</a>.

Log into your Hipmob account at https://manage.hipmob.com/#apps:

<img style="border: 1px solid #dedede; padding: 0px;margin: 5px auto; display: block" src="/images/2012-11-03/figure3.png" /><br />

Once there, click the Settings button next to the app you'd like to update.

<img style="border: 1px solid #dedede; padding: 0px;margin: 5px auto; display: block" src="/images/2012-11-03/figure4.png" /><br />

Select the Integration settings pane.

<img style="border: 1px solid #dedede; padding: 0px;margin: 5px auto; display: block" src="/images/2012-11-03/figure5.png" /><br />

Select the Parse tab, which will show you options to enter the Parse application ID and REST API key, as well as to enable/disable Parse push notifications. Enter your application ID and REST API key as shown below, and enable Parse push notifications.

<img style="border: 1px solid #dedede; padding: 0px;margin: 5px auto; display: block" src="/images/2012-11-03/figure6.png" /><br />

And, you're done.

<img style="border: 1px solid #dedede; padding: 0px;margin: 5px auto; display: block" src="/images/2012-11-03/figure7.png" /><br />

With this enabled, every time a message is received for a device that is offline we will make a Parse REST API call with a JSON body that looks like this:

<pre class="brush: js">
var body = {
    "where": {
        "hipmobId": '{hipmobId}'
    },
    "data": {
        "alert": '{message}',
        "count": '{count},
        "action": "com.hipmob.push.NEW_MESSAGE"
    }
};
</pre>

This will send a push message with a simple text message (<a target="_blank" href="http://www.hipmob.com/documentation/integrations/parse.html#pushmessages">also configurable in the Hipmob management interface</a>), a count of the number of available messages and a custom action (that can be used by the Parse push notification receiver) to all devices that use the <code>hipmobId</code> we configured on the device.

#### Send a message!

You will need to open the chat window at least once to send the <code>hipmobId</code> to the Hipmob communication network. Once that is done you can then send a message to the device. Log into the Hipmob management interface and visit the Devices tab (at https://manage.hipmob.com/#devices).

<img style="border: 1px solid #dedede; padding: 0px;margin: 5px auto; display: block" src="/images/2012-11-03/figure8.png" /><br />

Find the device you want to send a message to, and then expand the device's menu and select <span style="font-style: italic">Send Message</span>.

<img style="border: 1px solid #dedede; padding: 0px;margin: 5px auto; display: block" src="/images/2012-11-03/figure9.png" /><br />

Type in the message text, and then click <span style="font-style: italic">Send</span>.

<img style="border: 1px solid #dedede; padding: 0px;margin: 5px auto; display: block" src="/images/2012-11-03/figure10.png" /><br />

As a bonus, because we use the Parse User object ID the push message will be delivered to ALL instances of the application that the user is logged into!

And we can see it on the device.

<img style="border: 1px solid #dedede; padding: 0px;margin: 5px auto; display: block" src="/images/2012-11-03/figure11.png" /><br />

#### That's all folks

And that's it. There are many other things you can do with Hipmob: see our full list of docs at <a href="https://www.hipmob.com/documentation">https://www.hipmob.com/documentation</a>, including our user-to-user chat. There are also a couple of other neat things we can do with Parse: they'll be the subject of upcoming articles.

Let us know your thoughts: if you have any questions, suggestions or comments email/call/chat with us! 

UPDATE: comments and discussion on <a target="_blank" href="https://news.ycombinator.com/item?id=4737670"> Hacker News</a>.

P.S. If you're building a mobile app and want [first-class, integrated, in-app support chat or user-to-user chat you should check out Hipmob](https://www.hipmob.com/)!

The full documentation on Hipmob's Parse integration: <a href="https://www.hipmob.com/documentation/integrations/parse.html" target="_blank" class="btn btn-info">View the documentation</a>

 <a href="https://manage.hipmob.com/register" class="btn btn-large btn-success" style="font-weight: bold">Get Started with Hipmob</a>
