<script setup lang="ts">
import {useMyAccountStore} from "@/stores/myAccountStore";
import {onBeforeMount, ref } from "vue";
import { MyAccount } from "@/types/myAccount";
import {postTweet} from "@/api/apiTweet";
import {getAuthenticatedUser} from "@/api/apiUser";
import router from "../router";
import generatePFP from "@/components/generatePFP.vue";

const myAccountStore = useMyAccountStore();
const myAccount = ref<MyAccount|null>(myAccountStore.getMyAccount());
const profilePicture = ref(myAccount.value?.avatar_url);
const fullName = ref(myAccount.value?.full_name);
const tweetText = ref('');
const fileInput = ref();
const selectedImage = ref<File | null>(null);
const previewImage = ref('');
const emit = defineEmits(['tweet-posted']);


onBeforeMount(async () => {
  const res = await getAuthenticatedUser();
  if(res){
    myAccountStore.setMyAccount(res);
    myAccount.value = myAccountStore.getMyAccount();
    profilePicture.value = myAccount.value?.avatar_url;
    fullName.value = myAccount.value?.full_name;
  }
  if(!myAccountStore.isMyAccountAuth){
    await router.push("/login");
  }
});


const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  if (event.target.files.length > 0) {
    selectedImage.value = event.target.files[0];
    if (selectedImage.value) {
      previewImage.value = URL.createObjectURL(selectedImage.value);
    }
  }
};

const removeImage = () => {
  previewImage.value = '';
  selectedImage.value = null;
  if (fileInput.value) {
    fileInput.value = '';
  }
};

const handlePostTweet = async () => {
  if (!tweetText.value.trim()) {
    return;
  }
  try {
    const tweet = await postTweet(tweetText.value, selectedImage.value);
    if (tweet) {
      console.log('New tweet posted:', tweet);
      tweetText.value = '';
      previewImage.value = '';
      selectedImage.value = null;
      fileInput.value = '';
      emit('tweet-posted');
    }
  } catch (error) {
    console.error('Failed to post tweet:', error);
  }
};
</script>

<template>
  <div class="mt-3 w-full inline-flex">
    <img class="w-[40px] h-[40px] rounded-full" v-if="profilePicture" :src="profilePicture" alt="Profile Picture">
    <div v-if="!profilePicture"> <generatePFP :full-name="fullName" />
    </div>
    <div class="pl-4 w-full flex flex-col">
      <textarea v-model="tweetText" placeholder="Was gibt es Neues?" class="bg-transparent resize-none h-[100px] text-base text-white outline-none" maxlength="200"></textarea>
      <input type="file" ref="fileInput" accept="image/*" @change="handleFileChange" hidden alt="">
      <div v-if="previewImage" class="relative">
        <img class="w-max h-[100px] rounded-md" :src="previewImage" alt="Selected Image">
        <button @click="removeImage" class="bg-red-700 rounded-full h-4 w-4 absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4">
          <svg class="w-4 h-4 flex items-center justify-center" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 3.205L8.795 2.5L6 5.295L3.205 2.5L2.5 3.205L5.295 6L2.5 8.795L3.205 9.5L6 6.705L8.795 9.5L9.5 8.795L6.705 6L9.5 3.205Z" fill="white"/>
          </svg>
        </button>
      </div>
      <div class="mt-2 md:mt-3 lg:mt-4 flex justify-between items-center">
        <div class="flex">
          <button @click="triggerFileInput" class="inline-flex items-center text-white outline-none transition-all">
            <svg class="w-4 md:w-5 lg:w-6 h-4 md:h-5 lg:h-6 fill-current" viewBox="0 0 24 24">
              <path d="M18 15.75C18 17.4833 17.3917 18.9583 16.175 20.175C14.9583 21.3917 13.4833 22 11.75 22C10.0167 22 8.54167 21.3917 7.325 20.175C6.10833 18.9583 5.5 17.4833 5.5 15.75V6.5C5.5 5.25 5.93767 4.18767 6.813 3.313C7.68833 2.43833 8.75067 2.00067 10 2C11.25 2 12.3127 2.43767 13.188 3.313C14.0633 4.18833 14.5007 5.25067 14.5 6.5V15.25C14.5 16.0167 14.2333 16.6667 13.7 17.2C13.1667 17.7333 12.5167 18 11.75 18C10.9833 18 10.3333 17.7333 9.8 17.2C9.26667 16.6667 9 16.0167 9 15.25V7C9 6.71667 9.096 6.47933 9.288 6.288C9.48 6.09667 9.71733 6.00067 10 6C10.2833 6 10.521 6.096 10.713 6.288C10.905 6.48 11.0007 6.71733 11 7V15.25C11 15.4667 11.071 15.646 11.213 15.788C11.355 15.93 11.534 16.0007 11.75 16C11.9667 16 12.146 15.929 12.288 15.787C12.43 15.645 12.5007 15.466 12.5 15.25V6.5C12.4833 5.8 12.2377 5.20833 11.763 4.725C11.2883 4.24167 10.7007 4 10 4C9.3 4 8.70833 4.24167 8.225 4.725C7.74167 5.20833 7.5 5.8 7.5 6.5V15.75C7.48333 16.9333 7.89167 17.9377 8.725 18.763C9.55833 19.5883 10.5667 20.0007 11.75 20C12.9167 20 13.9083 19.5877 14.725 18.763C15.5417 17.9383 15.9667 16.934 16 15.75V7C16 6.71667 16.096 6.47933 16.288 6.288C16.48 6.09667 16.7173 6.00067 17 6C17.2833 6 17.521 6.096 17.713 6.288C17.905 6.48 18.0007 6.71733 18 7V15.75Z"/>
            </svg>
            <span class="text-base">Anhang</span>
          </button>
        </div>
        <button
            :disabled="!tweetText.trim()"
            :class="`w-[120px] h-10 rounded-md text-black font-semibold ${!tweetText.trim() ? 'bg-blue-300' : 'bg-homeCard'}`"
            @click="handlePostTweet">
          Tweet
        </button>
      </div>
    </div>
  </div>
</template>
