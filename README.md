# mobileShare #
## 触发手机UC、QQ浏览器的原生的微信分享功能 ##

* 此插件主要作用是在UC和QQ两个主流浏览器上面触发微信分享到朋友圈或发送给朋友的功能
* 代码主要参考：http://mjs.sinaimg.cn/wap/module/share/201501261608/js/addShare.js
* 此外，JefferyWang的项目对我也有一定启示：https://github.com/JefferyWang/nativeShare.js

* @author  angusfu1126@qq.com
* @date     2015-07-22

```javascript
/**
 * 对外暴露的接口函数
 * @method mShare
 * @param  {Object} config 配置对象  参数见示例
 *     var config = {
 *          title : 'Lorem ipsum dolor sit.'
 *        , url   : 'http://m.ly.com'
 *        , desc  : 'Lorem ipsum dolor sit.'
 *        , img   : 'http://img1.40017.cn/cn/s/c/2015/loading.gif'
 *        , type  : type // 1 ==> 朋友圈  2 ==> 朋友  0 ==> 直接弹出原生
 *     }
 */
 ```