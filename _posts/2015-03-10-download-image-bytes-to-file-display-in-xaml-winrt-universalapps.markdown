---
layout: post
title:  "How to: download image, save as file, read file, display in XAML"
date:   2015-03-10 11:50:50 +1300
categories: xaml
---
I’m currently implementing a caching layer in a Universal App that needs to cache images, and I had a difficult time finding any good complete examples demonstrating this only some very spread out bits of advice, so I’m posting a stripped down solution I’m using here to hopefully help the next person!

My requirements were

- Download arbitrary images via http
- Save image to file
- Read image from file
- Needs to handle arbitrary image dimensions (image will be of unknown width/height)
- Display image in UI, either inside XAML or inside an HTML <img /> tag

NOTE: For this to work it required writing bytes to the file not strings, so storage of the file had to be binary. Writing bytes as strings didn’t seem to work.

I’ve stripped down my solution into a sample method. Here are the individual parts…

## Get Http Image As Byte[]
(there’s probably a shorter way to accomplish this)

{% highlight c# %}
 async Task<byte[]> getHttpAsBytesAsync(string url)
 {
  //build request
  var request = WebRequest.CreateHttp(url);
  request.UseDefaultCredentials = true;
  byte[] bytes;

  //get response
  var response = await request.GetResponseAsync();
  using (var br = new BinaryReader(response.GetResponseStream()))
  {
   using (var ms = new MemoryStream())
   {
    var lineBuffer = br.ReadBytes(1024);

    while (lineBuffer.Length > 0)
    {
     ms.Write(lineBuffer, 0, lineBuffer.Length);
     lineBuffer = br.ReadBytes(1024);
    }

    bytes = new byte[(int)ms.Length];
    ms.Position = 0;
    ms.Read(bytes, 0, bytes.Length);
   }
  }

  return bytes;
 }
{% endhighlight %}


## Save Image Byte[] To File

{% highlight c# %}
 async Task saveBytesToFileAsync(StorageFolder folder, string filename, byte[] bytes)
 {
  var file = await folder.CreateFileAsync(filename, CreationCollisionOption.ReplaceExisting);
  await FileIO.WriteBytesAsync(file, bytes);
 }
{% endhighlight %}

## Read Image Byte[] From File

{% highlight c# %}
 async Task<byte[]> getBytesFromFileAsync(StorageFolder folder, string name)
 {
  //get from file
  var file = await folder.GetFileAsync(name);
  var buffer = await FileIO.ReadBufferAsync(file);
  return buffer.ToArray();
 }
{% endhighlight %}

## Convert Image Byte[] to BitmapImage for display in XAML

{% highlight c# %}
 async Task<BitmapImage> convertBytesToBitmapAsync(byte[] bytes)
 {
  //convert to bitmap
  var bitmapImage = new BitmapImage();
  var stream = new InMemoryRandomAccessStream();
  stream.WriteAsync(bytes.AsBuffer());
  stream.Seek(0);

  //display
  bitmapImage.SetSource(stream);

  return bitmapImage;
 }
{% endhighlight %}

## Convert Image Byte[] to Base64 for display in HTML <Img/> tag

{% highlight c# %}
 //convert to base64 for display in html
 var imgHtml = string.Format("<img src=\"data:image/jpeg;base64,{0}\" />",
 Convert.ToBase64String(contentBytes2));
{% endhighlight %}

## Putting it all together

{% highlight c# %}
 async Task saveLoadImage()
 {
  var filename = "image";
  var urlOfImage = "http://static.tvtropes.org/pmwiki/pub/images/pingu_506.jpg";

  var folder = ApplicationData.Current.LocalFolder;

  //get file
  var contentBytes = await getHttpAsBytesAsync(urlOfImage);

  //save to file
  await saveBytesToFileAsync(folder, filename, contentBytes);

  //get from file
  var contentBytes2 = await getBytesFromFileAsync(folder, filename);

  //convert to base64 for display in html
  var imgHtml = string.Format("<img src=\"data:image/jpeg;base64,{0}\" />",
  Convert.ToBase64String(contentBytes2));

  //get bitmap from bytes, set image in XAML
  var contentAsImage = await convertBytesToBitmapAsync(contentBytes2);
  this.imgPenguin.Source = contentAsImage;

 }
{% endhighlight %}

### Sources

- <http://stackoverflow.com/questions/17107576/c-sharp-windows-8-store-metro-winrt-byte-array-to-bitmapimage>
- <http://stackoverflow.com/questions/13851462/how-do-i-read-a-binary-file-in-a-windows-store-app>
- <http://blog.jerrynixon.com/2012/06/windows-8-how-to-read-files-in-winrt.html>
- <http://stackoverflow.com/a/2368505/1241612>
- <http://www.dailycoding.com/posts/convert_image_to_base64_string_and_base64_string_to_image.aspx>
