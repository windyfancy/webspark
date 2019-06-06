var Dialog = {
    el: {},
    position : function(options){
        options    = options || {};
        var width  = options.width || 360,
            height = options.height || 355,
            clientW= document.documentElement.clientWidth,
            clientH= document.documentElement.clientHeight,
            top    = (clientH - height) / 2,
            left   = (clientW - width) / 2,
            right  = clientW - left - width,
            bottom = clientH - top - height;

        return {
            top    : top,
            left   : left,
            right  : right,
            bottom : bottom
        }
    },
    show: function (options) {
        if( this.el.container ){
            this.close();
        }
        var self = this;
        if (!options) { options = {};}

        var mask = document.createElement("div");
        var clientW= document.documentElement.clientWidth;
        var maskWidth = clientW > 1002 ? clientW : 1002;
        mask.style.cssText = "position:fixed;top:0px;left:0px;z-index:9;width:100%;height:100%;background-color:#000;display:block;opacity:0.3;filter:alpha(opacity=30);"
    	mask.style.width = maskWidth + 'px';
	    document.body.appendChild(mask); 

        var width  = options.width || 360;
        var height = options.height || 355;
        var src    = options.src;

        var container = document.createElement("div");
        container.style.cssText= "position:fixed;z-index:10;margin:auto;top:0;left:0;right:0;bottom:0;width:"+width+"px;height:"+height+"px"


        var iframe   = '<iframe id="boxIframe" src="{src}" width="{width}" height="{height}" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no"></iframe>';

        var objParam = {
            src     : src,
            width   : width,
            height  : height
        };
        container.innerHTML ='<div class="dialogTitle"><span>'+options.title+'</span><a href="javascript:Dialog.close();" class="close" title="点击关闭">×</a></div>'
                            + this.format(iframe, objParam);
        document.body.appendChild(container);
        this.el = { mask: mask, container: container };
    },
    close: function (type) {
        this.el.mask.parentNode.removeChild(this.el.mask);
        this.el.container.parentNode.removeChild(this.el.container);
        this.el.mask     = null;
        this.el.container= null;
       
    },format: function (str, arr) {//格式化字符串，提供数组和object两种方式
        var reg;
        //if ($.isArray(arr)) {
        if( Object.prototype.toString.call(str) == '[object Array]' ){ //没有引用jquery,改用源生的
            reg = /\{([\d]+)\}/g;
        } else {
            reg = /\{([\w]+)\}/g;
        }
        return str.replace(reg, function ($0, $1) {
            var value = arr[$1];
            if (value !== undefined) {
                return value;
            } else {
                return "";
            }
        });
    }

}


function showLogin(){
    Dialog.show({title:"登录",src:"/html/login.html",height:"240"})
}
function showRegister(){
    Dialog.show({title:"注册",src:"/html/register.html",height:"300"})
}