/**
 *  @author  yanglw@csdn.net
 *  @version 1.0.0
 *  @description CSDN统一上报JS-SDK
 */

(function($){
    var CFG,exports,_fn,param,tos,blurTime,focusTime,invalidTime,pageStartTime,allParam;
    CFG={
        SERVER_URL : 'http://192.168.6.115:15140',
        PV_TRACK_TYPE : 0
    }
    allParam={
        headers : {
            component : "",
            datatype : ""
        },
        body : {

        }
    }


    param={
        uid : '-',
        curl : '-',
        ref : '-',
        aid : '-',
        oid : '-',
        domain : '-',
        pid : '-',
        mod : '-',
        mtp : '-',
        ck : '-',
        con : '-',
        r : '0',
        tos : '0',
        cid : '-'
    }

    _fn={
        createImage : function( url, params, callback ) {
            console.log("发送请求!",params);
            // $.ajax({
            //     url:url + (url.indexOf('?') < 0 ? '?' : '') + params,
            //     async:false
            // })
            var image = new Image(1, 1);
            image.onload = function () {
                iterator = 0; // To avoid JSLint warning of empty block
                if (typeof callback === 'function') { callback(); }
            };
            image.src = url + (url.indexOf('?') < 0 ? '?' : '') + params;
        },
        tos : function(){
            var e, now, ref, t, tos;
            now = +new Date() / 1000 | 0;
            t = (ref = /\bdc_tos=([^;]*)(?:$|;)/.exec(document.cookie)) != null ? ref[1] : void 0;
            try {
                tos = now - parseInt(t, 36);
            } catch (_error) {
                e = _error;
                tos = -1;
            }
            document.cookie = "dc_tos=" + (now.toString(36)) + " ; expires=" + (new Date((now + 4 * 60 * 60) * 1000).toGMTString()) + " ; max-age=" + (4 * 60 * 60)+ " ; path=/ ; domain=." + (_fn.topDomain(window.location.host));
            return param.tos = tos;
        },
        now : function(){
            // console.log("当前系统时间:",Math.round(new Date().getTime()));
            return Math.round(new Date().getTime());
        },
        /**
         * 修正fixedTos
         */
        fixedTos : function(){
            var tos=_fn.now()-pageStartTime-invalidTime;
            // console.log("累计页面停留时间:",tos);
            return Math.round(tos/1000);
        },
        /**
         * 无效时间计算
         * @returns {number|*}
         */
        invalidTimeCalc : function(){
            var tmp=0;
            if(focusTime!=undefined&&blurTime!=undefined){
                tmp=focusTime-blurTime;
                console.log("本次离开时间:",tmp,"=",focusTime,"-",blurTime);
                blurTime=undefined;
            }
            invalidTime+=tmp;
            console.log("累计离开时间:",invalidTime,"=",invalidTime);
            return invalidTime;
        },
        sessionID : function(){
            var ref, sid;
            sid = (ref = /\bdc_session_id=([^;]*)(?:$|;)/.exec(document.cookie)) != null ? ref[1] : 0;

            if (sid === 0 || !/^\d+$/.test(sid)) {
                sid = new Date().getTime();
            }
            // document.cookie = "dc_session_id=" + sid + " ; path=/ ; domain=." + (_fn.topDomain(window.location.host));
            document.cookie = "dc_session_id=" + sid ;
            console.log("设置SESSIONid=",sid)
            return param.session_id = "" + sid;
        },
        cid : function(){
            return param.cid = ((ref2 = /(; )?(JSESSIONID)=([^;]+)/.exec(document.cookie)) != null ? ref2[3] : void 0) || '-';
        },
        /**
         * 获取顶级域名
         * @param loc
         * @returns {string}
         */
        topDomain : function(loc){
            console.log(".............,topDomain:",loc);
            var ref;
            return (ref=/\.?([a-z0-9\-]+\.[a-z0-9\-]+)(:\d+)?$/.exec(loc))!=null?ref[1]:"";
        },
        initBaseParam : function(){
            this.sessionID();
            this.cid();
            console.warn("initBaseParam:",param);
        }
    }

    invalidTime=0;
    tos=0;
    pageStartTime=_fn.now();
    focusTime=pageStartTime;
    _fn.initBaseParam();

    exports={
        trackInit : function(p){
            // console.log("trackInit:p=",p);
            param = $.extend( param, p );
            // console.log("trackInit:",param);
        },
        closeWindow : function(){
            focusTime=_fn.now();
            _fn.invalidTimeCalc();
            csdn.reportPV(_fn.fixedTos());
        },
        /**
         * PV统计
         * @param delayReport   是否需要延迟上报(延迟上报将在关闭浏览器时候再上报)
         */
        trackPV :function(delayReport){
            if(delayReport){
                // _fn.startTimer();
                window.onblur = function () {
                    blurTime=_fn.now();
                    console.log("重置blurTime:",blurTime);
                }

                window.onfocus = function () {
                    focusTime=_fn.now();
                    _fn.invalidTimeCalc();
                }

                window.onbeforeunload = function(){
                    focusTime=_fn.now();
                    _fn.invalidTimeCalc();
                    csdn.reportPV(_fn.fixedTos());
                }

            }else{
                csdn.reportPV(_fn.tos());
            }
        },
        reportPV : function(tos){

            var tmpParam=$.extend(param,{
                tos : tos
            });
            tmpParam.r=new Date().getTime();
            tmpParam.ref=encodeURIComponent( document.referrer );
            tmpParam.curl=encodeURIComponent( window.location.href );
            var tempAllParam=$.extend(allParam,{
                headers : {
                    component : tmpParam.pid,
                    datatype : "pv"
                },
                body : JSON.stringify(tmpParam),
            });
            console.log("reportPV report:",tempAllParam);
            $.ajax({
                type: 'POST',
                url: CFG.SERVER_URL+'/'+tmpParam.domain ,
                data: JSON.stringify([tempAllParam]),
                error : function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error("trackPV report error!");
                }
            });
        },
        trackClick : function(p){
            p.ck=p.ck?encodeURIComponent( p.ck ):'-';
            p.con=p.con?encodeURIComponent( p.con ):'-';
            var arr=[]
            var tmpParam=$.extend(param,p);
            console.log("222",JSON.stringify(p));
            tmpParam.r=new Date().getTime();
            tmpParam.ref=encodeURIComponent( document.referrer );
            tmpParam.curl=encodeURIComponent( window.location.href );
            var tempAllParam=$.extend(allParam,{
                headers : {
                    component : tmpParam.pid,
                    datatype : "click"
                },
                body : JSON.stringify(tmpParam)
                // body : tmpParam
            });
            console.log("trackClick report:",tempAllParam);
            $.ajax({
                url: CFG.SERVER_URL+'/'+tmpParam.domain ,
                type: 'POST',
                // contentType : 'application/json',
                data: JSON.stringify([tempAllParam]),
                error : function (XMLHttpRequest, textStatus, errorThrown) {
                    console.error("trackClick report error!");
                }
            });
 /*           for ( key in tmpParam ) {
                arr.push( key + '=' + tmpParam[key] );
            }
            tmpParam.r=new Date().getTime();
            tmpParam.ref=encodeURIComponent( document.referrer );
            // console.log("trackClick:",CFG.CLICK_URL,arr);
            _fn.createImage(CFG.CLICK_URL,arr.join('&'));*/
        }
    };
    if(window.csdn===undefined){
        window.csdn={};
    }
    for(i in exports){
        window.csdn[i]=exports[i];
    }
})(jQuery);

