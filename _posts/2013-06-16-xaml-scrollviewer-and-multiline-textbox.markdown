---
layout: post
title:  "Implementing ScrollViewer and a multiline TextBox properly"
date:   2013-06-16 11:50:50 +1300
categories: xaml
---
Would you like to create a scrollable multi-line TextBox like OneNote or Messages? This would sound like a reasonably straightforward task, but as it turns out it is a task fraught with peril.

This solution works for a TextBox sitting at the top or bottom of the page (e.g. messages), or a TextBox that need to fill the screen (e.g. comments/notes/an editor). It handles varying TextBox height and allows for proper scrolling at all times.

Here’s the steps required for this to work:

### 1. Simulate a popped up keyboard in the page

Create a placeholder UI element that simulates the space the keyboard takes up on the page, which effectively squishes the ScrollViewer into the available space.
Only display when the TextBox gets focus (i.e. only the keyboard is visible) and hide it when it doesn’t, using the GotFocus and LostFocus events.
Note the keyboard height differs between different resolutions, so some checking is required to find the correct keyboard height, which can be done on the page’s Loaded event.

### 2. Manually scroll the ScrollViewer while new lines of text are entered.

This is required to so that as text wraps down to new lines the caret is kept in view. We do this by manually scrolling the ScrollViewer as the TextBox size increases. This is done in the TextChanged event of the TextBox.

### 3. Prevent Windows Phone from natively scrolling up your page.

Naturally while you’re typing in a mult-line TextBox if the caret gets too close to the keyboard, Windows Phone automatically pushes the entire page upward so as to keep the text field from being hidden underneath the keyboard. This built-in feature is redundant where we have our own means of scrolling (the ScrollViewer). This implicit action needs to be manually reset. To fix this, keep resetting the ApplicationRootFrame’s RenderTransformation property whenever the TextBox gets Focus.

### 4. Manually scroll to intended caret position

On initially tapping a populated Textbox, scrolling to the point at which the user wants the cursor to be – specifically to an area that would be hidden after the keyboard is shown – requires some manual means to accomplish. This is handled on the Tap event.

### Result

What we get is the following behaviour, while retaining proper scrolling while typing in the TextBox, as well as when focus is outside of it.



![Responsive page supporting a snapped and full experience]({{ "/assets/images/posts/xaml-custom-scrollviewer-options.jpg" | prepend: site.baseurl }})

### Full code

**XAML + C#**

{% highlight XML %}
<phone:PhoneApplicationPage x:Class=”WP.TextEntry.MainPage”
    xmlns=”http://schemas.microsoft.com/winfx/2006/xaml/presentation&#8221;
    xmlns:x=”http://schemas.microsoft.com/winfx/2006/xaml&#8221;
    xmlns:phone=”clr-namespace:Microsoft.Phone.Controls;assembly=Microsoft.Phone”
    xmlns:shell=”clr-namespace:Microsoft.Phone.Shell;assembly=Microsoft.Phone”
    xmlns:d=”http://schemas.microsoft.com/expression/blend/2008&#8243;
    xmlns:mc=”http://schemas.openxmlformats.org/markup-compatibility/2006&#8243;
    mc:Ignorable=”d”
    FontFamily=”{StaticResource PhoneFontFamilyNormal}”
    FontSize=”{StaticResource PhoneFontSizeNormal}”
    Foreground=”{StaticResource PhoneForegroundBrush}”
    SupportedOrientations=”PortraitOrLandscape” Orientation=”Portrait”
    shell:SystemTray.IsVisible=”True”>
    <!–LayoutRoot is the root grid where all page content is placed–>
    <Grid x:Name=”LayoutRoot” Grid.Row=”1″ Margin=”12,0,12,0″>
        <Grid.RowDefinitions>
            <RowDefinition Height=”auto” />
            <RowDefinition />
            <RowDefinition Height=”auto” />
        </Grid.RowDefinitions>
        <TextBlock Text=”Scrolling TextBox sample” FontSize=”40″ />
        <ScrollViewer Grid.Row=”1″
                      Background=”Orange”
                      Name=”scroller”>
            <!–option: wrap in a StackPanel to shrink the TextBox height, and vertically align it to either the top of bottom of row–>
            <!–<StackPanel VerticalAlignment=”Bottom”>–>
                <!–option: test solution with items above textbox, i.e. simulate message list–>
                <!–<Button>Arbitrary control 1</Button>
                <Button>Arbitrary control 2</Button>
                <Button>Arbitrary control 3</Button>–>
                <TextBox Name=”txtMessage”
                        TextWrapping=”Wrap”
                        AcceptsReturn=”True”
                        TextChanged=”txtMessage_TextChanged”
                        GotFocus=”txtMessage_GotFocus”
                        LostFocus=”txtMessage_LostFocus”
                        Tap=”txtMessage_Tap” />
            <!–</StackPanel>–>
        </ScrollViewer>
        <!–mimic the keyboard taking up space–>
        <Grid Grid.Row=”2″
                Name=”pnlKeyboardPlaceholder”
                Visibility=”Collapsed” />
    </Grid>
