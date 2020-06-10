import firebase from "firebase/app"
import "firebase/firestore"

const fbConfig = {
  apiKey: 'AIzaSyAO7HATR89mnaU5huhdLPqaVk3vqMYHxhA',
  authDomain: 'code-memo-c3125.firebaseapp.com',
  databaseURL: 'https://code-memo-c3125.firebaseio.com',
  projectId: 'code-memo-c3125',
  storageBucket: 'code-memo-c3125.appspot.com',
  messagingSenderId: '153335857441'
};
firebase.initializeApp(fbConfig)
const db = firebase.firestore()

export {
  firebase,
  db
}