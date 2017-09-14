//注册控制器
package AdminControllers

import (
	"fmt"
	"log"
	"time"

	"crypto/md5"
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"io"

	"github.com/astaxie/beego"

	mgo "gopkg.in/mgo.v2"
)

type RegisterController struct {
	beego.Controller
}

//数据结构
type UserRegister struct {
	Phone        string `bson:"phone" form:"phone"`
	Pwd          string `bson:"pwd" form:"pwd"`
	Name         string `bson:"name" form:"name"`
	Sex          string `bson:"sex" form:"sex"`
	Uid          string `bson:"uid"`
	IsAllowLogin bool   `bson:"isAllowLogin"`
	LoginTime    int64  `bson:"loginTime"`
	RegisterTime int64  `bson:"registerTime"`
}

func (this *RegisterController) RegistPage() {

	this.TplName = "admin/regist/index.html"
}

//注册登录控制
func (this *RegisterController) RegisterCon() {
	user := UserRegister{}

	//解析到结构体
	if err := this.ParseForm(&user); err != nil {
		this.Error("解析表单数据失败", "/register", 1)
		return
	}

	//判断手机号是否为空
	if user.Phone == "" {
		this.Error("手机号为空", "/register", 1)
		return
	}
	//判断是密码否为空
	if user.Pwd == "" {
		this.Error("密码为空", "/register", 1)
		return
	}
	pwdConfirm := this.GetString("pwdConfirm")
	//判断确认密码是否为空
	if pwdConfirm == "" {
		this.Error("确认密码为空", "/register", 1)
		return
	}
	//判断姓名是否为空
	if user.Name == "" {
		this.Error("姓名为空", "/register", 1)
		return
	}
	//判断姓别是否为空
	if user.Sex == "" {
		this.Error("性别为空", "/register", 1)
		return
	}

	//确认密码
	if user.Pwd != pwdConfirm {
		this.Error("密码与确认密码不匹配", "/register", 1)
		return
	}

	user.Pwd = this.GetMd5String(user.Pwd)
	user.IsAllowLogin = true
	user.RegisterTime = time.Now().Unix() //注册时间
	user.Uid = this.UniqueId()
	fmt.Printf("%#v\n", user)
	//mongdb链接
	url := beego.AppConfig.String("url")
	session, err := mgo.Dial(url)
	if err != nil {
		this.Error("数据库连接错误", "/register", 1)
		return
	}
	//集合
	c := session.DB(beego.AppConfig.String("database")).C("user")
	err = c.Insert(user)

	if err != nil {
		log.Println("注册失败:", err)
		this.Error("注册失败", "/register", 1)
		return
	} else {
		this.Success("注册成功,请登录", "/login", 1)
		return
	}

}

/*
* 成功跳转
 */
func (this *RegisterController) Success(msg string, url string, wait int) {
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
func (this *RegisterController) Error(msg string, url string, wait int) {
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

//生成32位md5字串
func (this *RegisterController) GetMd5String(s string) string {
	h := md5.New()
	h.Write([]byte(s))
	return hex.EncodeToString(h.Sum(nil))
}

//生成Guid字串
func (this *RegisterController) UniqueId() string {
	b := make([]byte, 48)

	if _, err := io.ReadFull(rand.Reader, b); err != nil {
		return ""
	}
	return this.GetMd5String(base64.URLEncoding.EncodeToString(b))
}
