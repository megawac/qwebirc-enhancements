/*
    The Cookie Monster, or How to Remove HTTP Cookies From XMLHttpRequest With setRequestHeader()

    Description: This class is used to remove cookies from XMLHttpRequests.

    Copyright (c) 2006-2011 Michael G. Noll <http://www.michael-noll.com/>

    Documentation:
    http://www.michael-noll.com/tutorials/cookie-monster-for-xmlhttprequest/


    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/
function CookieMonster(aXMLHttpRequest)
{
    this.channel_ = aXMLHttpRequest.channel;

    // happens after the cookie data has been loaded into the request,
    // but before the request is sent
    this.topic_ = "http-on-modify-request";

    this.observerService_ = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
    this.observerService_.addObserver(this, this.topic_, false /* hold a strong reference */);

    // we assume that waiting 15 seconds for cookies is enough in practice;
    // we want to have a defined end time for removing the observer again
    this.lunchTime_ = new Scheduler(this.stopEating, 15000 /* stop eating after 15 seconds */);
}

/*
    Be a standard conform cookie monster.
*/
CookieMonster.prototype.QueryInterface = function(iid)
{
    if (   iid.equals(Components.interfaces.nsISupports)
        || iid.equals(Components.interfaces.nsIObserver))
        return this;
    throw Components.results.NS_ERROR_NO_INTERFACE;
}

/*
    When we are notified that a cookie comes our way through our channel
    (attached to the XMLHttpRequest), we will eat all of them, i.e. remove them.
*/
CookieMonster.prototype.observe = function(subject, topic, data)
{
    if (topic != this.topic_ || subject != this.channel_)
        return; // not our cookies, bleh (as if the original cookie monster did care...)

    // lunch time!
    this.channel_.QueryInterface(Components.interfaces.nsIHttpChannel);
    this.channel_.setRequestHeader("Cookie", "", false); // aaah, cookies! scrunch, scrunch...

    // Cookies will only be included once to the HTTP channel, so whenever
    // we have been notified via topic "http-on-modify-request" and ate all
    // cookies, our work is done and we will stop eating.
    this.lunchTime_.stop();
    this.stopEating();
}

/*
    Stop eating cookies.
*/
CookieMonster.prototype.stopEating = function()
{
    // we finished our lunch, so we clean up (again, as if the original cookie monster...)
    this.observerService_.removeObserver(this, this.topic_); // avoid memory leaks
    delete(this.channel_);
    delete(this.lunchTime_);
    delete(this.observerService_);
}

/*
    A scheduler for executing a function (callback) after a specified amount of time.

    First parameter:    function variable, executing on every beat
    Second parameter:   time (in ms) after which the supplied function is called
*/
function Scheduler(callback, callAfter_MS)
{
    this.callback_ = callback;

    // get a timer
    this.timer_ = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);

    // we want to stop the beat on shutdown
    var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
    observerService.addObserver(this, "xpcom-shutdown", false);

    // initialize the timer to fire after the given ms interval
    this.timer_.initWithCallback(this, callAfter_MS, this.timer_.TYPE_ONE_SHOT);
}

Scheduler.prototype.QueryInterface = function(iid)
{
    if (   iid.equals(Components.interfaces.nsISupports)
        || iid.equals(Components.interfaces.nsITimerCallback)
        || iid.equals(Components.interfaces.nsIObserver))
        return this;
    throw Components.results.NS_ERROR_NO_INTERFACE;
}

Scheduler.prototype.observe = function(aSubject, aTopic, aData)
{
    // stop the beat on shutdown (see http://wiki.mozilla.org/XPCOM_Shutdown)
    if (aTopic == "xpcom-shutdown")
        this.stop();
}

Scheduler.prototype.stop = function()
{
    if (this.timer_) {
        // stop the timebeat and remove the observer
        this.timer_.cancel();
        this.timer_ = null;
        this.callback_ = null;
        var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
        observerService.removeObserver(this, "xpcom-shutdown");
    }
}

Scheduler.prototype.notify = function(aTimer)
{
    this.callback_();
    this.stop();
}
