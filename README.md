@author Akira Sakaguchi <akira.s7171@gmail.com>

# sugoi_cookies
Chrome extension for checking Cookies needed for Google Ads Conversion tracking

Check if you have cookies that are needed for Google Ads conversion tracking by gclid test

## Outline:
Now that you do NOT need to open your developer tool to check your cookie, or type one by one to test gclid!
This plugin is developed to make it easy to check if first party Cookies can be passed between different domains in your website.

## JS files:
### writer.js
 - the main JS file to  write cookie info related to Google Ads conversion tracking
 TODO: use Chrome.cookies API to get Cookies

### background.js
 - execute clearCookies(chrome.cookies API), then send a message to content JS
 
### popup.js
 - listening events by elements and getting values from the input.
   Then sendsend message to background JS or content JS for reload / clearCookie
 
### const.js
 - constans variables
 
### content.js
 - receive messages from popup JS & background JS, 
   then execute reload or send another messageto background JS

## Message Flow
*testGclid: popup.js: get gclid value and sendMessage to content JS  
  => content,js: execute reload with / without gclid
 
 /** below also can be used to reload
  *  
  *  chrome.tabs.executeScript(tabID, {
  *   code: `window.location.href="${newURL}"`
  */ });

*clearCookies: popup.js: sendMessage 
  => content,js: receive & send message to background.js
  => background.js: execute chrome.cookie API, then send message to content.js
  => content.js: console.log() & reload without gcli

## Features:
### 1 You can check "_gcl_aw" on your browser. This is a cookie that plays a very important role for Google Ads and its conversion tracking.
For more information about how _gcl_aw works, please have a look below:

English - https://developers.google.com/adwords-remarketing-tag/?hl=en
日本語 - https://developers.google.com/adwords-remarketing-tag/?hl=ja

### 2 You can check "_gac" on your browser. It is a type of Google Analytics cookie, and also can be utilized for Google Ads conversion tracking. 
For more information about how _gac_ works, please have a look below:

English - https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage?hl=en
日本語 -https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage?hl=ja

### 3 Test gclid auto-tagging with this plugin, which means you don't need to type '?gclid=.....' in the URL bar one by one anymore. 
You are an advertiser or web marketing developer but don't know much about gclid? You should check : 
English - https://support.google.com/analytics/answer/2938246?hl=en
日本語 - https://support.google.com/analytics/answer/2938246?hl=ja
