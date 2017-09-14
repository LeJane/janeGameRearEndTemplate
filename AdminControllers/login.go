//登陆控制器
package AdminControllers

import (
	"bashidu/models"
	"log"

	"crypto/md5"
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"io"

	"github.com/astaxie/beego"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

//登陆控制器
type LoginControllers struct {
	beego.Controller
}

//登录页面显示
func (this *LoginControllers) LoginPage() {
	uid := this.GetSession("uid")
	if uid != nil {
		this.Error("您已登录，正在跳转到主页......", "/index/index", 1)
		return
	}
	//登陆页面显示
	this.TplName = "login/index.html"
}

//登录控制数据
type loginData struct {
	Phone string `form:phone`
	Pwd   string `form:pwd`
}

/*
* 成功跳转
 */
func (this *LoginControllers) Success(msg string, url string, wait int) {
	data := make(map[string]interface{})
	data["type"] = true
	data["title"] = "提示信息"
	data["msg"] = msg
	data["wait"] = wait
	if url == "-1" {
		url = this.Ctx.Request.Referer()
	} else if url == "-2" {
		url = this.Ctx.Request.Referer()
	}
	data["url"] = url
	this.Data["mess"] = data
	this.TplName = "message.html"

}

/*
* 失败跳转
 */
func (this *LoginControllers) Error(msg string, url string, wait int) {
	data := make(map[string]interface{})
	data["type"] = false
	data["title"] = "错误提示"
	data["msg"] = msg
	data["wait"] = wait
	if url == "-1" {
		url = this.Ctx.Request.Referer()
	} else if url == "-2" {
		url = this.Ctx.Request.Referer()
	}

	data["url"] = url
	this.Data["mess"] = data
	this.TplName = "message.html"

}

//登陆控制
func (this *LoginControllers) LoginCon() {

	//初始化，new返回零值指针
	login := models.UserRegister{}

	if err := this.ParseForm(&login); err != nil {
		log.Println("登陆表单解析错误：", err)
		this.Error("表单解析错误", "/login", 1)
		return
	}

	//手机号判断
	if login.Phone == "" {
		this.Error("手机号为空", "/login", 1)
		return
	}
	//密码判断
	if login.Pwd == "" {
		this.Error("密码为空", "/login", 1)
		return
	}
	session, err := mgo.Dial(beego.AppConfig.String("url"))
	if err != nil {
		this.Error("数据库连接错误", "/register", 1)
		return
	}
	//加密MD5字符串
	pwdConfirm := this.GetMd5String(this.GetString("pwd"))

	c := session.DB(beego.AppConfig.String("database")).C("user")
	queryMap := bson.M{"phone": login.Phone}
	err = c.Find(queryMap).One(&login)

	if err != nil {
		log.Println("数据库查询错误:", err)
		this.Error("没有您的信息，请注册您的信息", "/login", 1)
		return
	}

	if login.Uid != "" {

		if login.Pwd != pwdConfirm {
			this.Error("密码不正确,请重新输入", "/login", 1)
			return
		}
	} else {
		this.Error("获取信息失败,请重新登录", "/login", 1)
		return
	}

	this.SetSession("uid", login.Uid)

	this.Success("登录成功", "/index/index", 1)
}

//生成32位md5字串
func (this *LoginControllers) GetMd5String(s string) string {
	h := md5.New()
	h.Write([]byte(s))
	return hex.EncodeToString(h.Sum(nil))
}

//生成Guid字串
func (this *LoginControllers) UniqueId() string {
	b := make([]byte, 48)

	if _, err := io.ReadFull(rand.Reader, b); err != nil {
		return ""
	}
	return this.GetMd5String(base64.URLEncoding.EncodeToString(b))
}

//注销
func (this *LoginControllers) LoginOut() {
	this.DelSession("uid")
	this.Redirect("/login", 302)
}
