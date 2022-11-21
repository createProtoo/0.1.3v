<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="login.aspx.cs" Inherits="WebApplicationRun.Login.login" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <div>请登陆！先输入验证码，然后才能获取手机验证码</div>
            <div>

                <asp:Label ID="Label2" runat="server" Text="手机号"></asp:Label>
                <asp:TextBox ID="txtNo" runat="server"></asp:TextBox>
                <asp:Label ID="Label3" runat="server" Text="验证码："></asp:Label>
                <asp:TextBox ID="TextBox2" runat="server"></asp:TextBox>
                <asp:Image ID="Image1" runat="server" />
                <asp:Button ID="Button1" runat="server" OnClick="Button1_Click" Text="提交" />

            </div>
            <div>

            </div>
        </div>
    </form>
</body>
</html>
