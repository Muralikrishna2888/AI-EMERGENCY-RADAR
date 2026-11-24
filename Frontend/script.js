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

// ===== AI EMERGENCY RADAR - DEMO DETECTION =====

const startBtn = document.getElementById("startDetection");
const simulateBtn = document.getElementById("simulateEmergency");
const cancelBtn = document.getElementById("cancelAlert");

const detectionStatus =
  document.getElementById("detectionStatus");

const detectionMessage =
  document.getElementById("detectionMessage");

let monitoringActive = false;
let countdownTimer = null;
let countdownValue = 10;

startBtn.addEventListener("click", () => {
  monitoringActive = true;

  detectionStatus.textContent = "Detection: ACTIVE";
  detectionStatus.style.color = "#00e6a0";

  detectionMessage.textContent =
    "Demo monitoring is active. Waiting for simulated event.";
});

simulateBtn.addEventListener("click", () => {
  if (!monitoringActive) {
    detectionMessage.textContent =
      "Please start monitoring first.";
    return;
  }

  if (countdownTimer) return;

  countdownValue = 10;

  detectionMessage.textContent =
    "TEST EVENT DETECTED! SOS in " +
    countdownValue + " seconds. Press CANCEL to stop.";

  countdownTimer = setInterval(() => {
    countdownValue--;

    if (countdownValue > 0) {
      detectionMessage.textContent =
        "TEST SOS in " + countdownValue +
        " seconds. Press CANCEL to stop.";
    } else {
      clearInterval(countdownTimer);
      countdownTimer = null;

      const testAlert = {
        time: new Date().toLocaleString(),
        status: navigator.onLine
          ? "Automatic demo alert - Cloud not connected"
          : "Automatic demo alert - Saved offline"
      };

      alerts.unshift(testAlert);
      alerts = alerts.slice(0, 10);

      try {
        localStorage.setItem(
          "emergencyAlerts",
          JSON.stringify(alerts)
        );
        showAlerts();

        detectionMessage.textContent =
          "TEST ALERT SAVED LOCALLY.";
      } catch {
        detectionMessage.textContent =
          "Unable to save test alert.";
      }
    }
  }, 1000);
});

cancelBtn.addEventListener("click", () => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }

  detectionMessage.textContent =
    "Test alert cancelled.";

});

// ===== VOICE DETECTION SYSTEM =====

const startVoice = document.getElementById("startVoice");
const stopVoice = document.getElementById("stopVoice");
const voiceStatus = document.getElementById("voiceStatus");
const voiceMessage = document.getElementById("voiceMessage");

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

let recognition = null;
let voiceActive = false;

if (!SpeechRecognition) {
  voiceStatus.textContent = "Voice detection not supported";
  voiceMessage.textContent =
    "Please try a supported browser such as Chrome.";
} else {
  recognition = new SpeechRecognition();

  recognition.lang = "en-IN";
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onstart = () => {
    voiceStatus.textContent = "Microphone: ACTIVE";
    voiceMessage.textContent =
      "Listening for HELP. Demo mode only.";
  };

  recognition.onresult = (event) => {
    const result =
      event.results[event.results.length - 1][0]
        .transcript.toLowerCase();

    voiceMessage.textContent = "Heard: " + result;

    const helpWords = [
      "help",
      "help me",
      "సహాయం",
      "కాపాడండి"
    ];

    const detected = helpWords.some(word =>
      result.includes(word)
    );

    if (detected && monitoringActive) {
      voiceMessage.textContent =
        "HELP detected! Starting TEST countdown.";

      if (!countdownTimer) {
        simulateBtn.click();
      }
    }
  };

  recognition.onerror = (event) => {
    voiceMessage.textContent =
      "Voice error: " + event.error;
  };

  recognition.onend = () => {
    if (voiceActive) {
      voiceStatus.textContent = "Microphone: Paused";
      voiceMessage.textContent =
        "Listening stopped. Restart voice detection if needed.";
      voiceActive = false;
    }
  };

  startVoice.addEventListener("click", () => {
    if (!monitoringActive) {
      voiceMessage.textContent =
        "First activate START MONITORING.";
      return;
    }

    if (!voiceActive) {
      voiceActive = true;
      recognition.start();
    }
  });

  stopVoice.addEventListener("click", () => {
    voiceActive = false;

    if (recognition) {
      recognition.stop();
    }

    voiceStatus.textContent = "Microphone: OFF";
    voiceMessage.textContent = "Voice detection stopped.";
  });
}

