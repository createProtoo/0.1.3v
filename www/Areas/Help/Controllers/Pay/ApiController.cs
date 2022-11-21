//前端请求,模拟webapi,内部通道就出页面,去拉马
//外部通道就转发
//这个是属于控制器
using Fluentx.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Video2018;
using WebApplicationRun.HTMLHelper;
using WebApplicationRun.Models;
using WebVideoCenter.ViewModels.Add;
using static WebApplicationRun.Areas.Help.Models.OrdersModel;

namespace WebApplicationRun.Areas.Help.Controllers.Pay
{
    public class ApiController : Controller
    {
       // public static string  F4BaseUrl="http://localhost:7070";
        public static string F4BaseUrl = "http://192.168.0.119:7070";
        private static readonly MongoHelper<UserInfoSearch, UserInfos, Account> mongoHelper = new MongoHelper<UserInfoSearch, UserInfos, Account>();

       


       //第一个接收接口,然后会跳转到下面的
        [Route("Pay2020")]
        public ActionResult Pay(WebApiModel userPay)
        {
            //全部接口,处理思路
            //根据参数判断返回json或者直接跳转
           
            var okShop = mongoHelper.GetNeedShop("Shops", Convert.ToInt32(userPay.PosUid));
            


            Dictionary<string, string> paramsMap = new Dictionary<string, string>();
            paramsMap.Add("PosUid", userPay.PosUid);
            paramsMap.Add("OrderNo", userPay.OrderNo);
            paramsMap.Add("OrderMoney", userPay.OrderMoney);
            string b = string.Empty; //加密后数据

            MD5Helper MD5Encrypt = new MD5Helper(paramsMap,okShop.Key, ref b);

            if(!userPay.Sign.Equals(b))
            {
                payUrl payUrl = new payUrl();
                payUrl.payurl = "签名错误!";
                return Json(payUrl);
            }

          

            if (!string.IsNullOrEmpty(userPay.JsonUrl))//请求返回json
            {  //这个对应也要去处理目标参数情况

                userPay.OrderInTime = DateTime.Now;
                userPay.UpdateTime = DateTime.Now;
                userPay.OrderID = UniqueData.Gener("-");
                //model.OrderID = OrderIDHelper.GenerateOrderNo(); ;
                mongoHelper.AddInfo(userPay, "YunOrders");

                payUrl payUrl = new payUrl();
                payUrl.payurl = F4BaseUrl+ "/Help/Api/Index/" + userPay.OrderID;

                return Json(payUrl);
              
            }

            userPay.OrderInTime = DateTime.Now;
            userPay.UpdateTime = DateTime.Now;
            userPay.OrderID = UniqueData.Gener("-");
            mongoHelper.AddInfo(userPay, "YunOrders");
            Dictionary<string, object> postData = new Dictionary<string, object>();
            postData.Add("OrderName", userPay.OrderName);
            postData.Add("OrderType", userPay.OrderType);
            postData.Add("OrderMoney", userPay.OrderMoney);
            postData.Add("Sign", b);
            postData.Add("PosUid", userPay.PosUid);
            postData.Add("OrderNo", userPay.OrderNo);
            postData.Add("OrderNotify", userPay.OrderNotify);
            postData.Add("OrderID", userPay.OrderID);
            postData.Add("OrderInTime", userPay.OrderInTime);
            postData.Add("UpdateTime", userPay.UpdateTime);
         

            return this.RedirectAndPost(F4BaseUrl+ "/Help/Api/JmpUrl", postData);

        }



