import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { auth } from "../firebase";
import { storage } from "../firebase";
import { db } from "../firebase";
export const RegisterUser = async (email, password, photo, userName) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = res;
    console.log("user Created");
    console.log(user);

    //Storing userInfo in firstore database:
    await uploadImgAndUpdateProfile(user, photo, userName, user.id);
  } catch (err) {
    console.log(err.message);
  }
};

export const uploadImgAndUpdateProfile = async (
  user,
  file,
  displayName,
  userId
) => {
  try {
    //Create user

    //Create a unique image name
    const date = new Date().getTime();
    const storageRef = ref(storage, `${displayName + date}`);

    await uploadBytesResumable(storageRef, file).then(() => {
      getDownloadURL(storageRef).then(async (downloadURL) => {
        try {
          // Update profile
          console.log(user);
          await updateProfile(user, {
            displayName,
            photoURL: downloadURL,
          });
          //create user on firestore
        } catch (err) {
          console.log(err.message);
        }
      });
    });
  } catch (err) {
    console.log(err.messege);
  }
};
export const storeInfo = async (currentUser) => {
  console.log(currentUser);
  const { displayName: Name, uid: userId, photoURL: imgURL } = currentUser;
  try {
    // Add a new document in collection "cities"
    const res = await setDoc(doc(db, "userCollection1Ex1", userId), {
      id: userId,
      name: Name,
      imageUrl: imgURL,
    });
  } catch (err) {
    console.log(err.message);
  }
};

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const { user } = userCredential;
    console.log("Signed In");
    console.log(user);
  } catch (err) {
    console.log(err.messege);
  }
};
