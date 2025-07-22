/**
 * create 2024-11-11 18:23:42 By wanghao
 * 全局方法封装
 * */
import EventBus from "../utils/EventBus.js";
//使用bus调用页面方法
// EventBus.$emit('queryMeetingCenterList', JSON.parse(data));
import MsgId from "../proto/msgid_pb.js";
import * as Proto from "../proto/chat_pb";
import store from "../store";
import LocalStore from "../websocket/store/localstore";
import {KEY_VUE_USER_ID} from "../constant";

// 数据转化：Uint8Array 转换为 JavaScript 字符串（FsString）
export const toFsString = (data) => {
  // 将 Uint8Array 转换为 JavaScript 字符串
  return new TextDecoder().decode(data);

  // return String.fromCharCode.apply(null, data);
};

// js 将序列化的proto 转成16进制编码
function bufferToHex(buffer) {
  let hex = "";
  for (let i = 0; i < buffer.length; i++) {
    // 将每个字节转换为16进制，并确保每个字节的16进制表示为两位
    hex += buffer[i].toString(16).padStart(2, "0");
  }
  return hex;
}

// js 将16进制编码 转成序列化的proto
function hexToBuffer(hex) {
  if (hex.length % 2 !== 0) {
    throw new Error("Invalid hex string length");
  }

  const buffer = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    buffer[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return buffer;
}

// js调用UE
export const jsCallUE = (id, data) => {
  try {
    // alert("调用UE里的函数");
    console.log("%c ================请求ue的id====================:", "color: #FFA500;", id);
    ue.ueobj.webreqmsg(id.toString(), bufferToHex(data)).then(() => {
      // alert('调用了UE里的函数!');
    });
  } catch (e) {
    console.error("ReferenceError: ue is not defined");
    // console.log('%cReferenceError: ue is not defined', 'font-weight: bold; font-size: 12px; color: red');
  }
};

// 提供给UE的方法
window.uemsgack = function (id, data) {
  console.log("%c ================ue返回的参数id====================:", "color: #52d10a;", id);
  switch (id) {
    //   返回好友列表
    case MsgId.S2C_FRIEND_LIST_ACK:
      // data是json字符串
      // console.log('2008：',data);
      // console.log("2008返回参数:", hexToBuffer(data));
      try {
        // 使用 hexToBuffer 转换数据，并确保返回值兼容 jspb.ByteSource
        const S2CFriendListAckData = Proto.default.S2CFriendListAck.deserializeBinary(hexToBuffer(data));
        console.log(`%c ${MsgId.S2C_FRIEND_LIST_ACK}返回参数:`, "color: #52d10a;", S2CFriendListAckData.toObject());
        let newFriendList = S2CFriendListAckData.toObject().friendInfoList.map((item, index) => {
          return {
            id: item.roleId,
            wxid: item.roleId, //微信号
            displayName: item.userName, //姓名首字母
            reason: item.userName,  //昵称
            img: 'static/images/newfriend.jpg', //头像
            portrait: 'static/images/newfriend.jpg', //头像
            signature: "", //个性签名
            nickname: item.userName,  //昵称
            sex: item.sex,   //性别 1为男，0为女
            remark: item.userName,  //备注
            area: "",  //地区,
          };
        });
        console.log(newFriendList)
        store.commit('updateFriendList', newFriendList)
      } catch (e) {
        console.error("反序列化失败:", e);
      }
      break;
    //   返回好友申请列表
    case MsgId.S2C_APPLY_LIST_ACK:
      try {
        // 使用 hexToBuffer 转换数据，并确保返回值兼容 jspb.ByteSource
        const S2CApplylistAckData = Proto.default.S2CApplylistAck.deserializeBinary(hexToBuffer(data));
        console.log(`%c ${MsgId.S2C_APPLY_LIST_ACK}返回参数:`, "color: #52d10a;", S2CApplylistAckData.toObject());
        if (S2CApplylistAckData.toObject().errorId == 0) {
          console.log(S2CApplylistAckData.toObject().applylistList)
          let newApplyFriendList = S2CApplylistAckData.toObject().applylistList.map((item, index) => {
            return {
              id: item.roleId,
              wxid: item.roleId, //微信号
              displayName: item.userName, //姓名首字母
              status: item.opType, // 是否处理 0.未处理 1.同意 2.拒绝
              time: item.time, // 申请时间
              reason: item.userName,  //昵称
              initial: item.userName, //姓名首字母
              img: 'static/images/newfriend.jpg', //头像
              portrait: 'static/images/newfriend.jpg', //头像
              signature: "", //个性签名
              nickname: item.userName,  //昵称
              sex: item.sex,   //性别 1为男，0为女
              remark: "新的朋友",  //备注
              area: "",  //地区
            };
          });
          console.log(newApplyFriendList)
          store.commit('updateFriendRequest', newApplyFriendList)
        }

      } catch (e) {
        console.error("反序列化失败:", e);
      }
      break;
    //   返回请求加为好友
    case MsgId.S2C_APPLY_FRIEND_ACK:
      try {
        // 使用 hexToBuffer 转换数据，并确保返回值兼容 jspb.ByteSource
        const S2CApplyFriendAckData = Proto.default.S2CApplyFriendAck.deserializeBinary(hexToBuffer(data));
        console.log(`%c ${MsgId.S2C_APPLY_FRIEND_ACK}返回参数:`, "color: #52d10a;", S2CApplyFriendAckData.toObject());

      } catch (e) {
        console.error("反序列化失败:", e);
      }
      break;
    //   返回同意或拒绝加为好友
    case MsgId.S2C_AGREE_FRIEND_ACK:
      try {
        // 使用 hexToBuffer 转换数据，并确保返回值兼容 jspb.ByteSource
        const S2CAgreeFriendAckData = Proto.default.S2CAgreeFriendAck.deserializeBinary(hexToBuffer(data));
        console.log(`%c ${MsgId.S2C_AGREE_FRIEND_ACK}返回参数:`, "color: #52d10a;", S2CAgreeFriendAckData.toObject());
        // 查询添加好友列表
        store.commit('getFriendList', true)

      } catch (e) {
        console.error("反序列化失败:", e);
      }
      break;
    //   删除好友返回
    case MsgId.S2C_DELETE_FRIEND_RES:
      try {
        // 使用 hexToBuffer 转换数据，并确保返回值兼容 jspb.ByteSource
        const S2CDeleteFriendAckData = Proto.default.S2CDeleteFriendAck.deserializeBinary(hexToBuffer(data));
        console.log(`%c ${MsgId.S2C_DELETE_FRIEND_RES}返回参数:`, "color: #52d10a;", S2CDeleteFriendAckData.toObject());
        if (S2CDeleteFriendAckData.toObject().errorId == 0) {
          store.commit('deleteFriend', true);
          //查询好友列表或者主动删除好友
          // store.state.friendlist.forEach((item,index) => {
          //   if(item.id == S2CDeleteFriendAckData.toObject().roleId){
          //     store.state.friendlist.splice(index,1);
          //   }
          // });
          //通过过滤来进行筛选
          // store.state.friendlist = store.state.friendlist.filter(item => item.id !== S2CDeleteFriendAckData.toObject().roleId);
          store.commit('getFriendList', true)
        }
      } catch (e) {
        console.error("反序列化失败:", e);
      }
      break;
    //   返回请求好友黑名单
    case MsgId.S2C_BLACKLIST_ACK:
      try {
        // 使用 hexToBuffer 转换数据，并确保返回值兼容 jspb.ByteSource
        const S2CBlacklistAckData = Proto.default.S2CBlacklistAck.deserializeBinary(hexToBuffer(data));
        console.log(`%c ${MsgId.S2C_BLACKLIST_ACK}返回参数:`, "color: #52d10a;", S2CBlacklistAckData.toObject());

      } catch (e) {
        console.error("反序列化失败:", e);
      }
      break;
    //   返回添加好友到黑名单
    case MsgId.S2C_BLACKLIST_ADD_ACK:
      try {
        // 使用 hexToBuffer 转换数据，并确保返回值兼容 jspb.ByteSource
        const S2CBlacklistAddAckData = Proto.default.S2CBlacklistAddAck.deserializeBinary(hexToBuffer(data));
        console.log(`%c ${MsgId.S2C_BLACKLIST_ADD_ACK}返回参数:`, "color: #52d10a;", S2CBlacklistAddAckData.toObject());

      } catch (e) {
        console.error("反序列化失败:", e);
      }
      break;
    //   返回请求删除好友黑名单
    case MsgId.S2C_BLACKLIST_DEL_ACK:
      try {
        // 使用 hexToBuffer 转换数据，并确保返回值兼容 jspb.ByteSource
        const S2CBlacklistDelAckData = Proto.default.S2CBlacklistDelAck.deserializeBinary(hexToBuffer(data));
        console.log(`%c ${MsgId.S2C_BLACKLIST_DEL_ACK}返回参数:`, "color: #52d10a;", S2CBlacklistDelAckData.toObject());

      } catch (e) {
        console.error("反序列化失败:", e);
      }
      break;
    //   返回好友推荐列表
    case MsgId.S2C_FRIEND_RECOMMEND_AKC:
      try {
        // 使用 hexToBuffer 转换数据，并确保返回值兼容 jspb.ByteSource
        const S2CFriendRecommendAckData = Proto.default.S2CFriendRecommendAck.deserializeBinary(hexToBuffer(data));
        let recommendData = S2CFriendRecommendAckData.toObject();
        console.log(`%c ${MsgId.S2C_FRIEND_RECOMMEND_AKC}返回参数:`, "color: #52d10a;", recommendData);
        if (recommendData.errorId == 0) {
          console.log(recommendData.briefList)
          let newFriendList = recommendData.briefList.map((item, index) => {
            return {
              id: item.roleId,
              wxid: item.roleId, //微信号
              displayName: item.userName, //姓名首字母
              initial: item.userName, //姓名首字母
              img: 'static/images/newfriend.jpg', //头像
              portrait: 'static/images/newfriend.jpg', //头像
              signature: "", //个性签名
              nickname: item.userName,  //昵称
              sex: item.sex,   //性别 1为男，0为女
              remark: "新的朋友",  //备
              area: "",  //地区
            };
          });
          console.log(newFriendList)
          store.commit('updateSearchUser', newFriendList)
        }

      } catch (e) {
        console.error("反序列化失败:", e);
      }
      break;

    default:
      console.error("未定义的返回信息");

      break;
    //   返回聊天结果
    case MsgId.S2C_CHAT_ACK:
      try {
        // 使用 hexToBuffer 转换数据，并确保返回值兼容 jspb.ByteSource
        const S2CBlacklistDelAckData = Proto.default.S2CBlacklistDelAck.deserializeBinary(hexToBuffer(data));
        console.log(`%c ${MsgId.S2C_CHAT_ACK}返回参数:`, "color: #52d10a;", S2CBlacklistDelAckData.toObject());
        //监听聊天结果，成功后调用聊天记录信息


      } catch (e) {
        console.error("反序列化失败:", e);
      }
      break;
    //   频道聊天记录返回
    case MsgId.S2C_CHAT_HISTORY_ACK:
      try {
        // 使用 hexToBuffer 转换数据，并确保返回值兼容 jspb.ByteSource
        const S2CBlacklistDelAckData = Proto.default.S2CBlacklistDelAck.deserializeBinary(hexToBuffer(data));
        console.log(`%c ${MsgId.S2C_CHAT_HISTORY_ACK}返回参数:`, "color: #52d10a;", S2CBlacklistDelAckData.toObject());
        // 聊天信息返回后，调用聊天记录信息，将返回的信息显示到聊天记录中
        // 调用信息显示到聊天记录中
        // store.commit('updateConversationBrief', S2CBlacklistDelAckData.toObject())
        // 模拟返回的信息
        let chatHistoryData = {
          errCode: 1,
          total_num: 0,
          start_index: 1,
          count: 1,
          ChatHistoryItem: {
            fromRole: "123456",
            content: "发送的信息",
          }
        };
        // 封装的发送消息对象protoMessage，封装当前数据对应的消息对象，替换对象中lastMessage
        this.commit("acceptProtoMessage", {
          content: S2CBlacklistDelAckData.ChatHistoryItem.content,//内容
          target: S2CBlacklistDelAckData.ChatHistoryItem.fromRole,//角色id
        })


      } catch (e) {
        console.error("反序列化失败:", e);
      }
      break;
  }
};


// 调用UE的webgetroleid方法获取角色id
export const webGetRoleId = () => {
  try {
    // alert("调用UE里的 webgetroleid 函数");
    ue.ueobj.webgetroleid().then(() => {
      // alert('调用了UE里的函数!');
    });
  } catch (e) {
    console.error("ReferenceError: ue is not defined");
    // console.log('%cReferenceError: ue is not defined', 'font-weight: bold; font-size: 12px; color: red');
  }
};


// ue返回的角色id
window.uesetroleid = function (id) {
  console.log("%c ================ue返回的角色id====================:", "color: #52d10a;", id);
  store.state.userId = id;
};


// 调用UE的webuploadfile方法获取文件路径  type 0:图片 1:视频  2:文件
export const webuploadfile = (type) => {
  try {
    // alert("调用UE里的 webuploadfile 函数");
    ue.ueobj.webuploadfile(type).then(() => {
      // meetingCenterStore.loading = true;
      // alert('调用了UE里的函数!');
    });
  } catch (e) {
    console.error("ReferenceError: ue is not defined");
    // console.log('%cReferenceError: ue is not defined', 'font-weight: bold; font-size: 12px; color: red');
  }
};

let imageUrl = 'https://oss.test.kuailaiyuanyuzhou.com/';//配置服务器图片地址
// ue返回的上传图片信息
window.uploadImage = function (error, errorData, data, name, requestid = '1', target) {
  console.log("%c ================ue返回的图片上传信息====================:", "color: #52d10a;", error, errorData, data, name, requestid);
  console.log("%c error:", "color: #52d10a;", error);
  console.log("%c errorData:", "color: #52d10a;", errorData);
  console.log("%c data:", "color: #52d10a;", data);
  console.log("%c name:", "color: #52d10a;", name);
  console.log("%c requestid:", "color: #52d10a;", requestid);
  console.log("%c target:", "color: #52d10a;", target);
  if (error) {
    let fileUrl = imageUrl + data //封面图片;
    if (data && requestid === '0') {
      // meetingCenterStore.coverImage = imageUrl + '20240730-150250_1728975865 _208.png' //封面图片;
      // 封装的发送消息对象protoMessage，封装当前数据对应的消息对象，替换对象中lastMessage
      this.commit("acceptProtoMessage", {
        content: `<img src=${fileUrl} alt="">`,//内容
        target: target,//角色id
        type: 1,//消息类型：图片
      })
    } else if (data && requestid === '1') {
      // 封装的发送消息对象protoMessage，封装当前数据对应的消息对象，替换对象中lastMessage
      this.commit("acceptProtoMessage", {
        content: fileUrl,//内容
        target: target,//角色id
        type: 6,//消息类型：视频
      })
    } else if (data && requestid === '2') {
      // 封装的发送消息对象protoMessage，封装当前数据对应的消息对象，替换对象中lastMessage
      this.commit("acceptProtoMessage", {
        content: fileUrl,//内容
        target: target,//角色id
        type: 1,//消息类型：文件
      })
    }
  } else {
    console.log('上传失败信息：', errorData);
  }
};


// 调用UE的webgetaccountinfo方法获取用户信息
export const webgetaccountinfo = () => {
  try {
    // alert("调用UE里的 webuploadfile 函数");
    ue.ueobj.webgetaccountinfo().then(() => {
      // alert('调用了UE里的函数!');
    });
  } catch (e) {
    console.error("ReferenceError: ue1 is not defined");
    // console.log('%cReferenceError: ue is not defined', 'font-weight: bold; font-size: 12px; color: red');
  }
};
// ue返回的角色信息
window.uesetroleInfo = function (data) {
  console.log("%c ================ue返回的角色信息====================:", "color: #52d10a;", data);
  // store.state.user = {...data};
  store.state.user.name = data.role_name;
  store.state.user.userId = data.role_id;
  localStorage.setItem(KEY_VUE_USER_ID,data.role_id);
};


// 预览功能
export const webpreviewroom = (levelname) => {
  console.log(levelname)
  try {
    ue.ueobj.webpreviewroom(levelname).then(() => {
      // alert('调用了UE里的函数!');
    });
  } catch (e) {
    console.error("ReferenceError: ue is not defined");
    // console.log('%cReferenceError: ue is not defined', 'font-weight: bold; font-size: 12px; color: red');
  }
};


// 调用UE的webattendmeeting进入会议方法
export const webattendmeeting = (meetingid) => {
  try {
    // alert("调用UE里的 webuploadfile 函数");
    ue.ueobj.webattendmeeting(meetingid).then(() => {
      // alert('调用了UE里的函数!');
    });
  } catch (e) {
    console.error("ReferenceError: ue is not defined");
    // console.log('%cReferenceError: ue is not defined', 'font-weight: bold; font-size: 12px; color: red');
  }
};

// ue返回的进入会议信息
window.ueattendmeeting = function (data) {
  console.log("%c ================ue返回的进入会议信息====================:", "color: #52d10a;", data);

};


// 调用UE的webcloseui退出方法
export const webcloseui = () => {
  try {
    // alert("调用UE里的 webuploadfile 函数");
    ue.ueobj.webcloseui().then(() => {
      // alert('调用了UE里的函数!');
    });
  } catch (e) {
    console.error("ReferenceError: ue is not defined");
    // console.log('%cReferenceError: ue is not defined', 'font-weight: bold; font-size: 12px; color: red');
  }
};
