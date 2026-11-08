import * as Notifications from "expo-notifications";

export async function getNotificationPermission() {
  return Notifications.getPermissionsAsync();
}

export async function requestNotificationPermission() {
  return Notifications.requestPermissionsAsync();
}
