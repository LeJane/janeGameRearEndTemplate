//首页控制器
package AdminControllers

import (
	bc "bashidu/AdminControllers/baseControllers"
	"bashidu/models"
)

//首页控制器
type IndexControllers struct {
	bc.BaseController
}

//首页显示
func (this *IndexControllers) IndexPage() {
	//获取用户信息
	Uid := ""
	if v, ok := this.GetSession("uid").(string); ok {
		Uid = v
	}
	userInfo, err := models.GetUserInfo(Uid)

	if err != nil {
		this.DelSession("uid")
		this.Error("获取用户信息失败,请重新登录", "/login", 1)
		return
	}
	this.Data["userPhone"] = userInfo.Phone
	//首页显示

	this.TplName = "admin/index/index.html"
}
