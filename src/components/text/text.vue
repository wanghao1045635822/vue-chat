<!-- 文本输入框 -->
<template>
  <div class="text">
    <div class="emoji">
      <i class="icon iconfont icon-biaoqing" @click="showEmoji=!showEmoji"></i>
      <!--      2025年5月12日16:37:01 后开发-->
      <i title="语音聊天" class="icon iconfont icon-dianhua" v-show="isSingleConversation" @click="sendAudio"></i>
      <i title="视频聊天" class="icon iconfont icon-ai-video" @click="sendVideo"></i>
      <i title="发送图片" class="icon iconfont icon-tupian" @click="sendUEImage(0)">
        <!--        <input type="file" accept="image/*" id="chat-send-img" ref="uploadPic" @change="sendPic">-->
      </i>
      <i title="发送视频" class="icon iconfont icon-shipin" @click="sendUEImage(1)">
        <!--        <input type="file" accept="video/*" id="chat-send-video" ref="uploadVideo" @change="sendVideoMessage">-->
      </i>
      <i title="发送文件" class="icon iconfont icon-wenjian" @click="sendUEImage(2)">
        <!--        <input type="file" accept="*" id="chat-send-file" ref="uploadFile" @change="sendFile">-->
      </i>
      <transition name="showbox">
        <div class="emojiBox" v-show="showEmoji">
          <li v-bind:key=index v-for="(item, index) in emojis">
            <img :src="'static/emoji/'+item.file" :data="item.code" @click="clickemojiBox(item)">
          </li>
        </div>
      </transition>

      <transition name="voice-video-chat-box">
        <div class="chat-modal" v-show="false">
          <div class="chat-box">
            <video id="video-remote" playsinline autoplay muted></video>
            <video id="video-local" playsinline autoplay muted></video>
          </div>
        </div>
      </transition>
<!--      视频呼叫和通知显示-->
      <div class="wxCallBox" v-show="showCallBox">
        <img class="bigavatar" :src="callRemoteImg" style="width: 100px;"/>
        <span>{{callDisplayName}}</span>
        <p id="wxCallTips" class="calltips">{{videoTextCallTips}}</p>
        <div class="callbtnBox">
          <!--                语音开关-->
          <div class="activeBtn" >
            <img v-if="!isMutedAudio"  @click="muteAudio" src="./../../../static/video/openAudio.png" alt="">
            <img v-if="isMutedAudio"  @click="unmuteAudio" src="./../../../static/video/stopAudio.png" alt="">
          </div>
          <!--                接通-->
          <div class="activeBtn" v-show="acceptCall" style="background-color: #ffffff;" @click="handleAccept">
            <img style="width: 100%;height: 100%" src="./../../../static/video/connect.png" alt="">
          </div>
          <!--                挂断-->
          <div class="activeBtn" style="background-color: #ffffff;" @click="cancel">
            <img style="width: 100%;height: 100%" src="./../../../static/video/stop.png" alt="">
          </div>
          <!--                视频开关-->
          <div class="activeBtn">
            <img v-if="!isMutedVideo" @click="muteVideo" src="./../../../static/video/openVideo.png" alt="">
            <img v-if="isMutedVideo" @click="unmuteVideo" src="./../../../static/video/stopVideo.png" alt="">
          </div>
        </div>
      </div>
<!--视频显示-->
      <div class="callContent" v-show="showChatBox">
        <div class="">
          <div class="callercontent callshow" style="">
            <div class="exchange-content">
              <div class="playcontent left-big-content">
<!--                <img id="wxCallRemoteImg" class="bigavatar" :src="callRemoteImg" v-show="showCallRemoteImg"/>-->
<!--                <p id="wxCallTips" class="calltips" v-text="videoTextCallTips" v-show="showCallTips"> 接通中... </p>-->
<!--                播放远端视频-->
                <div id="wxCallRemoteVideo" style="width: 100%;height: 380px;background-color: #666666"></div>
                <div class="btnBox">
                  <!--                语音开关-->
                  <div class="activeBtn" >
                    <img v-if="!isMutedAudio"  @click="muteAudio" src="./../../../static/video/openAudio.png" alt="">
                    <img v-if="isMutedAudio"  @click="unmuteAudio" src="./../../../static/video/stopAudio.png" alt="">
                  </div>
                  <!--                挂断-->
                  <div class="activeBtn" style="background-color: #ffffff;" @click="cancel">
                    <img style="width: 100%;height: 100%" src="./../../../static/video/stop.png" alt="">
                  </div>
                  <!--                视频开关-->
                  <div class="activeBtn" >
                    <img v-if="!isMutedVideo" @click="muteVideo" src="./../../../static/video/openVideo.png" alt="">
                    <img v-if="isMutedVideo" @click="unmuteVideo" src="./../../../static/video/stopVideo.png" alt="">
                  </div>
                  <!--                接通-->
<!--                  <div class="activeBtn" style="background-color: #ffffff;">-->
<!--                    <img style="width: 100%;height: 100%" src="./../../../static/video/connect.png" alt="">-->
<!--                  </div>-->
                </div>
              </div>
<!--              播放本地视频-->
              <div  id="wxCallLocalVideo" class="playcontent right-sml-content" v-show="showCallLocalVideo">
<!--                <img id="wxCallLocalImg" :src="callLocalImg" class="bigavatar" v-show="showCallLocalImg"/>-->
<!--                <video autoplay="autoplay" muted="muted" playsinline=""></video>-->
              </div>
            </div>
<!--            <div class="opera-content flexbox">-->
<!--              <img class="calleravatar" :src="callRemoteImg"/>-->
<!--              <span class="flexauto overell callnick" v-text="callDisplayName"></span>-->
<!--              <span class="flexbox">-->
<!--                            <span class="operabtn canclecall btnopacity" v-show="cancelCall" @click="cancel">取消</span>-->
<!--                            <span class="operabtn canclecall btnopacity" style="display: none;" v-show="rejectCall"-->
<!--                                  @click="reject">拒绝</span>-->
<!--                            <span class="operabtn upcall btnopacity" style="display: none;" v-show="acceptCall"-->
<!--                                  @click="accept">接听</span>-->
<!--                        </span>-->
<!--              <span class="talktime flexbox" style="display: none;" v-show="showTalkTime"><i-->
<!--                class="iconfont icon-ai-video"></i> <span v-text="talkTime">00:00</span></span>-->
<!--              <span class="operabtn canclecall btnopacity" style="display: none;" v-show="hangUpCall" @click="hangUp"><i-->
<!--                class="iconfont icon-guaduan"></i>挂断 </span>-->
<!--              <button class="screenbtn"><i class="iconfont icon-quanping iconfull" style="display: none;"></i></button>-->
<!--              <button class="screenbtn" style="display: none;"><i class="iconfont icon-tuichuquanping iconfull"></i>-->
<!--              </button>-->
<!--            </div>-->
          </div>
        </div>
      </div>
