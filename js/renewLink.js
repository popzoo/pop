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
        document.getElementById("right_link").setAttribute("href","https://greasyfork.org/zh-CN/scripts/394497");
    }    
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
})();
