using My.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApplicationRun.Areas.Help.Models;

namespace WebApplicationRun.Areas.Help.HtmlHelper
{
    public class GetUserRole
    {
        public static Account2020 GetRole()
        {
            if (HttpContext.Current.Request.Cookies["userid"] != null)
            {
                string o=   HttpContext.Current.Request.Cookies["userid"].Value;
                object obj = MemcacheHelper.Get(o);//根据key从Memcache中获取用户的信息

                Account2020 a = SerializerHelper.DeserializeToObject<Account2020>(obj.ToString());
                return a;
            }

            return null;
        }
    }
}