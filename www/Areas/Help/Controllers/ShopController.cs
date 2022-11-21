//商户管理控制器

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Video2018;
using WebApplicationRun.Areas.Help.HtmlHelper;
using WebVideoCenter.ViewModels.Add;
using static WebApplicationRun.Areas.Help.Models.OrdersModel;

namespace WebApplicationRun.Areas.Help.Controllers
{
    public class ShopController : Controller
    {
        private static readonly MongoHelper<UserInfoSearch, UserInfos, Account> mongoHelper = new MongoHelper<UserInfoSearch, UserInfos, Account>();

        // GET: Help/Shop
        public ActionResult Index()
        {
            return View();
        }

        // GET: Help/Shop/Pay
        public ActionResult Pay()
        {
            var userInfo = GetUserRole.GetRole();


            var okShop = mongoHelper.GetNeedShop("Shops", Convert.ToInt32(userInfo.UID));

            if(okShop.Password2==null)
            {
                ViewBag.SetPwd2 = 1;
            }




            return View();
        }
        // GET: Help/Shop/Agent
        public ActionResult Agent()
        {
            return View();
        }

        // GET: Help/Shop/History
        public ActionResult History()
        {
            return View();
        }



        // GET: Help/Shop/Manage
        public ActionResult Manage()
        {
            return View();
        }

        //处理添加商户,返回数据
        //GET: Help/Shop/AddShop
        [HttpPost]
        public JsonResult AddShop(AddShopModel model)
        {
            model.OKTime = DateTime.Now.ToString("G"); ;

            mongoHelper.AddInfo(model, "Shops");

            string okStr ="ok";


            return Json(okStr);
        }



    }
}