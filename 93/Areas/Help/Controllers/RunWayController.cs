using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using Video2018;
using WebApplicationRun.Areas.Help.HtmlHelper;
using WebApplicationRun.HTMLHelper;
using WebApplicationRun.HTMLHelper.Api;
using WebApplicationRun.QrCodeHelper;
using WebVideoCenter.ViewModels.Add;
using WebVideoCenter.ViewModels.Order;
using ZXing;
using ZXing.Common;
using static WebApplicationRun.Areas.Help.Models.OrdersModel;

namespace WebApplicationRun.Areas.Help.Controllers
{
    public class RunWayController : Controller
    {
        // GET: Help/RunWay
        public ActionResult Index()
        {
            return View();
        }

        // GET: Help/RunWay/channel
        public ActionResult Channel()
        {
            var userInfo = GetUserRole.GetRole();
            if (userInfo != null)
            {
                ViewBag.Name = userInfo.USER_NAME;
                ViewBag.Role = userInfo.Role;
            }
            else
            {
                ViewBag.Name = "请登录";
            }
            return View("test");//采用整体刷新,后期可更改为frame
        }
        // GET: Help/RunWay/Pay
        public ActionResult Pay()
        {
            return View();
        }
        // GET: Help/RunWay/QrcodeInfos
        public ActionResult QrcodeInfos()
        {
            return View();
        }

        public ActionResult Test()
        {
            return View();
        }

        //上传二维码解析同时识别出金额
        // Post: Help/RunWay/Add
        [HttpPost]
        public ActionResult Add()
        {
            //return Content("<br />");
            if (Request.Files.Count != 0)
            {
                HttpPostedFileBase file = Request.Files[0];
                // var file = Request.Files[0];
                string image = string.Empty;
                string qrGuid = string.Empty;
                if (!string.IsNullOrWhiteSpace(file.FileName))
                {   //服务器上的UpLoad文件夹必须有读写权限　　　
                    string suffix = file.FileName.Substring(file.FileName.LastIndexOf('.'));
                    if (file.FileName.LastIndexOf(".png") < 0 && file.FileName.LastIndexOf(".jp") < 0)
                    {

                        return Json("-1");
                    }
                    qrGuid = Guid.NewGuid().ToString();
                    image = qrGuid + ".jpeg";

                    // string fileName = Guid.NewGuid() + suffix;

                    System.IO.Stream stream = file.InputStream;
                    QRCodeHelper qRCodeHelper = new QRCodeHelper();
                    string tmpQR = string.Empty;
                    try
                    {
                        tmpQR = qRCodeHelper.ScanBarCodeZxing(stream).ToLower();//(Server.MapPath("~/Upload/" + fileName));

                        /* Image primaryImage = Image.FromStream(stream);

                         tmpQR = Decode((Bitmap)primaryImage, false, null);*/

                        //stream.Dispose();
                    }
                    catch
                    {
                        try
                        {
                            Image primaryImage = Image.FromStream(stream);

                            tmpQR = Decode((Bitmap)primaryImage, false, null);

                        }
                        catch (Exception)
                        {
                           ViewBag.img ="-1";//返回给前段
                            stream.Dispose();

                        }



                        return Json(ViewBag.img);

                    }

                    if (tmpQR.ToLower().IndexOf("wxp://") < 0 && tmpQR.ToLower().IndexOf("qr.alipay.com/") < 0)
                    {
                        
                        ViewBag.img = "-1";//返回给前段img显示

                        return Json(ViewBag.img);
                    }
                    //查询数据库是否存在
                    Order_Qr order_Qr = new Order_Qr();
                    order_Qr.qrUrl = tmpQR;
                    MongoHelper<UserInfoSearch, UserInfos, Account> mongoHelper = new MongoHelper<UserInfoSearch, UserInfos, Account>();
                    if (mongoHelper.ExitQR("qrcodes", order_Qr) != null)
                    {
                        
                        ViewBag.img = "-1";//返回给前段img显示
                        return Json(ViewBag.img);
                    }


                    //***************************************
                    //从这里开始是通过的
                    ViewBag.img = tmpQR;
                    file.SaveAs(Server.MapPath("~/Upload/" + image));//保存起来
                    stream.Dispose();

                    string result = string.Empty;
                    try
                    {

                        //调试日记,生产的时候移除
                        LogOut.DebugLog("准备识别数字", @"d:\www\log.txt");

                        //识别数字
                        Ocr2020 oCRHelper = new Ocr2020();
                        
                        result = oCRHelper.GetMoney(Server.MapPath("~/Upload/" + image));
                        //取出金额
                        // 先去掉,
                        LogOut.DebugLog("识别数字为:" + result, @"d:\www\log.txt");

                        result = result.Replace(",", "");
                        int tMark = result.IndexOf("￥");
                        if (tMark > 0)
                        {
                            result = result.Substring(tMark);
                            result = Regex.Match(result, @"\d+.\d+").Value.Trim();
                            result = "|" + result;
                        }
                        else
                        {
                            result = string.Empty;
                        }


                       
                        ViewBag.img = tmpQR + result;
                    }
                    catch (Exception e)
                    {
                        LogOut.DebugLog("识别数字异常:" + e.Message, @"d:\www\log.txt");



                    }
                }


            }
           

          

            return Json(ViewBag.img);
        }



        //*********************Zxin



        private Type Renderer { get; set; }
        private bool TryMultipleBarcodes { get; set; }
        private bool TryOnlyMultipleQRCodes { get; set; }
        private string Decode(Bitmap bitmap, bool tryMultipleBarcodes, IList<BarcodeFormat> possibleFormats)
        {
            BarcodeReader barcodeReader;
            IList<ResultPoint> resultPoints;
            IList<Result> lastResults;
            barcodeReader = new BarcodeReader
            {
                AutoRotate = true,
                TryInverted = true,
                Options = new DecodingOptions { TryHarder = true }
            };




            var timerStart = DateTime.Now.Ticks;
            IList<Result> results = null;
            var previousFormats = barcodeReader.Options.PossibleFormats;
            if (possibleFormats != null)
                barcodeReader.Options.PossibleFormats = possibleFormats;

            if (tryMultipleBarcodes)
                results = barcodeReader.DecodeMultiple(bitmap);
            else
            {
                var result = barcodeReader.Decode(bitmap);
                if (result != null)
                {
                    if (results == null)
                    {
                        results = new List<Result>();
                    }
                    results.Add(result);
                }
            }

            var timerStop = DateTime.Now.Ticks;

            barcodeReader.Options.PossibleFormats = previousFormats;

            if (results == null)
            {
                return "";
            }
            //labDuration.Text = new TimeSpan(timerStop - timerStart).ToString();

            if (results != null)
            {
                string ok = "";
                foreach (var result in results)
                {
                    if (!string.IsNullOrEmpty(result.Text))
                    {
                        ok = result.Text;
                        break;
                    }

                }

                return ok;
            }
            else
            {
                return "";
            }




        }

    }
}