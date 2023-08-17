/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Space, message } from "antd";
import "./App.css";
import { firebaseConfig } from "./constants";
import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAdditionalUserInfo,
  getAuth,
  signInWithPopup,
} from "firebase/auth";
import { useRef, useState } from "react";
import { GoogleOutlined } from "@ant-design/icons";

function App() {
  // Initialize Firebase
  initializeApp(firebaseConfig);

  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<string>();

  const ref = useRef<HTMLButtonElement>(null);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.idToken;
      // The signed-in user info.
      const user: any = result.user;

      const additionalInfo = getAdditionalUserInfo(result);
      // IdP data available using getAdditionalUserInfo(result)
      // ...

      const accessToken = user.stsTokenManager.accessToken;

      setLoading(false);

      console.log({ accessToken, additionalInfo, token });
      setAccessToken(user.stsTokenManager.accessToken);
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData?.email;
      const credential = GoogleAuthProvider.credentialFromError(error);

      console.log({ errorCode, errorMessage, email, credential });
    }

    setTimeout(() => {
      ref.current!.click();
    }, 1000);
  };

  return (
    <Space size="large">
      <Button
        size="large"
        loading={loading}
        block
        type="primary"
        onClick={signInWithGoogle}
        icon={<GoogleOutlined />}
      >
        Continue with Google
      </Button>
      <button
        id="test"
        ref={ref}
        style={{ visibility: "hidden" }}
        onClick={async () => {
          await navigator.clipboard.writeText(accessToken!);
          message.success("access token copied");
        }}
      />
    </Space>
  );
}

export default App;

