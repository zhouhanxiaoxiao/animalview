<template>
  <div>
    <top-nav></top-nav>
    <div class="about-container">
      <a-comment>
        <a-avatar
            slot="avatar"
            :src="userHeadSrc"
            :alt="userName"
        />
        <div slot="content">
          <a-form-item>
            <a-textarea :rows="4" v-model="value"/>
          </a-form-item>
          <a-form-item>
            <a-button html-type="submit"
                      :loading="submitting"
                      :disabled="this.value.length == 0"
                      type="primary" @click="handleSubmit('new')">
              Add Comment
            </a-button>
          </a-form-item>
        </div>
      </a-comment>
      <a-list
          v-if="comments.length"
          :data-source="comments"
          :header="`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`"
          item-layout="horizontal"
      >
        <a-list-item slot="renderItem" slot-scope="item">
          <a-comment
              :author="item.user.name"
              :datetime="longToStr(item.createtime)"
              style="width: 100%"
          >
            <span slot="actions" key="comment-nested-reply-to"
                  @click="replayId=item.id">Reply to</span>
            <a-avatar
                slot="avatar"
                :src="getUserHeadSrc(item.user.id)"
                :alt="item.user.name"
            />
            <div slot="content" style="width: 100%">
              {{item.comments}}
              <div v-if="replayId == item.id" style="width: 100%">
                <a-form-item>
                  <a-textarea :rows="4" v-model="replayText"/>
                </a-form-item>
                <a-form-item>
                  <a-button html-type="submit"
                            :loading="submitting" type="primary"
                            :disabled="replayText.length == 0"
                            @click="handleSubmit('old')">
                    add reply
                  </a-button>
                </a-form-item>
              </div>
            </div>
            <a-comment v-for="reply in item.replys" :key="reply.id"
                       :author="reply.user.name"
                       :datetime="longToStr(reply.createtime)"
                       style="width: 100%"
            >
              <a-avatar
                  slot="avatar"
                  :src="getUserHeadSrc(reply.user.id)"
                  :alt="reply.user.name"
              />
              <p slot="content">
                {{reply.comments}}
              </p>
            </a-comment>
          </a-comment>
        </a-list-item>
      </a-list>
    </div>
  </div>
</template>
<script>
import TopNav from "@/components/publib/TopNav";
import moment from 'moment';
import {formatDate} from "@/components/publib/date";
export default {
  name: "about",
  components: {TopNav},
  data:function (){
    return {
      comments: [],
      submitting: false,
      value: '',
      moment,
      replayId : "",
      replayText : "",
    }
  },
  beforeMount() {
    this.initPage();
  },
  methods:{
    initPage : function (){
      var _this = this;
      this.$axios.post("/about/suggest",{flag :"system"}).then(function (res){
        console.log(res);
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.comments = res.data.retMap.comments;
        }
      }).catch(function (res){
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })
    },
    longToStr : function (date) {
      var d = new Date(date)
      return formatDate(d,"yyyy-MM-dd hh:mm:ss");
    },
    handleSubmit(flag) {
      this.submitting = true;
      var com = "";
      if (flag == "new"){
        this.replayId = "";
        com = this.value;
      }else {
        com = this.replayText;
      }
      var postData = {
        comment : com,
        replayId : this.replayId,
        flag : "system"
      }
      var _this = this;
      this.$axios.post("/about/suggest/commit",postData).then(function (res){
        console.log(res);
        _this.submitting = false;
        if (res.data.code != "200"){
          _this.$message.error(_this.$t(res.data.code));
        }else {
          _this.$message.success(_this.$t("commitSucc"));
          _this.value = "";
          _this.initPage();
        }
      }).catch(function (res){
        _this.submitting = false;
        console.log(res);
        _this.$message.error(_this.$t("systemErr"));
      })

    },
    handleChange(e) {
      this.value = e.target.value;
    },
    getUserHeadSrc(userId){
      return this.$axios.defaults.baseURL + 'user/userHead/' + userId + '.png';
    }
  },
  computed:{
    userId : function (){
      return this.$store.getters.getUser.id;
    },
    userHeadSrc : function (){
      return this.$axios.defaults.baseURL + 'user/userHead/' + this.userId + '.png';
    },
    userName : function (){
      return this.$store.getters.getUser.name
    }
  }
}
</script>

<style scoped>
  .about-container{
    text-align: left;
    margin-top: 100px;
    background-color: white;
    width: 90%;
    margin-left: 5%;
    min-height: 500px;
    border-radius: 5px;
    padding: 20px 20px;
  }
</style>