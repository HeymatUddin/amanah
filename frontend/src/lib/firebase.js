import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDdsF9dOtcAeqeGzhl-Fl02qTH25Nddoe0",
    authDomain: "amanah-ec268.firebaseapp.com",
    projectId: "amanah-ec268",
    storageBucket: "amanah-ec268.firebasestorage.app",
    messagingSenderId: "807947309129",
    appId: "1:807947309129:web:8bdf3f831c912ca0212f98",
    measurementId: "G-WBVKD214KN"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)