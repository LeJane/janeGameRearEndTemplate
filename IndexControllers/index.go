//前端首页
package IndexControllers

import (
	"bashidu/models"

	"log"
	"strconv"

	"github.com/astaxie/beego"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

type IndexControllers struct {
	beego.Controller
}

//首页列表数据
func (this *IndexControllers) IndexList() {
	page := this.GetString("p")
	PageInt, _ := strconv.Atoi(page)
	count := 10
	var p int = (PageInt - 1) * count
	var s int
	s = p
	if p == 1 {
		p = 0
	}
	var offRset = s * count

	session, err := mgo.Dial(beego.AppConfig.String("url"))
	var game []models.GameDataStruct
	if err != nil {
		log.Println("数据库连接错误", err)
		this.AjaxReturn(601, "数据库连接错误", nil)
	}
	c := session.DB(beego.AppConfig.String("database")).C("gameDetail")
	err = c.Find(nil).Limit(offRset).Skip(p).Sort("-time").All(&game)

	if err != nil {
		log.Println("查询数据失败:", err)
		this.AjaxReturn(602, "查询数据失败", nil)
	}

	this.AjaxReturn(200, "获取数据成功", game)
}

//ajax返回
func (this *IndexControllers) AjaxReturn(State int, Msg string, Result interface{}) {
	var data map[string]interface{} = make(map[string]interface{})
	data["State"] = State
	data["Msg"] = Msg
	data["Result"] = Result
	this.Data["json"] = data
	this.ServeJSON()
	return
}

//根据提交的id号返回相应的数据
func (this *IndexControllers) IndexDetail() {
	//	this.Ctx.ResponseWriter.Header().Add("Access-Control-Allow-Origin", "*")
	//gameId
	var GId string = this.GetString("gameId")
	log.Println("Gid：", GId)
	session, err := mgo.Dial(beego.AppConfig.String("url"))
	var game models.GameDataStruct
	if err != nil {
		log.Println("数据库连接错误", err)
		this.AjaxReturn(601, "数据库连接错误", nil)
	}
	c := session.DB(beego.AppConfig.String("database")).C("gameDetail")
	queryMap := bson.M{"gameId": GId}
	err = c.Find(queryMap).One(&game)
	if err != nil {
		log.Println("查询数据失败:", err)
		this.AjaxReturn(602, "查询数据失败", nil)
	}

	this.AjaxReturn(200, "获取数据成功", game)

}