        //  GET: Help/Api/Index 上面跳过来,这个是第二个
        //json返回后的网址页面
        [HttpGet]
        public ActionResult Index(string id)
        {
            //取出数据,然后到前端,然后前端发送请求post,注意通道类型

            var userPay = mongoHelper.GetYunOrderInfo("YunOrders", id);
            //1取出商户对应的通道和Key,2还原目标参数,3取出支付地址
            var okShop = mongoHelper.GetNeedShop("Shops", Convert.ToInt32(userPay.PosUid));
            if (string.IsNullOrEmpty(okShop.AgentPT))
            {
                okShop.AgentPT = "0|0|0";
            }
            List<string> wechatRun = new List<string>();
            List<string> alipayRun = new List<string>();
            List<string> unionpayRun = new List<string>();
            switch (userPay.OrderType)
            {
                case "wechat":
                    wechatRun.Add(okShop.sltWeChat);
                    var tmpRuns = okShop.wechatMoreRun.Split('|');
                    foreach (var item in tmpRuns)
                    {
                        wechatRun.Add(item);
                    }

                    break;
                case "alipay":
                    alipayRun.Add(okShop.sltAlipay);
                    tmpRuns = okShop.alipayMoreRun.Split('|');
                    foreach (var item in tmpRuns)
                    {
                        alipayRun.Add(item);
                    }
                    break;
                case "unionpay":
                    unionpayRun.Add(okShop.sltYsf);
                    tmpRuns = okShop.ysfMoreRun.Split('|');
                    foreach (var item in tmpRuns)
                    {
                        unionpayRun.Add(item);
                    }
                    break;
                default:
                    break;
            }//混跑后期再加,现在先预留
            //取出商户费率,对应通道,然后取出对应的:通道费率,账号,Key回调地址等
            decimal alipayFL = Convert.ToDecimal(okShop.alipayF);
            decimal wechatFL = Convert.ToDecimal(okShop.wechatF);
            decimal ysfFL = Convert.ToDecimal(okShop.ysfF);
            var allRuns = mongoHelper.GetNeedRuns("Runs");
            AddRunModel aRunModel = allRuns.Where(x => x.RunUid == okShop.sltAlipay).FirstOrDefault();
            AddRunModel wRunModel = allRuns.Where(x => x.RunUid == okShop.sltWeChat).FirstOrDefault();
            AddRunModel yRunModel = allRuns.Where(x => x.RunUid == okShop.sltYsf).FirstOrDefault();
            string postPram = string.Empty;
            string runID = string.Empty;//对方账号
            string runKey = string.Empty;//对方秘钥
            string runPayUrl = string.Empty;
            string aRunTpye = aRunModel.alipayT;//对方支付宝的代号
            string wRunTpye = aRunModel.wechatT;
            string yRunTpye = aRunModel.ysfT;
            int h5Pay = 0;//是否是h5支付,默认不是,只有内部才能启用
            switch ((userPay.OrderType))
            {
                case "wechat":
                    if (wRunModel.RunTpye == 1)
                    {
                      /* if(wRunTpye.Split('|')[1].Trim().ToLower().Equals("h5"))
                        {
                            h5Pay = 1;
                        }*/
                        ViewBag.WhichUrl = 1;//内部通道
                    }
                    else
                    {
                        postPram = wRunModel.MoreParm;//post参数
                        ViewBag.WhichUrl = 2;//外部通道
                        runPayUrl = wRunModel.OrderNotify;
                    }
                    //更新订单,锁定当时费率和手续费
                    userPay.ShopFL = okShop.wechatF;//微信费率
                    userPay.RunFL = wRunModel.wechatF;//通道费率
                    userPay.AgentFL = okShop.AgentPT.Split('|')[2];
                    userPay.AgentGiveMoney = Convert.ToString(Convert.ToDecimal(userPay.OrderMoney) * Convert.ToDecimal(userPay.AgentFL) / 100);//代理佣金

                    userPay.ShopGiveMoney =Convert.ToString( Convert.ToDecimal(userPay.OrderMoney) * Convert.ToDecimal(okShop.wechatF)/100);//微信手续费
                    userPay.RunGiveMoney = Convert.ToString(Convert.ToDecimal(userPay.OrderMoney) * Convert.ToDecimal(wRunModel.wechatF)/100);//通道费
                    mongoHelper.UpdateLock4fOrder("YunOrders", userPay);
                    runID = wRunModel.RunUid;
                    runKey = wRunModel.Key;

                    break;
                case "alipay":
                    if (aRunModel.RunTpye == 1)
                    {
                       /* if (aRunTpye.Split('|')[1].Trim().ToLower().Equals("h5"))
                        {
                            h5Pay = 1;
                        }*/
                        ViewBag.WhichUrl = 1;//内部通道
                    }
                    else
                    {
                        postPram = aRunModel.MoreParm;//post参数
                        ViewBag.WhichUrl = 2;//外部通道
                        runPayUrl = aRunModel.OrderNotify;
                    }
                    //更新订单,锁定当时费率和手续费
                    userPay.ShopFL = okShop.alipayF;//支付宝费率
                    userPay.RunFL = aRunModel.alipayF;//通道费率
                    userPay.AgentFL = okShop.AgentPT.Split('|')[1];
                    userPay.AgentGiveMoney = Convert.ToString(Convert.ToDecimal(userPay.OrderMoney) * Convert.ToDecimal(userPay.AgentFL) / 100);//代理佣金

                    userPay.ShopGiveMoney = Convert.ToString(Convert.ToDecimal(userPay.OrderMoney) * Convert.ToDecimal(okShop.alipayF)/100);//手续费
                    userPay.RunGiveMoney = Convert.ToString(Convert.ToDecimal(userPay.OrderMoney) * Convert.ToDecimal(aRunModel.alipayF)/100);//通道费
                    mongoHelper.UpdateLock4fOrder("YunOrders", userPay);
                    runID = aRunModel.RunUid;
                    runKey = aRunModel.Key;
                    break;
                case "unionpay":
                    if (yRunModel.RunTpye == 1)
                    {
                       /* if (yRunTpye.Split('|')[1].Trim().ToLower().Equals("h5"))
                        {
                            h5Pay = 1;
                        }*/
                        ViewBag.WhichUrl = 1;//内部通道
                    }
                    else
                    {
                        postPram = yRunModel.MoreParm;//post参数
                        ViewBag.WhichUrl = 2;//外部通道
                        runPayUrl = yRunModel.OrderNotify;
                    }
                    //更新订单,锁定当时费率和手续费
                    userPay.ShopFL = okShop.ysfF;//商家费率
                    userPay.RunFL = yRunModel.ysfF;//通道费率
                    userPay.AgentFL = okShop.AgentPT.Split('|')[0];
                    userPay.AgentGiveMoney = Convert.ToString(Convert.ToDecimal(userPay.OrderMoney) * Convert.ToDecimal(userPay.AgentFL) / 100);//代理佣金

                    userPay.ShopGiveMoney = Convert.ToString(Convert.ToDecimal(userPay.OrderMoney) * Convert.ToDecimal(okShop.ysfF)/100);//手续费
                    userPay.RunGiveMoney = Convert.ToString(Convert.ToDecimal(userPay.OrderMoney) * Convert.ToDecimal(yRunModel.ysfF)/100);//通道费
                    mongoHelper.UpdateLock4fOrder("YunOrders", userPay);
                    runID = yRunModel.RunUid;
                    runKey = yRunModel.Key;

                    break;

            }

            //如果是外部通道,则转发
            if(ViewBag.WhichUrl == 2)
            {
                //然后开始还原参数
                if (!string.IsNullOrEmpty(postPram))//外部转发,内部不需要
                {
                    string b = string.Empty; //加密后签名

                    var needPrams = postPram.Split('*');
                    var keyModel = JsonConvert.DeserializeObject<Dictionary<string, dynamic>>(needPrams[0]);

                    var model2 = JsonConvert.DeserializeObject<Dictionary<string, dynamic>>(needPrams[1]);
                    // var model3 = JsonConvert.DeserializeObject<Dictionary<string, dynamic>>(needPrams[2]);

                    // 遍历字典 并将各个条目保存到数据库
                    //StringBuilder str = new StringBuilder();
                    List<string> postList = new List<string>();
                    Dictionary<string, string> signMap = new Dictionary<string, string>();

                    //先取出签名字段的签名是部分签名还是整体签名
                    //"All":"0",是部分签名,是1就是全部签名
                    bool signAll = false;//默认是部分签名

                    string allStr = keyModel.Where(xx => xx.Key == "All").FirstOrDefault().Value;

                    //取出秘钥
                    // string KeyStr = keyModel.Where(xx => xx.Key == "Key").FirstOrDefault().Value;

                    //取出md5结果是大小写:0为默认小写,1为大写
                    string Md5Kind = model2.Where(xx => xx.Key == "MD5").FirstOrDefault().Value;
                    string TmpSign = model2.Where(xx => xx.Key == "Sign").FirstOrDefault().Value;

                    //移除掉没用的
                    //  keyModel.Remove("Key");
                    keyModel.Remove("All");
                    model2.Remove("MD5");
                    model2.Remove("Sign");//移除后面需要计算
                    if (allStr == "1")
                    {
                        signAll = true;//全部参与签名
                    }
                    // string[] ourPrams = new string[9] { "PosUid", "OrderNo", "OrderType", "OrderMoney", "OrderNotify", "OrderName", "OrderId", "OrderPrice", "Sign" };
                    Dictionary<string, dynamic> keys = new Dictionary<string, dynamic>();
                    keys.Add("PosUid", userPay.PosUid);
                    keys.Add("OrderNo", userPay.OrderID);//这里发送的是我们的单号
                    keys.Add("OrderType", userPay.OrderType);
                    keys.Add("OrderMoney", userPay.OrderMoney);
                    keys.Add("OrderNotify", userPay.OrderNotify);
                    keys.Add("OrderName", userPay.OrderName);
                    keys.Add("OrderId", userPay.OrderID);
                    keys.Add("OrderPrice", userPay.OrderPrice);
                    // keys.Add("Sign","");//这个后面要去计算的
                    keys.Add("TimeStamp", Convert.ToString(TimeStamp.GetTimeStamp(DateTime.Now) * 1000));


                    //把字段替换掉,还原成目标形式,一共9个字段
                    //我们一一来过
                    //新建一个收集最终的结果
                    Dictionary<string, dynamic> OK1 = new Dictionary<string, dynamic>();
                    Dictionary<string, dynamic> OK2 = new Dictionary<string, dynamic>();

                    foreach (var item in keyModel)
                    {
                        //这里符合的,我们处理,不符合的,我们默认接收

                        int ii = keys.Where(xx => xx.Key == item.Key).Count();
                        if (ii > 0)//找到了,处理
                        {
                            OK1.Add(item.Value, keys.Where(xx => xx.Key == item.Key).First().Value);//把符合的取出来了

                        }
                        else
                        {
                            OK1.Add(item.Key, item.Value);//把符合的取出来了

                        }



                    }

                    //一个全新的集合组建完毕...                
                    keyModel.Clear();
                    keyModel = OK1;


                    //下面我们来处理标准参数
                    foreach (var item in model2)
                    {
                        //这里符合的,我们处理,不符合的,我们默认接收

                        int ii = keys.Where(xx => xx.Key == item.Key).Count();
                        if (ii > 0)//找到了,处理
                        {
                            OK2.Add(item.Value, keys.Where(xx => xx.Key == item.Key).First().Value);//把符合的取出来了

                        }
                        else
                        {
                            OK2.Add(item.Key, item.Value);//把符合的取出来了

                        }



                    }
                    //一个全新的集合组建完毕...
                    model2.Clear();
                    model2 = OK2;

                    if (!signAll)//部分签名
                    {

                        foreach (var item in keyModel)
                        {
                            signMap.Add(item.Key, item.Value);

                            postList.Add(item.Key + "' value='" + item.Value + "'");

                        }
                        MD5Helper MD5Encrypt = new MD5Helper(signMap, runKey, ref b);

                    }
                    else//全部计算
                    {
                        foreach (var item in keyModel)
                        {
                            signMap.Add(item.Key, item.Value);

                            postList.Add(item.Key + "' value='" + item.Value + "'");

                        }
                        foreach (var item in model2)
                        {

                            signMap.Add(item.Key, item.Value);

                        }


                        MD5Helper MD5Encrypt = new MD5Helper(signMap, runKey, ref b);

                    }


                    foreach (var item in model2)
                    {

                        postList.Add(item.Key + "' value='" + item.Value + "'");

                    }
                    //把签名补上
                    if (Md5Kind == "1")//就是大写
                    {
                        b = b.ToUpper();
                    }
                    postList.Add(TmpSign + "' value='" + b + "'");

                    ViewBag.PostList = postList;
                    ViewBag.RunPayUrl = runPayUrl;
                    ViewBag.RunH5 = h5Pay;//是否是h5通道

                }

            }



            return View(userPay);
        }



