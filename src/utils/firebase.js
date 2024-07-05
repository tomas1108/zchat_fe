import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCB3_DCrMJlPb6FE3MI60X98Dgpr__krNI",
  authDomain: "zchat-e58b1.firebaseapp.com",
  projectId: "zchat-e58b1",
  storageBucket: "zchat-e58b1.appspot.com",
  messagingSenderId: "299068763423",
  appId: "1:299068763423:web:958316cc2b4336dcac542a",
  measurementId: "G-FPPCJFSGH3"
};

// Initialize Firebase app if it hasn't been initialized
const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const uploadFileToFirebase = async (file, type, id, key) => {
  if (!file || !id || !key || !type) {
    throw new Error('File, user_id, and key are required');
  }

  const fileRef = ref(storage, `${type}/${id}/${key}`);
  await uploadBytes(fileRef, file);
  const downloadURL = await getDownloadURL(fileRef);
  return downloadURL;
};

export default uploadFileToFirebase;