<!--音频显示-->
      <!--      视频呼叫和通知显示-->
      <div class="wxCallBox" v-show="showAudioCallBox">
        <img class="bigavatar" :src="callRemoteImg" style="width: 100px;"/>
        <p class="callnick" v-text="callDisplayName"></p>
        <p class="call-time" style="display: none;" v-show="showTalkTime" v-text="talkTime">00:00</p>
        <p class="waiting-msg" v-text="waitingMsgTips"> 接通中... </p>
        <p id="wxCallTips" class="calltips">{{videoTextCallTips}}</p>
        <div class="callbtnBox">
          <!--                语音开关-->
          <div class="activeBtn" >
            <img v-if="!isMutedAudio"  @click="muteAudio" src="./../../../static/video/openAudio.png" alt="">
            <img v-if="isMutedAudio"  @click="unmuteAudio" src="./../../../static/video/stopAudio.png" alt="">
          </div>
          <!--                接通-->
          <div class="activeBtn" v-show="acceptCall" style="background-color: #ffffff;" @click="handleAccept">
            <img style="width: 100%;height: 100%" src="./../../../static/video/connect.png" alt="">
          </div>
          <!--                挂断-->
          <div class="activeBtn" style="background-color: #ffffff;" @click="cancel">
            <img style="width: 100%;height: 100%" src="./../../../static/video/stop.png" alt="">
          </div>
        </div>
      </div>

<!--      <div class="audioContent" v-show="showAudioBox">-->
<!--        <div class="audioBody callshow">-->
<!--          <div class="audioBg">-->
<!--            <img class="callavatar" :src="callRemoteImg"/>-->
<!--            <div class="blackbg"></div>-->
<!--          </div>-->
<!--          <div class="audiomain">-->
<!--            <img class="audio-avatar" :src="callRemoteImg"/>-->
<!--            <p class="callnick" v-text="callDisplayName"></p>-->
<!--            <p class="call-time" style="display: none;" v-show="showTalkTime" v-text="talkTime">00:00</p>-->
<!--            <p class="waiting-msg" v-show="waitingMsg" v-text="waitingMsgTips"> 接通中... </p>-->
<!--            <div class="call-opera flexbox">-->
<!--              <div class="loadingcall flexbox">-->
<!--                <span class="cancleaudio callercanle btnopacity" style="display: none;" v-show="cancelCall"-->
<!--                      @click="cancel"><i class="iconfont icon-guaduan"></i>取消 </span>-->
<!--                <span class="cancleaudio btnopacity" style="display: none;" v-show="rejectCall"-->
<!--                      @click="reject">拒绝</span>-->
<!--                <span class="upcall btnopacity" style="display: none;" v-show="acceptCall" @click="accept">接听</span>-->
<!--                <span class="cancleaudio btnopacity" style="display: none;" v-show="hangUpCall" @click="hangUp"><i-->
<!--                  class="iconfont icon-guaduan"></i>挂断 </span>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--          <div style="display: none;">-->
<!--            <audio id="wxCallRemoteAudio" autoplay="autoplay"></audio>-->
<!--          </div>-->
<!--          <div style="display: none;">-->
<!--            <audio id="wxCallLocalAudio" autoplay="autoplay" muted="muted"></audio>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
    </div>
    <!--        <textarea id="sendText"-->
    <!--                  ref="text"-->
    <!--                  v-model="content"-->
    <!--                  @keydown.enter.exact="sendMessage"-->
    <!--                  @keydown.ctrl.enter="newline"-->
    <!--                  @focus="onFocus"-->
    <!--                  @click="showEmoji=false"-->
    <!--                  style="background-color: transparent;"-->
    <!--        ></textarea>-->
    <div class="editor-container">
      <!-- 绑定 v-model 或自定义事件 -->
      <quill-editor
        id="sendText"
        ref="text"
        v-model="content"
        @keydown.enter="sendMessage"
        @keydown.ctrl.enter="newline"
        @click="showEmoji=false"
        :options="editorOptions"
        @text-change="onTextChange"
        @blur="onEditorBlur($event)"
        @focus="onEditorFocus($event)"
        @ready="onEditorReady($event)"
      />
    </div>
    <div class="send" @click="send" ref="sendBtn" v-bind:class="{disable : sendBtnDisabled}">
      <span>发送</span>
    </div>
    <transition name="appear">
      <div class="warn" v-show="warn">
        <div class="description">不能发送空白信息</div>
      </div>
    </transition>
  </div>
</template>

<script>
import adapter from 'webrtc-adapter'
import {mapGetters, mapState} from 'vuex'
import TextMessageContent from '../../websocket/message/textMessageContent'
import ImageMessageContent from '../../websocket/message/imageMessageContent'
import * as qiniu from 'qiniu-js'
import MessageContentMediaType from '../../websocket/message/messageContentMediaType'
import LocalStore from '../../websocket/store/localstore'
import SessionCallback from '../../webrtc/sessionCallback'
import EngineCallback from '../../webrtc/engineCallback'
import SendMessage from '../../websocket/message/sendMessage'
import CallState from '../../webrtc/callState'
import {UPLOAD_BY_QINIU, SUCCESS_CODE} from '../../constant'
import webSocketCli from '../../websocket/websocketcli'
import Message from '../../websocket/message/message'
import ProtoMessage from '../../websocket/message/protomessage'
import VideoMessageContent from '../../websocket/message/videoMessageContent'
import FileMessageContent from '../../websocket/message/fileMessageContent'
import MsgId from "../../proto/msgid_pb";
import * as Proto from "../../proto/friend_pb";
import * as Chat from "../../proto/chat_pb";
import {jsCallUE, webuploadfile} from "../../utils/UEmethod";
import TRTC from 'trtc-sdk-v5';

