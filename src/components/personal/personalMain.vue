<template>
  <div>
    <top-nav></top-nav>
    <div class="main-container">
      <a-layout id="components-layout-demo-top-side">
        <a-layout-content>
          <a-layout style="padding: 24px 0; background: #fff">
            <a-layout-sider width="20%" style="background: #fff;text-align: center">
              <a-menu
                  mode="inline"
                  :default-selected-keys="['1']"
                  v-model="menuId"
                  style="height: 100%"
              >
                <a-menu-item key="1" @click="showContent('1')">
                  {{ $t("accountInfo") }}
                </a-menu-item>
<!--                <a-menu-item key="2" @click="showContent('2')">-->
<!--                  {{ $t("messageInfo") }}-->
<!--                </a-menu-item>-->
                <a-menu-item key="3" @click="showContent('3')" v-if="$store.getters.isAdmin">
                  {{ $t("userManager") }}
                </a-menu-item>
              </a-menu>
            </a-layout-sider>
            <a-layout-content :style="{ padding: '0 24px', minHeight: '280px' }">
              <personal-info v-if="this.menuId == '1'"></personal-info>
              <user-manager v-if="this.menuId == '3'"></user-manager>
            </a-layout-content>
          </a-layout>
        </a-layout-content>
      </a-layout>
    </div>
  </div>
</template>

<script>
import TopNav from "@/components/publib/TopNav";
import PersonalInfo from "@/components/personal/personalInfo";
import UserManager from "@/components/personal/userManager";

export default {
  name: "personalMain",
  components: {UserManager, PersonalInfo, TopNav},
  data() {
    return {
      collapsed: false,
      menuId: '1',
    };
  },
  methods: {
    showContent: function (menuId) {
      this.menuId = menuId;
    }
  },
  computed: {}
}
</script>

<style scoped>
#components-layout-demo-custom-trigger .trigger {
  margin-top: 100px;
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}

#components-layout-demo-custom-trigger .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>