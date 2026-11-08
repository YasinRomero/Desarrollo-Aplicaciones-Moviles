export async function getNotificationPermission() {
  return { status: "unavailable", canAskAgain: false };
}

export async function requestNotificationPermission() {
  return { status: "unavailable", canAskAgain: false };
}
