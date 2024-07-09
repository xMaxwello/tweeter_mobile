<script setup lang="ts">

import {onBeforeMount, onMounted, ref} from "vue";
import {fetchTweetDetails, postComment, toggleLikeComment} from "@/api/apiTweet";
import {useRoute} from "vue-router";
import {getAuthenticatedUser} from "@/api/apiUser";
import {useMyAccountStore} from "@/stores/myAccountStore";
import tweetContent from "../components/tweetContent.vue";
import {MyAccount} from "@/types/myAccount";
import generatePFP from "../components/generatePFP.vue";
import {Tweet} from "@/types/userTweets";
import router from "../router";
import {IonContent, IonPage} from "@ionic/vue";
import {useLoadingStore} from "@/stores/loadingStore";


const route = useRoute();
const loadingStore = useLoadingStore();
let tweet = ref<Tweet | null>(null);
let newComment = ref('');
const myAccountStore = useMyAccountStore();
const myAccount = ref<MyAccount|null>(myAccountStore.getMyAccount());
const profilePicture = ref(myAccount.value?.avatar_url);
const fullName = ref(myAccount.value?.full_name);


onBeforeMount(async () => {
  const res = await getAuthenticatedUser();
  if(res){
    myAccountStore.setMyAccount(res);
    myAccount.value = myAccountStore.getMyAccount();
    profilePicture.value = myAccount.value?.avatar_url;
  }
  if(!myAccountStore.isMyAccountAuth){
    await router.push("/login");
  }
});

onMounted(async () => {
  loadingStore.isLoading = true;
  const tweetId = route.params.id;
  try {
    tweet.value = await fetchTweetDetails(tweetId);
  } catch (error) {
    console.error("Failed to fetch tweet details:", error);
  } finally {
    loadingStore.isLoading = false;

  }
});

const handlePostComment = async () => {
  if (!newComment.value.trim()) {
    return;
  }
  console.log("Posting comment:", newComment.value);
  try {
    const comment = await postComment(route.params.id, newComment.value);
    if (comment) {
      tweet.value?.comments.unshift(comment);
      newComment.value = '';
    }
  } catch (error) {
    console.error("Failed to post comment:", error);
  }
}


