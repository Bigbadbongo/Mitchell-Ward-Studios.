const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyDBrcxxRu3PMk_2NM8XEqC9GBtLrHrcBns",
  authDomain: "mitchell-ward-studios.firebaseapp.com",
  projectId: "mitchell-ward-studios",
  appId: "1:326050299607:web:f224f72dda3408ad6dba92"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

signInWithEmailAndPassword(auth, "test@test.com", "password123")
  .then(() => console.log("Success"))
  .catch((err) => console.log("Error code:", err.code));
