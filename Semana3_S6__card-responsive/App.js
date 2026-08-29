import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import UserCard from "./src/components/UserCard";

const minecraftUsers = [
  {
    name: "Alex",
    age: 24,
    photo:
      "https://wallpapers.com/images/hd/minecraft-alex-1080-x-1080-wallpaper-28q792mbqaclxm7p.jpg",
    isOnline: true,
    role: "Explorer",
  },
  {
    name: "Creeper Sigiloso",
    age: 15,
    photo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPmUx_3lzq0oxazNrBCu8ntUUg2xw5uu-SYdzC8RYtzc0V8UVPzA1j6716&s=10",
    isOnline: false,
  },
  {
    name: "Enderman_99",
    age: 500,
    photo:
      "https://i.pinimg.com/originals/d7/d4/c7/d7d4c764eb92b5126ff44f3f69374b05.jpg",
    role: "Teleporter",
  },
  {
    name: "Zombie_Villager_Triste",
    age: 42,
    photo:
      "https://media.sketchfab.com/models/42cf2b7d1723461982ce2dded1018492/thumbnails/873b5d622dad4015b52d70b60b2dfe94/5293111575a94793b0e6a929db7336aa.jpeg",
    isOnline: true,
  },
  {
    name: "Herobrine",
    age: 999,
    photo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkNqA-9AXr4ngWkd0kW2Dmfu0UybVMOC72IASxYPI6Hy6w3pCJWMr4bA8&s=10",
    isOnline: true,
    role: "Myth",
  },
  {
    name: "Cerdo con Silla",
    age: 3,
    photo:
      "https://upload.wikimedia.org/wikipedia/commons/8/8b/Minecraft_pig_%2815735062557%29.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original",
    isOnline: false,
  },
  {
    name: "Lobo Domesticado",
    age: 6,
    photo:
      "https://i.pinimg.com/736x/a3/80/57/a3805701047597835c376272eb01da49.jpg",
    isOnline: true,
    role: "Pet",
  },
  {
    name: "Aldeano Constructor",
    age: 57,
    photo:
      "https://wallpapers.com/images/hd/minecraft-villager-1253-x-683-wallpaper-oxxu2swv9c7s7nxj.jpg",
    role: "Trader",
  },
  {
    name: "Ghas_T",
    age: 112,
    photo:
      "https://i.pinimg.com/736x/e8/e0/6c/e8e06c48b601bc8dd2f6ef733bf0d89b.jpg",
    isOnline: false,
  },
  {
    name: "Steve Diamante",
    age: 31,
    photo:
      "https://m.media-amazon.com/images/S/aplus-media-library-service-media/7ad0f966-cfd3-4fbe-a431-3b4bc609b188.__CR0,0,2000,2000_PT0_SX300_V1___.jpg",
    isOnline: true,
    role: "Miner",
  },
];

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Minecrafteros</Text>
        <View style={styles.contentUsers}>
          {minecraftUsers.map((user, index) => (
            <UserCard
              key={index}
              name={user.name}
              age={user.age}
              photo={user.photo}
              isOnline={user.isOnline}
              role={user.role}
            />
          ))}
        </View>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },

  main: {
    paddingInline: 20,
    maxWidth: 850,
    flex: 1,
    gap: 10,
  },

  title: {
    fontWeight: "bold",
    fontSize: 30,
    fontFamily: "Monospace",
  },

  contentUsers: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});
