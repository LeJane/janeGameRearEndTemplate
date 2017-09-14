//用户管理的模型

package models

import (
	"errors"

	"github.com/astaxie/beego"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

//数据结构
type UserRegister struct {
	Id           bson.ObjectId `bson:"_id,omitempty"`
	Phone        string        `bson:"phone" form:"phone"`
	Pwd          string        `bson:"pwd" form:"pwd"`
	Name         string        `bson:"name" form:"name"`
	Sex          string        `bson:"sex" form:"sex"`
	Uid          string        `bson:"uid"`
	IsAllowLogin bool          `bson:"isAllowLogin"`
	LoginTime    int64         `bson:"loginTime"`
	RegisterTime int64         `bson:"registerTime"`
}

//根据uid获取用户信息

func GetUserInfo(uid string) (*UserRegister, error) {
	if uid == "" {
		err := errors.New("uid为空")
		return nil, err
	}
	url := beego.AppConfig.String("url")
	userInfo := UserRegister{}
	//连接mongdb
	session, err := mgo.Dial(url)
	if err != nil {
		return nil, err
	}
	//集合
	c := session.DB(beego.AppConfig.String("database")).C("user")
	queryMap := bson.M{"uid": uid}
	err = c.Find(queryMap).One(&userInfo)
	if err != nil {
		return nil, err
	}
	return &userInfo, nil

}
