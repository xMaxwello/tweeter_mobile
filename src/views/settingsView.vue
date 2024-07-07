<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {deleteMyProfilePicture, getAuthenticatedUser, updateMyAccount, updateMyProfilePicture} from "@/api/apiUser";
import PasswordDialog from "../components/passwordDialog.vue";
import {MyAccount} from "@/types/myAccount";
import {useMyAccountStore} from "@/stores/myAccountStore";
import router from "../router";
import generatePFP from "../components/generatePFP.vue";
import {IonContent, IonPage} from "@ionic/vue";

const myAccountStore = useMyAccountStore();
const myAccount = ref<MyAccount|null>(myAccountStore.getMyAccount());
const profilePicture = ref(myAccount.value?.avatar_url);
const firstName = ref(myAccount.value?.first_name);
const lastName = ref(myAccount.value?.last_name);
const fullName = ref(myAccount.value?.full_name);
const email = ref(myAccount.value?.email);
const emailConfirmation = ref(myAccount.value?.email);
const emailChanged = ref(false);
const showPasswordDialog = ref(false);
const fileUpload = ref();

onBeforeMount(async () => {
  const res = await getAuthenticatedUser();
  if(res){
    myAccountStore.setMyAccount(res);
    myAccount.value = myAccountStore.getMyAccount();
    profilePicture.value = myAccount.value?.avatar_url;
    firstName.value = myAccount.value?.first_name;
    lastName.value = myAccount.value?.last_name;
    email.value = myAccount.value?.email;
    emailConfirmation.value = myAccount.value?.email;
  }
  if(!myAccountStore.isMyAccountAuth){
    await router.push("/login");
  }
});

const errorMessage = ref('');
const confirmMessage = ref('');
let messageTimeout = null;

function setMessage(type, message, duration = 5000) {
  if (messageTimeout) {
    clearTimeout(messageTimeout);
  }

  if (type === 'error') {
    errorMessage.value = message;
  } else if (type === 'confirm') {
    confirmMessage.value = message;
  }

  messageTimeout = setTimeout(() => {
    if (type === 'error') {
      errorMessage.value = '';
    } else if (type === 'confirm') {
      confirmMessage.value = '';
    }
  }, duration);
}

const handleProfilePictureUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      const imageUrl = await updateMyProfilePicture(file);
      if (imageUrl) {
        profilePicture.value = `${imageUrl}?t=${new Date().getTime()}`;
        setMessage('confirm', 'Profilbild wurde erfolgreich aktualisiert');
        console.log("Profile image updated:", profilePicture.value);
      }
    } catch (error) {
      console.error('Failed to upload profile image:', error);
      setMessage('error', 'Profilbild konnte nicht aktualisiert werden');
    }
  }
};

const clickProfilePictureUpload = () => {
  fileUpload.value.click();
}

const handleDeleteProfilePicture = async () => {
  const deletePicture = await deleteMyProfilePicture();
  if (deletePicture) {
    profilePicture.value = '';
    setMessage('confirm', 'Profilbild erfolgreich gelöscht');
  } else {
    setMessage('error', 'Fehler beim Löschen des Profilbildes');
  }
};


const handleProfileName = async () => {
  if (!firstName.value && !lastName.value) {
    console.error('First and last names are required.');
    return;
  }
  console.log(`Updating name to: ${firstName.value} ${lastName.value}`);

  try {
    const updatedUser = await updateMyAccount(firstName.value, lastName.value, null, null, null, null, null);
    if (updatedUser) {
      console.log("Name updated successfully:", updatedUser);
      setMessage('confirm', 'Name wurde erfolgreich aktualisiert');
      myAccountStore.setMyAccount(updatedUser);
    }
  } catch (error) {
    console.error('Failed to update name:', error);
    setMessage('error', 'Name konnte nicht aktualisiert werden');
  }
};

const changeEmail = () => {
  emailChanged.value = true;
}

