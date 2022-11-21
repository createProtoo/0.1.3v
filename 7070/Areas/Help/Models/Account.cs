using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplicationRun.Areas.Help.Models
{
    /// <summary>
    /// 登录的用户信息
    /// </summary>
    public class Account2020
    {
        /// <summary>
        /// 主键
        /// </summary>
        public int USER_ID { get; set; }
        /// <summary>
        /// 姓名
        /// </summary>
        public string USER_NAME { get; set; }
        /// <summary>
        /// 登录的用户名
        /// </summary>
        public string UID { get; set; }
        /// <summary>
        /// 密码
        /// </summary>
        public string password { get; set; }
        /// <summary>
        /// 角色权限
        /// </summary>
        public string Role { get; set; }     
        /// <summary>
        /// 单位
        /// </summary>
        public string Parter { get; set; }

    }
}