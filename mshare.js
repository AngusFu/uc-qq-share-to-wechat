
/**
 * 此插件主要作用是在UC和QQ两个主流浏览器
 * 上面触发微信分享到朋友圈或发送给朋友的功能
 * 代码编写过程中 参考:
 * http://mjs.sinaimg.cn/wap/module/share/201501261608/js/addShare.js
 * 此外，JefferyWang的项目对我也有一定启示：
 * https://github.com/JefferyWang/nativeShare.js
 *
 * @revisor  angusfu1126@qq.com
 * @date     2015-07-22
 */

!(function(global) {
    'use strict';

    var UA, uc, qq, wx, tc, qqVs, ucVs, os,qqBridgeDone;

    UA = navigator.appVersion;

    // 是否是 UC 浏览器
    uc = UA.split('UCBrowser/').length > 1  ? 1 : 0;

    // 判断 qq 浏览器
    // 然而qq浏览器分高低版本   2代表高版本  1代表低版本
    qq = UA.split('MQQBrowser/').length > 1 ? 2 : 0;

    // 是否是微信
    wx = UA.match(/MicroMessenger/i) == 'micromessenger';

    // 浏览器版本
    qqVs = qq ? parseFloat(UA.split('MQQBrowser/')[1]) : 0;
    ucVs = uc ?  parseFloat(UA.split('UCBrowser/')[1]) : 0;
    
    //获取操作系统信息  iPhone(1)  Android(2)
    os = (function () {
        var ua = navigator.userAgent;

        if (/iphone|ipod/i.test(ua)) {
            return 1;
        } else if(/android/i.test(ua)){
            return 2;
        } else {
            return 0;
        }
    }());

    // qq浏览器下面 是否加载好了相应的api文件
    qqBridgeDone = false;

    // 进一步细化版本和平台判断
    // 参考: https://github.com/JefferyWang/nativeShare.js
    // http://mjs.sinaimg.cn/wap/module/share/201501261608/js/addShare.js
    if ((qq && qqVs < 5.4 && os == 1) || (qq && qqVs < 5.3 && os == 1)) {
        qq = 0;
    } else {
        if (qq && qqVs < 5.4 && os == 2) {
            qq = 1;
        } else {
            if (uc && ( (ucVs < 10.2 && os == 1) || (ucVs < 9.7 && os == 2) )) {
                uc = 0;
            }
        }
    }

    /**
     * qq浏览器下面 根据不同版本 加载对应的bridge
     * @method loadqqApi
     * @param  {Function} cb 回调函数
     */
    function loadqqApi(cb) {
        if (!qq) { // qq == 0 
            return cb && cb();
        }

        var qqApiScript = document.createElement('script');
        //需要等加载过qq的接口文档之后，再去初始化分享组件
        qqApiScript.onload = function () {cb && cb();};
        qqApiScript.onerror = function () {};
        // qq == 1 低版本
        // qq == 2 高版本
        qqApiScript.src = (qq == 1 ) ? 'http://3gimg.qq.com/html5/js/qb.js' : 'http://jsapi.qq.com/get?api=app.share';

        document.body.appendChild(qqApiScript);
    }


    /**
     * UC浏览器分享
     * @method ucShare
     */
    function ucShare(config) {
        // ['title', 'content', 'url', 'platform', 'disablePlatform', 'source', 'htmlID']
        // 关于platform
        // ios: kWeixin || kWeixinFriend;
        // android: WechatFriends || WechatTimeline
        // uc 分享会直接使用截图
        
        var platform = '', shareInfo;

        // 指定了分享类型
        if (config.type) {
            if (os == 2) {
                platform = config.type == 1 ? 'WechatTimeline' : 'WechatFriends';
            } else if (os == 1) {
                platform = config.type == 1 ? 'kWeixinFriend' : 'kWeixin';
            }
        }

        shareInfo = [ config.title, config.desc, config.url, platform, '', '', '' ];

        // android 
        if (window.ucweb) {
            ucweb.startRequest && ucweb.startRequest('shell.page_share', shareInfo);
        }
        // ios
        else if (window.ucbrowser) {
            ucbrowser.web_share && ucbrowser.web_share.apply(null, shareInfo);
        }

    };
    

    /**
     * qq浏览器分享函数
     * @method qqShare
     */
    function qqShare(config) {
        var type = config.type;

        //微信好友1, 微信朋友圈8
        type = type ? ((type == 1) ? 8 : 1) : ''; 

        var share = function () {
            var shareInfo = {
                'url': config.url,
                'title': config.title,
                'description': config.desc,
                'img_url': config.img,
                'img_title': config.title,
                'to_app': type,
                'cus_txt': ''
            };

            if (window.browser) {
                browser.app && browser.app.share(shareInfo);
            } else if (window.qb) {
                qb.share && qb.share(shareInfo);
            }
        };

        if (qqBridgeDone) {
            share();
        } else {
            loadqqApi(share);
        }
    };

    /**
     * 对外暴露的接口函数
     * @method mShare
     * @param  {Object} config 配置对象  参数见示例
     *     var config = {
     *          title : 'Lorem ipsum dolor sit.'
     *        , url   : 'http://m.ly.com'
     *        , desc  : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quaerat inventore minima voluptates.'
     *        , img   : 'http://img1.40017.cn/cn/s/c/2015/loading.gif'
     *        , type  : type // 1 ==> 朋友圈  2 ==> 朋友  0 ==> 直接弹出原生
     *     }
     */
    function mShare(config) {
        this.config = config;
        this.init = function (type) {
            if (typeof type != 'undefined') this.config.type = type;

            try {
                if (uc) {
                    ucShare(this.config);
                } else if (qq && !wx) {
                    qqShare(this.config);
                }
            } catch (e) {}
        }
    };
    
    // 预加载 qq bridge
    loadqqApi(function () {
        qqBridgeDone = true;
    });

    // 方法暴露给全局变量
    global.mShare = mShare;

})(this);


