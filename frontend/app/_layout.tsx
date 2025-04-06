import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import {
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from "@expo-google-fonts/outfit";

export default function RootLayout() {
  const [loadedFonts] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
  });

  return (
    <AuthProvider>
      <Stack />
    </AuthProvider>
  );
}
