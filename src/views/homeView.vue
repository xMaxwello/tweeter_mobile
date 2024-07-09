<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import router from "@/router";
import { onMounted, reactive, ref } from "vue";
import { Tweet } from "@/types/userTweets";
import { fetchTweets } from "@/api/apiTweet";
import { searchUser } from "@/api/apiUser";
import searchUserResult from "@/components/searchUserResult.vue";
import tweetContent from "@/components/tweetContent.vue";
import makeTweet from "@/components/makeTweet.vue";
import {useLoadingStore} from "@/stores/loadingStore";

const loadingStore = useLoadingStore();

const users = ref([]);
const searchQuery = ref('');
const currentPage = ref(1);
const hasMoreTweets = ref(true);
let tweets = reactive<Tweet[]>([]);

const performSearch = async () => {
  if (!searchQuery.value.trim()) return;
  loadingStore.isLoading = true;
  try {
    const result = await searchUser(searchQuery.value);
    if (result) {
      users.value = result;
    } else {
      users.value = [];
    }
  } catch (error) {
    console.error('Search failed:', error);
  } finally {
    loadingStore.isLoading = false;
  }
};

const clearSearch = () => {
  searchQuery.value = '';
};

const loadTweets = async () => {
  if (loadingStore.isLoading || !hasMoreTweets.value) return;

  loadingStore.isLoading = true;
  try {
    const newTweets = await fetchTweets(currentPage.value);
    if (newTweets && newTweets.length > 0) {
      tweets.push(...newTweets);
      currentPage.value++;
    } else {
      hasMoreTweets.value = false;
    }
  } catch (error) {
    console.error("Failed to load tweets:", error);
  } finally {
    loadingStore.isLoading = false;
  }
};

const loadData = async (event) => {
  await loadTweets();
  setTimeout(() => {
    event.target.complete();
  }, 500);
};

onMounted(loadTweets);

const refreshTweets = async () => {
  currentPage.value = 1;
  tweets = reactive<Tweet[]>([]);
  await loadTweets();
};