const handleProfileEmail = async () => {
  if(firstName.value && lastName.value && email.value && emailConfirmation.value){
    if(email.value === emailConfirmation.value){
      const updatedUser = await updateMyAccount(
          firstName.value,
          lastName.value,
          email.value,
          emailConfirmation.value,
          null,
          null,
          null
      );
      if(updatedUser){
        myAccountStore.setMyAccount(updatedUser);
        console.log("E-mail updated successfully:", updatedUser);
        errorMessage.value = '';
        setMessage('confirm', 'E-mail wurde erfolgreich aktualisiert');

      }
      emailChanged.value = false;
    }else{
      setMessage('error', 'Email stimmt nicht überein');
    }
  }else{
    setMessage('error', 'Alle Felder müssen ausgefüllt werden');
  }
}

</script>

<template>
  <ion-page>
    <ion-content :fullscreen="true" style="--background: #001c30">
  <div class="flex justify-center pt-24">
    <div class="w-full w-max-[751px] h-auto px-5">
      <div class="w-full flex justify-between items-center">
        <h1 class="text-white text-base font-medium">Einstellungen</h1>
      </div>
      <hr class="w-full mt-5 border-white border-opacity-10"/>

      <div class="w-full flex justify-between items-center py-4">
        <div class="w-[40px] h-[40px] relative">
          <img class="w-full h-full rounded-full" v-if="profilePicture" :src="profilePicture" alt="Profile Picture">
          <button v-if="profilePicture" @click="handleDeleteProfilePicture" class="bg-red-700 rounded-full h-4 w-4 absolute top-0 right-0 translate-x-1/4 -translate-y-1/4">
            <svg class="w-4 h-4 flex items-center justify-center" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.5 3.205L8.795 2.5L6 5.295L3.205 2.5L2.5 3.205L5.295 6L2.5 8.795L3.205 9.5L6 6.705L8.795 9.5L9.5 8.795L6.705 6L9.5 3.205Z" fill="white"/>
            </svg>
          </button>
          <div v-if="!profilePicture">
            <generatePFP :full-name="fullName"/>
          </div>
        </div>
        <input ref="fileUpload" type="file" class="file:absolute file:right-5 file:top-1 hidden" accept="image/*" @input="handleProfilePictureUpload">
        <button @click="clickProfilePictureUpload" class="text-xs md:text-sm lg:text-base font-semibold text-homeCard">Bild hochladen</button>
      </div>

      <div class="w-full flex justify-between items-center text-white py-2">
        <p>Vorname</p>
        <input v-model="firstName" class="w-[280px] sm:w-[340px] h-[52px]  px-4 bg-homeCard bg-opacity-5 rounded-md" @keydown.enter="handleProfileName" type="text" placeholder="Vorname">
      </div>

      <div class="w-full flex justify-between items-center text-white py-2">
        <p>Nachname</p>
        <input v-model="lastName" class="w-[280px] sm:w-[340px] h-[52px] px-4 bg-homeCard bg-opacity-5 rounded-md" type="text" @keydown.enter="handleProfileName" placeholder="Nachname">
      </div>

      <div class="w-full flex justify-between items-center text-white py-2">
        <p>E-Mail</p>
        <input class="w-[280px] sm:w-[340px] h-[52px] px-4 bg-homeCard bg-opacity-5 rounded-md" type="email" v-model="email" @blur="changeEmail" @keydown.enter="changeEmail" @input="changeEmail">
      </div>

      <div v-if="emailChanged" class="w-full flex justify-between items-center text-white py-2">
        <p>E-Mail wiederholen</p>
        <input class="w-[280px] sm:w-[340px] h-[52px] px-4 bg-homeCard bg-opacity-5 rounded-md" type="email" v-model="emailConfirmation" @blur="handleProfileEmail" @keydown.enter="handleProfileEmail" >
      </div>

      <div class="relative">
        <div class="w-full flex justify-between items-center text-white pt-4">
          <p>Passwort</p>
          <button @click="showPasswordDialog = true" class="w-[170px] h-10 rounded-md bg-homeCard text-black font-semibold">Passwort ändern</button>
        </div>
        <div v-if="showPasswordDialog" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" @click="showPasswordDialog = false">
          <div @click.stop>
            <PasswordDialog @close="showPasswordDialog = false" />
          </div>
        </div>
      </div>

      <div class="w-full flex justify-end items-center py-2">
        <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
        <p v-if="confirmMessage" class="text-green-700">{{ confirmMessage }}</p>
      </div>

    </div>
  </div>
    </ion-content>
  </ion-page>
</template>
