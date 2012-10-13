---
layout: post
title: "Unified logging with Node JS and Syslog"
excerpt: "Heroku's log drains let you see all your log events from multiple Heroku applications in a single stream: why not extend the same love to the rest of your (non-Heroku) infrastructure? We discuss how we built and setup a Node JS server to stream log files to the same server as our Heroku logs, significantly simplifying our debugging tasks."
author: "Femi Omojola"
releasedate: "October 13, 2012"
pagename: unifiedloggingwithnodejsandsyslog
--- 
Here at [Hipmob](https://www.hipmob.com "Hipmob"), we use [Heroku](http://heroku.com "Heroku") for a number of different parts of our communication network. Using multiple loosely-coupled services simplifies scaling (which is handy when trying to provide [live chat as a service to mobile apps](https://www.hipmob.com/documentation/)), but (as with any distributed system with many moving parts) sometimes debugging can be a little challenging. Recently while trying to debug a customer issue we needed to be able to follow some data as it moved from our API service (implemented in NodeJS and deployed on Heroku) through our chat service (implemented in NodeJS and deployed on our own EC2 servers: [Heroku, pretty please add Websocket support soon!](https://devcenter.heroku.com/articles/http-routing#websockets)) and then to our management service (implemented in Python and deployed on Heroku). After scuffling with multiple shell sessions and trying to visually synchronize our logging statements we decided it was finally time to actually investigate centralized logging.  

#### Logging from Heroku to Syslog
Heroku has a pretty nifty logging system called [Logplex](https://devcenter.heroku.com/articles/logging) that you can setup to send the logs from all your Heroku apps to a single location, and there are a number of Heroku addons (such as [Papertrail](https://addons.heroku.com/papertrail)) that use this capability to provide central monitoring of your logs for errors and other items of interest. We had a server we were already using for centralized logging so we opted to stream all our Heroku logs to that server instead of using a hosted service: we may yet choose one of those hosted services, but for now hosting it ourselves sufficed. Really, all we wanted was to be able to run <code>tail -f {logfile}</code> and see everything go by in the right order.

#### Setting up syslog
We'd previously used rsyslog on Ubuntu to capture Haproxy logs, however Haproxy uses UDP logging, and Heroku required TCP logging. There are a ton of decent guides covering this: we used [Heroku's guide](https://devcenter.heroku.com/articles/logging#syslog-drains) for this, and we were pretty happy. We lost about 3 hours to ([this Ubuntu rsyslog bug](https://bugs.launchpad.net/ubuntu/+source/rsyslog/+bug/789174)) but eventually we just used on a non-privileged port and we were done.

#### Adding the drains
Using the Heroku client, a quick:
<pre class="brush: bash">
heroku drains:add --app api.hipmob.com syslog://{log server IP or DNS name}:{port number}
</pre>

sets up the Heroku log drain that we want. We can fetch the drain details by running <pre class="brush: bash">heroku drains --app api.hipmob.com</pre> and this gives us the drain identifier.

<pre class="brush: text">
syslog://{log server IP or DNS name}:{port number} (&lt;api drain ID&gt;)
</pre>

We do the same for each app we're interested in (in our case there are 2 of them), and then save the drain IDs for use in the next step.

#### Logging everything to a single file
So we finally had logs for multiple Heroku apps streaming into our logging server. What we wanted was to have a separate log file for each Heroku app (so we could look at those individually) as well as a global log file with the output of every app (so we could see all activity from a single place). rsyslog's RainierScript was a little difficult to grasp: the [docs](http://www.rsyslog.com/doc/rainerscript.html) didn't quite clarify how best to use it so it took a little while to sort through. We prevailed, though: the contents of <code>/etc/rsyslog.d/heroku.conf</code> are below:

<pre class="brush:text">
# api.hipmob.com
if $source == '&lt;api drain ID&gt;' then /mnt/logs/heroku/api.hipmob.com.log
if $source == '&lt;api drain ID&gt;' then /mnt/logs/hipmob/production.log
if $source == '&lt;api drain ID&gt;' then ~

# manage.hipmob.com
if $source == '&lt;manage drain ID&gt;' then /mnt/logs/heroku/manage.hipmob.com.log
if $source == '&lt;manage drain ID&gt;' then /mnt/logs/hipmob/production.log
if $source == '&lt;manage drain ID&gt;' then ~
</pre>

This pipes each Heroku app into a dedicated file and into the global production.log file: <code>tail -f /mnt/logs/hipmob/production.log</code> is now a single stream of every log event from Heroku, which was exactly what we needed. The third line in each segment prevents the log lines from going into any other log files.

#### Adding our own logs
The last piece was getting the logs from our EC2 servers into the central rsyslog server as well: we don't have Logplex to handle it for us, so we're on our own here. This proved to be a bit messier: we use <code>console.log</code> and <code>console.error</code> statements sprinkled liberally throughout our code (we try and resist, but [log spam](http://eranki.tumblr.com/post/27076431887/scaling-lessons-learned-at-dropbox-part-1) can be very useful) and by default the Node JS console goes to <code>system.out</code>. Packages like [Winston](https://github.com/indexzero/winston-syslog) offer Node JS support for syslog but we like being able to use the default console for local debugging. 

We're clearly not the first people who've run into this problem: Papertrail have the [remote_syslog](https://github.com/papertrail/remote_syslog) gem. But: its in Ruby, and we're already using NodeJS on our servers, so we wanted to stick to a single stack (which simplifies our deployment). On our EC2 servers we have Upstart init scripts that redirect the output of the Node processes to a log file: why not just run <code>tail -f</code> on that file and then send THAT to the remote syslog?

#### Introducing: pipe-to-syslog
And so we did. The source is in [github](https://github.com/Hipmob/pipe-to-syslog) for your viewing pleasure. Setting it up is pretty straightforward (once you've already got Node and the syslog server setup). The instructions below are for Ubuntu: it shouldn't be too messy to run them on another Linux distribution.

#### Setting up pipe-to-syslog
<div>
<ol>
<li>Check out the <code>pipe-to-syslog</code> project from Github and copy the configuration template
<pre class="brush: bash">
git clone https://github.com/Hipmob/pipe-to-syslog.git /var/local/pipe-to-syslog
cd /var/local/pipe-to-syslog
</pre>
</li>
<li>Install all the dependencies.
<pre class="brush: bash">
npm install
</pre>
</li>
<li>Add it to Upstart.
<pre class="brush: bash">
cp pipe-to-syslog.conf /etc/init
</pre>
</li>
<li>By default we drop privileges and run as a user other than root, so create that user and group here.
<pre class="brush: bash">
useradd -M --shell /bin/false node
</pre>
<span class="label label-info">NOTE</span> If you don't create this user and group (or want to use a different user/group), you will need to edit the <code>/etc/init/pipe-to-syslog.conf</code> file to update or remove the <code>--user</code> and <code>--group</code> parameters.<br /><br />
</li>
<li>Create the local log file folder.
<pre class="brush: bash">
mkdir /var/log/node
</pre>
<span class="label label-info">NOTE</span> If you don't create this folder the service will not start. If you want to log to a different location edit the <code>/etc/init/pipe-to-syslog.conf</code> file.<br /><br />
</li>
<li>Setup the configuration file.
<pre class="brush: bash">
cp conf.js.template conf.js
</pre>

Edit conf.js: we've tried to keep it pretty simple. You can have as many unique entries in the <code>self</code> object. For each entry you can specify an arbitrary number of <span style="font-weight: bold">sinks</span> (log output destinations): each sink describes the specific file that should be read (using the <span style="font-style: italic">channel</span> field) and the syslog level, facility and tag. For the entry you can specify the hostname to be sent to the syslog server (you'll need to make a note of this when you're configuring the syslog server), and then the actual syslog server IP address/DNS name and port number.

<pre class="brush: js">
function get_config()
{
    var self = {};
    self['web'] = {
        sinks: [
            {
                channel: { type: 'tail', file: '/var/log/node/out.log' },
                level: 'info',
                tag: 'web',
                facility: 'user',
            },
            {
                channel: { type: 'tail', file: '/var/log/node/err.log' },
                level: 'error',
                tag: 'web',
                facility: 'user',
            }],
        hostname: '{hostname}',
        server: '{syslog server IP address or DNS name}',
        port: {port number} };
    return self;
}

module.exports.get_config = get_config;
</pre>

For every sink the service will spawn a <code>tail -f</code> process and will watch it.<br /><br />
</li>
<li>And, you're done. Start it up.
<pre class="brush: bash">
service pipe-to-syslog start
</pre>

You can send the service process a USR1 signal to get it to restart the <code>tail -f</code> processes (useful if you rotate logs). A USR2 signal will force it to kill all the <code>tail -f</code> processes and re-read the configuration file. And the venerable TERM signal will make it exit.
</li>
</ol>
</div>
<br />
#### And...we're done
Finally on the rsyslog server we add the <code>/etc/rsyslog.d/ec2.conf</code>: this uses the hostname from step #6 above.

<pre class="brush:text">
# hostname
if $source == '{hostname}' then /mnt/logs/aws/{hostname}.log
if $source == '{hostname}' then /mnt/logs/hipmob/production.log
if $source == '{hostname}' then ~
</pre>

And now we have a single log stream in <code>/mnt/logs/hipmob/production.log</code>, with everything in it.

Now, this didn't particularly help us with the original problem (we didn't want to keep the client waiting THAT long), but a couple of days later we needed to look at a different issue, and we were ready!

Hope it helps: if you have any questions, suggestions or comments email/call/chat with us!

P.S. If you're building a mobile app and want [first-class, integrated, in-app support chat or direct messaging between users you should check out Hipmob](https://www.hipmob.com/)!
