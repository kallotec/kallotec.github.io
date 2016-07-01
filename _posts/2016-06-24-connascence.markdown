---
layout: post
title:  "Connascence"
date:   2016-06-24 11:50:50 +1300
categories:
---

# Code Camp

So I attended [Code Camp Christchurch](http://codecampchristchurch.com) over the weekend. The talks featured were excellent and certainly exceeded my expectations. I really was impressed by the wisdom imparted on the day. So much so that I wanted to distill and share one of the more valuable things I learned.

I went to [Ian Randall](http://twitter.com/kiwipom)s talk on how they do Continuous Delivery at [PushPay](http://pushpay.com). While the talk was excellent in and of itself, the concept of **Connascence** was dropped towards the end, without too much info other than emploring us to check it out, which I later did thankfully.

## A quest to write better code

I've learned a *lot* of things over my career, but the only other time in when I learned something that actually helped me write better code was when I decided to take the time to understand SOLID properly.

SOLID provided me with an excellent tool/heuristic for making design decisions. Incidently, by applying SOLID, I actually found myself *accidently* using existing design patterns. That was quite a breakthrough at the time.

But as I've found there's still another missing peice in the puzzle. We have so much guidance in software design at a high level, but there's nothing all that rigorous at the low level, guiding us with all the small but frequent, fine-grained coding decisions.

The concept of Connascence solves a lot of these problems, and for me has served as a second breakthrough in learning to write better code, and hopefully for you too!

## Connascence

While [Wikipedia's definition](https://en.wikipedia.org/wiki/Connascence_%28computer_programming%29) is great, I feel the following quote captures it a little more usefully.

> Connascence is a way of describing the coupling between different parts of a codebase. And because it classifies the relative strength of that coupling, connascence can be used as a tool to help prioritise what should be refactored first.

Source: [https://silkandspinach.net/2015/01/22/connascence-of-value/](https://silkandspinach.net/2015/01/22/connascence-of-value/)

Note that this isn't just used retroactively, it's all about making better design choices *while writing code* as well.

### The video

Probably the best value-for-time explanation I've found is the following video, presented by [Josh Robb](http://twitter.com/josh_robb) (also from PushPay).

Video: [https://www.youtube.com/watch?v=Ip2o4vbAK3s](https://www.youtube.com/watch?v=Ip2o4vbAK3s)

In addition to a great outline of Connascence and how it's used, the video also hints at some of the shortcomings of existing principles such as SOLID and challenges the idea of pre-emptive abstraction and patterns, and sights Connascence as a simpler, more robust answer.

It's well worth 30 minutes of your time.

### The printout

Like the concept and want a printout as a quick reference? I couldn't find any I really liked on google images, so I drew one up.

<a href="/assets/images/posts/connascence.jpg" target="_blank">![Connascence reference](/assets/images/posts/connascence.jpg)</a>

## Common reaction from colleagues

### "But some of these things I already know and are really obvious..?"

For example, the 2 argument function vs the 8 argument function (Connascence of Position) and refactoring the arguments into its own class (Connascence of Name). This is a code smell any skilled developer will pick up on, and so what else is new apart from the awesome sounding names we can impress people at parties with?

What we've actually done is place these known code smells (obvious or not) inside a classification system.

Before, we knew it was bad, but not how bad, relative to other categories of smells (Connascences). But now, we can measure the risk of certain types of code effectively, and make much better decisions about what we do with it, and the icing on the cake is that we now have a path for improvement - by refactoring the code toward better Connascences.

## Why isn't this as common as SOLID?

My theory is that around the time the concept was conceived, perhaps code wasn't as complex and omnipresent as it is now, it was perhaps conceived too early for it's time. Interested to hear other oppinions..

## Further reading

[http://Connascence.io](http://Connascence.io) - Great next step, loads of concrete examples.
