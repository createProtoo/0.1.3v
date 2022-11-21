using My.Common;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Video2018;
using Video2018.Filter.Mvc;
using WebApplicationRun.Areas.Help.Models;
using WebApplicationRun.HTMLHelper;
using WebVideoCenter.ViewModels.Add;

namespace WebApplicationRun.Areas.Help.Controllers.User
{
    public class UserController : Controller
    {
        private static readonly MongoHelper<UserInfoSearch, UserInfos, Account> mongoHelper = new MongoHelper<UserInfoSearch, UserInfos, Account>();

        // GET: Help/User/Login

        public ActionResult Login()
        {



            return View();
        }
        [HttpPost]
        public ActionResult LoginCk(Account2020 account2020)
        {
            string a = account2020.UID;
            string b=account2020.password;
            GetCRC32 getCRC32 = new GetCRC32();
            account2020.password = Convert.ToString(getCRC32.GetCRC32Str(b));
            bool isExitOK = false;
            int tmp;
            if (int.TryParse(a, out tmp))//如果转换失败（为false）时输出括号内容
            {
                //1 先取 商户账号
                
                var okShops = mongoHelper.GetNeedShops("Shops", 0, 3000).ToList();
                var tmpShops = okShops.Where(x => x.PosUid == Convert.ToInt32(a) && x.Password == b).ToList();
                if (tmpShops.Count == 1) //存在
                {
                    account2020.USER_NAME = tmpShops.First().ShopName;
                    account2020.Role = "ShopManager";
                    isExitOK = true;
                }

            }

           

            //2 取出通道
            if(!isExitOK)
            {
                var allRuns = mongoHelper.GetNeedRuns("Runs");
                var tmpRuns = allRuns.Where(x => x.RunUid == a && x.RunPassword == b).ToList();
                if (tmpRuns.Count ==1) //存在
                {
                    account2020.Role = "RunManager";
                    account2020.USER_NAME = tmpRuns.First().RunName;
                    isExitOK = true;
                }

            }

            if(!isExitOK)
            {
                //最后取出管理者信息
                var tmpModel = mongoHelper.GetLoginUser("SysUsers", a).ToList();
                if (tmpModel.Count == 0)
                {
                    if (a.Equals("adminx"))  //初始化
                    {
                        account2020.Role = "SuperAdmin";
                        account2020.USER_NAME = "超级管理员";
                        mongoHelper.AddInfo(account2020, "SysUsers");
                        return Json("200");
                    }
                    return Json("404");
                }
                else
                {
                    if (!tmpModel.First().password.Equals(account2020.password))
                    {
                        return Json("404");
                    }
                    account2020.Role = tmpModel.First().Role;
                    account2020.USER_NAME = tmpModel.First().USER_NAME;
                }

            }


            try
            {
                if (MemcacheHelper.Get(account2020.UID) != null)
                {
                    MemcacheHelper.Delete(account2020.UID);
                }
                MemcacheHelper.Set(account2020.UID, SerializerHelper.SerializeToString(account2020));//使用Memcache代替Session解决数据在不同Web服务器之间共享的问题。
                Response.Cookies["userid"].Value = account2020.UID;//将Memcache的key以cookie的形式返回到浏览器端的内存中，当用户再次请求其它的页面请求报文中会以Cookie将该值再次发送服务端。
                Response.Cookies["token"].Value = account2020.password;//将Memcache的key以cookie的形式返回到浏览器端的内存中，当用户再次请求其它的页面请求报文中会以Cookie将该值再次发送服务端。
               
               
            }
            catch 
            {
               
                Json("500");
            }




            return Json("200");
        }

    }
}