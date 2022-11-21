//后台数据模型

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplicationRun.Areas.Help.Models
{
    public class OrdersModel
    {

        //前端UI界面请求模型

        public class UiJsonForQr
        {
            public int code { get; set; }
            public string msg { get; set; }
            public string timestamp { get; set; }
            public string version { get; set; }
            public Data okdata { get; set; }
        }

        public class Data
        {
            public string channelType { get; set; }
            public string channel { get; set; }
            public string money { get; set; }
            public string realMoney { get; set; }
            public string tradeNo { get; set; }
            public string outTradeNo { get; set; }
            public int status { get; set; }
            public string statusDesc { get; set; }
            public string payUrl { get; set; }
            public string qrcodeUrl { get; set; }
            public string qrcodeContent { get; set; }
            public bool paySucc { get; set; }
            public bool notifySucc { get; set; }
            public string validTime { get; set; }
            public string validTimeMills { get; set; }
            public object receiverRealName { get; set; }
            public object receiverNickname { get; set; }
            public object receiverUserAvatar { get; set; }
            public string receiptMoney { get; set; }
            public object receiverAliUid { get; set; }
            public object recevierAliLoginId { get; set; }
            public object recevierAliZZZKL { get; set; }
            public string nid { get; set; }
            public object wechatPhone { get; set; }
            public string returnUrl { get; set; }
            public string qrcodeTxt { get; set; }
            public string outJumpLink { get; set; }
        }
        //前端UI界面请求模型end...



        //app发送给web的模型

        public class AppUnionpayModel
        {
            public Params _params { get; set; }
            public string _type { get; set; }
        }

        public class Params
        {
            public string messageuuid { get; set; }
            public string dt { get; set; }
            public string no { get; set; }
            public string money { get; set; }
            public string key_id { get; set; }
            public string mark { get; set; }
            public string phoneId { get; set; }
            public string payurl { get; set; }

            public string merchant_id { get; set; }
        }



        //回调给盘口的实体模型
        public class NotifiyPanModel
        {

            public string OrderID { get; set; }//我们的单号

            public string OrderMoney { get; set; }

            public string OrderNo { get; set; }//外部单号
            public string PosUid { get; set; } //*平台的请求商户号【必须值】

            public string Sign { get; set; }



        }



        //日记相关,通道通知日记
        public class RunNotifyModel
        {
            public string OrderID { get; set; }
            public string ComeLog { get; set; }
            public string ComeTime { get; set; }

        }
        //日记相关,通知盘口日记
        public class PanNotifyModel
        {
            public string OrderID { get; set; }
            public string ComeLog { get; set; }
            public string ComeTime { get; set; }

        }


        //动态签名,和动态参数

        public class SignModel
        {
            public string OrderNo { get; set; }
            public string OrderMoney { get; set; }
            public string PosUid { get; set; }
            public string Key { get; set; }
        }

        public class PostPramModel
        {
            public string OrderType { get; set; }
            public string OrderNotify { get; set; }
            public string OrderRemark { get; set; }
            public string OrderName { get; set; }
            public string Sign { get; set; }
            public string MD5 { get; set; }
        }


        //前段统计金额
        public class ShopGiveInfoModel
        {
            public decimal d1 { get; set; }
            public decimal d2 { get; set; }
            public decimal d3 { get; set; }
            public decimal d4 { get; set; }
        }
        public class AddAgentModel
        {
            public string WhichCmd { get; set; }
            public object Data { get; set; }
        }


        public class ShopGiveMoneyModel
        {
            public string OrderID { get; set; }
            public string PosUid { get; set; }
            public string USER_NAME { get; set; }
            public string TotalMoney { get; set; } //提现的时候,总金额
            public string LeaveMoney { get; set; } //提现后剩余金额
            public string ShopMoney { get; set; }
            public string ShopPassWord { get; set; }

            public string Role { get; set; }

            public DateTime OKTime { get; set; }

            public string WhoDeal { get; set; }

            public string DealNote { get; set; }

            public string DealTime { get; set; }

            public int State { get; set; }
        }

        //添加通道模型

        public class AddRunModel
        {
            public string RunName { get; set; }
            public string RunGood { get; set; }
            public string RunUid { get; set; }
            public string RunPassword { get; set; }
            public string alipayF { get; set; }
            public string alipayT { get; set; }
            public string wechatF { get; set; }
            public string wechatT { get; set; }
            public string ysfF { get; set; }
            public string ysfT { get; set; }
            public string Key { get; set; }
            public string OrderNotify { get; set; }
            public string MoreParm { get; set; }
            public string BackParm { get; set; }
            public string OKTime { get; set; }

            public int RunTpye { get; set; }//通道类型

        }

        //二维码解析和金额识别
        public class QRcodeEncodeData
        {
            // public string QrId { get; set; }
            //public string QrId { get; set; }

        }


        //码库模型

        public class AddQrcode
        {
            public object _id { get; set; }
            public string QrId { get; set; }
            public string RunUid { get; set; }
            public string maType { get; set; }
            public string qrH5 { get; set; } //是否h5拉起
            public string maUid { get; set; } //码的账号
            public string maPwd { get; set; }
            public string maName { get; set; }
            public int maXianEr { get; set; }
            public int maXiaoShi { get; set; }//每小时出码频率 
            public int maYiRi { get; set; }//每日出码频率
            public int maXiaJia { get; set; }
            public string qrCodeAndMoney { get; set; }

            public int qrState { get; set; }//马儿状态
            public int qrLostTimes { get; set; }//马儿使用多少次

            public int qrHourUseTimes { get; set; }//马儿一小时使用次数
            public int qrDayUseTimes { get; set; }//马儿一天使用次数

            public string AddTime { get; set; }




        }




        public class AddShopModel
        {
            public string ShopName { get; set; }
            public int PosUid { get; set; }

            public string Password { get; set; }
            public string Password2 { get; set; }
            public string Key { get; set; }
            public string OrderNotify { get; set; }

            public string alipayF { get; set; }
            public string wechatF { get; set; }
            public string ysfF { get; set; }

            public string sltAlipay { get; set; }
            public string sltWeChat { get; set; }
            public string sltYsf { get; set; }

            public string alipayMoreRun { get; set; }
            public string wechatMoreRun { get; set; }
            public string ysfMoreRun { get; set; }

            public string AgentPT { get; set; }//代理佣金比例
            public string Zb100 { get; set; }

            public string alipayFuDong { get; set; }
            public string wechatFuDong { get; set; }
            public string ysfFuDong { get; set; }
            public string RunKind { get; set; }
            public string BtnDeal { get; set; }
            public string OKTime { get; set; }//创建时间


        }



        public class ReturnOKOrders
        {
            public int draw { get; set; }
            public int recordsTotal { get; set; }
            public int recordsFiltered { get; set; }
            public string[] data { get; set; }
        }

        //统计页面需要的模型
        public class TongJiModel
        {
            public int tjTotalNums { get; set; }
            public int tjTotalOkNums { get; set; }
            public decimal tjTotalMoney { get; set; }
            public decimal tjTotalOkMoney { get; set; }

            public decimal tjTotalHandMoney { get; set; }
            public decimal tjGiveShopMoney { get; set; }

            public decimal tjLeaveShopMoney { get; set; }

            public decimal tjAgentMoney { get; set; }

            public int tjTotalVisitors { get; set; }

            public int tjShowQrcodesNums { get; set; }

            public int tjBadQrcodesNums { get; set; }
            public string tjOKNums { get; set; }

            public List<HourSuccessfulModel> tjSuccessfulModels { get; set; }
            public List<HourSuccessfulModel> tjAlipaySuccessfulModels { get; set; }
        }

        //给通道预充值
        public class RunBuyMoneyModel
        {
            public string OrderID { get; set; }
            public string RunUid { get; set; }
            public string RunName { get; set; }
            public string BuyMoney { get; set; } //充值金额
            public string BeforeMoney { get; set; } //充值前余额
            public string TotalMoney { get; set; } //充值后总金额           


            public DateTime OKTime { get; set; }

            public string WhoDeal { get; set; }

            public string DealNote { get; set; }

            public DateTime DealTime { get; set; }

            public int State { get; set; }
        }

        //计算分时成功率
        public class HourSuccessfulModel
        {
            public decimal TotalNum { get; set; }
            public decimal OkNum { get; set; }
            public string Pt { get; set; }
            public string OKTime { get; set; } 
            
        }



        //********************************************************
        public class RootPostOrders
        {
            public int draw { get; set; }
            public int length { get; set; }
            public int start { get; set; }
            public int orderCmd { get; set; }
            // public int @search[value] { get; set; }
        }

        public class RootOrders
        {
            public int draw { get; set; }
            public int recordsTotal { get; set; }
            public int recordsFiltered { get; set; }
            public string[][] data { get; set; }
        }

        //****************************************




    }
}