export default {
  data() {
    return {
      text: "初始内容",
      // content: '<img src="/static/images/microzz.jpg" style="width: 30px" alt="/::+">',
      content: '',
      sendBtnDisabled: true,
      reply: '未找到',
      frequency: 0,
      warn: false,
      showEmoji: false,
      videoTextCallTips: '接通中 ...',
      voipClient: null,
      rejectCall: false,
      cancelCall: false,
      acceptCall: false,
      hangUpCall: false,
      showCallBtn: false,
      showCallLocalImg: false,
      showCallLocalVideo: false,
      showCallRemoteImg: false,
      showCallRemoteVideo: false,
      showCallBox: false,//显示通话界面
      showAudioCallBox: false,//显示语音通话界面
      showCallTips: true,
      callRemoteImg: 'static/images/UserAvatar.jpg',
      callLocalImg: 'static/images/UserAvatar.jpg',
      callDisplayName: '王浩',
      waitingMsg: false,
      isAudioOnly: false,
      waitingMsgTips: '',
      showTalkTime: false,
      talkInterval: 0,
      talkTime: '00:00',
      talkTimerInterval: null,
      editorOptions: {
        modules: {
          placeholder: false,
          toolbar: [
            // ['bold', 'italic', 'underline', 'strike'], // 工具按钮
            // [{'header': 1}, {'header': 2}],       // 标题
            // ['blockquote', 'code-block'],               // 代码块
            // [{'list': 'ordered'}, {'list': 'bullet'}],
            // ['link', 'image', 'video'],                 // 媒体插入
            // ['clean']                                   // 清除格式
          ]
        },
        theme: 'snow'  // 主题风格（默认 'snow'）
      },
      trtc: '',
      sdkAppId: 1600041230,
      sdkSecretKey: "a11593a1e02a21dddd162f5680f9258bdfec30089cad27f4ca6d7307209d6d6e",
      // userId: LocalStore.getUserId(),
      userId: 'user_123456',
      userIds: 'user_666',
      roomId: 8888,
      userSig: '',
      remoteUsersViews: [],
      isMutedVideo: false,
      isMutedAudio: false,
      // status
      camStatus: 'stopped', // stopped, starting, started, stopping
      micStatus: 'stopped',
      roomStatus: 'exited', // exited, exiting, entering, entered
      shareStatus: 'stopped' // stopping, stopped, sharing, shared
    };
  },
  computed: {
    ...mapState([
      'selectId',
      'selectFriendId',
      'emojis',
      'showChatBox',
      'showAudioBox',
      'userInfoList',
      'inCommingNotify',
      'outGoingNotify'
    ]),
    ...mapGetters([
      'selectedChat',
      'isSingleConversation',
    ])
  },
  methods: {
    onEditorBlur(quill) {
      // console.log('编辑器失焦', quill)
      this.showEmoji = false
    },
    onEditorFocus(quill) {
      // console.log('editor focus!', quill)
      this.showEmoji = false;
      this.$store.dispatch('clearUnreadStatus', '');
    },
    onEditorReady(quill) {
      console.log('editor ready!', quill)
    },
    onEditorChange({quill, html, text}) {
      console.log('editor change!', quill, html, text)
      this.content = html
    },
    //  获取编辑器实例
    getEditor() {
      return this.$refs.text.quill;
    },
    // 监听内容变化
    onTextChange(delta, oldDelta, source) {
      console.log('内容变化:', delta);
    },
    handleInput(event) {
      console.log(event.target.innerHTML)
      // 更新数据（双向绑定的核心）
      this.content = event.target.innerHTML;
    },
    sendPic(e) {
      var store = this.$store;
      var file = e.target.files[0];
      var localPath = e.target.value
      if (UPLOAD_BY_QINIU) {
        store.dispatch('getUploadToken', MessageContentMediaType.Image);
        console.log("sendpic " + e.target.value);
        var key = MessageContentMediaType.Image + "-" + LocalStore.getUserId() + "-" + new Date().getTime() + "-" + file.name;
        setTimeout(() => {
          var token = LocalStore.getImageUploadToken();
          console.log("upload file key " + key + " token " + token);
          if (token) {
            var observable = qiniu.upload(file, key, token, null, null);
            var observer = {
              next(res) {
                console.log('uploading ' + res.total.percent);
              },
              error(err) {
                console.log("upload error " + err.code + " message " + err.message);
              },
              complete(res) {
                console.log("upload complete" + res);
                var localPath = e.target.value;
                var remotePath = "http://image.comsince.cn/" + key;
                var imageMessageContent = new ImageMessageContent(localPath, remotePath, null);
                store.dispatch('sendMessage', new SendMessage(null, imageMessageContent));
              }
            }
            observable.subscribe(observer);
          }

        }, 200);
      } else {
        this.sendImage(file)
      }
      this.$refs.uploadPic.value = null;
    },
    sendUEImage(type) {
      // webuploadfile(type);
      if (type === 0) {
        // 图片
        this.$store.commit("acceptProtoMessage", {
          // content: `<img src="../../../static/images/小姨妈.jpg" style="width: 200px;" alt="">`,//内容
          content: '../../../static/images/小姨妈.jpg',//内容
          target: this.$store.state.selectTarget,//角色id
          type: 7,//消息类型：图片
        })
      } else if (type === 1) {
        // 视频
        this.$store.commit("acceptProtoMessage", {
          content: '../../../static/video/play.mp4',//内容
          target: this.$store.state.selectTarget,//角色id
          type: 6,//消息类型：视频
        })
      } else if (type === 2) {
        // 文件
        this.$store.commit("acceptProtoMessage", {
          content: '聊天项目设计.doc',//内容
          size: 109,
          target: this.$store.state.selectTarget,//角色id
          type: 8,//消息类型：视频
        })
      }
    },
    sendImage(file) {
      var store = this.$store;
      var key = MessageContentMediaType.Image + "-" + LocalStore.getUserId() + "-" + new Date().getTime() + "-" + file.name;
      webSocketCli.getMinioUploadUrl(MessageContentMediaType.Image, key).then(data => {
        if (data.code == SUCCESS_CODE) {
          console.log("domain " + data.result.domain + " url " + data.result.url)
          var messageId;
          var thunmbanilwithoutDesc;
          //获取缩略图,同时也为了适配android 端适配的问题，防止转发图片报错
          var reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = (e) => {
            var result = e.target.result
            this.canvasDataURL(result, {}, base64Img => {
              thunmbanilwithoutDesc = base64Img.split(',')[1]
              //添加缩略消息
              var imageMessageContent = new ImageMessageContent(file, null, thunmbanilwithoutDesc);
              var message = Message.conert2Message(new SendMessage(null, imageMessageContent));
              var protoMessage = ProtoMessage.convertToProtoMessage(message);
              messageId = protoMessage.messageId
              store.dispatch('preAddProtoMessage', protoMessage);
            })
          }

          fetch(data.result.url, {
            method: 'PUT',
            body: file
          }).then(() => {
            var remotePath = data.result.domain + "/" + key;
            console.log("remote path " + remotePath)
            var imageMessageContent = new ImageMessageContent(file, remotePath, thunmbanilwithoutDesc);
            store.dispatch('updateSendMessage', {messageId: messageId, messageContent: imageMessageContent})
          }).catch((e) => {
            console.error(e);
          });
        }
      })
    },

    /*** js 图片压缩上传(纯js的质量压缩，非长宽压缩)
     * https://www.cnblogs.com/xiangsj/p/8932525.html
     */
    canvasDataURL(path, obj, callback) {
      var img = new Image();
      img.src = path;
      img.onload = function () {
        var that = this;
        // 默认按比例压缩
        var w = that.width,
          h = that.height,
          scale = w / h;
        w = w * 0.5 > 113 ? 113 : w * 0.5;
        h = w / scale;
        console.log("scale " + scale + " transfer size " + w + ":" + h)
        var quality = 0.5;  // 默认图片质量为0.7
        //生成canvas
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        // 创建属性节点
        var anw = document.createAttribute("width");
        anw.nodeValue = w;
        var anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        // 图像质量
        if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
          quality = obj.quality;
        }
        // quality值越小，所绘制出的图像越模糊
        var base64 = canvas.toDataURL('image/jpeg', quality);
        // 回调函数返回base64的值
        callback(base64);
      }
    },

    //https://github.com/metroluffy/blog/issues/18
    sendVideoMessage(e) {
      var store = this.$store;
      var file = e.target.files[0];
      var localPath = e.target.value

      var key = MessageContentMediaType.Video + "-" + LocalStore.getUserId() + "-" + new Date().getTime() + "-" + file.name;
      webSocketCli.getMinioUploadUrl(MessageContentMediaType.Video, key).then(data => {
        if (data.code == SUCCESS_CODE) {
          console.log("domain " + data.result.domain + " url " + data.result.url)
          var messageId;
          var thunmbanilwithoutDesc;
          //获取缩略图,同时也为了适配android 端适配的问题，防止转发图片报错
          var url = URL.createObjectURL(file);
          console.log("video url " + url)

          this.getVideoImage(url, base64Img => {
            console.log("base64Img " + base64Img)
            thunmbanilwithoutDesc = base64Img.split(',')[1]
            //添加缩略消息
            var videoMessageContent = new VideoMessageContent(localPath, '', thunmbanilwithoutDesc);
            var message = Message.conert2Message(new SendMessage(null, videoMessageContent));
            var protoMessage = ProtoMessage.convertToProtoMessage(message);
            messageId = protoMessage.messageId
            store.dispatch('preAddProtoMessage', protoMessage);
          }, 2)

          fetch(data.result.url, {
            method: 'PUT',
            body: file
          }).then(() => {
            var remotePath = data.result.domain + "/" + key;
            console.log("remote path " + remotePath)
            var imageMessageContent = new VideoMessageContent(localPath, remotePath, thunmbanilwithoutDesc);
            store.dispatch('updateSendMessage', {messageId: messageId, messageContent: imageMessageContent})
          }).catch((e) => {
            console.error(e);
          });
        }
      })

      this.$refs.uploadVideo.value = null;
    },

    getVideoImage(path, callback, secs = 1) {
      var me = this,
        video = document.createElement('video');
      video.onloadedmetadata = function () {
        if ('function' === typeof secs) {
          secs = secs(this.duration);
        }
        this.currentTime = Math.min(Math.max(0, (secs < 0 ? this.duration : 0) + secs), this.duration);
        console.log("secs " + secs + " currentTime " + this.currentTime)
      };
      video.onseeked = function (e) {
        var canvas = document.createElement('canvas');
        var w = video.videoHeight,
          h = video.videoWidth,
          scale = w / h;
        w = w > 250 ? 250 : w;
        h = w / scale;
        console.log("scale " + scale + " transfer size " + w + ":" + h)
        canvas.height = h;
        canvas.width = w;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        var imgBase64 = canvas.toDataURL('image/jpeg', 0.7);
        callback(imgBase64);
      };
      video.onerror = function (e) {
        console.log("excption" + e)
        callback.call(me, undefined, undefined, e);
      };
      video.src = path;
    },

    sendFile(e) {
      var store = this.$store;
      var file = e.target.files[0];
      var localPath = e.target.value

      var key = MessageContentMediaType.File + "-" + LocalStore.getUserId() + "-" + new Date().getTime() + "-" + file.name;
      webSocketCli.getMinioUploadUrl(MessageContentMediaType.File, key).then(data => {
        if (data.code == SUCCESS_CODE) {
          console.log("domain " + data.result.domain + " url " + data.result.url)
          var messageId;
          var fileMessageContent = new FileMessageContent(file, '');
          var message = Message.conert2Message(new SendMessage(null, fileMessageContent));
          var protoMessage = ProtoMessage.convertToProtoMessage(message);
          messageId = protoMessage.messageId
          store.dispatch('preAddProtoMessage', protoMessage);


          fetch(data.result.url, {
            method: 'PUT',
            body: file
          }).then(() => {
            var remotePath = data.result.domain + "/" + key;
            console.log("remote path " + remotePath)
            var message = new FileMessageContent(file, remotePath);
            store.dispatch('updateSendMessage', {messageId: messageId, messageContent: message})
          }).catch((e) => {
            console.error(e);
          });
        }
      })

      this.$refs.uploadFile.value = null;
    },

    // 按回车发送信息
    sendMessage(e) {
      console.log("send code " + e.keyCode);
      if (e.keyCode === 13) {
        this.send();
        //阻止回车换行
        e.preventDefault();
      }

    },

    // 点击关闭emojiBox
    // 选择表情包
    clickemojiBox(item) {
      console.log(item);
      // 使用正则表达式移除包裹图片的 <p> 标签
      this.content = this.content.replace(/<\/?p>/g, '');
      this.content += `<img src="/static/emoji/${item.file}" alt="${item.code}" style="vertical-align: middle; width: 24px; height: 24px"/>`;
      console.log(this.content)
      // this.content += item.code;
      // this.showEmoji = false;
    },

    newline(e) {
      this.content = this.content + '\n';
      e.preventDefault();
    },

    onBlur() {
      console.log('send text onblur');
    },

    onFocus() {
      console.log('send text onfoucs');
      this.$store.dispatch('clearUnreadStatus', '');
    },
    // 点击发送按钮发送信息
    send() {
      console.log("send selectFriendId ：" + this.selectFriendId);
      console.log("send message " + this.content);
      // 将图片换成属性值

      //去掉<p>和</p> 标签
      // this.content = this.content.replace(/<p>/g, '').replace(/<\/p>/g, '');
      // 使用插件的api进行获取输入内容
      // this.content = this.$refs.text.quill.getText();
      // console.log("content " + this.content)

      if (this.content.length < 1) {
        this.warn = true
        this.content = ''
        setTimeout(() => {
          this.warn = false;
        }, 1000)
      } else {
        //进行消息类型包装
        var textMessageContent = new TextMessageContent(this.content);
        // textMessageContent.type = 6
        console.log(new TextMessageContent(this.content));
        console.log(new SendMessage(null, textMessageContent));
        this.sendMessageToStore(new SendMessage(null, textMessageContent));
        this.content = '';
        // this.$refs.text.focus();
        // 请求聊天方法  聊天类型 见SOCIALIZECHATTYPE   文字：0  表情：1
        // this.sendMsg(1);

      }
    },
    // 请求聊天方法
    sendMsg(value) {
      console.log(MsgId.C2S_CHAT_REQ, '请求聊天');
      // 请求聊天信息
      let InfoReq = new Chat.default.C2SSocializeChatReq();
      // 封装聊天信息
      InfoReq.setChanneltype(5);// 聊天渠道类型
      InfoReq.setGroupid('');// 群聊的群id
      // InfoReq.setTargetroleid(this.$store.state.userId);// 登录角色id
      InfoReq.setTargetroleid(this.$store.state.selectFriendId);// 目标角色id
      InfoReq.setText(this.content);// 文本信息
      InfoReq.setVoiceid('');// 语音id
      InfoReq.setVoiceduration('');// 语音时长
      InfoReq.setChatType(value);// 聊天类型 见SOCIALIZECHATTYPE   文字：0  表情：1
      // 序列化
      const bytes = InfoReq.serializeBinary();

      // console.log("请求信息 data:", bytes);

      // 反序列化
      const userDeserialized = Chat.default.C2SSocializeChatReq.deserializeBinary(bytes);
      console.log("请求好友聊天信息 data:", JSON.stringify(userDeserialized.toObject()));

      jsCallUE(MsgId.C2S_FRIEND_LIST_REQ, bytes);
    },
    //发送语音聊天
    async sendAudio() {
      if(this.camStatus === 'starting'){
        return;
      }
      // 创建 TRTC 实例
      this.trtc = TRTC.create();

      // const userSigGenerator = new LibGenerateTestUserSig(this.sdkAppId, this.sdkSecretKey, 604800);
      // this.userSig = userSigGenerator.genTestUserSig(this.userId);
      // 生成健全的 userSig
      const {sdkAppId, userSig} = genTestUserSig({
        sdkAppId: this.sdkAppId,
        userId: this.userId,
        sdkSecretKey: this.sdkSecretKey,
      });
      // 进入房间
      try {
        await this.trtc.enterRoom({
          roomId: this.roomId,
          sdkAppId: parseInt(sdkAppId, 10),
          userId: this.userId,
          userSig: userSig,
        });
        console.log('enter room successfully');
      } catch (error) {
        console.error('failed to enter room ' + error);
      }

      this.camStatus = 'starting';
      // 打开/关闭麦克风
      await this.trtc.startLocalAudio({
        option: {
          microphoneId: this.microphoneId,
        },
      }).then(() => {
        // this.$store.state.showAudioBox = true;
        this.showAudioCallBox = true;
        this.waitingMsg = true;
        this.rejectCall = false;
        this.acceptCall = false;
        this.hangUpCall = false;
        this.cancelCall = true;
        // this.initCallUserInfo(this.$store.state.selectTarget);
        this.isAudioOnly = true;
        // this.voipClient.startCall(this.$store.state.selectTarget, this.isAudioOnly);
        this.isMutedAudio = false;
        this.micStatus = 'started';
        this.trtc.on(TRTC.EVENT.REMOTE_AUDIO_AVAILABLE, event => {
          // // 当你需要播放远端音频时调用该api
          // this.trtc.muteRemoteAudio(event.userId, false);
          // // 停止远端音频
          // this.trtc.muteRemoteAudio(event.userId, true);
        });
      });
    },



    //发送视频聊天
    async sendVideo() {
      if(this.camStatus === 'starting'){
        return;
      }
      if (this.isSingleConversation) {
        // 创建 TRTC 实例
        this.trtc = TRTC.create();

        // 生成健全的 userSig
        const {sdkAppId, userSig} = genTestUserSig({
          sdkAppId: this.sdkAppId,
          userId: this.userId,
          sdkSecretKey: this.sdkSecretKey,
        });
        // 进入房间
        try {
          await this.trtc.enterRoom({
            roomId: this.roomId,
            sdkAppId: parseInt(sdkAppId, 10),
            userId: this.userId,
            userSig: userSig,
          });
          console.log('enter room successfully');
        } catch (error) {
          console.error('failed to enter room ' + error);
        }
        this.camStatus = 'starting';
        await this.trtc.startLocalAudio({
          option: {
            microphoneId: this.microphoneId,
          },
        });
        this.isMutedAudio = false;
        this.micStatus = 'started';
        await this.trtc.startLocalVideo({
          view: 'wxCallLocalVideo',
          option: {
            cameraId: this.cameraId,
            profile: '1080p',
          },
        }).then(()=>{
          this.acceptVideoCall();
        });

      } else {
        this.$store.state.groupOperateState = 4;
        //触发groupMap以是vue相应变更
        this.$store.state.groupMemberTracker += 1;
        this.$store.state.showCreateGroupDialog = true;
      }

    },
    // 接通视频通话回调函数
    async acceptVideoCall() {
      this.showCallBox = true;
      this.rejectCall = false;//拒绝来电
      this.acceptCall = false;//接受来电
      this.hangUpCall = false;//挂断电话
      this.cancelCall = true;//取消电话
      // this.initCallUserInfo(this.$store.state.selectTarget);
      // this.voipClient.startCall(this.$store.state.selectTarget, this.isAudioOnly);
      // this.showCallRemoteVideo = true;//显示对方视频
      this.showCallRemoteImg = false;//显示对方图片
      this.showCallTips = true;//显示通话提示
      this.videoTextCallTips = "正在接通，请稍候...";//通话提示
      // 在进入房间之前，监听 TRTC.EVENT.REMOTE_VIDEO_AVAILABLE 事件，以接收所有远端用户视频发布事件。
      this.trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, this.handleRemoteVideoAvailable);

    },
    // 接通视频通话
    async handleAccept() {
      // 创建 TRTC 实例
      this.trtc = TRTC.create();
      // 生成健全的 userSig
      const {sdkAppId, userSig} = genTestUserSig({
        sdkAppId: this.sdkAppId,
        userId: this.userId,
        sdkSecretKey: this.sdkSecretKey,
      });
      // 进入房间
      try {
        await this.trtc.enterRoom({
          roomId: this.roomId,
          sdkAppId: parseInt(sdkAppId, 10),
          userId: this.userIds,
          userSig: userSig,
        });
        console.log('enter room successfully');
      } catch (error) {
        console.error('failed to enter room ' + error);
      }
      this.camStatus = 'starting';
      await this.trtc.startLocalAudio({
        option: {
          microphoneId: this.microphoneId,
        },
      });
      this.isMutedAudio = false;
      this.micStatus = 'started';
      await this.trtc.startLocalVideo({
        view: 'wxCallLocalVideo',
        option: {
          cameraId: this.cameraId,
          profile: '1080p',
        },
      }).then(()=>{


      });
    },
    // 处理远程视频可用
    handleRemoteVideoAvailable(event) {
      const { userId, streamType } = event;
      console.log(streamType,"+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
      this.showCallBox = false;
      this.$store.state.showChatBox = true;
      this.showCallLocalVideo = true;
      try {
        if (streamType === TRTC.TYPE.STREAM_TYPE_MAIN) {
          this.$nextTick(async () => {
            await this.trtc.startRemoteVideo({ userId, streamType, view: `wxCallRemoteVideo` });
          });
        } else {
          this.$nextTick(async () => {
            await this.trtc.startRemoteVideo({ userId, streamType, view: `wxCallRemoteVideo` });
          });
        }
      } catch (error) {

      }
    },






    initCallUserInfo(target) {
      var portrait = this.getUserPortrait(target);
      if (portrait) {
        this.callRemoteImg = portrait;
      }
      this.callLocalImg = this.$store.state.user.img;
      this.callDisplayName = this.getDisplayName(target);
    },
    getUserPortrait(target) {
      var userInfo = this.userInfoList.find(userInfo => userInfo.uid == target);
      if (userInfo) {
        return userInfo.portrait;
      }
      return null;
    },
    getDisplayName(target) {
      var userInfo = this.userInfoList.find(userInfo => userInfo.uid == target);
      return userInfo.displayName;
    },
    hangUp() {
      // this.voipClient.cancelCall();
      this.cancel();
    },
    reject() {
      this.voipClient.cancelCall();
    },
    accept() {
      this.rejectCall = false;
      this.acceptCall = false;
      this.hangUpCall = true;
      this.voipClient.answerCall(this.isAudioOnly);
    },
    async cancel() {
      // 关闭显示框
      // this.voipClient.cancelCall();
      this.$store.state.showAudioBox = false;
      this.$store.state.showChatBox = false;
      this.showCallBox = false;
      this.showAudioCallBox = false;
      this.waitingMsg = false;
      this.rejectCall = false;
      this.acceptCall = false;
      this.hangUpCall = false;
      this.cancelCall = false;
      this.isAudioOnly = false;
      this.showCallBtn = false;
      this.showCallRemoteVideo = false;//显示对方视频
      this.showCallRemoteImg = false;//显示对方图片
      this.showCallTips = false;//显示通话提示
      // 关闭音频检测
      this.stopGetAudioLevel();
      await this.trtc.stopLocalAudio();
      await this.trtc.stopLocalVideo();
      await this.trtc.stopScreenShare();
      this.camStatus = 'stopped';
      // 退出房间
      await this.trtc.exitRoom();
      // 被销毁的 trtc 实例无法再次使用，需要创建一个新的实例。
      this.trtc.destroy();
    },
    stopGetAudioLevel() {
      this.trtc && this.trtc.enableAudioVolumeEvaluation(-1);
    },
    async muteVideo() {
      try {
        await this.trtc.updateLocalVideo({ mute: true });
        this.isMutedVideo = true;
      } catch (error) {

      }
    },

    async muteAudio() {
      try {
        await this.trtc.updateLocalAudio({ mute: true });
        this.isMutedAudio = true;
      } catch (error) {

      }
    },

    async unmuteVideo() {
      try {
        await this.trtc.updateLocalVideo({ mute: false });
        this.isMutedVideo = false;
      } catch (error) {

      }
    },

    async unmuteAudio() {
      try {
        await this.trtc.updateLocalAudio({ mute: false });
        this.isMutedAudio = false;
      } catch (error) {

      }
    },

    sendMessageToStore(sendMessage) {
      // let chatHistoryData = {
      //   errCode:1,
      //   total_num:0,
      //   start_index:1,
      //   count:1,
      //   ChatHistoryItem:{
      //     fromRole:  "123456",
      //     content:  "发送的信息",
      //   }
      // };
      // 将封装的信息发送到store中
      // let sendata ={
      //   target: null,
      //   messageContent: {
      //     mentionedType: 0,
      //     mentionedTargets: [
      //
      //   ],
      //     type: 1,
      //     content: "<p>89</p>"
      // },
      //   tos: ""
      // }
      // sendMessage.target =4;
      console.log('sendMessage:', JSON.stringify(sendMessage))
      this.$store.dispatch('sendMessage', sendMessage)
    }
  },
  // 在进入的时候 聚焦输入框
  mounted() {
    // 初始化富文本编辑器样式修改
    document.getElementById('sendText').querySelector('.ql-hidden').style.display = 'none';
    document.getElementById('sendText').querySelector('.ql-editor').style.paddingTop = 0;
    document.getElementById('sendText').querySelector('.ql-editor').style.width = '100%';
    document.getElementById('sendText').querySelector('.ql-editor').style.overflow = 'auto';
    // 获取 Quill 的根 DOM 元素
    const editorElement = document.querySelector('#sendText .ql-editor');
    // 直接移除 placeholder 属性
    editorElement.removeAttribute('data-placeholder');


    var sessionCallback = new SessionCallback();
    var engineCallback = new EngineCallback();
    engineCallback.onReceiveCall = session => {
      this.isAudioOnly = session.audioOnly;
      console.log("receive isAudioOnly " + session.audioOnly);
      if (!this.isAudioOnly) {
        this.$store.state.showChatBox = true;
        this.videoTextCallTips = '对方邀请您进行视频通话';
        this.rejectCall = true;
        this.cancelCall = false;
        this.acceptCall = true;
        this.hangUpCall = false;
        this.showCallLocalImg = true;
        this.showCallLocalVideo = false;
        this.showCallRemoteImg = true;
        this.showCallRemoteVideo = false;
        this.showCallTips = true;
        this.initCallUserInfo(session.clientId);
      } else {
        this.$store.state.showAudioBox = true;
        this.waitingMsg = true;
        this.waitingMsgTips = '对方邀请你进行语音通话';
        this.rejectCall = true;
        this.acceptCall = true;
        this.cancelCall = false;
        this.hangUpCall = false;
        this.initCallUserInfo(session.clientId);
      }

      //取消textarea焦点聚焦
      try {
        document.getElementById('sendText').blur();
      } catch (error) {
        console.error("get sendText error " + error);
      }
    }

    engineCallback.shouldStartRing = isIncomming => {
      if (isIncomming) {
        this.inCommingNotify.loopPlay()
      } else {
        this.outGoingNotify.loopPlay();
      }
    }

    engineCallback.shouldSopRing = () => {
      this.inCommingNotify.stopPlay();
      this.outGoingNotify.stopPlay();
    }

    sessionCallback.didChangeState = state => {
      if (state === CallState.STATUS_CONNECTED) {
        if (this.isAudioOnly) {
          this.cancelCall = false;
          this.rejectCall = false;
          this.acceptCall = false;
          this.hangUpCall = true;
          this.waitingMsg = false;
        } else {
          this.cancelCall = false;
          this.acceptCall = false;
          this.rejectCall = false;
          this.hangUpCall = true;
        }
        this.showTalkTime = true;
        this.talkTimerInterval = setInterval(() => {
          this.talkInterval += 1;
          var min = Math.floor(this.talkInterval / 60 % 60);
          var sec = Math.floor(this.talkInterval % 60);
          sec = sec < 10 ? "0" + sec : sec;
          min = min < 10 ? "0" + min : min;
          this.talkTime = min + ":" + sec;
        }, 1000)
      }
    }

    sessionCallback.didReceiveRemoteAudioTrack = stream => {
      document.getElementById("wxCallRemoteAudio").srcObject = stream;
    }

    sessionCallback.didCallEndWithReason = callEndReason => {
      if (this.isAudioOnly) {
        this.$store.state.showAudioBox = false;
      } else {
        this.$store.state.showChatBox = false;
      }
      if (this.talkTimerInterval) {
        this.showTalkTime = false;
        this.talkInterval = 0;
        clearInterval(this.talkTimerInterval);
      }
    }

    sessionCallback.didCreateLocalVideoTrack = (stream) => {
      this.showCallLocalImg = false;
      this.showCallLocalVideo = true;
      document.getElementById("wxCallLocalVideo").srcObject = stream;
    }

    sessionCallback.didReceiveRemoteVideoTrack = stream => {
      this.showCallRemoteImg = false;
      this.showCallTips = false;
      this.showCallRemoteVideo = true;
      document.getElementById("wxCallRemoteVideo").srcObject = stream;
    }
    this.voipClient = this.$store.state.voipClient;
    this.voipClient.setCurrentSessionCallback(sessionCallback);
    this.voipClient.setCurrentEngineCallback(engineCallback);

    var _this = this
    document.getElementById('sendText').addEventListener('paste', function (e) {
      var cbd = e.clipboardData;
      var ua = window.navigator.userAgent;
      // 没有数据
      if (!(e.clipboardData && e.clipboardData.items)) {
        return;
      }
      // Mac平台下Chrome49版本以下 复制Finder中的文件的Bug Hack掉
      if (cbd.items && cbd.items.length === 2 && cbd.items[0].kind === "string" && cbd.items[1].kind === "file" &&
        cbd.types && cbd.types.length === 2 && cbd.types[0] === "text/plain" && cbd.types[1] === "Files" &&
        ua.match(/Macintosh/i) && Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49) {
        return;
      }
      for (var i = 0; i < cbd.items.length; i++) {
        var item = cbd.items[i];
        var blob;
        if (item.kind == "file") {
          blob = item.getAsFile();
          if (blob.size === 0) {
            return;
          }
          // 插入图片记录
          _this.sendImage(blob)

        }
      }
    });
  },
  watch: {
    // 在选择其它对话的时候 聚焦输入框
    selectId() {
      setTimeout(() => {
        // this.$refs.text.focus()
      }, 0)
    },
    // 当输入框中的值为空时 弹出提示  并在一秒后消失
    content() {
      if (this.content === '') {
        this.$refs.sendBtn.style.background = "#f5f5f5";
        this.$refs.sendBtn.style.color = '#7c7c7c';
        this.sendBtnDisabled = true;
      } else {
        this.$refs.sendBtn.style.background = "rgb(18,150,17)";
        this.$refs.sendBtn.style.color = '#fff';
        this.sendBtnDisabled = false;
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.text
  position: relative
  height: 25%
  //background: #fff

  .emoji
    position: relative
    width: 100%
    height: 20%
    line-height: 40px
    font-size: 12px
    padding: 0 30px
    box-sizing: border-box
    color: #7c7c7c

    i
      font-size: 20px;
      margin-right: 10px;
      cursor: pointer
      position: relative

      &:hover
        color: #1aad19

    input
      opacity: 0;
      height: 100%;
      width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 11;
      font-size: 0;
      cursor: pointer;

    .emojiBox
      position: absolute
      display: flex
      flex-wrap: wrap
      top: -210px
      left: -100px
      width: 300px
      height: 200px
      padding: 5px
      background-color: #fff
      border: 1px solid #d1d1d1
      border-radius: 2px
      box-shadow: 0 1px 2px 1px #d1d1d1

      &.showbox-enter-active, &.showbox-leave-active
        transition: all .5s

      &.showbox-enter, &.showbox-leave-active
        opacity: 0

    .chat-modal
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 1001;
      -webkit-overflow-scrolling: touch;
      outline: 0;
      overflow: hidden;
      margin: 30 /@rate auto;
      background-color: rgba(0, 0, 0, .3);

      .chat-box
        position: relative;
        left: 50%;
        top: 5%;
        transform: translate(-50%, 0);
        padding: 50 /@rate 40 /@rate;
        background: #fff;
        height: 800px;
        width: 480px;

        .video-local
          width: 50px;
          height: 100px;
          vertical-align: middle;

        .video-remote
          width: 480px;
          height: 800px;
          vertical-align: middle;

    .btnopacity:hover
      opacity: .8

    .callContent
      .callercontent
        width: 664px;
        height: 380px;
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        top: 10;
        bottom: 0;
        z-index: 2000

      .callercontent video
        width: 100%;
        background: #000

      .callercontent.callnone
        display: none

      .callercontent.callshow
        display: block

      .left-big-content
        width: 480px;
        //height: 360px;
        position: absolute;
        left: 0;
        top: 0

      .left-big-content .bigavatar
        width: 100%;
        height: 100%;
        filter: blur(6px)

      .left-big-content video
        width: 100%;
        height: 100%;
        background: #000

      .right-sml-content
        width: 160px;
        height: 120px;
        box-shadow: 0 6px 20px 0 rgba(48, 52, 58, 0.5);
        border-radius: 4px;
        position: absolute;
        right: 0;
        bottom: 0

      .right-sml-content .bigavatar
        width: 100%;
        height: 100%;
        border-radius: 4px

      .opera-content
        padding: 10px 16px;
        box-shadow: 0 6px 20px 0 rgba(48, 52, 58, 0.5);
        height: 56px;
        width: 480px;
        background: #fff;
        position: absolute;
        bottom: 0;
        left: 0

      .opera-content .calleravatar
        width: 36px;
        height: 36px;
        margin-right: 16px;
        flex-shrink: 0;
        border-radius: 100%

      .opera-content .callnick
        color: #30343a

      .opera-content .operabtn
        width: 72px;
        height: 32px;
        border-radius: 6px;
        color: #fff;
        text-align: center;
        font-size: 12px;
        line-height: 32px;
        cursor: pointer

      .opera-content .canclecall
        background: #ff6161

      .opera-content .canclecall .iconfont
        color: #fff;
        font-size: 16px;
        margin-right: 8px

      .opera-content .upcall
        margin-left: 16px;
        background: #39ba70

      .calltips
        position: absolute;
        margin: auto;
        text-align: center;
        color: #fff;
        font-size: 16px;
        z-index: 10;
        left: 0;
        right: 0;
        top: 0;
        bottom :300px;
        line-height : 300px;
      .flexshrink
        flex-shrink: 0

      .iconfull
        margin-left: 16px;
        font-size: 16px;
        cursor: pointer

      .screenbtn
        background: #fff;
        border: 0

      .talktime span
        font-size: 12px;
        color: #30343a;
        margin-left: 8px;
        margin-right: 16px

      .flexbox
        display: flex;
        align-items: center

      .flexauto
        flex: 1

    .audioContent
      .flexbox
        display: flex;
        align-items: center

      .callshow
        display: block

      .audioBody
        width: 280px;
        height: 344px;
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        top: 10;
        bottom: 0;
        z-index: 2000;
        border-radius: 3px

      .audioBody .audioBg
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        border-radius: 3px

      .audioBody .audioBg .callavatar
        width: 100%;
        height: 100%;
        filter: blur(4px)

      .audioBody .audioBg .blackbg
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 5;
        top: 0;
        left: 0;
        background: #000;
        opacity: .5

      .audioBody .audiomain
        position: relative;
        z-index: 6;
        text-align: center;
        color: #fff

      .audioBody .audiomain .audio-avatar
        width: 73px;
        height: 73px;
        position: relative;
        border-radius: 50%;
        overflow: hidden;
        margin-top: 64px;
        margin-bottom: 12px

      .audioBody .audiomain .callnick
        font-size: 16px;
        line-height: 22px

      .audioBody .audiomain .call-time
        line-height: 20px;
        margin-top: 4px

      .audioBody .audiomain .call-opera
        justify-content: center

      .audioBody .audiomain .call-opera span
        width: 96px;
        height: 32px;
        margin: 66px 12px 0;
        line-height: 32px;
        border-radius: 6px;
        cursor: pointer

      .audioBody .audiomain .call-opera span .iconfont
        &:hover
          pointer-events: none
        font-size: 16px;
        margin-right: 8px

      .audioBody .audiomain .call-opera .nomuted
        border: 1px solid #fff

      .audioBody .audiomain .call-opera .muted
        background: #fff;
        color: #30343a

      .audioBody .audiomain .call-opera .cancleaudio
        background: #ff6161

      .audioBody .audiomain .call-opera .callercanle
        width: 128px

      .audioBody .loadingcall
        justify-content: center

      .audioBody .loadingcall .upcall
        background: #39ba70

  textarea
    box-sizing: border-box
    padding: 0 30px
    height: 74%
    width: 100%
    border: none
    outline: none
    font-family: "Micrsofot Yahei"
    font-size: 13px
    resize: none
    color: #ffffff

  .send
    position: absolute
    bottom: 10px
    right: 30px
    width: 75px
    height: 28px
    line-height: 28px
    box-sizing: border-box
    text-align: center
    //border: 1px solid #e5e5e5
    border-radius: 3px
    background: #f5f5f5
    font-size: 12px
    color: #7c7c7c

    &:hover
      background: rgb(18, 150, 17)
      color: #fff
      cursor: pointer

  .warn
    position: absolute
    bottom: 50px
    right: 10px
    width: 110px
    height: 30px
    line-height: 30px
    font-size: 12px
    text-align: center
    border: 1px solid #bdbdbd
    border-radius: 4px
    box-shadow: 0 1px 5px 1px #bdbdbd

    &.appear-enter-active, &.appear-leave-active
      transition: all 1s

    &.appear-enter, &.appear-leave-active
      opacity: 0

    &:before
      content: " "
      position: absolute
      top: 100%
      right: 20px
      border: 7px solid transparent
      border-top-color: #fff
      filter: drop-shadow(1px 3px 2px #bdbdbd)

  .disable
    pointer-events: none;

</style>
<style lang="css" scoped>
/* 确保编辑器容器高度 */
::v-deep .ql-editor {

}

.editor-container {
  width: 100%;
  overflow: auto;
}
.wxCallBox{
  position: absolute;
  left: 20%;
  bottom: 0;
  width: 300px;
  height: 500px;
  background-color: #000000;
  border-radius: 4px;
  z-index: 9999;
  transition: all .5s;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
  .callbtnBox{
    width: 100%;
    position: absolute;
    bottom: 4rem;
    display: flex;
    justify-content: space-evenly;
    .activeBtn{
      width: 3rem;
      height: 3rem;
      //background: #eeeeee;
      border-radius: 50%;
      //border: 1px solid #e5e5e5;
      background-color: rgba(255, 255, 255, 0.5); /* 70% 不透明度 */
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all .3s;
      &:hover{
        //background: #f1f1f1;
        border: 1px solid #f1f1f1;
      }
      img {
        width: 1.8rem;
        height: 1.8rem;
        cursor: pointer;
      }
    }
  }
}
.btnBox{
  width: 100%;
  position: absolute;
  bottom: 4rem;
  display: flex;
  justify-content: space-evenly;
  .activeBtn{
    width: 3rem;
    height: 3rem;
    //background: #eeeeee;
    border-radius: 50%;
    //border: 1px solid #e5e5e5;
    background-color: rgba(255, 255, 255, 0.5); /* 70% 不透明度 */
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all .3s;
    &:hover{
      //background: #f1f1f1;
      border: 1px solid #f1f1f1;
    }
    img {
      width: 1.8rem;
      height: 1.8rem;
      cursor: pointer;
    }
  }
}


</style>