const handleLikeCommentToggle = async (comment) => {
  const result = await toggleLikeComment(comment.id);
  if (result !== null) {
    comment.is_liked = result;
    comment.likes_count += result ? 1 : -1;
  }
}

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true" style="--background: #001c30">
    <div class="flex justify-center py-24">
      <div class="w-full max-w-[751px] h-auto pb-4 px-5">
        <div class="w-full flex flex-col">
          <div class="flex justify-start items-center">
            <button @click="$router.push('/home')" class="text-white text-base font-medium flex pt-2 pb-1 items-center">
              <svg class="w-8 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.9999 10.9999H7.82992L12.7099 6.11991C13.0999 5.72991 13.0999 5.08991 12.7099 4.69991C12.6174 4.60721 12.5075 4.53366 12.3865 4.48348C12.2656 4.4333 12.1359 4.40747 12.0049 4.40747C11.874 4.40747 11.7443 4.4333 11.6233 4.48348C11.5023 4.53366 11.3924 4.60721 11.2999 4.69991L4.70992 11.2899C4.61722 11.3824 4.54367 11.4923 4.49349 11.6133C4.44331 11.7343 4.41748 11.8639 4.41748 11.9949C4.41748 12.1259 4.44331 12.2556 4.49349 12.3765C4.54367 12.4975 4.61722 12.6074 4.70992 12.6999L11.2999 19.2899C11.3925 19.3825 11.5024 19.4559 11.6234 19.506C11.7443 19.5561 11.874 19.5819 12.0049 19.5819C12.1359 19.5819 12.2655 19.5561 12.3865 19.506C12.5074 19.4559 12.6173 19.3825 12.7099 19.2899C12.8025 19.1973 12.8759 19.0874 12.9261 18.9665C12.9762 18.8455 13.0019 18.7158 13.0019 18.5849C13.0019 18.454 12.9762 18.3243 12.9261 18.2034C12.8759 18.0824 12.8025 17.9725 12.7099 17.8799L7.82992 12.9999H18.9999C19.5499 12.9999 19.9999 12.5499 19.9999 11.9999C19.9999 11.4499 19.5499 10.9999 18.9999 10.9999Z" fill="white"/>
              </svg>
              zurück
            </button>
          </div>

          <div v-if="tweet">

          <tweetContent
              :id="tweet.id"
              :imgURL="tweet.image_url"
              :profilePicURL="tweet.user.avatar_url"
              :name="tweet.user.full_name"
              :time="tweet.created_at"
              :text="tweet.body"
              :likes="tweet.likes_count"
              :isLiked="tweet.is_liked"
              :comments="tweet.comments_count"
          />


          <!-- Comments Box -->
          <div class="pt-20 w-full flex">
            <div class="w-[40px] h-[40px] flex-shrink-0">
              <img class="w-[40px] h-[40px] rounded-full" v-if="profilePicture" :src="profilePicture" alt="Profile Picture">
              <div v-if="!profilePicture">
                <generatePFP :full-name="fullName"/>
              </div>
            </div>
            <div class="flex flex-col flex-grow pl-4">
              <textarea v-model="newComment" placeholder="Kommentiere den Beitrag" class="bg-transparent resize-none h-[100px] text-base text-white outline-none w-full" maxlength="200"></textarea>
              <div class="mt-4 flex justify-end items-center">
                <button :disabled="!newComment.trim()"
                        :class="{'bg-blue-300': !newComment.trim(), 'bg-homeCard': newComment.trim()}"
                        @click="handlePostComment" class="w-[154px] h-10 rounded-md text-black font-semibold">Kommentieren</button>
              </div>
            </div>
          </div>


          <!-- Comments Section -->
            <hr class="w-full my-4 border-white border-opacity-10"/>
            <div>
              <h1 v-if="tweet.comments_count == 0" class="text-white text-base"> Es wurde noch kein Kommentar gepostet</h1>
              <h1 v-else-if="tweet.comments_count == 1" class="text-white text-base"> 1 Kommentar</h1>
              <h1 v-else class="text-white text-base">{{tweet.comments_count}} Kommentare</h1>
            </div>
            <div v-for="comment in tweet.comments" :key="comment.id">
              <div class="flex mt-3">
                <div class="w-[40px] h-[40px] flex-shrink-0">
                  <img class="w-[40px] h-[40px] rounded-full mr-4" v-if="comment.user.avatar_url" :src="comment.user.avatar_url" alt="Profile Picture">
                  <div v-if="!comment.user.avatar_url">
                    <generatePFP :full-name="comment.user.full_name"/>
                  </div>
                </div>

                <div class="flex flex-col flex-grow pl-4">
                  <div class="flex items-center">
                    <h2 class="text-white font-medium text-base">{{comment.user.full_name}}</h2>
                    <p class="text-gray-400 text-xs pl-4">{{ comment.created_at }}</p>
                  </div>
                  <p class="text-white text-sm mt-2 break-words whitespace-pre-wrap">{{ comment.body }}</p>

                  <div class="flex flex-row text-sm mt-4">
                    <div class="flex flex-row items-center pr-14">
                      <button @click="() => handleLikeCommentToggle(comment)">
                        <svg v-if="comment.is_liked" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.5 3C14.76 3 13.09 3.81 12 5.09C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.42 2 8.5C2 12.28 5.4 15.36 10.55 20.04L12 21.35L13.45 20.03C18.6 15.36 22 12.28 22 8.5C22 5.42 19.58 3 16.5 3ZM12.1 18.55L12 18.65L11.9 18.55C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5C9.04 5 10.54 5.99 11.07 7.36H12.94C13.46 5.99 14.96 5 16.5 5C18.5 5 20 6.5 20 8.5C20 11.39 16.86 14.24 12.1 18.55Z" fill="url(#paint0_linear_36_2436)"/>
                          <defs>
                            <linearGradient id="paint0_linear_36_2436" x1="12" y1="3" x2="12" y2="21.35" gradientUnits="userSpaceOnUse">
                              <stop offset="0" stop-color="#FF595E"/>
                              <stop offset="1" stop-color="#FFCA3A"/>
                            </linearGradient>
                          </defs>
                        </svg>
                        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.5 3C14.76 3 13.09 3.81 12 5.09C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.42 2 8.5C2 12.28 5.4 15.36 10.55 20.04L12 21.35L13.45 20.03C18.6 15.36 22 12.28 22 8.5C22 5.42 19.58 3 16.5 3ZM12.1 18.55L12 18.65L11.9 18.55C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5C9.04 5 10.54 5.99 11.07 7.36H12.94C13.46 5.99 14.96 5 16.5 5C18.5 5 20 6.5 20 8.5C20 11.39 16.86 14.24 12.1 18.55Z" fill="white"/>
                        </svg>
                      </button>
                      <p class="pl-2 text-white">{{ comment.likes_count }}</p>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    </ion-content>
  </ion-page>
</template>

