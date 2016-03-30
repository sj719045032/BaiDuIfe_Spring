/**
 * Created by sj on 2016/3/30.
 */
/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
    var item='';
    var city=document.getElementById('aqi-city-input').value.trim();
    var index=document.getElementById('aqi-value-input').value.trim();
      if(city.match(/^[\u4e00-\u9fa5a-zA-Z]+$/)){   //输入合法性验证
         if(index.match(/^[0-9]+$/)){
             aqiData[city]=index;
         }else{
             alert("请输入正整数！");
         }
      }else {
          alert("请输入中文或者英文字符！");
      }
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
    var displayHtml='';
    for(var key in aqiData) {
        displayHtml += '<tr><td>' + key + '</td><td>' + aqiData[key] + '</td><td><button>删除</button></td></tr>';//通过数据得到需要渲染的html
    }
    document.getElementById('aqi-table').innerHTML=displayHtml;
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
    addAqiData();
    renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle(event) {
    // do sth.
    var city=event.target.parentNode.previousSibling.previousSibling.innerText;//获取需要删除的城市
    delete aqiData[city];//删除需要删除的城市数据
    renderAqiList();
}

function init() {
    // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
    document.getElementById('add-btn').onclick=addBtnHandle;
    // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
    document.getElementById('aqi-table').onclick=delBtnHandle;
}

window.onload=init;