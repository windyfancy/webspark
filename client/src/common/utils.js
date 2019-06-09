var Utils={
    httpRequest: function (url, data, options) {
        //url="http://localhost"+url
        let type = "post";
        if(typeof data=="object"){
            data=JSON.stringify(data);
        }
 
        return new Promise((resolve, reject) => {

            var xhr = new XMLHttpRequest();
            
            xhr.open(type, url, true);
            //xhr.withCredentials = true;
            xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");
            xhr.setRequestHeader("Accept", "text/javascript");
            xhr.send(data);
            xhr.onreadystatechange = () => {

                if (xhr.readyState == 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {

                        var resultObj = JSON.parse(xhr.responseText);
                        resolve(resultObj)
                    } else {
                        reject(xhr.responseText);
                    }

                }
            }
        })
    },
    getStringLength:function (text){
        var charArr = text.split("");
        var byteLen = 0;
        var reg=new RegExp("[\u4E00-\u9FA5]", "g")
        for (var i = 0; i < charArr.length; i++) {
            var m = charArr[i].match(reg);
            if(m){
                byteLen += 2;
            }else{
                byteLen++;
            }

            /*if (byteLen > maxLength) {
                return text.substring(0, i) + (showReplacer ? "..." : "");
            }*/
        }
        return byteLen;

    },
    getRelativeDate:function(date){
        var now=new Date();
        var result;
        //今天的邮件
        var t = now.getTime() - date.getTime(); 	//相差毫秒
        var minutes = Math.round(t / 1000 / 60);
        var hours = Math.round(t / 1000 / 60 / 60);
        var days = Math.round(t / 1000 / 60 / 60 /24);
  
        if (minutes < 1) {
            result = "刚刚";
        }else if (minutes >= 1 && minutes < 60) {
            result = minutes + "分钟前";
        } else if(hours<24){
            result = hours + "小时前";
        }else if(days<30){
            result = days + "天前";
        }else if(days<365){
            result = Math.round(days/30) + "个月前";
        }else{
            result = Math.round(days/365) + "年前";
        }
  
        
        return  result ;
   },
    getUrl:function (url,callback){
        var script=document.createElement("SCRIPT");
        script.src=url;
        script.type="text/javascript";
        document.head.appendChild(script);
        script.onload=function (){
            alert($(this).text());
            callback(this.textContent);
        }
    },
    getMedia:function (url,onStatus){
        //new Media("/android_asset/www/res/practical/nc03/C301.mp3").play()
        var fullPath;
        if(url.indexOf("file://")>=0){
            fullPath=url;
        }else if(url.indexOf("http://")>=0){
             fullPath=url;
        }else{ //相对路径转换为本地
            fullPath=cordova.file.applicationDirectory + "www/"+url
        }
        var myMedia=new Media(fullPath,function (){},function (){},
        onStatus);
        //if(autoPlay){
            //myMedia.play();//{ numberOfLoops: 9999,playAudioWhenScreenIsLocked : true}
        //}
        return myMedia;
    },
    //  <meta http-equiv="Content-Security-Policy" content="default-src *; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval';">
    request:function (url,callback){
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            var DONE = this.DONE || 4;
            if (this.readyState === DONE){
                console.log(this.responseText);
                callback && callback(this.responseText);
            }
        };
        request.open('GET', url, true);
        request.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); 
        request.send(null);
    },
    loadFile:function (url,callback){
        $.ajax({type:"GET",url:url,success:function(e){
            callback(e);
        }
        });

        /*
        if(window.device){
            if(url.indexOf("http:")>=0){
                $.ajax({type:"GET",url:url,success:function(e){
                    callback(e);
                }
                });
            }else{
                window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/"+url, function (e){
                    e.file(function(file) {
                        var reader = new FileReader();

                        reader.onloadend = function(e) {
                            //console.log("Text is: "+this.result);
                            //console.log(e);
                            callback(this.result);
                        }

                        reader.readAsText(file);
                    });
                }, function (err){});
            }
        }else{
            $.ajax({type:"GET",url:url,success:function(e){
                callback(e);
            }
            });
        }*/
    },
    getPathInfo:function(path){
        var reg=/(.+\/)(.+)$/
        var m=path.match(reg)
        return {
            dir:m[1],
            fileName:m[2],
            extName:m[2].split(".")[1]
        }
    },
    downloadFile:function (options){
          window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {

                console.log('file system open: ' + fs.name);

                // Make sure you add the domain name to the Content-Security-Policy <meta> element.
                var url = options.url;//'http://www.englishapp.net/res/album/practical/nc03/c301.mp3';
                // Parameters passed to getFile create a new file or return the file if it already exists.
                fs.root.getDirectory(options.savePath, { create: true, exclusive: false }, function (dirEntry) {
                    dirEntry.getFile(options.fileName, { create: true, exclusive: false }, function (fileEntry) {
                        download(fileEntry, url, false);
                    }, function (err){
                        console.log(err);
                    });
                },function (err){
                    console.log(err);
                })

            }, function (err){
                console.log(err);
            });


            function download(fileEntry, uri, readBinaryData) {

                var fileTransfer = new FileTransfer();
                var fileURL = fileEntry.toURL();
                fileTransfer.onprogress = function(progressEvent) {
                    if (progressEvent.lengthComputable) {
                        options.onprogress(progressEvent);
                        //console.log("current progress:"+progressEvent.loaded / progressEvent.total);
                    }
                };

                fileTransfer.download(
                    uri,
                    fileURL,
                    function (entry) {
                        //console.log("Successful download...");
                        //console.log("download complete: " + entry.toURL());
                        options.oncomplete(entry.toURL());
                        
                    },
                    function (error) {
                        console.log("download error source " + error.source);
                        console.log("download error target " + error.target);
                        console.log("upload error code" + error.code);
                    },
                    null, // or, pass false
                    {
                        //headers: {
                        //    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                        //}
                    }
                );
            }
    }
}


