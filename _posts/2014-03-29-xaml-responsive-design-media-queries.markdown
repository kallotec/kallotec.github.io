---
layout: post
title:  "A XAML implementation of CSS responsive design"
date:   2014-03-29 11:50:50 +1300
categories: xaml
---
## CSS vs XAML

Media queries in CSS are plain awesome for HTML webpages and more recently Windows 8 JS store applications, amongst other things they allow developer-defined styles to be switched between dynamically based on the current width of the users browser, providing the optimal user experience at supported screen sizes. This is what’s called responsive design.

XAML based technologies do not have such a simple mechanism for implementing this powerful concept. Some tools for supporting varying screen resolutions/states can be using the VisualStateManager and/or wrapping content in a Viewbox control. This usually provides an suboptimal experience for the user or complicated custom code for the developer. By creating an easy to use media query equivalent in XAML, I feel this would give app developers a new set of options for styling their apps and providing a better user experience.

## A XAML implementation

By sub-classing the regular base classes in XAML such as Application and Page, I was able to respond to SizeChanged event internally and apply groups of styles based on the new width, thereby creating a responsive effect as I resized or snapped my apps.

While implementing app or page width-based responsive design, I found I was able to do the same for orientation modes for smart devices by responding to OrientationChanged events.

In my current implementation, users can group two sets of ResourceDictionaries. And based on the type of responsive method chosen, these style groups are added and removed from the Resources’ MergedDictionaries collection at runtime.

## Responsive methods

Here’s the methods of responsiveness I’m able to support at the moment:

### WinRT
**KlingDigital.ResponsiveStyles.WinRT.ResponsiveWidth**

Possibly best used for supporting a snapped experience at a specific width.

**KlingDigital.ResponsiveStyles.WinRT.ResponsiveHeight**

Possibly best used to support a smaller screen experience with less vertical realestate vs larger ones.

**KlingDigital.ResponsiveStyles.WinRT.ResponsiveOrientation**

Possibly best used to provide separate portrait and landscape experiences. Note this currently also fires when application is snapped. Future versions will need to discern between Orientation and Snapped states.

### WPF

**KlingDigital.ResponsiveStyles.WPF.ResponsiveWidth**

Possibly best used to provide tool-window and fullsized experiences without creating separate windows.

**KlingDigital.ResponsiveStyles.WPF.ResponsiveHeight**

Same as above.

### Phone8
**KlingDigital.ResponsiveStyles.WP8.ResponsiveOrientation**

Possibly best used when a tailored experience is required for a different orientation state.

**KlingDigital.ResponsiveStyles.WP8.ResponsiveHD**

Possibly best used if a less memory intensive experience is required for lower memory devices or resolutions. Or conversely provide an experience that better utilizes the added height in available screen real estate on HD.


![Responsive page supporting a snapped and full experience]({{ "/assets/images/posts/xaml-responsive-snapped.png" | prepend: site.baseurl }})

*Above: Responsive page supporting a snapped and full experience*


## Combining responsive methods

Any combination of responsive methods can be used in the same app or page.

## Per page or global

Responsiveness can be done ad-hoc at either the App or Page level or both. Simply replace the App or Page base class with the responsive version from my libraries.

It made sense to implement it only at the Page level for WPF. Reason being a WPF app can have many windows, all of which can be different sizes so controlling style switching at the app level doesn’t make alotta sense. However if required, the implementation for WinRT can be ported over manually.

## Current drawbacks

If mixing responsive styles at the app or page level, care would need to be given so that styles and style files do not collide. This may result in runtime errors.

Still getting design time support to work.

No Silverlight support yet, unless requested.

## Sample solution download

I created some sample projects for WinRT, WP8, and WPF, to demonstrate these techniques. Feel free to use it how you please, and if you do, a link back to this article would be much appreciated.

https://github.com/kallotec/XAMLResponsiveStyles

## Tell me if you find this useful!

This has purely been experimentation thus far and bit of fun. I’m still yet to see where it may go. If you try it on your own project, please leave a comment with your findings!
