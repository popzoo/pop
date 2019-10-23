// ==UserScript==
// @name         Auto Redefined Motorcade Data
// @name:zh-CN   整理下载车队数据
// @namespace    https://github.com/popzoo/pop
// @version      1.1
// @description  自动跑完所有车队数据，供其他模块使用
// @author       lvlanxing
// @icon         https://raw.githubusercontent.com/popzoo/pop/master/images/favicon.ico
// @match        https://msg.douyu.com/*
// @mail         lvlanxing@gmail.com
// @copyright    JadeBone
// @grant        none
// @license      Mozilla Public License 2.0
// @run-at       document-end
// @compatible   chrome
// @note         完成跑完数据需要5~6min，请耐心等待；
// ==/UserScript==


(function() {

    // ============================获取车队筛选条件=====================================================
    // ++++++++++++++++++++++++++++访问入口 https://msg.douyu.com/
    // ============================获取车队筛选条件=====================================================
    var fleetType1 = new Array();//无限制
    var fleetType2 = new Array();//等级
    var fleetType3 = new Array();//贵族
    var fleetType5 = new Array();//粉丝
    var fleetType0 = new Array();//其他
    fetchFleetList();
    function fetchFleetList() {
        fetch('https://raw.githubusercontent.com/wolf-scream/gift_effect/master/fleet_config.json',{
            method: 'GET',
            mode: 'cors', //请求模式为跨域
            cache: 'default',
            credentials: 'omit', // 同源则加入凭据头,omit,include
        }).then(res => {
            return res.text();
        }).then(result => {
            console.info("车队数据轮询开启，请耐心等待！");
            // console.log('获取的结果', result);
            result = result.substring(17, result.length-2);
            var jsonData = JSON.parse(result);
            jsonData=jsonData.data.list;
            var fleetList = new Array();
            for(let key in jsonData){
                if(jsonData[key].cid!=undefined && jsonData[key].cid!=""){
                    fleetList.push(jsonData[key].cid);
                }
            }
            let i = 0;
            let overCount = fleetList.length;
            var loopit = function(){
                if(i==overCount){
                    //alert("it is over!");
                    console.info("所有车队数据轮询完毕,3s后开始下载！");
                    setTimeout(downloadAll,3000);
                    return;
                }else{
                    motorcadeInfo(fleetList[i]);
                    i++;
                    setTimeout(loopit,parseInt(Math.random()*60)+100);//这里需要延迟150ms
                }
            }
            loopit();
        }).catch(err => {
            console.error('请求错误', err);
        })
    }

    function downloadAll(){
        saveJsonContent(JSON.stringify(fleetType1),'fleet_type_1.json');
        saveJsonContent(JSON.stringify(fleetType2),'fleet_type_2.json');
        saveJsonContent(JSON.stringify(fleetType3),'fleet_type_3.json');
        saveJsonContent(JSON.stringify(fleetType5),'fleet_type_5.json');
    }

    function saveJsonContent (content, fileName) {
        let downLink = document.createElement('a')
        downLink.download = fileName;
        let blob = new Blob([content]);//字符内容转换为blod地址
        downLink.href = URL.createObjectURL(blob);
        document.body.appendChild(downLink);// 链接插入到页面
        downLink.click();
        document.body.removeChild(downLink);// 移除下载链接
    }

    //非斗鱼车队页面可用
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
            if(json.data.applyJoinType=="1"){
                fleetType1.push(json.data);
            }else if(json.data.applyJoinType=="2"){
                fleetType2.push(json.data);
            }else if(json.data.applyJoinType=="3"){
                fleetType3.push(json.data);
            }else if(json.data.applyJoinType=="5"){
                fleetType5.push(json.data);
            }else{
                fleetType0.push(json.data);
            }
        }).catch(err => {
            console.error('请求错误', err);
        })
    }

})();


