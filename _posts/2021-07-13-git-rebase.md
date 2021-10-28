---
layout: post
title: "Git Rebase"
date: 2021-07-13
tags:
  - git
  - tricks
author: Aman Poonia
avatar: assets/img/common/andrew-avatar.png
category: git
---

There comes time when in git you created a feature branch from master branch. While you are working on the feature branch, master branch gets new changes and you want those change to be present in your feature branch. This is where you need **git rebase**  

Simple command to get the changes from master branch to you feature branch is  

{% highlight bash %}
git switch feature
git rebase master
{% endhighlight %}

And you are done
