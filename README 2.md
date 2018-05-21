# CSDN  数据统一上报JS-SDK
## 版本
发布时间 2017年7月7日11:23:06
作者  [yanglw@csdn.net](mailto:yanglw@csdn.net)
版本号  V1.0
## 一.安装
1. jquery.js(version>=1.x.x)
2. track.js

## 二.调用
### 1. 初始化全局参数


```
$(function(){
    
    var param={
                pid : '12301_knowledge_base',
                aid : 'knowledge_base_detail',
                domain : '12301'
            }
    
    //初始化设置上报全局变量
    csdn.trackInit(param)
    
    //开启PV上报
    csdn.trackPV(true);
    
    var CLICK_EVENT="ontouchend" in document ? "tap" : "click";
    //主动点击上报
    $("#login-btn").on(CLICK_EVENT,function(){
                //登录成功,userName存入COOKIE
                $.cookie("name",$("#userName").val());

                //成功后,从COOKIE取出cookie,并修改track全局变量
                csdn.trackInit({uid:$.cookie("name")});
    }) ;
})
```


### 2. PV统计
csdn.trackPV(delayReport)

delayReport 该字段主要控制页面停留时间使用
tos 页面停留时间(上一个页面的停留时间/当前页面的停留时间)

delayReport=undefined/false 默认按照传统方式,页面打开时立即上报
delayReport=true 页面关闭时,PV上报
### 3. 点击/曝光统计
csdn.trackClick(param)

# 接收参数说明

## PV统计

*属性类型|字段|名称|格式|说明
---|---|---|---|---
业务|domain|所属域名|string|如:csdn,12301,vcg
业务|pid|产品ID|string|[值域见约定](https://121.40.44.17/redmine/projects/data-support/wiki/Def_product)
业务|aid|页面类型|string|不限|
业务|oid|所属内容贡献者标识|string|CSDN博文作者
业务|tag|tag标记|string|CSDN博文标签内容
业务|x-acl-token|权限token|string|CSDN权限token
业务|uid|登录名称|string|
基础|session_id|会话ID|string|
基础|*tos|页面停留时间(time on site)|string|单位:秒
基础|r|随机数|numeric|防止缓存
后端|url|当前url地址|string|字段需要做编码，客户端上报的内容包含在url的参数中
后端|ref|当前所在页面|string|
后端|user_agent|客户端信息|string|
后端|dt |上报时间|datetime|
后端|IP |用户ip|string|
后端|cid|cookiesID|string|


## 点击/曝光 统计

属性类型|字段|名称|格式|说明
---|---|---|---|---
业务|domain|所属域名|string|如:csdn,12301,vcg
业务|pid|产品ID|string|[值域见约定](https://121.40.44.17/redmine/projects/data-support/wiki/Def_product)
业务|mod|模块信息|string|[值域见约定](https://121.40.44.17/redmine/projects/data-support/wiki/Def_mod)
业务|mtp|模块类型|int|1：公告；2：文字链；3：图片；4：tag
业务|ck|点击URL|string|不限|缺省值为"-""
业务|con|曝光内容|string|一组数组，格式为：名称1,链接1,策略1;名称2,链接2,策略2;...;名称8,链接8,策略8   增加策略值 不需要策略值时 策略值为 横杠('-')
业务|aid|页面类型|string|不限|
业务|oid|所属内容贡献者标识|string|CSDN博文作者
业务|tag|tag标记|string|CSDN博文标签内容
业务|uid|登录名称|string|
基础|session_id|会话ID|string|
基础|*tos|页面停留时间(time on site)|string|单位:秒
基础|r|随机数|numeric|防止缓存
后端|url|当前url地址|string|字段需要做编码，客户端上报的内容包含在url的参数中
后端|ref|当前所在页面|string|
后端|user_agent|客户端信息|string|
后端|dt |上报时间|datetime|
后端|IP |用户ip|string|
后端|cid|cookiesID|string|

##说明
***注意:**
1. 属性类型
- 业务:  业务调用方通过方法调用传参
- 基础:  前端SDK自动获取补全
- 获取补全,如IP,User-Agent(客户端代理信息),Referer(页面当前URL)
2. tos
- 页面停留时间默认为上一页面的停留时间,前端设置延迟上报时,为当前页面的停留时间
3. 无法获得值时请提供默认值“-”
