import { defineStore } from 'pinia';
import { ref } from 'vue';
import { MyAccount } from '@/types/myAccount';

export const useMyAccountStore = defineStore('myAccountStore', () => {
    const myAccount = ref<MyAccount | null>(null);

    function setMyAccount(account: MyAccount | null) {
        myAccount.value = account;
    }

    function getMyAccount() {
        return myAccount.value;
    }

    function logOffMyAccount() {
        myAccount.value = null;
    }

    function isMyAccountAuth() {
        return myAccount.value !== null;
    }

    return { myAccount, setMyAccount, getMyAccount, logOffMyAccount, isMyAccountAuth };
}, {
    persist: true
});
