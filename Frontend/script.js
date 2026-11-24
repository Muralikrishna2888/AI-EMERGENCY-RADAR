// ==========// AI EMERGENCY RADAR // Main JavaScript// =========

const $ = (id) => document.getElementById(id);

const connectionText = $("connectionText");
const internetStatus = $("internetStatus");
const systemStatus = $("systemStatus");

const sosButton = $("sosButton");

const startDetection = $("startDetection");
const simulateEmergency = $("simulateEmergency");
const cancelAlert = $("cancelAlert");

const detectionStatus = $("detectionStatus");
const detectionMessage = $("detectionMessage");

const startVoice = $("startVoice");
const stopVoice = $("stopVoice");

const voiceStatus = $("voiceStatus");
const voiceMessage = $("voiceMessage");

const alertList = $("alertList");

let monitoringActive = false;
let countdownTimer = null;
let countdown = 10;

let recognition = null;
let voiceActive = false;

// ==========// LOAD SAVED ALERTS // ==========

let alerts = [];

try {
  alerts = JSON.parse(
    localStorage.getItem("emergencyAlerts") || "[]"
  );

  if (!Array.isArray(alerts)) alerts = [];

} catch (error) {
  alerts = [];
}

// ========// INTERNET STATUS // ========

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
      "Internet: Disconnected";

  }
}

window.addEventListener("online", updateConnection);
window.addEventListener("offline", updateConnection);

// ===========// SAVE ALERT // ===========

function saveAlert(message) {

  const alert = {
    time: new Date().toLocaleString(),
    status: message
  };

  alerts.unshift(alert);
  alerts = alerts.slice(0, 10);

  try {

    localStorage.setItem(
      "emergencyAlerts",
      JSON.stringify(alerts)
    );

    showAlerts();

    return true;

  } catch (error) {

    console.error("Storage error:", error);
    return false;

  }
}

// =================================
// DISPLAY ALERTS
// =================================

function showAlerts() {

  alertList.replaceChildren();

  if (alerts.length === 0) {
    alertList.textContent = "No alerts yet.";
    return;
  }

  alerts.forEach(alert => {

    const item = document.createElement("p");

    item.textContent =
      "TEST SOS | " +
      alert.time +
      " | " +
      alert.status;

    item.style.padding = "12px";
    item.style.marginBottom = "10px";
    item.style.color = "#ff7187";

    alertList.appendChild(item);

  });
}

// =================================
// MANUAL TEST SOS
// =================================

sosButton.addEventListener("click", () => {

  const saved = saveAlert(
    navigator.onLine
      ? "Manual test - Cloud not connected"
      : "Manual test - Saved offline, not sent"
  );

  alert(
    saved
      ? "TEST SOS created and saved locally."
      : "Could not save test alert."
  );

});

// =================================
// START MONITORING
// =================================

startDetection.addEventListener("click", () => {

  monitoringActive = true;

  detectionStatus.textContent =
    "Detection: ACTIVE";

  detectionStatus.style.color = "#00e6a0";

  systemStatus.textContent =
    "System: Demo monitoring active";

  detectionMessage.textContent =
    "Waiting for a simulated event.";

});

// =================================
// EMERGENCY COUNTDOWN
// =================================

function startCountdown() {

  if (!monitoringActive) {

    detectionMessage.textContent =
      "Start monitoring first.";

    return;
  }

  if (countdownTimer !== null) return;

  countdown = 10;

  detectionMessage.textContent =
    "TEST EVENT DETECTED! Alert in 10 seconds.";

  countdownTimer = setInterval(() => {

    countdown--;

    if (countdown > 0) {

      detectionMessage.textContent =
        "TEST SOS in " + countdown +
        " seconds. Press CANCEL to stop.";

    } else {

      clearInterval(countdownTimer);
      countdownTimer = null;

      const saved = saveAlert(
        navigator.onLine
          ? "Automatic demo alert - Cloud not connected"
          : "Automatic demo alert - Saved offline, not sent"
      );

      detectionMessage.textContent = saved
        ? "TEST ALERT SAVED LOCALLY."
        : "Could not save alert.";

    }

  }, 1000);

}

simulateEmergency.addEventListener(
  "click",
  startCountdown
);

// =================================
// CANCEL ALERT
// =================================

cancelAlert.addEventListener("click", () => {

  if (countdownTimer !== null) {

    clearInterval(countdownTimer);
    countdownTimer = null;

  }

  detectionMessage.textContent =
    "Test alert cancelled.";

});

// =================================
// VOICE DETECTION
// =================================

const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

if (!SpeechRecognition) {

  voiceStatus.textContent =
    "Voice detection unavailable";

  voiceMessage.textContent =
    "This browser does not support speech recognition.";

} else {

  recognition = new SpeechRecognition();

  recognition.lang = "en-IN";
  recognition.continuous = true;
  recognition.interimResults = false;

  recognition.onstart = () => {

    voiceStatus.textContent =
      "Microphone: ACTIVE";

    voiceMessage.textContent =
      "Listening. Demo mode only.";

  };

  recognition.onresult = (event) => {

    const transcript =
      event.results[event.results.length - 1][0]
        .transcript.toLowerCase();

    voiceMessage.textContent =
      "Heard: " + transcript;

    const helpWords = [
      "help",
      "help me",
      "help please",
      "సహాయం",
      "కాపాడండి"
    ];

    const detected = helpWords.some(word =>
      transcript.includes(word)
    );

    if (detected && monitoringActive) {

      voiceMessage.textContent =
        "HELP phrase detected. Starting TEST countdown.";

      startCountdown();

    }

  };

  recognition.onerror = (event) => {

    voiceMessage.textContent =
      "Voice error: " + event.error;

  };

  recognition.onend = () => {

    voiceStatus.textContent =
      "Microphone: OFF";

    voiceActive = false;

  };

  startVoice.addEventListener("click", () => {

    if (!monitoringActive) {

      voiceMessage.textContent =
        "Start monitoring first.";

      return;
    }

    if (!voiceActive) {

      try {

        voiceActive = true;
        recognition.start();

      } catch (error) {

        voiceActive = false;

        voiceMessage.textContent =
          "Could not start microphone.";

      }

    }

  });

  stopVoice.addEventListener("click", () => {

    voiceActive = false;

    recognition.stop();

    voiceStatus.textContent =
      "Microphone: OFF";

    voiceMessage.textContent =
      "Voice detection stopped.";

  });

}

// =================================
// INITIALIZE
// =================================

updateConnection();
showAlerts();

systemStatus.textContent = "System: Ready";
