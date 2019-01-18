var utils = {
	uuid(len, radix){
		var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	    var uuid = [],
	        i;
	    radix = radix || chars.length;

	    if (len) {
	        // Compact form
	        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
	    } else {
	        // rfc4122, version 4 form
	        var r;

	        // rfc4122 requires these characters
	        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
	        uuid[14] = '4';

	        // Fill in random data.  At i==19 set the high bits of clock sequence as
	        // per rfc4122, sec. 4.1.5
	        for (i = 0; i < 36; i++) {
	            if (!uuid[i]) {
	                r = 0 | Math.random() * 16;
	                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
	            }
	        }
	    }

	    return uuid.join('');
	},

	fnParseQueryStrings(url){
		if(!url){
			return {};
		}
		var params = {};
		var result = url.match(new RegExp("[\?\&][^\?\&]+=[^\?\&]+","g")); 
		if(result == null){
			return {};
		}
		for(var i = 0; i < result.length; i++){
			var temp = result[i].substring(1).split("=");
			params[temp[0]]=temp[1];
		}
		return params;
	},

	delMap(map, key){
		map = map || {};
		key = key || "";
		delete map[key];
		return map;
	},

	concatArr2QueryString(map){
		if(!map){
			return "";
		}
		return JSON.stringify(map).replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&");
	},

	replaceParams(url, params){
    	var paramsOrg = this.fnParseQueryStrings(url);
    	for(var key in params){
    		paramsOrg[key] = params[key]
    	}
    	return this.concatArr2QueryString(paramsOrg);
    },

	fnGetQueryString(url, key) { //正则获取url后面的参数值，如?env=dev&exp=123中可以通过fnGetQueryString('exp')=>得到123
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        var result = url.match(reg);
        return result ? decodeURIComponent(result[2]) : false;
    },

   funcUrlDel(name) {//删除url指定参数名并返回新的url
        var loca = window.location;
        var baseUrl = loca.origin + loca.pathname + "?";
        var query = loca.search.substr(1);
        if (query.indexOf(name) > -1) {
            var obj = {};
            var arr = query.split("&");
            for (var i = 0; i < arr.length; i++) {
                arr[i] = arr[i].split("=");
                obj[arr[i][0]] = arr[i][1];
            };
            delete obj[name];
            var url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g, "").replace(/\:/g, "=").replace(/\,/g, "&");
            return url
        };
    },

    getlinkSearch(key, reqStr) {//这个作用同fnGetQueryString(key)函数差不多，不过它将reqStr参数替代了window.searsh获取的东西,因为上个函数在删除了url的某一参数后会返回一个新的带?参数查询的链接
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
        var result = reqStr.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]) : false;
    },

    // refreshUrl() {//强制刷新到不带二次分享参数页面
    // 	var $this = this;
    //     var url = "",
    //         reqStr = "";
    //     if ($this.fnGetQueryString(window.location.search.substr(1), 'from')) {//from为微信二次分享自带参数
    //         url = $this.funcUrlDel('from');
    //         var reqIndex = url.indexOf('?');
    //         reqStr = url.substr(reqIndex);//截取去除from参数后的地址
    //         console.log(url, reqStr);
    //         alert(url+"-----------"+reqStr)
    //         if ($this.getlinkSearch('isappinstalled', reqStr)) {//isappinstalled为微信二次分享自带参数
    //             url = url.substr(0, url.indexOf('&'));//截取去除isappinstalled参数后的地址
    //             console.log(url);
    //             alert(url)
    //             window.location.href = url;
    //         } else {
    //         	alert("----------"+url)
    //             window.location.href = url;
    //         }
    //     }
    // }
}

export default utils