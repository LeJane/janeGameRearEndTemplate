package AdminControllers

import (
	"html/template"
	//	"io"
	//	"log"
	//	"os"
	//	_ "strconv"
	//	"time"

	bc "bashidu/AdminControllers/baseControllers"

	//	"github.com/astaxie/beego"
)

//用户管理控制器
type UserControllers struct {
	bc.BaseController //继承beego.Controller控制器
}

type user struct {
	UserName interface{} `form:"user"`
	UserPwd  string      `form:"pwd"`
}

//get方法重写,以实现自定义逻辑----->固定路由方式
func (this *UserControllers) Get() {
	//	this.Ctx.WriteString("这是后端用户管理控制器")
	this.Data["xsrf"] = template.HTML(this.XSRFFormHTML())

	this.EnableXSRF = true
	this.XSRFExpire = 3600
	//	this.Data["json"] = this.GetMd5String("123456")
	//	this.ServeJSON()
	this.TplName = "admin/user/index.html"
}

func (this *UserControllers) Post() {
	u := user{}
	if err := this.ParseForm(&u); err != nil {
		//直接输出错误
		this.Ctx.WriteString("未获取到数据")
		return
	}
	uuname := ""
	if uname, ok := u.UserName.(string); ok {
		uuname = uname
	}

	//	this.UploadMethod("avater")

	this.Data["json"] = map[string]interface{}{"code": 1, "msg": "上传成功"}
	this.ServeJSON()
	return
	this.Ctx.WriteString(uuname + ":这是struct直接解析:" + u.UserPwd)
	this.Ctx.WriteString(this.GetString("user") + "：密码：" + this.GetString("pwd"))
}
