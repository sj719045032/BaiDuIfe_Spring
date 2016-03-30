/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
    var y = dat.getFullYear();
    var m = dat.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = dat.getDate();
    d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
    var returnData = {};
    var dat = new Date("2016-01-01");
    var datStr = ''
    for (var i = 1; i < 92; i++) {
        datStr = getDateStr(dat);
        returnData[datStr] = Math.ceil(Math.random() * seed);
        dat.setDate(dat.getDate() + 1);
    }
    return returnData;
}

var aqiSourceData = {
    "北京": randomBuildData(500),
    "上海": randomBuildData(300),
    "广州": randomBuildData(200),
    "深圳": randomBuildData(100),
    "成都": randomBuildData(300),
    "西安": randomBuildData(500),
    "福州": randomBuildData(100),
    "厦门": randomBuildData(100),
    "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
    nowSelectCity: Object.getOwnPropertyNames(aqiSourceData)[0],
    nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart(selectCity,graTime) {
    var renderData=chartData[selectCity][graTime];
    var displayHtml = '';
    var width='';
    switch (graTime){
        case 'day':
            width=10;
            break;
        case  'week':
            width=30;
            break;
        case  'month':
            width=70;
            break;
    }
    for (var key in renderData) {
        var color = '';
        if (renderData[key] < 100) {
            color = 'green';
        }
        else if (renderData[key] < 200) {
            color = 'blue';
        }
        else if (renderData[key] < 300) {
            color = 'red';
        } else {
            color = 'purple';
        }
        displayHtml += '<div title="' + key+'\n污染指数：'+renderData[key]+ '" style="display:inline-block;margin:0 1px;width:' + width + 'px;height:' + renderData[key] + 'px;background-color:' + color + '"></div>'
    }
    document.getElementsByClassName('aqi-chart-wrap')[0].innerHTML = displayHtml;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(event) {
    // 确定是否选项发生了变化
    var newTime = event.target.value;
    if (event.target.name == 'gra-time' && newTime != pageState.nowGraTime) {
        pageState.nowGraTime = newTime;
    }
    // 设置对应数据
    // 调用图表渲染函数
    renderChart(pageState.nowSelectCity,pageState.nowGraTime);
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange(event) {
    // 确定是否选项发生了变化
    if (pageState.nowSelectCity != event.target.value) {
        pageState.nowSelectCity = event.target.value
    }
    // 设置对应数据
    // 调用图表渲染函数
    renderChart(pageState.nowSelectCity,pageState.nowGraTime);
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
    document.getElementById('form-gra-time').onclick = graTimeChange;//事件代理
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
    // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var dropdownHtml = '';
    var select = document.getElementById('city-select');
    for (var key in aqiSourceData) {
        dropdownHtml += '<option>' + key + '</option>';
    }
    select.innerHTML = dropdownHtml;
    // 给select设置事件，当选项发生变化时调用函数citySelectChange
    select.onchange = citySelectChange;
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
    // 将原始的源数据处理成图表需要的数据格式
    // 处理好的数据存到 chartData 中
    for (var key in aqiSourceData) {
        chartData[key] = {};
        chartData[key].day = aqiSourceData[key];
        chartData[key].week = {};
        chartData[key].month = {};
        var week = [];
        var weekNum = 1;
        var month = [];
        var nowMonth = undefined;
        for (var date in chartData[key].day) {
            var dateObj = new Date(date);
            week.push(chartData[key].day[date]);
            if (dateObj.getDay() == 0) {
                var average = week.reduce(function (a, b) {
                        return a + b;
                    }) / week.length;
                chartData[key].week['第'+weekNum+'周'] = average.toFixed(2);
                weekNum++;
                week = [];
            }
            if (week.length != 0) {
                average = week.reduce(function (a, b) {
                        return a + b;
                    }) / week.length;
                chartData[key].week['第'+weekNum+'周'] = average.toFixed(2);
            }

            if (nowMonth === undefined) {
                nowMonth = dateObj.getMonth();
            }
            if (dateObj.getMonth() != nowMonth) {
                average = month.reduce(function (a, b) {
                        return a + b;
                    }) / month.length;
                chartData[key].month[nowMonth+1+'月'] = average.toFixed(2);
                nowMonth = dateObj.getMonth();
                month = [];
            }
            month.push(chartData[key].day[date]);
        }
        average = month.reduce(function (a, b) {
                return a + b;
            }) / month.length;
        chartData[key].month[nowMonth+1+'月'] = average.toFixed(2);


    }
    renderChart(pageState.nowSelectCity,pageState.nowGraTime);
}

/**
 * 初始化函数
 */
function init() {
    initGraTimeForm()
    initCitySelector();
    initAqiChartData();
}

window.onload = init;