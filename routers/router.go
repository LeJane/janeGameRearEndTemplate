package routers

import (
	"bashidu/AdminControllers"
	bc "bashidu/AdminControllers/baseControllers"
	"bashidu/IndexControllers"

	"github.com/astaxie/beego"
)

func init() {
	beego.Router("/admin/user", &AdminControllers.UserControllers{})
	beego.Router("/index", &IndexControllers.MainController{})
	beego.Router("/login", new(AdminControllers.LoginControllers), "get:LoginPage")
	beego.Router("/index/index", new(AdminControllers.IndexControllers), "get:IndexPage")
	beego.Router("/login/loginCon", new(AdminControllers.LoginControllers), "post:LoginCon")
	beego.Router("/register", new(AdminControllers.RegisterController), "get:RegistPage")
	beego.Router("/register/registerCon", new(AdminControllers.RegisterController), "post:RegisterCon")
	beego.Router("/loginout", new(AdminControllers.LoginControllers), "get:LoginOut")
	beego.Router("/game/index", new(AdminControllers.GameController), "get:GameIndex")
	beego.Router("/game/index/add", new(AdminControllers.GameController), "get:GameAddPage")
	beego.Router("/file/upload", new(bc.BaseController), "post:UploadMethod")
	beego.Router("/game/addCon", new(AdminControllers.GameController), "post:GameAddCon")
	beego.Router("/game/list", new(AdminControllers.GameController), "post:IndexList")
	beego.Router("/game/update", new(AdminControllers.GameController), "get:Update")
	beego.Router("/game/UpdateCon", new(AdminControllers.GameController), "post:UpdateCon")
	beego.Router("/game/del", new(AdminControllers.GameController), "post:Del")

	//前段首页请求列表数据
	beego.Router("/bashiduchina/index", new(IndexControllers.IndexControllers), "post:IndexList")
	beego.Router("/bashiduchina/detail", new(IndexControllers.IndexControllers), "post:IndexDetail")
}
