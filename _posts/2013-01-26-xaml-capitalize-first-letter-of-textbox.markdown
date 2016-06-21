---
layout: post
title:  "Capitalize the first letter of a TextBox (Windows Phone)"
date:   2013-01-26 11:50:50 +1300
categories: xaml
---
For a standard TextBox, the default on-screen keyboard is presented so that the first letter entered is lower-case, unless of course the user first taps the upper-case keyboard arrow. But in many cases, this is an annoying extra step for the user.

To configure the keyboard to capitalize the first letter for a `TextBox`, simply set the TextBox’s `InputScope` property to “PersonalFullName”. The `InputScope` property controls the way in which the on-screen keyboard is displayed to the user when a particular input control is being edited.

#### Microsoft warns this should only be used with Silverlight for Windows Phone.

{% highlight c# %}

InputScope inputScope = new InputScope();
InputScopeName inputScopeName = new InputScopeName();
inputScopeName.NameValue = InputScopeNameValue.PersonalFullName;
inputScope.Names.Add(inputScopeName);
textbox.InputScope = inputScope;

{% endhighlight %}

Too verbose? Setting it in XAML is cleaner.

{% highlight XML %}

<TextBox InputScope=”PersonalFullName” />

{% endhighlight %}

For many text boxes that require this, a global style might be a more manageable approach.

{% highlight XML %}

<Style TargetType=”TextBox”>
<Setter Property=”InputScope” Value=”PersonalFullName” />
</Style>

{% endhighlight %}

While we’re on the subject, it’s worth checking out the other common InputScope values. For example “Text”, which enables auto-correct and text suggestion.
