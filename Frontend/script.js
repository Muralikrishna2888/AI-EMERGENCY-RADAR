
const connectionText = document.getElementById("connectionText");
const internetStatus = document.getElementById("internetStatus");
const sosButton = document.getElementById("sosButton");
const alertList = document.getElementById("alertList");

let alerts = [];

try {
  alerts = JSON.parse(
    localStorage.getItem("emergencyAlerts") || "[]"
  );
} catch {
  alerts = [];
}

// Internet status
function updateConnection() {
  if (navigator.onLine) {
    connectionText.textContent = "● ONLINE";
    connectionText.style.color = "#00e6a0";
    internetStatus.textContent =
      "Internet: Connected";
  } else {
    connectionText.textContent = "● OFFLINE";
    connectionText.style.color = "#ffb020";
    internetStatus.textContent =
      "Internet: Disconnected - Offline mode";
  }
}

// Display saved alerts
function showAlerts() {
  alertList.replaceChildren();

  if (alerts.length === 0) {
    alertList.textContent = "No alerts yet.";
    return;
  }

  alerts.forEach((alert) => {
    const item = document.createElement("p");
    item.textContent =
      "TEST SOS | " + alert.time + " | " + alert.status;

    item.style.padding = "10px";
    item.style.marginBottom = "8px";
    item.style.color = "#ff687c";

    alertList.appendChild(item);
  });
}

// Test SOS button
sosButton.addEventListener("click", () => {
  const now = new Date().toLocaleString();

  const newAlert = {
    time: now,
    status: navigator.onLine
      ? "Saved locally - Cloud not connected"
      : "Saved offline - Not sent"
  };

  alerts.unshift(newAlert);
  alerts = alerts.slice(0, 10);

  try {
    localStorage.setItem(
      "emergencyAlerts",
      JSON.stringify(alerts)
    );
  } catch {
    alert("Could not save alert on this device.");
  }

  showAlerts();

  alert(
    "TEST SOS created!\n\n" +
    "Status: " + newAlert.status
  );
});

// Listen for internet changes
window.addEventListener("online", updateConnection);
window.addEventListener("offline", updateConnection);

// Start
updateConnection();
showAlerts();

