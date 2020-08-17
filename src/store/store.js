import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex);

export default new Vuex.Store({
    state:{
        user:{}
    },
    mutations:{
        saveUser(state,user){
            state.user = user;
        },
    },
    getters : {
        getUser(state){
            return state.user;
        },
        isResearcher(state){
            for (var i = 0;i<state.user.roles.length;i++){
                var role = state.user.roles[i];
                if (role.roletype == "999999" || role.roletype == "01"){
                    return true;
                }
            }
            return false;
        },
        isFeeder(state){
            for (var i = 0;i<state.user.roles.length;i++){
                var role = state.user.roles[i];
                if (role.roletype == "999999" || role.roletype == "02"){
                    return true;
                }
            }
            return false;
        },
        isAdmin(state){
            for (var i = 0;i<state.user.roles.length;i++){
                var role = state.user.roles[i];
                if (role.roletype == "999999"){
                    return true;
                }
            }
            return false;
        },
        isOther(state){
            for (var i = 0;i<state.user.roles.length;i++){
                var role = state.user.roles[i];
                if (role.roletype == "999999" || role.roletype == "09"){
                    return true;
                }
            }
            return false;
        },
        isCurrentUser:(state) => (id) => {
            if (state.user.id == id){
                return true;
            }
            for (var i = 0;i<state.user.roles.length;i++){
                var role = state.user.roles[i];
                if (role.roletype == "999999"){
                    return true;
                }
            }
            return false;
        }
    }
})