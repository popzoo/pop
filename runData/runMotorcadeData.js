// ==UserScript==
// @name         Auto Redefined Motorcade Data
// @name:zh-CN   整理下载车队数据
// @namespace    https://github.com/popzoo/pop
// @version      1.5
// @description  自动跑完所有车队数据，供其他模块使用
// @author       lvlanxing
// @icon         https://rawcdn.githack.com/popzoo/pop/9d4121eed5cbb035e55203b8a9e56a73dcf2e6bf/images/favicon.ico
// @icon64URL    https://rawcdn.githack.com/popzoo/pop/9d4121eed5cbb035e55203b8a9e56a73dcf2e6bf/images/favicon-64.ico
// @match        https://msg.douyu.com/666
// @match        https://www.douyu.com/666
// @mail         lvlanxing@gmail.com
// @copyright    JadeBone
// @run-at       document-end
// @note         完成跑完数据需要5~6min，请耐心等待；
// @grant        GM_openInTab
// ==/UserScript==


(function() {
    // ============================获取车队筛选条件=====================================================
    // ++++++++++++++++++++++++++++全部车队访问入口 https://www.douyu.com/666
    // ++++++++++++++++++++++++++++车队信息访问入口 https://msg.douyu.com/666
    // ============================获取车队筛选条件=====================================================
    var num = 0;
    var fleetList = new Array();
    var fleetType1 = new Array();//不限
    var fleetType2 = new Array();//等级
    var fleetType3 = new Array();//贵族
    var fleetType5 = new Array();//粉丝
    var fleetType0 = new Array();//其他

    if(document.URL=='https://www.douyu.com/666'){
        setTimeout(fetchFleetConfig,2000);
    }else if(document.URL=='https://msg.douyu.com/666'){
        setTimeout(getWindowNameData,1000);
    }

    function fetchFleetConfig() {
        fetch('https://webconf.douyucdn.cn/resource/common/fleet/fleet_config.json',{
            method: 'GET',
            mode: 'cors', 
            cache: 'default',
            credentials: 'omit'
        }).then(res => {
            return res.text();
        }).then(result => {
            result = result.substring(17, result.length-2);
            window.name = result;
            window.location.href = "https://msg.douyu.com/666";
        }).catch(err => {
            console.error('请求错误', err);
        })
    }

    function getWindowNameData() {
        if(window.name!=""){
            console.info("车队数据轮询开启，请耐心等待！");
            let jsonData = JSON.parse(window.name);//这里要延迟10s
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
        let overCount = fleetList.length;
        console.info(overCount);
        if(num==overCount){
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
                // }else{
                //     fleetType0.push(json.data);
                }
                num++;
                loopfleetList();
            }else{
                console.info("一条错误+++车号CID["+cid+"]+++"+json.message+"+++状态码："+json.status_code);
                num++;
                loopfleetList();
            }
        }).catch(err => {
            console.error('请求错误', err);
            num++;
            loopfleetList();
        })
    }

    function downloadAll(){
    	fleetType1 = "DYConfigCallback("+JSON.stringify(fleetType1)+");";
    	fleetType2 = "DYConfigCallback("+JSON.stringify(fleetType2)+");";
    	fleetType3 = "DYConfigCallback("+JSON.stringify(fleetType3)+");";
    	fleetType5 = "DYConfigCallback("+JSON.stringify(fleetType5)+");";
        saveJsonContent(fleetType1,'fleet_type_1.json');
        saveJsonContent(fleetType2,'fleet_type_2.json');
        saveJsonContent(fleetType3,'fleet_type_3.json');
        saveJsonContent(fleetType5,'fleet_type_5.json');
        // saveJsonContent(JSON.stringify(fleetType1),'fleet_type_1.json');
        // saveJsonContent(JSON.stringify(fleetType2),'fleet_type_2.json');
        // saveJsonContent(JSON.stringify(fleetType3),'fleet_type_3.json');
        // saveJsonContent(JSON.stringify(fleetType5),'fleet_type_5.json');
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


