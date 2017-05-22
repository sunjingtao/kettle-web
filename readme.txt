1、目前支持的例子请查看kettle-webapp/src/main/webapp/js/App.js中第62行起的所有例子
2、本例使用Maven3.2.3构建，启动jetty后访问http://localhost:8080/kw
3、支持IE9及以上、FireFox等浏览器，IE6-IE8需要做特殊化处理，其他浏览器未测试

1、YOU CAN LOOKUP EXAMPLES IN kettle-webapp/src/main/webapp/js/App.js SINCE LINE 62.
2、THIS PROJECT WAS POWERED BY MAVEN3.2.3 AND JETTY, AFTER STARTUP, YOU CAN USE 
   http://localhost:8080/kw TO ACCESS.
3、BROWSERS NOW SUPPORTED ARE IE9 AND GREATER AS WELL AS FIREFOX, IE6-8 ARE PARTIALLY 
   SUPPORTED WITH SPECIAL SETTINGS, OTHER BROWERS HAVEN'T BEEN TESTED YET.

安装说明：
1、创建数据库，并执行kettle-webapp项目src/main/sql/目录下的sql文件初始化表结构（仅在MySQL上测试过）
2、修改kettle-scheduler项目resources/container-scheduler.xml中的数据库配置
3、部署war包并启动即可