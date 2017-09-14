//游戏管理控制器
package AdminControllers

import (
	bc "bashidu/AdminControllers/baseControllers"
	"bashidu/models"
	"fmt"
	"time"

	//	"fmt"
	"log"

	"github.com/astaxie/beego"

	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type GameController struct {
	bc.BaseController
}

func (this *GameController) GameIndex() {

	//	fmt.Printf("%#v\n", game)
	//	this.Data["list"] = game
	this.Data["GameCurrentUrl"] = "#"
	this.Data["CurrentCate"] = "游戏列表"
	this.Data["CurrentPCate"] = "游戏管理"
	this.TplName = "admin/game/index.html"
}

//游戏添加页面
func (this *GameController) GameAddPage() {
	this.Data["GameCurrentUrl"] = "/game/index"
	this.Data["CurrentCate"] = "游戏添加"
	this.Data["CurrentPCate"] = "游戏列表"
	this.TplName = "admin/game/add.html"
}

//游戏添加控制
func (this *GameController) GameAddCon() {
	game := models.GameDataStruct{} //初始化游戏结构体

	if err := this.ParseForm(&game); err != nil {
		log.Println("解析表单数据失败:", err)
		this.Error("数据解析失败:", "/game/index/add", 1)
		return
	}

	session, err := mgo.Dial(beego.AppConfig.String("url"))
	defer session.Close()
	if err != nil {
		log.Panicln("数据库连接错误:", err)
		this.Error("数据库连接错误", "/game/index/add", 1)
		return
	}
	c := session.DB(beego.AppConfig.String("database")).C("gameDetail")
	game.FromWhere = "编辑推荐"
	game.Time = time.Now().Unix()
	game.GameId = this.UniqueId()
	err = c.Insert(game)
	if err != nil {
		log.Println("数据保存失败:", err)
		this.Error("提交数据失败", "/game/index/add", 1)
		return
	}

	this.Success("添加游戏成功", "/game/index", 1)
}

func (this *GameController) IndexList() {
	session, err := mgo.Dial(beego.AppConfig.String("url"))
	defer session.Close()
	var game []models.GameDataStruct //初始化游戏结构体
	if err != nil {
		log.Println("数据库连接错误:", err)
		this.AjaxReturn(409, "数据库连接错误", nil)
	}
	//	queryMap := bson.M{}
	c := session.DB(beego.AppConfig.String("database")).C("gameDetail")
	err = c.Find(nil).All(&game)
	if err != nil {
		log.Println("获取数据失败:", err)
		this.AjaxReturn(411, "获取数据失败", nil)
	}
	this.AjaxReturn(200, "获取数据成功", game)
}

//修改
func (this *GameController) Update() {
	var GId string = this.GetString("gameId") //游戏主键
	if GId == "" {
		this.Error("主键为空", "/game/index", 1)
		return
	}
	fmt.Println("gid", GId)
	gameData := models.GameDataStruct{}

	session, err := mgo.Dial(beego.AppConfig.String("url"))
	defer session.Close()
	if err != nil {
		log.Println("数据库连接错误:", err)
		this.DelSession("uid")
		this.Error("数据库连接错误", "/login", 1)
		return
	}
	//	queryMap := bson.M{}
	c := session.DB(beego.AppConfig.String("database")).C("gameDetail")
	queryMap := bson.M{"gameId": GId}

	err = c.Find(queryMap).One(&gameData)
	if err != nil {
		log.Println("获取数据失败:", err)
		this.Error("获取数据失败", "/game/index", 1)
		return
	}
	this.Data["GameCurrentUrl"] = "/game/index"
	this.Data["CurrentCate"] = "游戏添加"
	this.Data["CurrentPCate"] = "游戏列表"
	this.Data["game"] = gameData
	this.TplName = "admin/game/edit.html"
}

//删除
func (this *GameController) Del() {
	var GId string //游戏主键
	this.Ctx.Input.Bind(&GId, "gameId")
	fmt.Println("gid", GId)
	session, err := mgo.Dial(beego.AppConfig.String("url"))
	defer session.Close()
	if err != nil {
		log.Println("数据库连接错误:", err)
		this.AjaxReturn(409, "数据库连接错误", nil)
	}

	c := session.DB(beego.AppConfig.String("database")).C("gameDetail")
	queryMap := bson.M{"gameId": GId}
	err = c.Remove(queryMap)
	if err != nil {
		log.Println("删除数据失败:", err)
		this.AjaxReturn(414, "删除数据失败", nil)
	}
	this.AjaxReturn(200, "删除数据成功", nil)
}

//修改
func (this *GameController) UpdateCon() {
	var GId string = this.GetString("gameId") //游戏主键

	game := models.GameDataStruct{} //初始化游戏结构体
	if err := this.ParseForm(&game); err != nil {
		log.Println("解析表单数据失败:", err)
		this.Error("数据解析失败:", "/game/index/add", 1)
		return
	}

	session, err := mgo.Dial(beego.AppConfig.String("url"))
	defer session.Close()

	if err != nil {
		log.Println("数据库连接错误:", err)
		this.DelSession("uid")
		this.Error("数据库连接错误", "/login", 1)
		return
	}
	c := session.DB(beego.AppConfig.String("database")).C("gameDetail")
	queryMap := bson.M{"gameId": GId}
	game.FromWhere = "编辑推荐"
	game.Time = time.Now().Unix()
	err = c.Update(queryMap, game)
	if err != nil {
		log.Println("修改数据失败:", err)
		this.Error("修改数据失败", "/game/index", 1)
		return
	}

	this.Success("修改数据成功", "/game/index", 1)
}
