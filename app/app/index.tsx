import { View } from "react-native";
import SearchScreen from "./SearchScreen";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SearchScreen />
    </View>
  );
}
