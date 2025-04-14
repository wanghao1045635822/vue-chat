<template>
  <div class="addfrind">
    <el-dialog
      title="添加好友"
      :visible.sync="showSearchFriendDialog"
      width="30%"
      :show-close="true"
      @close="handleClose"
      custom-class="dialogDiv"
      center>

      <el-dialog
        width="30%"
        title="添加好友"
        :visible.sync="innerVisible"
        append-to-body>
        <el-input
          type="textarea"
          :rows="3"
          v-model="friendRequest"></el-input>
        <span slot="footer" class="dialog-footer">
            <el-button size="medium" type="info" plain round @click="innerVisible=false">取 消</el-button>
            <el-button size="medium" type="success" plain round @click="sendFriendRequest">确 定</el-button>
        </span>
      </el-dialog>

      <el-input v-model="friendInput" prefix-icon="el-icon-search" placeholder="请输入手机号码或昵称"
                @keydown.enter.native="searchUser"></el-input>
      <el-table
        :data="searchUsers"
        :show-header="false"
        :fit="true"
        :highlight-current-row="false"
        max-height="300"
        style="width: 100%;margin-top:10px;">
        <el-table-column
          prop="image"
          label="头像"
          width="50"
        >
          <template slot-scope="scope">
            <el-avatar :src="scope.row.portrait"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          width="120">
          <template slot-scope="scope">
            <div>
              <p>{{ scope.row.displayName }}</p>
              <p>{{ scope.row.signature }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="加好友"
          align="right">
          <template slot-scope="scope">
            <i style="cursor: pointer;" class="icon iconfont icon-jiahaoyou" @click="showFriendRequestDialog(scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
      <!-- <span slot="footer" class="dialog-footer">
          <el-button class="search-friend-btn" size="medium" type="info" plain round @click="changeSearchFriendDialog">取 消</el-button>
          <el-button class="search-friend-btn"  size="medium" type="success" plain round @click="changeSearchFriendDialog">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters, mapState} from 'vuex'
import {jsCallUE} from '../../utils/UEmethod'
import MsgId from '../../proto/msgid_pb'
import * as Proto from '../../proto/friend_pb'

export default {
  data() {
    return {
      friendInput: '',
      friendRequest: '',
      currentSearchUser: null,
      innerVisible: false
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      // 获取好友推荐列表
      this.getFriendRecommendList();

    },
    // 请求获取好友推荐列表
    getFriendRecommendList(data) {
      console.log(MsgId.C2S_FRIEND_RECOMMEND_REQ,'请求获取好友推荐列表Id');
      // 请求好友信息
      let InfoReq = new Proto.default.C2SFriendRecommendReq();
      // 序列化
      const bytes = InfoReq.serializeBinary();

      // console.log("请求好友推荐列表 data:", bytes);

      // 反序列化
      const userDeserialized = Proto.default.C2SFriendRecommendReq.deserializeBinary(bytes);
      console.log("请求好友推荐列表 data:", JSON.stringify(userDeserialized.toObject()));

      jsCallUE(MsgId.C2S_FRIEND_RECOMMEND_REQ, bytes);
    },
    changeSearchFriendDialog() {
      this.$store.state.showSearchFriendDialog = false;
    },
    searchUser(e) {
      console.log("search user ");
      if (e.keyCode === 13 && this.friendInput != "") {
        // this.$store.dispatch('searchUser', this.friendInput);
        this.friendInput = '';
      }
    },
    handleClose() {
      // this.$store.dispatch('updateSearchUser', []);
    },
    // 添加好友请求
    sendFriendRequest() {
      this.innerVisible = false;
      // this.$store.dispatch("sendFriendAddRequest", {
      //   reason: this.friendRequest,
      //   targetUserId: this.currentSearchUser.uid
      // });
      console.log(MsgId.C2S_APPLY_FRIEND_REQ,'请求添加好友Id');
      // 请求好友信息
      let InfoReq = new Proto.default.C2SApplyFriendReq();
      InfoReq.setRoleId(this.currentSearchUser.id);
      // 序列化
      const bytes = InfoReq.serializeBinary();

      // console.log("请求好友申请列表 data:", bytes);

      // 反序列化
      const userDeserialized = Proto.default.C2SApplyFriendReq.deserializeBinary(bytes);
      console.log("请求添加好友 data:", JSON.stringify(userDeserialized.toObject()));

      jsCallUE(MsgId.C2S_APPLY_FRIEND_REQ, bytes);



    },
    showFriendRequestDialog(currentSearchUser) {
      this.innerVisible = true;
      this.friendRequest = "我是" + this.$store.state.user.name;
      this.currentSearchUser = currentSearchUser;
    }
  },
  computed: {
    ...mapState([
      'searchUsers',
    ]),
    showSearchFriendDialog: {
      get() {
        return this.$store.state.showSearchFriendDialog;
      },
      set(val) {
        this.$store.state.showSearchFriendDialog = val;
      }
    }
  }
}
</script>

<style scoped>
.addfrind .icon {
  display: inline-block;
  font-size: 26px;
  color: rgb(0, 220, 65);
}

.layout-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column
}

.el-dialog__wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-friend-btn {
  width: 50%;
  height: 35px;
}

.el-table::before{
  height: 0;
}
</style>

