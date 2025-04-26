import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "@/firebase";
export default function OAuth() {
  const auth = getAuth(app);

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      console.log(resultsFromGoogle, "sdfdsfdsf");
      //   const res = await fetch("/api/auth/google", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       name: resultsFromGoogle.user.displayName,
      //       email: resultsFromGoogle.user.email,
      //       googlePhotoUrl: resultsFromGoogle.user.photoURL,
      //     }),
      //   });
      // const data = await res.json();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      type="button"
      className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      onClick={handleGoogleClick}
    >
      {/* <AiFillGoogleCircle className="w-6 h-6 mr-2" /> */}
      Continue with Google
    </button>
  );
}
