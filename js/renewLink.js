(function (){
	if(document.getElementById("own_time")!=undefined){
		document.getElementById("own_time").setAttribute("href","//popzoo.github.io/zoo/");//https://www.popzoo.xyz/
	}
    if(document.getElementById("own_danmu")!=undefined){
    	document.getElementById("own_danmu").setAttribute("href","//popzoo.github.io/danmu/");//https://danmu.popzoo.xyz/
	}
    if(document.getElementById("own_fire")!=undefined){
    	document.getElementById("own_fire").setAttribute("href","//popzoo.github.io/pop/");
	}
    if(document.getElementById("own_gift")!=undefined){
    	document.getElementById("own_gift").setAttribute("href","//popzoo.github.io/pop/giftshow.html");
	}
    if(document.getElementById("own_car")!=undefined){
    	document.getElementById("own_car").setAttribute("href","//popzoo.github.io/pop/motorcade.html");
	}
    if(document.getElementById("own_form")!=undefined){
    	document.getElementById("own_form").setAttribute("href","//popzoo.github.io/form/");//http://form.popzoo.xyz/
	}
    // git cat link
    if(document.getElementById("left_link")!=undefined){
        document.getElementById("left_link").setAttribute("href","https://github.com/popzoo/seekProxy/blob/master/README.md");
    }
    if(document.getElementById("right_link")!=undefined){
        document.getElementById("right_link").setAttribute("href","//popzoo.github.io/zoo/personal.html");
    }   
     //====================================================== 
    var OriginTitile = document.title, titleTime;
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            document.title = '道友请留步(￢_￢)瞄~';
            clearTimeout(titleTime);
        } else {
            document.title = '欢迎回家✿(。◕ᴗ◕。)✿';
            titleTime = setTimeout(function() {
                document.title = OriginTitile;
            },3000);
        }
    });
    //====================================================== 
    const live2d_path = "https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/";
    // const live2d_path = "https://cdn.jsdelivr.net/gh/lvlanxingapp/live2d-widget/";
    localStorage.setItem('modelId',5);
    localStorage.setItem('modelTexturesId',0);
    // 封装异步加载资源的方法
    function loadExternalResource(url, type) {
        return new Promise((resolve, reject) => {
            let tag;
    
            if (type === "css") {
                tag = document.createElement("link");
                tag.rel = "stylesheet";
                tag.href = url;
            }
            else if (type === "js") {
                tag = document.createElement("script");
                tag.src = url;
            }
            if (tag) {
                tag.onload = () => resolve(url);
                tag.onerror = () => reject(url);
                document.head.appendChild(tag);
            }
        });
    }
    // 加载 waifu.css live2d.min.js waifu-tips.js
    if (screen.width >= 768) {
        Promise.all([
            loadExternalResource(live2d_path + "waifu.css", "css"),
            loadExternalResource(live2d_path + "live2d.min.js", "js"),
            loadExternalResource(live2d_path + "waifu-tips.js", "js")
        ]).then(() => {
            initWidget({
                waifuPath: live2d_path + "waifu-tips.json",
                // apiPath: "https://live2d.fghrsh.net/api/",
                // cdnPath: "https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/"
                cdnPath: "https://cdn.jsdelivr.net/gh/lvlanxingapp/live2d_api/"
            });
        });
    }
    // initWidget 第一个参数为 waifu-tips.json 的路径，第二个参数为 API 地址
    // API 后端可自行搭建，参考 https://github.com/fghrsh/live2d_api
    // 初始化看板娘会自动加载指定目录下的 waifu-tips.json
    console.log(`
      く__,.ヘヽ.        /  ,ー､ 〉
               ＼ ', !-─‐-i  /  /´
               ／｀ｰ'       L/／｀ヽ､
             /   ／,   /|   ,   ,       ',
           ｲ   / /-‐/  ｉ  L_ ﾊ ヽ!   i
            ﾚ ﾍ 7ｲ｀ﾄ   ﾚ'ｧ-ﾄ､!ハ|   |
              !,/7 '0'     ´0iソ|    |
              |.从"    _     ,,,, / |./    |
              ﾚ'| i＞.､,,__  _,.イ /   .i   |
                ﾚ'| | / k_７_/ﾚ'ヽ,  ﾊ.  |
                  | |/i 〈|/   i  ,.ﾍ |  i  |
                 .|/ /  ｉ：    ﾍ!    ＼  |
                  kヽ>､ﾊ    _,.ﾍ､    /､!
                  !'〈//｀Ｔ´', ＼ ｀'7'ｰr'
                  ﾚ'ヽL__|___i,___,ンﾚ|ノ
                      ﾄ-,/  |___./
                      'ｰ'    !_,.:
    `);    
    window.addEventListener('load', () => {
        console.log('%cPOPZOO WebSite', 'text-shadow: 0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0, 0, 0, .1), 0 0 5px rgba(0, 0, 0, .1), 0 1px 3px rgba(0, 0, 0, .3), 0 3px 5px rgba(0, 0, 0, .2), 0 5px 10px rgba(0, 0, 0, .25), 0 10px 10px rgba(0, 0, 0, .2), 0 20px 20px rgba(0, 0, 0, .15);\
            font-size: 5em;');
        console.log(`页面加载完毕消耗了${Math.round(performance.now() * 100) / 100}ms`);
    });
})();
