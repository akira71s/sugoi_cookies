@author Akira Sakaguchi <akira.s7171@gmail.com>

# sugoi_cookies
Chrome extension for checking Cookies needed for Google Ads Conversion tracking

(Google広告のコンバージョン計測に必要なクッキーの計測・テストを行う、Google Chromブラウザの拡張機能(プラグイン)です。)


<img width="827" alt="demo" src="https://user-images.githubusercontent.com/40524432/52161436-d7c46880-26ff-11e9-9da6-2be74a386dae.PNG">

## Outline(概要):
Check if you have cookies that are needed for Google Ads conversion tracking by gclid test
Before this plugin, you needed to add 「?or&gclid=...」 to the URL, then open the developer tool, find the cookie names...
but you don't need to do anymore. What you need to do is just check the console!

(gclidテストと呼ばれるテスト行うと、Google広告のクッキーがきちん保存されているか確認ができます。
今まではURLの後ろに? or & gclid=... とつけて、デベロッパーツールを開いて、クッキーを探して....
という作業が必要でしたが、このプラグインを使えば、それがコンソールでできます。)

## JS files (JavaScript ファイル):
### writer.js
 - JS file to write (console.log) cookie info related to Google Ads conversion tracking

### background.js
 - execute clearCookies(chrome.cookies API), then send a message to content JS & writer JS
 
### popup.js
 - listening events by elements and getting values from the input.
Then send messages to background JS or content JS for reload / clearCookie 

### const.js
 - constans variables
 
### content.js
 - receive messages from popup JS & background JS, 
   then execute reload or send another messageto background JS

## Message Flow
*testGclid: popup.js: get gclid value and sendMessage to content JS  
  => content,js: execute reload with / without gclid

*clearCookies: popup.js: sendMessage 
  => content,js: receive & send message to background.js
  => background.js: execute chrome.cookie API, then sendResponse to content.js
  => content.js: console.log() & reload without gcli

// TODO : reload / onload

## Features(機能):  
### 1 Check "_gcl_aw" in the console.(_gcl_aw_クッキーを検出し、コンソールで情報を流します)    
This is a cookie that plays a very important role for Google Ads and its conversion tracking.  

(このクッキーはGoogle広告のコンバージョン計測に欠かせないものです。)

For more information about how _gcl_aw works, please have a look below:    
(_gcl_awに関して、コンバージョンに関しては以下のドキュメントをお読みください)    
English - https://developers.google.com/adwords-remarketing-tag/?hl=en    
日本語 - https://developers.google.com/adwords-remarketing-tag/?hl=ja    

### 2 Check "_gac" in the console.(_gac_クッキーを検出し、コンソールで情報を流します)   
It is a type of Google Analytics cookie, and also can be utilized for Google Ads conversion tracking.   
*You need to link your Google Ads & Google Analytics accounts to utilize this cookie    

(これはGoogleアナリティクスのクッキーの1種です。_gcl_awと同様に、Google広告のコンバージョンに活用できます。  
※Google広告アカウントと、Googleアナリティクスアカウントのリンクが必要です)  

For more information about how _gac_ works, please have a look below:  
(_gacに関して、Googleアナリティクスのクッキーに関しては以下のドキュメントをお読みください)  
English - https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage?hl=en  
日本語 -https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage?hl=ja  

### 3 1-click gclid auto-tagging test(gclidテストがボタン1つで実行可能です。)  

You are an advertiser or web marketing developer but don't know much about gclid? You should check :   
(gclidテスト、自動タグ設定に関しては以下のドキュメントをお読み下さい。)  
English - https://support.google.com/analytics/answer/2938246?hl=en  
日本語 - https://support.google.com/analytics/answer/2938246?hl=ja  

### 4(New! for version 1.7.2) Clear Cookies (新機能: クッキーの削除)  

By hitting the yellow botton, you can clear _gcl_aw & _gac Cookies in the domain you're currently at.  

(現在いるドメインの_gac, _gcl_awを消去します。)  

### 5(New! for version 1.7.2) Clear All Cookies (新機能: すべてのクッキーの削除)

By hitting the red botton, you can clear all the cookies you have in the browser.  

(クロームブラウザのすべてのクッキーを削除します。)  
