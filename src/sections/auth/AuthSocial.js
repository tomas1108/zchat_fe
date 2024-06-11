import { Divider, IconButton, Stack } from "@mui/material";
import { FacebookLogo, GithubLogo, GoogleLogo } from "phosphor-react";
import React from "react";
import { useDispatch } from "react-redux";  
import { LoginWithSocial, RegisterUser, RegisterUserGoogle } from "../../redux/slices/auth";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider,signOut  } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCB3_DCrMJlPb6FE3MI60X98Dgpr__krNI",
    authDomain: "zchat-e58b1.firebaseapp.com",
    projectId: "zchat-e58b1",
    storageBucket: "zchat-e58b1.appspot.com",
    messagingSenderId: "299068763423",
    appId: "1:299068763423:web:958316cc2b4336dcac542a",
    measurementId: "G-FPPCJFSGH3"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/user.birthday.read');

const AuthSocial = () => {
    const dispatch = useDispatch();
    
    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            console.log(user);
           const  name = user.displayName;
           const email = user.email;
            const avatar = user.photoURL;

            

          
        } catch (error) {
            console.error('Error during Google login:', error);
            // Handle errors here
        }
    };

    const handleLogout = async () => {
         await signOut(auth);

    // Xóa thông tin đăng nhập với Google (nếu có)
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.providerData.some(providerData => providerData.providerId === provider.providerId)) {
      await currentUser.unlink(provider.providerId);
    }

    console.log('Logged out');
      };

    const handleGithubClick = () => {
       
    };

    const handleFacebookClick = () => {
        // Handle Facebook login
    };

    return (
        <div>
            <Divider sx={{ my: 2.5, typography: "overline", color: "text.disabled", '&::before, ::after': { borderTopStyle: "dashed" } }}>
                OR
            </Divider>
            <Stack direction={"row"} justifyContent="center" spacing={2}>
                <IconButton onClick={handleGoogleLogin}>
                    <GoogleLogo color="#DF3E30" />
                </IconButton>
                <IconButton onClick={handleLogout} color="inherit">
                    <GithubLogo />
                </IconButton>
                <IconButton onClick={handleFacebookClick}>
                    <FacebookLogo color="#1C9CEA" />
                </IconButton>
            </Stack>
        </div>
    );
}

export default AuthSocial;