;(function() {  
  
    //  
    // 密文字符集（size:62）。  
    // [0-9A-Za-z]  
    //  
    var _hexCHS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';  
  
    //  
    // 密文字符顺序映射。  
    // 顺序与 _hexCHS 同，从 0 开始。  
    //  
    var _hexTBL = {  
        '0':0, '1':1, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9,  
        'A':10, 'B':11, 'C':12, 'D':13, 'E':14, 'F':15, 'G':16, 'H':17, 'I':18, 'J':19,  
        'K':20, 'L':21, 'M':22, 'N':23, 'O':24, 'P':25, 'Q':26, 'R':27, 'S':28, 'T':29,  
        'U':30, 'V':31, 'W':32, 'X':33, 'Y':34, 'Z':35, 'a':36, 'b':37, 'c':38, 'd':39,  
        'e':40, 'f':41, 'g':42, 'h':43, 'i':44, 'j':45, 'k':46, 'l':47, 'm':48, 'n':49,  
        'o':50, 'p':51, 'q':52, 'r':53, 's':54, 't':55, 'u':56, 'v':57, 'w':58, 'x':59,  
        'y':60, 'z':61  
    };  
  
    //  
    // 进制转换加密法  
    // 原理：  
    // 用 [0-9A-Za-z] 62 个字符的随机排列作为进制表对字符的值进行转换。  
    // 特点：  
    // 1. 密文为数字和大小写英文字母，及原有的 [\s\n\r]；  
    // 2. 增加了密文字符的平移操作，提高加密强度；  
    // 3. 可自动识别单双字节字符并进行相应编码；  
    // 4. 双字节字符用 3 位 41 进制表示，最大可表示 68920 的字值；  
    // 5. 单字节字符用 2 位 16 进制表示，最大可表示 255 的字值；  
    // 6. 空白、换行和回车 [\s\n\r] 保持原样。  
    // 缺点：  
    // 密文会比原文长，中文视宽增长 1.5 倍（一个汉字算 2 字节宽）；  
    // 考虑空白和换行/回车不处理，英文增长 < 2 倍。  
    // 推荐：  
    // 可用于任意类型的文本加密，由于密文为规范的 [\w]，适于各类环境。  
    //  
    // 参数：  
    // key[0-57) 间的值小于 62 且唯一，其后的值可任意和重复；  
    // key[0-16) 为 16 进制字符表，key[16-57) 为 41 进制字符表。  
    //  
    // @param array key  - [0-61] 互斥值数组，length >= 57  
    //  
    window.Hexch = function( key )  
    {  
        if(!key){
            key=[61,37,55,31,34,7,24,9,43,12,27,17,25,29,60,33,35,41,58,2,51,49,9,5,59,11,42,32,22,40,4,57,50,38,8,56,21,19,52,53,16,28,1,26,47,17,54,46,10,23,55,13,14,20,15,36,18]
        }
        if (key.length < 57) {  
            throw new Error('the key is too short.');  
        }  
        // 平移密钥  
        this._sz = _hexCHS.charCodeAt(key[15]) % (key.length-20) + 10,  
        this._ks = key.slice(-this._sz);  
        for (var _i=0; _i<this._sz; ++_i) {  
            this._ks[_i] = _hexCHS.charCodeAt(this._ks[_i]%62);  
        }  
  
        this._k16 = [], this._k41 = [];  
        this._t16 = {}, this._t41 = {};  
  
        for (var _i=0; _i<16; ++_i) {  
            this._k16[_i] = _hexCHS.charAt(key[_i]);  
            this._t16[this._k16[_i]] = _i;  
        }  
        for (var _i=0; _i<41; ++_i) {  
            this._k41[_i] = _hexCHS.charAt(key[_i+16]);  
            this._t41[this._k41[_i]] = _i;  
        }  
    };  
  
    // 加密  
    Hexch.prototype.enc = function( s )  
    {  
        var _k16 = this._k16,  
            _k41 = this._k41,  
            _ks  = this._ks,  
            _sz  = this._sz,  
            _cnt = 0;  
        return  s.replace(/[^\t]/g, function( ch ) {  
            var _n = ch.charCodeAt(0);  
            return  (_n <= 0xff)  
                ? _k16[parseInt(_n/16)] + _k16[_n%16]  
                : _k41[parseInt(_n/1681)] + _k41[parseInt(_n%1681/41)] + _k41[_n%41]  
        // 平移  
        }).replace(/[0-9A-Za-z]/g, function( ch ) {  
            return  _hexCHS.charAt((_hexTBL[ch] + _ks[_cnt++%_sz]) % 62);  
        });  
    };  
  
    // 解密  
    Hexch.prototype.dec = function( s )  
    {  
        var _t16 = this._t16,  
            _t41 = this._t41,  
            _ks  = this._ks,  
            _sz  = this._sz,  
            _cnt = 0;  
        var _s = s.replace(/[0-9A-Za-z]/g, function( ch ) {  
            return  _hexCHS.charAt((_hexTBL[ch] - _ks[_cnt++%_sz]%62 + 62) % 62);  
        });  
        var _rs = '';  
        for (var _i=0; _i<_s.length;) {  
            var _ch = _s.charAt(_i);  
            if (/[\t]/.test(_ch)) {  
                _rs += _ch;  
                ++_i;  
            } else if (_t16[_ch] !== undefined) {  
                _rs += String.fromCharCode(_t16[_s.charAt(_i)]*16 + _t16[_s.charAt(_i+1)]);  
                _i += 2;  
            } else {  
                _rs += String.fromCharCode(_t41[_s.charAt(_i)]*1681 + _t41[_s.charAt(_i+1)]*41 + _t41[_s.charAt(_i+2)]);  
                _i += 3;  
            }  
        }  
        return  _rs;  
    };  
  
})();  

module.exports=Utils;