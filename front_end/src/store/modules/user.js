import Vue from 'vue'
import router from '@/router'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { message } from 'ant-design-vue'
import {
    loginAPI,
    registerAPI,
    getUserInfoAPI,
    updateUserInfoAPI,
    getUserCreditRecordsAPI,
    chargeCreditAPI,
    addCommentAPI,
    getCommentsByUserIdAPI,
    registerVIPAPI,
    getVIPInfoByUserIdAPI,
} from '@/api/user'

import {
    getUserOrdersAPI,
    cancelOrderAPI,
    getOrderByIdAPI,
    endOrderAPI,
} from '@/api/order'
const getDefaultState = () => {
    return {
        userId: '',
        userInfo: {

        },
        userOrderList: [

        ],
        checkOrderModalVisible: false,
        creditRecordVisible: false,
        evaluationVisible:false,
        // vipRegisterVisible: false,
        userOrder:[

        ],
        userCreditRecord:[

        ],
        comments:[

        ],
        vipInfo:{

        },

    }
}

const user = {
    state : getDefaultState(),

    mutations: {
        reset_state: function(state) {
            state.token = '',
            state.userId = '',
            state.userInfo = {
                
            },
            state.userOrderList = [],
            state.userOrder=[],
            //add on 5.8
            state.checkOrderModalVisible=false;//add on 5.8;
            // state.vipRegisterVisible=false;
            state.vipInfo={

            }
        },
        set_token: function(state, token){
            state.token = token
        },
        set_email: (state, data) => {
            state.email = data
        },
        set_userId: (state, data) => {
            state.userId = data
        },
        set_userInfo: (state, data) => {
            state.userInfo = {
                ...state.userInfo,
                ...data
            }
        },
        set_userOrderList: (state, data) => {
            state.userOrderList = data
        },
        //change on 5.8
        set_userOrderById:(state,data)=>{
            state.userOrder=[]
            state.userOrder.push(data)
        },
        set_checkOrderModalVisible:(state, data)=> {
            state.checkOrderModalVisible = data//add on 5.8
        },
        set_vipRegisterVisible:(state,data)=>{
            state.vipRegisterVisible=data
        },
        set_userCreditRecord: (state,data) => {//?????????????????????
            state.userCreditRecord=data
        },
        set_creditRecordVisible:(state,data)=>{
            state.creditRecordVisible=data
        },
        set_comments:(state,data)=>{
            state.comments=data
        },
        set_vipInfo:(state,data)=>{
            state.vipInfo=data
        },
        set_evaluationVisible:(state,data)=>{
            state.evaluationVisible=data
        },
    },

    actions: {
        login: async ({ dispatch, commit }, userData) => {
            const res = await loginAPI(userData)
            if(res){
                setToken(res.id)
                commit('set_userId', res.id)
                dispatch('getUserInfo')
                router.push('/hotel/hotelList')
            }
        },
        register: async({ commit }, data) => {
            const res = await registerAPI(data)
            if(res){
                message.success('????????????')
            }
        },
        getUserInfo({ state, commit }) {
            return new Promise((resolve, reject) => {
              getUserInfoAPI(state.userId).then(response => {
                const data = response
                if (!data) {
                  reject('?????????????????????????????????')
                }
                commit('set_userInfo', data)
                commit('set_userId', data.id)
                resolve(data)
              }).catch(error => {
                reject(error)
              })
            })
        },
        updateUserInfo: async({ state, dispatch }, data) => {
            const params = {
                id: state.userId,
                ...data,
            }
            const res = await updateUserInfoAPI(params)
            if(res){
                message.success('????????????')
                dispatch('getUserInfo')
            }
        },
        getUserOrders: async({ state, commit }) => {
            const data = {
                userId: Number(state.userId)
            }
            const res = await getUserOrdersAPI(data)
            if(res){
                commit('set_userOrderList', res)
                console.log(state.userOrderList)
            }
        },
        getVIPInfoByUserId:async ({state,commit},data)=>{
          const res=await getVIPInfoByUserIdAPI(data)
          if(res){
              commit('set_vipInfo',res)

              console.log(res.viptype)
          }
        },
        //change on 5.8:
        getOrderById: async ({state,commit},orderId)=>{
            const res=await getOrderByIdAPI(orderId)
            if(res){
                commit('set_userOrderById',res)
                console.log(state.userOrder)
            }


        },
        registerVIP:async ({commit},data)=>{
          const res=await registerVIPAPI(data)
          if(res){
              message.success("????????????")
          }else{
              message.error("?????????????????????")
          }
        },
        chargeCredit: async ({state,commit,dispatch},data)=>{
            const res=await chargeCreditAPI(data)
            if(res){
                commit('set_userCreditRecord',res)
                dispatch('getUserInfo')
                message.success("????????????")
            }else{
                console.log("??????")
            }
        },
        getUserCreditRecord: async ({state,commit},userId)=>{//????????????????????????
            const res=await getUserCreditRecordsAPI(userId)
            if(res){
                commit('set_userCreditRecord',res)
            }else{
                message.error('????????????????????????')
            }
        },

        cancelOrder: async({ state, dispatch }, orderId) => {
            const res = await cancelOrderAPI(orderId)
            if(res) {
                dispatch('getUserOrders')
                message.success('????????????')
            }else{
                message.error('????????????')
            }
        },
        logout: async({ commit }) => {
            removeToken()
            resetRouter()
            commit('reset_state')
        },
          // remove token
        resetToken({ commit }) {
            return new Promise(resolve => {
                removeToken() // must remove  token  first
                commit('reset_state')
                resolve()
            })
        },
        addComment: async({ state, dispatch, commit },data) => {//????????????
            const res = await addCommentAPI(data)
            if(res){
                // ????????????????????????
                dispatch('getUserOrders')
                message.success('????????????')
                commit('set_evaluationVisible',false)
            }else{
                // ????????????????????????
                message.error('????????????')
            }
        },
        getCommentsByUserId:async ({state,commit})=>{
            const res =await getCommentsByUserIdAPI(state.userId)
            if(res){
                commit('set_comments',res)
            }else{
                message.error("??????????????????")
            }
        },
        endOrder:async ({state,dispatch},orderId)=>{
            const res=await endOrderAPI(orderId)
            if(res) {
                dispatch('getUserOrders')
                message.success('????????????')
            }else{
                message.error('????????????')
            }
        },

    }
}

export default user