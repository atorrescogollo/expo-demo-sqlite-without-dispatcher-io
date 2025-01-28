import * as SQLite from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import BlockerModule from "./modules/blocker/src/BlockerModule";

export default function App() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    BlockerModule.addListener("onCustomEvent", (event) => {
      setMessage(event.message);
    });
    const timer = setInterval(() => {
      BlockerModule.sendCustomEvent(`DATE: ${new Date().getTime()}`);
    }, 200);

    return () => {
      clearInterval(timer);
      BlockerModule.removeAllListeners("onCustomEvent");
    };
  }, []);

  const onPress = async () => {
    console.log("Creating tmp table...");
    const db = await SQLite.openDatabaseAsync("db", { useNewConnection: true });
    await db.execAsync(`
    DROP TABLE IF EXISTS items_tmp;
    CREATE TABLE IF NOT EXISTS items_tmp (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT NOT NULL
    );
    `);
    console.log("Generating load...");
    await Promise.all(
      Array(1000)
        .fill(0)
        .map((_, i) =>
          db.runAsync(
            `
            INSERT INTO items_tmp (id, name) VALUES (?, ?)
            `,
            [i, `name${i}`]
          )
        )
    );
    console.log("Renaming tmp table to real table...");
    await db.execAsync(`
    DROP TABLE IF EXISTS items;
    ALTER TABLE items_tmp RENAME TO items;
    DROP TABLE IF EXISTS items_tmp;
    `);
    console.log("Done!");
  };

  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      <Button title="Click me" onPress={() => onPress().catch(console.error)} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
