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
                  v-model="menuId"
                  :multiple="false"
                  style="height: 100%"
              >
                <a-menu-item key="accountInfo">
                  {{ $t("accountInfo") }}
                </a-menu-item>
                <a-menu-item key="userManager" v-if="$store.getters.isAdmin">
                  {{ $t("userManager") }}
                </a-menu-item>
                <a-menu-item key="departmentManager" v-if="$store.getters.isAdmin">
                  {{ $t("departmentManager") }}
                </a-menu-item>
              </a-menu>
            </a-layout-sider>
            <a-layout-content :style="{ padding: '0 24px', minHeight: '280px' }">
              <personal-info v-if="menuId == 'accountInfo'"></personal-info>
              <user-manager v-if="menuId == 'userManager'"></user-manager>
              <department-manager v-if="menuId == 'departmentManager'"></department-manager>
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
import DepartmentManager from "@/components/personal/DepartmentManager";

export default {
  name: "personalMain",
  components: {DepartmentManager, UserManager, PersonalInfo, TopNav},
  data() {
    return {
      collapsed: false,
      menuId: ['accountInfo'],
    };
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