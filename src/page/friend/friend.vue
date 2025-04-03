<template>
  <div class="content">
    <div class="friend-wrapper">
      <search></search>
      <friendlist></friendlist>
    </div>
    <div class="friendinfo">
      <info></info>
    </div>
  </div>
</template>

<script>
import search from '../../components/search/search'
import friendlist from '../../components/friendlist/friendlist'
import info from '../../components/info/info'
import {jsCallUE} from '../../utils/UEmethod'
import MsgId from '../../proto/msgid_pb'
import * as Proto from '../../proto/friend_pb'

export default {
  components: {
    search,
    friendlist,
    info
  },
  mounted() {
    this.init();
  },
  methods: {
// 初始化
    init() {
      // 获取好友列表
      this.getMsgFriendList();

    },
// 请求获取好友列表
    getMsgFriendList(data) {
      console.log(MsgId.C2S_FRIEND_LIST_REQ,'请求获取好友列表Id');
      // 请求好友信息
      let InfoReq = new Proto.default.C2SFriendListReq();
      // 序列化
      const bytes = InfoReq.serializeBinary();

      // console.log("请求好友列表 data:", bytes);

      // 反序列化
      const userDeserialized = Proto.default.C2SFriendListReq.deserializeBinary(bytes);
      console.log("请求好友列表 data:", JSON.stringify(userDeserialized.toObject()));

      jsCallUE(MsgId.C2S_FRIEND_LIST_REQ, bytes);
    }
  }
}
</script>

<style lang="stylus" scoped>
.content {
  display: flex;
  width: 100%;
  height: 100%;

  .friend-wrapper {
    width: 250px;
    //background: #fff
    background-color: rgba(0, 0, 0, 0.5)
  }

  .friendinfo {
    flex: 1
  }
}
</style>
