@author Akira Sakaguchi <akira.s7171@gmail.com>

# sugoi_cookies (Latest version: 3.7.2: CV detector fixed)
Chrome extension for checking Cookies needed for Google Ads Conversion tracking

(Google広告のコンバージョン計測に必要なクッキーの計測・テストを行う、Google Chromブラウザの拡張機能(プラグイン)です。)

<img width="640" alt="SS" src="https://user-images.githubusercontent.com/40524432/54485487-50e4dd00-48b4-11e9-99e5-d5b3cd206fde.PNG">
<img width="827" alt="1280_800" src="https://user-images.githubusercontent.com/40524432/53511451-6eb3f300-3afb-11e9-861b-2f2a4671e423.PNG">

## Outline(概要):
Check if you have cookies that are needed for Google Ads conversion tracking by gclid test
Before this plugin, you needed to add 「?or&gclid=...」 to the URL, then open the developer tool, find the cookie names...
but you don't need to do anymore. What you need to do is just check the console!

(gclidテストと呼ばれるテスト行うと、Google広告のクッキーがきちん保存されているか確認ができます。
今まではURLの後ろに? or & gclid=... とつけて、デベロッパーツールを開いて、クッキーを探して....
という作業が必要でしたが、このプラグインを使えば、それがコンソールでできます。)

## JS files (JavaScript ファイル):
### writers.js
### background.js
### popup.js
### const.js
### content.js
 
## Message Flow
*testGclid: [popup.js]: get gclid value and sendMessage to content JS  
  => [content,js]: execute reload with / without gclid
  => [writer.js]: checkcookies and show cookies in the console 
 
*reload: [popup.js]: clear / execute gclid test  
  => [content,js]: after async functions done (Promise), execute reload with or without gclid

## Features(機能):  
### 1: Check "_gcl_aw" in the console.(_gcl_aw_クッキーを検出し、コンソールで情報を流します)    
This is a cookie that plays a very important role for Google Ads and its conversion tracking.  

(このクッキーはGoogle広告のコンバージョン計測に欠かせないものです。)

For more information about how _gcl_aw works, please have a look below:    
(_gcl_awに関して、コンバージョンに関しては以下のドキュメントをお読みください)    
English - https://developers.google.com/adwords-remarketing-tag/?hl=en    
日本語 - https://developers.google.com/adwords-remarketing-tag/?hl=ja    

### 2: Check "_gac" in the console.(_gac_クッキーを検出し、コンソールで情報を流します)   
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

### 4: Check "gclid" in the console.(gclidクッキーを検出し、コンソールで情報を流します)     
For how to use "gclid" cookies, check the link below (Ofline Conversions)  
English - https://support.google.com/google-ads/answer/2998031?hl=ja  
日本語 - https://support.google.com/google-ads/answer/2998031?hl=en  

### 5: Clear Cookies (クッキーの削除)  
By hitting the yellow botton, you can clear _gcl_aw & _gac Cookies in the domain you're currently at.  
(現在いるドメインの_gac, _gcl_awを消去します。)  

### 6: Clear All Cookies (すべてのクッキーの削除)
By hitting the red botton, you can clear all the cookies you have in the domain.  
(ドメインのすべてのクッキーを削除します。)  

### 7: (New! for version 3.0.1) CV Detector (新機能: コンバージョン計測機能) 
Detect conversions and show Conversion ID & label, cookies the CVs can use.
In order to make your CVs work on Safari(ITP), you need to check if the cookies are sent with CV data.   

コンバージョンラベル・IDはもちろん、実際に送信できたクッキーまでをコンソールで表示します。(ITP対応のためには、このクッキーがコンバージョン時に送信できていることが必要です。)   

## TODO
TODO: add CROSS DOMAIN COOKIE DIFF ALERT function  
TODO: integrate OLD CODE DETECTOR function  
TODO: deal with customized cookie name (users can change the prefix of "_gcl" from GTM)  
