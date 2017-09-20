# ダイキンエアコン屋外気温 Homebridge プラグイン

## 概要

ネットワークアダプタが接続されているダイキン製ホームエアコンのセンサーで取得した屋外気温をHomekitから確認できるようにするためのHomebridgeプラグインです。
AN80TRPとBRP072A41の組み合わせで動作確認しています。

室内のエアコン操作はhomebridge-daikin-airconをご利用ください。

## 設定

```
"accessories": [
    {
        "accessory": "DaikinAirconOutdoor",
        "name": "屋外",
        "host": "192.168.11.2"
    }
]
```
