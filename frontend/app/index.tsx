import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useGoogleAuth, processGoogleSignIn } from "../services/authService";
import "../global.css";
import DocumentSets from "./pages/DocumentSets";
import BottomNavigationBar from "./components/NavigationBar/BottomNavigationTab";
import Onboarding1 from "./pages/Onboarding/Onboarding1";

export default function Index() {
  return (
    <Onboarding1/>
  )
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");

  // const { user, isAuthenticated, login, logout } = useAuth();
  // const { request, response, promptAsync } = useGoogleAuth();

  // useEffect(() => {
  //   if (response?.type === "success") {
  //     handleGoogleResponse();
  //   }
  // }, [response]);

  // const handleGoogleResponse = async () => {
  //   setIsLoading(true);
  //   setError("");

  //   try {
  //     const result = await processGoogleSignIn(response);
  //     login(result.accessToken, result.refreshToken, result.user);
  //   } catch (err: any) {
  //     setError(err.message || "Failed to sign in with Google");
  //     console.error("Google sign in error:", err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleGoogleSignIn = async () => {
  //   setError("");
  //   try {
  //     await promptAsync();
  //   } catch (err: any) {
  //     setError(err.message || "Failed to open Google sign in");
  //     console.error("Google prompt error:", err);
  //   }
  // };

  // const handleLogout = async () => {
  //   setIsLoading(true);
  //   try {
  //     await logout();
  //   } catch (err: any) {
  //     console.error("Logout error:", err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // // return <Onboarding1/>
  // // return <BottomNavigationBar/>
  // // return <DocumentSets />;
  // return (
  //   <View style={styles.container}>
  //     {isAuthenticated && user ? (
  //       <View style={styles.card}>
  //         <Text style={styles.title}>User Data</Text>
  //         <View style={styles.userDataContainer}>
  //           {user.picture && (
  //             <Image
  //               source={{ uri: user.picture }}
  //               style={styles.profileImage}
  //             />
  //           )}
  //           <Text style={styles.label}>Name: <Text style={styles.value}>{user.name}</Text></Text>
  //           <Text style={styles.label}>Email: <Text style={styles.value}>{user.email}</Text></Text>
  //           <Text style={styles.jsonData}>{JSON.stringify(user, null, 2)}</Text>
  //         </View>

  //         <TouchableOpacity
  //           style={styles.logoutButton}
  //           onPress={handleLogout}
  //           disabled={isLoading}
  //         >
  //           {isLoading ? (
  //             <ActivityIndicator color="#fff" />
  //           ) : (
  //             <Text style={styles.logoutButtonText}>Logout</Text>
  //           )}
  //         </TouchableOpacity>
  //       </View>
  //     ) : (
  //       <View style={styles.card}>
  //         <Text className="text-[24px] font-bold mb-[20px] text-center">Sign In</Text>

  //         {error ? (
  //           <View style={styles.errorContainer}>
  //             <Text style={styles.errorText}>{error}</Text>
  //           </View>
  //         ) : null}

  //         <TouchableOpacity
  //           style={styles.googleButton}
  //           onPress={handleGoogleSignIn}
  //           disabled={isLoading || !request}
  //         >
  //           {isLoading ? (
  //             <ActivityIndicator color="#fff" />
  //           ) : (
  //             <>
  //               <View style={styles.googleIconContainer}>
  //                 <Text style={styles.googleIcon}>G</Text>
  //               </View>
  //               <Text style={styles.googleButtonText}>Sign in with Google</Text>
  //             </>
  //           )}
  //         </TouchableOpacity>
  //       </View>
  //     )}
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ffcdd2",
  },
  errorText: {
    color: "#b71c1c",
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "#4285F4",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    backgroundColor: "#fff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  googleIcon: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4285F4",
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  logoutButton: {
    backgroundColor: "#f44336",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  userDataContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "500",
  },
  value: {
    fontWeight: "normal",
  },
  jsonData: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
    fontFamily: "monospace",
    width: "100%",
  },
});
