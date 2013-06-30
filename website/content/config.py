
# $Id: config.py,v 1.12 2007/06/30 15:30:05 me Exp $

# This is the configuration file for the Korvai.org website. Whenever a new
# page is created, add it to the list markdown_pages given below.

# filename, title
markdown_pages = [
('index.txt',           'Welcome'),
('contact.txt',         'Contact Us'),
('programs/index.txt',  'Thaniaavarthanam Programmes'),
('programs/first.txt',  'First Thaniaavarthanam Programme'),
('programs/second.txt', 'Second Thaniaavarthanam Programme'),
('programs/third.txt',  'Third Thaniaavarthanam Programme'),
('programs/fourth.txt', 'Fourth Thaniaavarthanam Programme'),
('book.txt',            'Korvais Made Easy'),
('lessons.txt',         'Mridangam lessons'),
('404.txt',             'Page not found'),
]

# files that should be copied
static_pages = [
'.htaccess',
'korvai.css',
'favicon.ico',
'musicplayer.swf',
'robots.txt',
'notation/notation.pdf',
'audio/audio-player.js',
'audio/player.swf',
'app/index.html',
'app/out/bundle.js',
]

# files that should be extracted
tgz_files = [
'notation/notation-html.tar.gz',
]

# The template of all the pages
template = """\
<!--
This file was automatically generated on ${date}.
Do not modify this file. All changes will be lost.
-->

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
<title> Korvai.org | ${title} </title>
<meta name="verify-v1" content="mSY/3gVCQMQmT9S2dzUpaJggVqUjxPeswb2aBcrQmaE=" />
<meta http-equiv="content-type" content="text/html; charset=iso-8859-1" />
<link rel="stylesheet" href="/korvai.css" type="text/css" media="all" title="Normal" />

<!-- Google analytics tracking code -->
<script type="text/javascript">
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-425862-2']);
  _gaq.push(['_setDomainName', 'korvai.org']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
</script>

</head>

<body>

<h1><a href="/" title="Korvai.org">Korvai.org</a></h1>

<div id="content">
${content}
</div>

<div id="navstuff">

<div id="siteinfo">
<h2><a name="nav" id="nav">Links</a></h2>
<ul id="sitenav">
<li><a href="/">Home</a></li>
<li><a href="/book.html">Book</a></li>
<li><a href="/programs/index.html">Programs</a></li>
<li><a href="/lessons.html">Mridangam lessons</a></li>
<li><a href="/contact.html">Contact us</a></li>
</ul>
</div>

</div>

<div id="bottom">
<p>Copyright &copy; 2006-2013 Korvai.Org, All rights reserved.</p>
</div>

</body>
</html>
"""
