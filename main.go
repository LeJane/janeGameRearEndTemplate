package main

import (
	_ "bashidu/routers"
	"strings"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/plugins/cors"
)

type MainController struct {
	beego.Controller
}

func main() {
	beego.BConfig.WebConfig.Session.SessionOn = true
	beego.BConfig.WebConfig.Session.SessionName = "Eightduchina"
	beego.BConfig.WebConfig.Session.SessionProviderConfig = "./runtime "
	beego.AddFuncMap("trimL", TrimL)

	beego.InsertFilter("*", beego.BeforeRouter, cors.Allow(&cors.Options{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"PUT", "PATCH", "GET", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "test-csrf-token", "x-csrf-token"},
		ExposeHeaders:    []string{"Content-Length", "content-type"},
		AllowCredentials: true,
	}))
	beego.Run()
}

func (this *MainController) Get() {
	this.Ctx.ResponseWriter.Header().Add("Access-Control-Allow-Origin", "*")
}

//去掉图片路径前面的点
func TrimL(s string) string {
	if s == "" {
		return "/static/img/camera.png"
	}
	return strings.TrimLeft(s, ".")
}
