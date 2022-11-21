using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Video2018.Filter.Mvc;
using WebApplicationRun.Areas.Help.HtmlHelper;
using static WebApplicationRun.Areas.Help.Models.OrdersModel;

namespace WebApplicationRun.Areas.Help.Controllers
{
    [MvcLoginAuthorize]
    public class IndexController : Controller
    {
        // GET: Help/Index/Tongji
        public ActionResult Tongji()
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
            return View();
        }

        // GET: Help/Index
        public ActionResult Index()
        {
            var userInfo=  GetUserRole.GetRole();
            if(userInfo!=null)
            {
                ViewBag.Name = userInfo.USER_NAME;
                ViewBag.Role = userInfo.Role;
            }else
            {
                ViewBag.Name = "请登录";
            }





           
            return View();
        }

        // GET: Help/Orders
        public ActionResult Orders()
        {
            return View();
        }

        [HttpGet]
        public ActionResult Test()
        {
            return View();
        }


    }
}