        [HttpPost] //这个是参数跳转,和上面区别就是一个是根据id,一个是类
        public ActionResult JmpUrl(WebApiModel uPay)
        {
            //string cook = "";
            //if (Request.Cookies["tempToken"] != null)
            //{
            //    cook = Request.Cookies["tempToken"].Value;
            //}
            //写入cookies方式2
            // Response.Cookies["tempToken"].Value = "123456";
            // Response.Cookies["tempToken"].Expires = DateTime.Now.AddDays(7);

            //取出数据,然后到前端,然后前端发送请求post,注意通道类型

            var userPay =  uPay;
            //1取出商户对应的通道和Key,2还原目标参数,3取出支付地址
            var okShop = mongoHelper.GetNeedShop("Shops", Convert.ToInt32(userPay.PosUid));

            if(string.IsNullOrEmpty(okShop.AgentPT))
            {
                okShop.AgentPT = "0|0|0";
            }



            List<string> wechatRun = new List<string>();
            List<string> alipayRun = new List<string>();
            List<string> unionpayRun = new List<string>();
            switch (userPay.OrderType)
            {
                case "wechat":
                    wechatRun.Add(okShop.sltWeChat);
                    var tmpRuns = okShop.wechatMoreRun.Split('|');
                    foreach (var item in tmpRuns)
                    {
                        wechatRun.Add(item);
                    }

                    break;
                case "alipay":
                    alipayRun.Add(okShop.sltAlipay);
                    tmpRuns = okShop.alipayMoreRun.Split('|');
                    foreach (var item in tmpRuns)
                    {
                        alipayRun.Add(item);
                    }
                    break;
                case "unionpay":
                    unionpayRun.Add(okShop.sltYsf);
                    tmpRuns = okShop.ysfMoreRun.Split('|');
                    foreach (var item in tmpRuns)
                    {
                        unionpayRun.Add(item);
                    }
                    break;
                default:
                    break;
            }//混跑后期再加,现在先预留
            //取出商户费率,对应通道,然后取出对应的:通道费率,账号,Key回调地址等
            decimal alipayFL = Convert.ToDecimal(okShop.alipayF);
            decimal wechatFL = Convert.ToDecimal(okShop.wechatF);
            decimal ysfFL = Convert.ToDecimal(okShop.ysfF);
            var allRuns = mongoHelper.GetNeedRuns("Runs");
            AddRunModel aRunModel = allRuns.Where(x => x.RunUid == okShop.sltAlipay).FirstOrDefault();
            AddRunModel wRunModel = allRuns.Where(x => x.RunUid == okShop.sltWeChat).FirstOrDefault();
            AddRunModel yRunModel = allRuns.Where(x => x.RunUid == okShop.sltYsf).FirstOrDefault();
            string postPram = string.Empty;
            string runID = string.Empty;//对方账号
            string runKey = string.Empty;//对方秘钥
            string runPayUrl = string.Empty;
            string aRunTpye = aRunModel.alipayT;//对方支付宝的代号
            string wRunTpye = aRunModel.wechatT;
            string yRunTpye = aRunModel.ysfT;
            int h5Pay = 0;//是否是h5支付,默认不是,只有内部才能启用
            switch ((userPay.OrderType))
            {
                case "wechat":
                    if (wRunModel.RunTpye == 1)
                    {
                       /* if (wRunTpye.Split('|')[1].Trim().ToLower().Equals("h5"))
                        {
                            h5Pay = 1;
                        }*/
                        ViewBag.WhichUrl = 1;//内部通道
                    }
                    else
                    {
                        postPram = wRunModel.MoreParm;//post参数
                        ViewBag.WhichUrl = 2;//外部通道
                        runPayUrl = wRunModel.OrderNotify;
                    }
                    //更新订单,锁定当时费率和手续费
                    userPay.ShopFL = okShop.wechatF;//微信费率
                    userPay.RunFL = wRunModel.wechatF;//通道费率
                    userPay.AgentFL = okShop.AgentPT.Split('|')[2];
                    userPay.AgentGiveMoney = Convert.ToString(Convert.ToDecimal(userPay.OrderMoney) * Convert.ToDecimal(userPay.AgentFL) / 100);//代理佣金

                    userPay.ShopGiveMoney = Convert.ToString(Convert.ToDecimal(userPay.OrderMoney) * Convert.ToDecimal(okShop.wechatF) / 100);//微信手续费
                    userPay.RunGiveMoney = Convert.ToString(Convert.ToDecimal(userPay.OrderMoney) * Convert.ToDecimal(wRunModel.wechatF) / 100);//通道费
                    mongoHelper.UpdateLock4fOrder("YunOrders", userPay);
                    runID = wRunModel.RunUid;
                    runKey = wRunModel.Key;

                    break;
                case "alipay":
                    if (aRunModel.RunTpye == 1)
                    {
                       /* if (aRunTpye.Split('|')[1].Trim().ToLower().Equals("h5"))
                        {
                            h5Pay = 1;
                        }*/
                        ViewBag.WhichUrl = 1;//内部通道
                    }
                    else
                    {
                        postPram = aRunModel.MoreParm;//post参数
                        ViewBag.WhichUrl = 2;//外部通道
                        runPayUrl = aRunModel.OrderNotify;
                    }
                    //更新订单,锁定当时费率和手续费
                    userPay.ShopFL = okShop.alipayF;//支付宝费率
                    userPay.RunFL = aRunModel.alipayF;//通道费率
                    userPay.AgentFL = okShop.AgentPT.Split('|')[1];
                    userPay.AgentGiveMoney = Convert.ToString(Convert.ToDecimal(userPay.OrderMoney) * Convert.ToDecimal(userPay.AgentFL) / 100);//代理佣金

                    userPay.ShopGiveMoney = Convert.ToString(Convert.ToDecimal(userPay.OrderMoney) * Convert.ToDecimal(okShop.alipayF) / 100);//手续费
                    userPay.RunGiveMoney = Convert.ToString(Convert.ToDecimal(userPay.OrderMoney) * Convert.ToDecimal(aRunModel.alipayF) / 100);//通道费
                    mongoHelper.UpdateLock4fOrder("YunOrders", userPay);
                    runID = aRunModel.RunUid;
                    runKey = aRunModel.Key;
                    break;
                case "unionpay":
                    if (yRunModel.RunTpye == 1)
                    {
                        /*if (yRunTpye.Split('|')[1].Trim().ToLower().Equals("h5"))
                        {
                            h5Pay = 1;
                        }*/
                        ViewBag.WhichUrl = 1;//内部通道
                    }
                    else
                    {
                        postPram = yRunModel.MoreParm;//post参数
                        ViewBag.WhichUrl = 2;//外部通道
                        runPayUrl = yRunModel.OrderNotify;
                    }
                    //更新订单,锁定当时费率和手续费
                    userPay.ShopFL = okShop.ysfF;//商家费率
                    userPay.RunFL = yRunModel.ysfF;//通道费率
                    userPay.AgentFL = okShop.AgentPT.Split('|')[0];
                    userPay.AgentGiveMoney= Convert.ToString(Convert.ToDecimal(userPay.OrderMoney) * Convert.ToDecimal(userPay.AgentFL) / 100);//代理佣金
                    userPay.ShopGiveMoney = Convert.ToString(Convert.ToDecimal(userPay.OrderMoney) * Convert.ToDecimal(okShop.ysfF) / 100);//手续费
                    userPay.RunGiveMoney = Convert.ToString(Convert.ToDecimal(userPay.OrderMoney) * Convert.ToDecimal(yRunModel.ysfF) / 100);//通道费
                    mongoHelper.UpdateLock4fOrder("YunOrders", userPay);
                    runID = yRunModel.RunUid;
                    runKey = yRunModel.Key;

                    break;

            }

            //如果是外部通道,则转发
            if (ViewBag.WhichUrl == 2)
            {

                //然后开始还原参数
                if (!string.IsNullOrEmpty(postPram))//外部转发,内部不需要
                {
                    string b = string.Empty; //加密后签名

                    var needPrams = postPram.Split('*');
                    var keyModel = JsonConvert.DeserializeObject<Dictionary<string, dynamic>>(needPrams[0]);

                    var model2 = JsonConvert.DeserializeObject<Dictionary<string, dynamic>>(needPrams[1]);
                    // var model3 = JsonConvert.DeserializeObject<Dictionary<string, dynamic>>(needPrams[2]);

                    // 遍历字典 并将各个条目保存到数据库
                    //StringBuilder str = new StringBuilder();
                    List<string> postList = new List<string>();
                    Dictionary<string, string> signMap = new Dictionary<string, string>();

                    //先取出签名字段的签名是部分签名还是整体签名
                    //"All":"0",是部分签名,是1就是全部签名
                    bool signAll = false;//默认是部分签名

                    string allStr = keyModel.Where(xx => xx.Key == "All").FirstOrDefault().Value;

                    //取出秘钥
                    // string KeyStr = keyModel.Where(xx => xx.Key == "Key").FirstOrDefault().Value;

                    //取出md5结果是大小写:0为默认小写,1为大写
                    string Md5Kind = model2.Where(xx => xx.Key == "MD5").FirstOrDefault().Value;
                    string TmpSign = model2.Where(xx => xx.Key == "Sign").FirstOrDefault().Value;

                    //移除掉没用的
                    //  keyModel.Remove("Key");
                    keyModel.Remove("All");
                    model2.Remove("MD5");
                    model2.Remove("Sign");//移除后面需要计算
                    if (allStr == "1")
                    {
                        signAll = true;//全部参与签名
                    }
                    // string[] ourPrams = new string[9] { "PosUid", "OrderNo", "OrderType", "OrderMoney", "OrderNotify", "OrderName", "OrderId", "OrderPrice", "Sign" };
                    Dictionary<string, dynamic> keys = new Dictionary<string, dynamic>();
                    keys.Add("PosUid", userPay.PosUid);
                    keys.Add("OrderNo", userPay.OrderNo);
                    keys.Add("OrderType", userPay.OrderType);
                    keys.Add("OrderMoney", userPay.OrderMoney);
                    keys.Add("OrderNotify", userPay.OrderNotify);
                    keys.Add("OrderName", userPay.OrderName);
                    keys.Add("OrderId", userPay.OrderID);
                    keys.Add("OrderPrice", userPay.OrderPrice);
                    // keys.Add("Sign","");//这个后面要去计算的
                    keys.Add("TimeStamp", Convert.ToString(TimeStamp.GetTimeStamp(DateTime.Now) * 1000));


                    //把字段替换掉,还原成目标形式,一共9个字段
                    //我们一一来过
                    //新建一个收集最终的结果
                    Dictionary<string, dynamic> OK1 = new Dictionary<string, dynamic>();
                    Dictionary<string, dynamic> OK2 = new Dictionary<string, dynamic>();

                    foreach (var item in keyModel)
                    {
                        //这里符合的,我们处理,不符合的,我们默认接收

                        int ii = keys.Where(xx => xx.Key == item.Key).Count();
                        if (ii > 0)//找到了,处理
                        {
                            OK1.Add(item.Value, keys.Where(xx => xx.Key == item.Key).First().Value);//把符合的取出来了

                        }
                        else
                        {
                            OK1.Add(item.Key, item.Value);//把符合的取出来了

                        }



                    }

                    //一个全新的集合组建完毕...                
                    keyModel.Clear();
                    keyModel = OK1;


                    //下面我们来处理标准参数
                    foreach (var item in model2)
                    {
                        //这里符合的,我们处理,不符合的,我们默认接收

                        int ii = keys.Where(xx => xx.Key == item.Key).Count();
                        if (ii > 0)//找到了,处理
                        {
                            OK2.Add(item.Value, keys.Where(xx => xx.Key == item.Key).First().Value);//把符合的取出来了

                        }
                        else
                        {
                            OK2.Add(item.Key, item.Value);//把符合的取出来了

                        }



                    }
                    //一个全新的集合组建完毕...
                    model2.Clear();
                    model2 = OK2;

                    if (!signAll)//部分签名
                    {

                        foreach (var item in keyModel)
                        {
                            signMap.Add(item.Key, item.Value);

                            postList.Add(item.Key + "' value='" + item.Value + "'");

                        }
                        MD5Helper MD5Encrypt = new MD5Helper(signMap, runKey, ref b);

                    }
                    else//全部计算
                    {
                        foreach (var item in keyModel)
                        {
                            signMap.Add(item.Key, item.Value);

                            postList.Add(item.Key + "' value='" + item.Value + "'");

                        }
                        foreach (var item in model2)
                        {

                            signMap.Add(item.Key, item.Value);

                        }


                        MD5Helper MD5Encrypt = new MD5Helper(signMap, runKey, ref b);

                    }


                    foreach (var item in model2)
                    {

                        postList.Add(item.Key + "' value='" + item.Value + "'");

                    }
                    //把签名补上
                    if (Md5Kind == "1")//就是大写
                    {
                        b = b.ToUpper();
                    }
                    postList.Add(TmpSign + "' value='" + b + "'");

                    ViewBag.PostList = postList;
                    ViewBag.RunPayUrl = runPayUrl;
                    ViewBag.RunH5 = h5Pay;//是否是h5通道

                }

            }

            return View(userPay);
        }

                      
    }//end.....
}