function navigateToTweetView(tweetId) {
  router.push({ name: 'TweetView', params: { id: tweetId } });
}
</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true" style="--background: #001c30" scroll-events>
      <div class="flex justify-center py-24">
        <div class="w-full max-w-[751px] h-full pb-4 px-5 mx-auto">
          <div class="w-full flex justify-between items-center">
            <h1 class="text-white text-base font-medium">Home</h1>
            <div class="w-60 h-10 rounded-md bg-homeCard bg-opacity-5 border-2 border-transparent flex items-center justify-between px-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-none">
                <g opacity="0.5">
                  <path d="M15.5 14H14.71L14.43 13.73C15.0549 13.004 15.5117 12.1488 15.7675 11.2256C16.0234 10.3025 16.072 9.33416 15.91 8.39001C15.44 5.61001 13.12 3.39001 10.32 3.05001C9.33559 2.92547 8.33576 3.02778 7.397 3.34909C6.45824 3.67041 5.60542 4.20222 4.90381 4.90384C4.20219 5.60545 3.67038 6.45827 3.34906 7.39703C3.02775 8.33579 2.92544 9.33562 3.04997 10.32C3.38997 13.12 5.60998 15.44 8.38998 15.91C9.33413 16.0721 10.3024 16.0234 11.2256 15.7676C12.1487 15.5117 13.0039 15.055 13.73 14.43L14 14.71V15.5L18.25 19.75C18.66 20.16 19.33 20.16 19.74 19.75C20.15 19.34 20.15 18.67 19.74 18.26L15.5 14ZM9.49997 14C7.00997 14 4.99997 11.99 4.99997 9.50001C4.99997 7.01 7.00997 5.00001 9.49997 5.00001C11.99 5.00001 14 7.01 14 9.50001C14 11.99 11.99 14 9.49997 14Z" fill="white"/>
                </g>
              </svg>

              <input type="text" v-model="searchQuery" @input="performSearch" placeholder="Suchen" class="w-full h-full text-xs md:text-sm lg:text-base bg-transparent text-white placeholder-opacity-50 outline-none px-2"/>

              <button @click="clearSearch" class="flex-none">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g opacity="0.5">
                    <path d="M18.3002 5.70998C18.2077 5.61728 18.0978 5.54373 17.9768 5.49355C17.8559 5.44337 17.7262 5.41754 17.5952 5.41754C17.4643 5.41754 17.3346 5.44337 17.2136 5.49355C17.0926 5.54373 16.9827 5.61728 16.8902 5.70998L12.0002 10.59L7.11022 5.69998C7.01764 5.6074 6.90773 5.53396 6.78677 5.48385C6.6658 5.43375 6.53615 5.40796 6.40522 5.40796C6.27429 5.40796 6.14464 5.43375 6.02368 5.48385C5.90272 5.53396 5.79281 5.6074 5.70022 5.69998C5.60764 5.79256 5.5342 5.90247 5.4841 6.02344C5.43399 6.1444 5.4082 6.27405 5.4082 6.40498C5.4082 6.53591 5.43399 6.66556 5.4841 6.78652C5.5342 6.90749 5.60764 7.0174 5.70022 7.10998L10.5902 12L5.70022 16.89C5.60764 16.9826 5.5342 17.0925 5.4841 17.2134C5.43399 17.3344 5.4082 17.464 5.4082 17.595C5.4082 17.7259 5.43399 17.8556 5.4841 17.9765C5.5342 18.0975 5.60764 18.2074 5.70022 18.3C5.79281 18.3926 5.90272 18.466 6.02368 18.5161C6.14464 18.5662 6.27429 18.592 6.40522 18.592C6.53615 18.592 6.6658 18.5662 6.78677 18.5161C6.90773 18.466 7.01764 18.3926 7.11022 18.3L12.0002 13.41L16.8902 18.3C16.9828 18.3926 17.0927 18.466 17.2137 18.5161C17.3346 18.5662 17.4643 18.592 17.5952 18.592C17.7262 18.592 17.8558 18.5662 17.9768 18.5161C18.0977 18.466 18.2076 18.3926 18.3002 18.3C18.3928 18.2074 18.4662 18.0975 18.5163 17.9765C18.5665 17.8556 18.5922 17.7259 18.5922 17.595C18.5922 17.464 18.5665 17.3344 18.5163 17.2134C18.4662 17.0925 18.3928 16.9826 18.3002 16.89L13.4102 12L18.3002 7.10998C18.6802 6.72998 18.6802 6.08998 18.3002 5.70998Z" fill="white"/>
                  </g>
                </svg>
              </button>
            </div>
          </div>
          <hr class="w-full mt-3 border-white border-opacity-10"/>

          <div v-if="searchQuery">
            <searchUserResult :users="users"/>
          </div>

          <div v-else>
            <makeTweet @tweet-posted="refreshTweets"/>

            <div v-if="!loadingStore.isLoading" v-for="tweet in tweets" :key="tweet.id">
              <tweetContent
                  :id="tweet.id"
                  :profilePicURL="tweet.user.avatar_url"
                  :imgURL="tweet.image_url"
                  :name="tweet.user.full_name"
                  :time="tweet.created_at"
                  :text="tweet.body"
                  :likes="tweet.likes_count"
                  :isLiked="tweet.is_liked"
                  :comments="tweet.comments_count"
                  @openTweet="navigateToTweetView"
              />
            </div>
          </div>

          <ion-infinite-scroll threshold="300px" @ionInfinite="loadData">
            <ion-infinite-scroll-content
                loading-spinner="dots"
                loading-text="">
            </ion-infinite-scroll-content>
          </ion-infinite-scroll>


        </div>
      </div>


    </ion-content>
  </ion-page>
</template>
