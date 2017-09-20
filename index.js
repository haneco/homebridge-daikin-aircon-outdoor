var inherits = require('util').inherits;
var Service, Characteristic;
var http = require('http');
var exec = require('child_process').exec;

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory('homebridge-daikin-aircon-outdoor', 'DaikinAirconOutdoor', DaikinAirconOutdoorAccessory);
}


class DaikinAirconOutdoorAccessory {
    constructor(log, config) {
        this.log = log;
        this.host = config['host'];
        this.name = config['name'];
    }

    /**
     * アダプタからのレスポンスをオブジェクトに変換する
     * @param {string} response - HTTPのレスポンスボディ
     * @return {object}
     */
	parseResponse(response) {
        const vals = {};
        if (response) {
            const items = response.split(',');
            const length = items.length;
            for (let i = 0; i < length; i++) {
                const keyVal = items[i].split('=');
                vals[keyVal[0]] = keyVal[1];
            }
        }
		return vals;
    }

    /**
     * GETリクエストを送る
     * @param {string} path - 送信先のパス
     * @param {function} callback - コールバック
     */
    sendGetRequest(path, callback) {
        const req = http.get(
            `http://${this.host}${path}`,
            (response) => {
                let body = '';
                response.setEncoding('utf8');
            
                response.on('data', (chunk) => {
                    body += chunk;
                });
            
                response.on('end', () => {
                    callback(body)
                });
            }
        ).on('error', (error) => {
            this.log(error.message);
            callback();
        });
    }

    /**
     * 屋外の気温を取得する
     */
    getCurrentOutdoorsTemperature(callback) {
		this.sendGetRequest('/aircon/get_sensor_info', (body) => {
            const responseValues = this.parseResponse(body);
            callback(null, responseValues.otemp);
        });
    }

    /**
     * サービスの設定
     */
    getServices() {
        const temperatureSensorService = new Service.TemperatureSensor(this.name)
        temperatureSensorService
            .getCharacteristic(Characteristic.CurrentTemperature)
            .on('get', this.getCurrentOutdoorsTemperature.bind(this));
            
        return [temperatureSensorService];
    }
}

