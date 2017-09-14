//基础控制器,用于执行子类的继承，以及用户的一些初始化方法
package baseControllers

import (
	_ "bashidu/models"
	"fmt"
	"strconv"
	"strings"

	"crypto/md5"
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"io"

	"log"
	"os"
	"time"

	"github.com/astaxie/beego"
	"github.com/beego/i18n"
)

//调用子类实现
type NestPrepare interface {
	NestPrepare()
}

//父级路由
type BaseController struct {
	beego.Controller
	i18n.Locale
	isLogin bool
}

//用户初始化方法
func (this *BaseController) Prepare() {
	v := this.GetSession("uid")
	if v == nil {
		this.Redirect("/login", 302)
	} else {
		this.Data["LoginMsg"] = "登录成功"
		this.TplName = "admin/index/index.html"
		return
	}
}

/*
* 成功跳转
 */
func (this *BaseController) Success(msg string, url string, wait int) {
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
func (this *BaseController) Error(msg string, url string, wait int) {
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

/*
* Ajax返回
*
 */
func (this *BaseController) AjaxReturn(status int, msg string, data interface{}) {
	json := make(map[string]interface{})
	json["State"] = status
	json["Msg"] = msg
	json["Result"] = data
	this.Data["json"] = json
	this.ServeJSON()
	return
}

//生成32位md5字串
func (this *BaseController) GetMd5String(s string) string {
	h := md5.New()
	h.Write([]byte(s))
	return hex.EncodeToString(h.Sum(nil))
}

//生成Guid字串
func (this *BaseController) UniqueId() string {
	b := make([]byte, 48)

	if _, err := io.ReadFull(rand.Reader, b); err != nil {
		return ""
	}
	return this.GetMd5String(base64.URLEncoding.EncodeToString(b))
}

//上传方法
func (this *BaseController) UploadMethod() {
	var UPloadFileName string

	//绑定文件名称
	this.Ctx.Input.Bind(&UPloadFileName, "UploadName")
	fmt.Println(UPloadFileName)
	//处理文件上传
	h, err := this.GetFiles(UPloadFileName)
	if err != nil {
		log.Println("getFile err", err)
		this.AjaxReturn(406, "获取文件失败", nil)
	}
	now := time.Now()
	dir := beego.AppConfig.String("uploadpath") + "/" + now.Format("2006-01-02")
	err = os.MkdirAll(dir, 0755)
	if err != nil {
		log.Println(err)
		this.AjaxReturn(405, "创建目录失败", nil)
	}

	//声明返回文件键值对
	type ReturnFile map[string]string

	var result []ReturnFile

	for k, _ := range h {
		f, err := h[k].Open()
		if err != nil {
			continue
		}
		defer f.Close()

		var ReturnImg ReturnFile = make(map[string]string) //每一个上传对象就创建一个map

		fileName := h[k].Filename
		ext := strings.Split(fileName, ".")                                      //分割文件名
		fileName = ext[0] + this.UniqueId() + this.RandFuncName() + "." + ext[1] //文件名组合

		dst, err := os.Create(dir + "/" + fileName)
		ReturnUrl := dir + "/" + fileName

		if err != nil {
			log.Println("创建文件失败：", err)
			this.AjaxReturn(407, "上传数据失败", nil)
		}

		if _, err := io.Copy(dst, f); err != nil {
			log.Println("拷贝数据失败:", err)
			this.AjaxReturn(408, "上传数据失败", nil)
		}

		ReturnImg[UPloadFileName] = ReturnUrl

		result = append(result, ReturnImg)

	}

	this.AjaxReturn(200, "上传成功", result)
}

func (this *BaseController) RandFuncName() string {
	return strconv.FormatInt(time.Now().Unix(), 10)
}
