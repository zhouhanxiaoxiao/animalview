<template>
  <div style="width: 90%; margin-left: 5%">
    <a-comment>
      <a-avatar
          slot="avatar"
          :src="userHeadSrc"
          :alt="userName"
      />
      <div slot="content">
        <a-form-item>
          <a-textarea placeholder="例：实验是否进行的顺利？是否有需要改进？是否想说点什么？实验结果相当满意！" :rows="4" v-model="value"/>
        </a-form-item>
        <a-form-item>
          <a-button html-type="submit"
                    :loading="submitting"
                    :disabled="this.value.length == 0"
                    type="primary" @click="handleSubmit('new')">
            说点什么...
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
            {{ item.comments }}
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
              {{ reply.comments }}
            </p>
          </a-comment>
        </a-comment>
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import {formatDate} from "@/components/publib/date";

export default {
  name: "askStep4",
  props :{
    taskId : String
  },
  data : function (){
    return{
      comments: [],
      submitting: false,
      value: '',
      replayId :"",
      replayText : ""
    }
  },
  mounted() {
    this.initPage();
  },
  methods : {
    initPage : function (){
      var _this = this;
      this.$axios.post("/about/suggest",{flag :this.taskId}).then(function (res){
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
        flag : this.taskId
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
    longToStr : function (date) {
      var d = new Date(date)
      return formatDate(d,"yyyy-MM-dd hh:mm:ss");
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
  },
  watch :{
    taskId(){
      this.initPage();
    }
  }
}
</script>

<style scoped>

</style>