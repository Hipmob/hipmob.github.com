---
layout: post
title: "A chicken in every pot, an email address for every app"
excerpt: "Email is still the dominant way of communicating online: why shouldn't your app get in on the action? We discuss Hipmob's new email integration that gives every install of your app an email address of its very own, and what you can do with that email address."
author: "Femi Omojola"
releasedate: "October 16, 2012"
pagename: achickenineverypotanemailaddressforeveryapp
disableolark: true
loadscript: "<script type=\"text/javascript\">var _hmc = _hmc || [];_hmc.push(['app', '024d55ddd11340ca89cc5bd13705fe0d']);_hmc.push(['settings', { }]);_hmc.push(['input', { 'placeholder': false, 'height': '20px', 'width': '95%' }]);_hmc.push(['title','Hipmob Email Demonstration']);(function() { var hm = document.createElement('script'); hm.type = 'text/javascript'; hm.async = true; hm.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'hipmob.s3.amazonaws.com/hipmobchat.min.js'; var b = document.getElementsByTagName('body')[0]; b.appendChild(hm); })();</script>"
---
Sorry, couldn't resist: I've wanted to use that opener for a long time. <a href="http://hoover.archives.gov/info/faq.html#chicken" target="_blank">Herbert Hoover never actually used the phrase</a>, but it does bring to mind something that is universally available, and it seemed to fit with what we were trying to do here, so we went with it. A very large percentage of the world's population has at least one email address (in some cases many more than one): it is still one of the most dominant forms of electronic communication, if not THE most dominant (perhaps SMS messaging may have it beat?).

[Hipmob](https://www.hipmob.com "Hipmob") provides live chat; it's as simple as downloading our libraries for iOS and Android, integrating them into your apps with an app key we provide and then you can talk to your users in real time, solve their problems, and make them happy. No servers to setup, no new code to write, just a conversation with your users. In the process, we're trying to make it as simple as possible to talk to your customers, whether you're there when they have a problem or you're away. 

#### No operators available
One of the biggest obstacles as we saw it was that most live chat implementations are limited to talking to the user when they are online and available: this generally requires that an operator be at hand, which can be hard for small companies. Our first attempt to change that was with our <a href="http://www.hipmob.com/documentation/api.html">server API</a>: a fully-featured REST API that lets you send text, picture or audio messages to any app with the Hipmob libraries integrated into it. We built language specific libraries (currently in <a href="https://github.com/Hipmob/hipmob-php">PHP</a>, <a href="https://github.com/Hipmob/hipmob-python">Python</a> and <a href="https://github.com/Hipmob/hipmob-node">Javascript for NodeJS</a>, with Java, Ruby and C# in development) and we think in the long term this will work out well for new applications and tools that are currently being developed.

#### Existing Tools
There are still a lot of very useful tools that are completely unaware of the live chat communication channel: help desks like [Desk](https://www.hipmob.com/documentation/integrations/desk.com) and [Zendesk](https://www.hipmob.com/documentation/integrations/zendesk) (which we integrate with), CRM tools like [Salesforce](https://www.hipmob.com/documentation/integrations/salesforce) and [Highrise](https://www.hipmob.com/documentation/integrations/highrise) (which we also integrate with), and even handy old favorites like Gmail (which EVERYONE integrates with, one way or another). All these tools grok email, though. So the question was: what could we do to bridge the gap?

#### Email to Chat Integration
And as soon as we started thinking about it, the answer jumped out at us: give every app install an email address of its own. Messages sent to the email address get translated by Hipmob's communication network and routed appropriately. The app can now be a fully-fledged participant in all the business processes that depend on email:
<div style="padding-left: 20px">
<ul>
<li>You can add the email address to mailing lists.</li>
<li>Help desk tools that send email can reply with changes/fixes and the information will show up right in the app.</li>
<li>CRM tools can send follow ups directly to the app.</li>
<li>...you get the picture.</li>
</ul>
</div><br />

#### Details
So how did we do it? We already assign unique identifiers to every instance of an app with the Hipmob libraries embedded, and we already had an API to send messages: it was pretty straightforward to wire up an email gateway (thank you <a target="_blank" href="http://documentation.mailgun.net/user_manual.html#um-routes">Mailgun</a> for your support) that parses the address to determine where to send it to, extracts the email message components and then calls our API with the email body and any acceptable attachments. Our existing communication network takes care of the rest. As with our API, we handle offline messaging: if the app isn't connected we'll buffer the messages and deliver them later. <a href="http://www.hipmob.com/documentation/email-integration" target="_blank">See the full documentation here.</a>

A neat little trick is that we let the host application set a custom unique identifier: this lets you tie the app install on our network with your internal database. Since we buffer messages for app installs that haven't even connected to our network yet, this lets you do some interesting things. As an example, say you are a software-as-a-service vendor and a customer signs up with you before installing your app. You know in advance what unique identifier you'll use for that user when they finally fire up your mobile app, so you can queue welcome messages or specific guidance for the user. Whenever they login to the app, those messages will be instantly delivered. If you have specific use cases you'd like to discuss give us a call at (650) 762-6513 or you can always email us at <a href="mailto:team@hipmob.com">team@hipmob.com</a>.

#### Instant Value (for us)
It has already been useful to us: right now at the conclusion of a chat session we send an email transcript to the admins for the app. The email includes a link to view the transcript in our management interface, and you could then send a reply from our web interface. As we were finalizing the email integration we mentioned it to a customer (<a href="http://www.hachisoft.com">Thanks Elliott!</a>) and he immediately pointed out that we could make it so replies to our transcript emails get sent directly to the phone, which solved the "where do replies go?" question. We released that earlier today. This also extends to help desk programs like Desk, which support sending an email whenever support staff reply to an issue: now if you <a href="https://www.hipmob.com/documentation/integrations/desk.com">integrate Hipmob with Desk</a> you can have support replies routed directly to your app.

#### And...a demonstration
Why not? The bottom right of the page has a little tab: if you pop it open it should show you the email address for this browser session. You can send an email to that address and it should show up shortly: there will be some slight delays, since email isn't always instant, but there's no need to refresh the screen or anything else. If the email address doesn't show up type <span style="font-weight: bold">help</span> to show it.

Let us know your thoughts: if you have any questions, suggestions or comments email/call/chat with us!

P.S. If you're building a mobile app and want [first-class, integrated, in-app support chat or direct messaging between users you should check out Hipmob](https://www.hipmob.com/)!

 <a href="https://manage.hipmob.com/register" class="btn btn-large btn-success" style="font-weight: bold">Give your app an email address with Hipmob</a>