</phone:PhoneApplicationPage>

{% endhighlight %}


{% highlight C# %}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Navigation;
using Microsoft.Phone.Controls;
using Microsoft.Phone.Shell;
using System.Windows.Media;
using System.Windows.Data;

namespace WP.TextEntry
{
    public partial class MainPage : PhoneApplicationPage
    {
        public MainPage()
        {
            InitializeComponent();
            Loaded += MainPage_Loaded;
        }

        void MainPage_Loaded(object sender, RoutedEventArgs e)
        {
            //determine if HD device
            var deviceWidth = this.ActualWidth;
            var isHdDevice = (deviceWidth > 500 ? true : false);

            //the keyboard height differs between HD devices and regular ones
            if (isHdDevice)
                keyboardHeight = 540;
            else
                keyboardHeight = 336;

            //make the keyboard placeholder's height as high as
            //the anticipted keyboard height
            //this will be used to offset other controls on the page into the viewable area
            pnlKeyboardPlaceholder.Height = keyboardHeight;

        }

        double InputHeight;
        int keyboardHeight;
        double tapOffset;

        private void txtMessage_Tap(object sender, System.Windows.Input.GestureEventArgs e)
        {
            //capture the y position of where the user tapped
            //relative to the textbox
            tapOffset = e.GetPosition(txtMessage).Y - 80;
        }

        private void txtMessage_GotFocus(object sender, RoutedEventArgs e)
        {
            //reset any page movement cause by keyboard opening
            App.RootFrame.RenderTransform = new CompositeTransform();

            //make the keyboard placeholder visible
            //squishing the scrollviewer into the now smaller available screen area
            pnlKeyboardPlaceholder.Visibility = Visibility.Visible;

            //re-measure content panel, scrollviewer and it's contents
            //this is so that the scrollviewers available scrollable area is updated
            LayoutRoot.UpdateLayout();

            //scroll to the position of the click
            //(tapOffset set in Tap event - Tap event fires before this and provides tap offset)
            scroller.ScrollToVerticalOffset(tapOffset);

        }

        private void txtMessage_TextChanged(object sender, TextChangedEventArgs e)
        {
            Dispatcher.BeginInvoke(() =>
            {
                double CurrentInputHeight = txtMessage.ActualHeight;

                //after the user starts typing text, text will eventually wrap to the next line
                //this ensures the textbox height doesnt sink below the bottom of the scrollviewer
                if (CurrentInputHeight > InputHeight)
                {
                    scroller.ScrollToVerticalOffset(scroller.VerticalOffset + CurrentInputHeight - InputHeight);
                }

                InputHeight = CurrentInputHeight;
            });
        }

        private void txtMessage_LostFocus(object sender, RoutedEventArgs e)
        {
            //hide the keyboard placeholder from screen
            //allowing the scrollviewer to re-occupy the available area again
            this.pnlKeyboardPlaceholder.Visibility = Visibility.Collapsed;

        }

    }
}

{% endhighlight %}


### Other notes

The only real shortcoming is that it doesn’t detect whether the Clipboard row is being displayed ontop of the keyboard, which may hide some of the TextBox. But since it’s of static height and can be easily checked via Clipboard.ContainsText() method, it should be easy enough to extend this solution to handle.

Support for panoramic mode will only require some more custom heights, and detection for orientation changes and states.

### Credits

I’ve spent some time searching and trying to implement this properly, and the solution combines the ideas from a few sources on the internet. So thanks must go to them for their contributions.

- [Juan Perez & Ku6opr answers](http://stackoverflow.com/questions/10758581/scrollable-textbox-in-wp7-ala-skype-and-facebook)
- [Alex Sorokoletov – Windows Phone 7 handling text entry screens and keyboard layouts](http://sorokoletov.com/2011/08/windows-phone-70-handling-text-entry-screens/)
