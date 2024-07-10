<script setup lang="ts">
import { ref } from "vue";
import { updateMyAccount } from "@/api/apiUser";
import { modalController } from "@ionic/vue";

const currentPassword = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const errorMessage = ref('');
const confirmMessage = ref('');

let messageTimeout = 0;

function setMessage(type: string, message: string, duration = 5000) {
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

const validatePassword = () => {
  errorMessage.value = '';

  if (!currentPassword.value) {
    setMessage('error', 'Bitte geben Sie Ihr aktuelles Passwort ein');
    return false;
  }
  if (!password.value) {
    setMessage('error', 'Bitte geben Sie ein neues Passwort ein');
    return false;
  }
  if (password.value.length < 8 || password.value.length > 64) {
    setMessage('error', 'Das Passwort muss zwischen 8 und 64 Zeichen lang sein');
    return false;
  }
  if (!/\d/.test(password.value)) {
    setMessage('error', 'Das Passwort muss mindestens eine Ziffer enthalten');
    return false;
  }
  if (!/[!@#$%^-_+=]/.test(password.value)) {
    setMessage('error', 'Das Passwort muss mindestens ein Symbol (!@#$%^-_+=) enthalten');
    return false;
  }
  if (password.value !== passwordConfirmation.value) {
    setMessage('error', 'Die Passwörter stimmen nicht überein');
    return false;
  }
  if (currentPassword.value === password.value) {
    setMessage('error', 'Das neue Passwort muss anders als das alte Passwort sein');
    return false;
  }
  return true;
};

const handleUpdateProfile = async () => {
  const isValid = validatePassword();
  if (!isValid) {
    console.error(errorMessage.value);
    return;
  }
  try {
    const updatedUser = await updateMyAccount(null, null, null, null, password.value, passwordConfirmation.value, currentPassword.value);
    if (updatedUser) {
      console.log("Profile updated successfully:", updatedUser);
      setMessage('confirm', 'Passwort wurde erfolgreich geändert');
      errorMessage.value = '';
      currentPassword.value = '';
      password.value = '';
      passwordConfirmation.value = '';
    }
  } catch (error) {
    console.error('Failed to update profile:', error);
    setMessage('error', 'Bitte überprüfen Sie ihre Eingaben oder versuchen Sie es später erneut');
  }
};

const closeDialog = () => {
  modalController.dismiss();
};
</script>

<template>
  <ion-content class="ion-padding">
    <div class="password-dialog pt-24 max-w-[732px] w-full h-full z-10 rounded-[10px] p-4 bg-passwordCard text-white flex flex-col">
      <div class="w-full flex justify-between items-center">
        <h1 class="text-white text-base font-medium">Passwort ändern</h1>
      </div>
      <hr class="w-full mt-5 border-white border-opacity-10"/>

      <div class="flex flex-col justify-center py-4">
        <ion-input v-model="currentPassword" label-placement="floating" class="w-[340px] h-[52px] px-4 bg-homeCard bg-opacity-5 rounded-md" type="password" label="Aktuelles Passwort"></ion-input>
        <ion-input v-model="password" label-placement="floating" class="w-[340px] h-[52px] px-4 my-4 bg-homeCard bg-opacity-5 rounded-md" type="password" label="Neues Passwort"></ion-input>
        <ion-input v-model="passwordConfirmation" label-placement="floating" class="w-[340px] h-[52px] px-4 bg-homeCard bg-opacity-5 rounded-md" type="password" label="Passwort wiederholen"></ion-input>
      </div>
      <div>
        <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
        <p v-if="confirmMessage" class="text-green-700">{{ confirmMessage }}</p>
      </div>
      <div class="flex justify-start text-xs py-2">
        <p>
          - Benutze 8 bis 64 Zeichen<br />
          - Min. 1 Ziffer muss enthalten sein<br />
          - Neben Buchstaben, verwende min. 1 Symbol (!@#$%^-_+=)
        </p>
      </div>
      <div class="flex justify-end h-full items-end pb-4">
        <button @click="closeDialog" class="w-[170px] h-10 rounded-md text-homeCard font-semibold">Abbrechen</button>
        <button @click="handleUpdateProfile" class="w-[170px] h-10 rounded-md bg-homeCard text-black font-semibold">Speichern</button>
      </div>
    </div>
  </ion-content>
</template>
