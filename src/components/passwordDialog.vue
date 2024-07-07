<script setup lang="ts">
import {ref} from "vue";
import {updateMyAccount} from "@/api/apiUser";

const currentPassword = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const errorMessage = ref('');
const confirmMessage = ref('');
const emits = defineEmits(['close']);

let messageTimeout = 0;

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

const validatePassword = () => {
  errorMessage.value = '';

  if (!currentPassword.value) {
    setMessage('error','Bitte geben Sie Ihr aktuelles Passwort ein');
    return false;
  }
  if (!password.value) {
    setMessage('error','Bitte geben Sie ein neues Passwort ein');
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
  emits('close');
};

</script>

<template>
  <div class="max-w-[732px] w-full h-[439px] rounded-[10px] p-4 bg-passwordCard text-white flex flex-col">
    <div class="flex justify-center pb-2">
      <h1>Passwort ändern</h1>
    </div>
    <div class="flex flex-col justify-center py-2">
      <input v-model="currentPassword" class="w-[340px] h-[52px] px-4 p bg-homeCard bg-opacity-5 rounded-md" type="password" placeholder="Aktuelles Passwort">
      <input v-model="password" class="w-[340px] h-[52px] px-4 my-4 bg-homeCard bg-opacity-5 rounded-md" type="password" placeholder="Neues Passwort">
      <input v-model="passwordConfirmation" class="w-[340px] h-[52px] px-4 bg-homeCard bg-opacity-5 rounded-md" type="password" placeholder="Passwort wiederholen">
    </div>
    <div>
      <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
      <p v-if="confirmMessage" class="text-green-700">{{ confirmMessage }}</p>
    </div>
    <div class="flex justify-start text-xs py-2">
      <p>
        - Benutze 8 bis 64 Zeichen<br/>
        - Min. 1 Ziffer muss enthalten sein<br/>
        - Neben Buchstaben, verwende min. 1 Symbol (!@#$%^-_+=)
      </p>
    </div>
    <div class="flex justify-end h-full items-end pb-4">
      <button @click="closeDialog" class="w-[170px] h-10 rounded-md text-homeCard font-semibold">Abbrechen</button>
      <button @click="handleUpdateProfile" class="w-[170px] h-10 rounded-md bg-homeCard text-black font-semibold">Speichern</button>
    </div>

  </div>
</template>