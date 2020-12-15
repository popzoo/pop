// ==UserScript==
// @name         Auto Crawl Dynamic-Gift and Motorcade Data
// @name:zh-CN   《车队信息+动态礼物》数据抓取
// @namespace    https://github.com/popzoo/pop
// @version      2.0
// @description  自动抓取斗鱼所有动态礼物和车队数据，供网站相关模块使用
// @author       lvlanxing
// @icon         https://cdn.jsdelivr.net/gh/popzoo/pop/images/favicon.ico
// @icon64URL    https://cdn.jsdelivr.net/gh/popzoo/pop/images/favicon-64.ico
// @match        *://msg.douyu.com/666
// @mail         lvlanxing@gmail.com
// @copyright    GPL-2.0
// @run-at       document-end
// @note         完成跑完数据需要5~10min，跑完后会浏览器自动弹出下载弹窗，请点击下载即可。
// @note         脚本触发入口为msg.douyu.com/666，查看控制台即可知晓抓取进度
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    // ============================获取车队筛选条件=====================================================
    // ++++++++++++++++++++++++++++车队信息访问入口 https://msg.douyu.com/666
    // ============================获取车队筛选条件=====================================================
    var num = 0,count=0;
    var giftList = new Array();
    var fleetList = new Array();
    var fleetType1 = new Array();//不限
    var fleetType2 = new Array();//等级
    var fleetType3 = new Array();//贵族
    var fleetType5 = new Array();//粉丝
    var fleetType0 = new Array();//其他
    // if(document.URL=='https://www.douyu.com/666'){
    //     setTimeout(fetchFleetConfig,2000);
    // }
    //===============================================================
    //++++++++++++++++++++++ dynamic gift Init ++++++++++++++++++++++
    //===============================================================
    setTimeout(function(){callbackGift(0)},1000);
    function callbackGift(code){
        if(code<750 || (code>=20000 && code<20600)){//<=20400 这里可以爬
            console.info("礼物抓取进度【"+count+"/"+1352+"】,礼物模板【"+code+"】");
            crawlerDynamicGift(code);
        }else if(code == 750){//1~735 20000~20541
            crawlerDynamicGift(20000);
        }else{
            console.info("动态礼物抓取完毕,数组长度:"+giftList.length);
            var arr = [];
            for(let i = giftList.length-1; i>-1; i--){
                let jsonContent = {"id":giftList[i].id,"name":giftList[i].name,"himg":giftList[i].himg,"exp":giftList[i].exp,"hit_interval":giftList[i].hit_interval,"price_name":giftList[i].price_name,"stay_time":giftList[i].stay_time,"intro":giftList[i].intro};
                arr.push(jsonContent);
            }
            giftList = [].concat(arr);
            // saveJsonContent(JSON.stringify(arr),'dynamic_gift.json');
            fetchFleetConfig();
        }
    }
    function crawlerDynamicGift(code){
        count++;
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://webconf.douyucdn.cn/resource/common/gift/gift_template/"+ code +".json",//1~736 20000~20340 这里要爬取
            onload: function(response) {
                try{
                    let result = response.responseText;
                    result = result.substring(17, result.length-2);
                    let jsonData = JSON.parse(result);
                    giftList = distinct(giftList.concat(jsonData));
                }catch(err){//avoid json parse error
                    console.error("无法解析礼物模板【"+code+"】信息或不存在！");
                }
                callbackGift(++code);
            },
            onerror: function(err){
                console.error('请求错误', err);
                callbackGift(++code);
            }
        });
    }
    function distinct(arr) {
        var result = [];
        for(let i = 0; i < arr.length; i++){
            for(let j = i + 1; j < arr.length; j++){
                if(arr[i].id === arr[j].id){
                    j = ++i;
                }
            }
            result.push(arr[i]);
        }
        return result;
    }
    //===============================================================
    //+++++++++++++++++++++++ fleet data init +++++++++++++++++++++++
    //===============================================================
    // setTimeout(fetchFleetConfig,2000);
    function fetchFleetConfig() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://webconf.douyucdn.cn/resource/common/fleet/fleet_config.json",
            onload: function(response) {
                try{
                    let result = response.responseText;
                    result = result.substring(17, result.length-2);
                    getWindowNameData(result);
                    // window.name = result;
                }catch(err){//avoid json parse error
                    console.error("无法解析车队列表！",err);
                }
            },
            onerror: function(err){
                console.error('请求错误', err);
            }
        });
    }
    function getWindowNameData(res) {
        if(res!=""&&res!=undefined){
            console.info("车队数据轮询开启，请耐心等待！");
            let jsonData = JSON.parse(res);//这里要延迟10s
            jsonData=jsonData.data.list;
            for(let key in jsonData){
                if(jsonData[key].cid!=undefined && jsonData[key].cid!=""){
                    fleetList.push(jsonData[key].cid);
                }
            }
            loopfleetList();
        }else{
            alert("车队数据获取失败，请重新获取fleet数据！");
        }
    }
    function loopfleetList(){
        console.info("车队抓取进度【"+num+"/"+fleetList.length+"】");
        if(num==fleetList.length){
            console.info("所有车队数据轮询完毕,2s后自动下载！");
            setTimeout(downloadAll,2000);
        }else{
            motorcadeInfo(fleetList[num]);
        }
    }
    function motorcadeInfo(cid){
        let postData = "motorcadeId="+ cid;
        fetch('https://msg.douyu.com/v3/motorcade/getSetting?timestamp='+Math.random(), {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'dy-device-id':'-',
                "dy-client": "web",
                "dy-csrf-token":Math.random().toString(36).substr(2),
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: postData
        }).then(result => {
            return result.json();
        }).then(json => {
            if(json.message == "success"){
                if(json.data.applyJoinType=="1"){
                    fleetType1.push(json.data);
                }else if(json.data.applyJoinType=="2"){
                    fleetType2.push(json.data);
                }else if(json.data.applyJoinType=="3"){
                    fleetType3.push(json.data);
                }else if(json.data.applyJoinType=="5"){
                    fleetType5.push(json.data);
                }
                loopfleetList(++num);
            }else{
                console.info("访问错误，车号CID["+cid+"]+++"+json.message+"+++状态码："+json.status_code);
                loopfleetList(++num);
            }
        }).catch(err => {
            console.error('请求错误', err);
            loopfleetList(++num);
        })
    }
    //===============================================================
    //+++++++++++++++++++++++ save json data ++++++++++++++++++++++++
    //===============================================================
    function downloadAll(){
        // fleetType1 = "DYConfigCallback("+JSON.stringify(fleetType1)+");";
        // fleetType2 = "DYConfigCallback("+JSON.stringify(fleetType2)+");";
        // fleetType3 = "DYConfigCallback("+JSON.stringify(fleetType3)+");";
        // fleetType5 = "DYConfigCallback("+JSON.stringify(fleetType5)+");";
        // saveJsonContent(fleetType1,'fleet_type_1.json');
        // saveJsonContent(fleetType2,'fleet_type_2.json');
        // saveJsonContent(fleetType3,'fleet_type_3.json');
        // saveJsonContent(fleetType5,'fleet_type_5.json');
        saveJsonContent(JSON.stringify(giftList),'dynamic_gift.json');
        saveJsonContent(JSON.stringify(fleetType1),'fleet_type_1.json');
        saveJsonContent(JSON.stringify(fleetType2),'fleet_type_2.json');
        saveJsonContent(JSON.stringify(fleetType3),'fleet_type_3.json');
        saveJsonContent(JSON.stringify(fleetType5),'fleet_type_5.json');
    }
    function saveJsonContent (content, fileName) {
        let downLink = document.createElement('a')
        downLink.download = fileName;
        let blob = new Blob([content]);//字符内容转换为blod
        downLink.href = URL.createObjectURL(blob);
        document.body.appendChild(downLink);
        downLink.click();
        document.body.removeChild(downLink);
    }
})();


