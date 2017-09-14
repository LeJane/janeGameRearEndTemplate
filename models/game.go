//游戏模型
package models

import (
	_ "github.com/astaxie/beego"
	//	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

//游戏的数据模型
type GameDataStruct struct {
	Id                   bson.ObjectId `bson:"_id,omitempty"`
	GameId               string        `bson:"gameId" form:"gameId"`
	GameName             string        `bson:"gameName" form:"gameName"`
	GameDecr             string        `bson:"gameDecr" form:"gameDecr"`
	GameIcon             string        `bson:"gameIcon" form:"gameIcon"`
	AuthorOrRole         string        `bson:"authorOrRole" form:"authorOrRole"`
	AuthorNameOne        string        `bson:"authorNameOne" form:"authorNameOne"`
	AuthorName           string        `bson:"authorName" form:"authorName"`
	IsDeveloperOrRelease string        `bson:"isDeveloperRelease" form:"isDeveloperRelease"`
	GameType             string        `bson:"gameType" form:"gameType"`
	GameSummary          string        `bson:"gameSummary" form:"gameSummary"`
	UpdateLog            string        `bson:"updateLog" form:"updateLog"`
	DeveloperSpeak       string        `bson:"developerSpeak" form:"developerSpeak"`
	EditSpeak            string        `bson:"editSpeak" form:"editSpeak"`
	Compat               []string      `bson:"compat" form:"compat"`
	ScreenShot           []string      `bson:"screenShot" form:"screenShot"`
	GeneralizationMap    string        `bson:"generalizationMap" form:"generalizationMap"`
	AdvertPic            string        `bson:"advertPic" form:"advertPic"`
	AdvertText           string        `bson:"advertText" form:"advertText"`
	GameVideo            string        `bson:"gameVideo" form:"gameVideo"`
	GameVideoPic         string        `bson:"gameVideoPic" form:"gameVideoPic"`
	QqName               string        `bson:"qqName" form:"qqName"`
	QqNumber             int64         `bson:"qqNumber" form:"qqNumber"`
	FromWhere            string        `bson:"fromWhere"`
	Time                 int64         `bson:"time"`
}
