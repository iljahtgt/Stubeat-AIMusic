# 資策會AIEN12 期末專題報告

Project Name: StuBeat音樂生成網站

組員:陳品彣,林宛儀,吳柏承,蔡奕德,陳奕安,劉致華

部屬網站:http://ec2-54-254-209-235.ap-southeast-1.compute.amazonaws.com/

簡述:

StuBeat是一個利用AI模型生產音樂的網頁平台,目標是讓一般使用者能夠輕鬆的用圖形介面來使用AI模型

我的分工:資料庫設計，登入/註冊系統，後台管理系統，使用案例及網站架構圖

資料庫使用:MySql
database:Stubeat
table:
sbmember - 儲存會員,
sbemployee - 儲存管理者,
sbmusic - 以json格式儲存音樂檔與會員ID做關聯


登入註冊系統,後台管理系統:

網頁前端:Javascript,Jquery
樣式表使用:Bootstrap 4
網頁架設前後端連結:Node.Js
功能:CRUD


尚未完工的部分:

會員頁面的修改:需加上會員在自己的資訊頁面中可以修改自己資訊的功能
資料庫的加密作業:原本使用Passport及Bcrypt做加密，但是當使用Ajax及前後端分離式的server時，還沒研究出怎麼將Passport掛載進去
第三方登入:使用Facebook及Google登入，問題同上。
