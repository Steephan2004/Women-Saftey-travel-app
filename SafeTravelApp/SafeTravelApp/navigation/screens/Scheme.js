import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import { Audio } from "expo-av";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import axios from "axios";
import * as Location from "expo-location";

// Task name
const BACKGROUND_FETCH_TASK = "background-fetch-task";

// Set the handler for foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Define the background task
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    console.log("Background task is running!");

    // Schedule a local notification to remind the user to check-in
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Check-in Reminder",
        body: "It is time to check-in! Please check-in now.",
      },
      trigger: {
        seconds: 1, // Trigger immediately (or set a time-based trigger here for testing)
      },
    });

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("Background task failed:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

const Sos = () => {
  const [lastCheckIn, setLastCheckIn] = useState("");
  const [checkInScheduled, setCheckInScheduled] = useState(false);
  const [checkInInterval, setCheckInInterval] = useState("");
  const [recording, setRecording] = useState( );
  const [playback, setPlayback] = useState();
  const [checkInDone, setCheckInDone] = useState(false);
  const [timerId, setTimerId] = useState(null);
  const [checkinterminate, setCheckinterminate] = useState(false);
  const [location, setLocation] = useState(null);
const[uri,setUri]=useState() 
  useEffect(() => {
    const requestNotificationPermission = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Notification permissions not granted!");
      } else {
        console.log("Notification permissions granted.");
      }
    };
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    const registerBackgroundFetch = async () => {
      try {
        const status = await BackgroundFetch.getStatusAsync();
        if (status === BackgroundFetch.BackgroundFetchStatus.Restricted) {
          console.warn("Background fetch is restricted on this device.");
          return;
        }

        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
          minimumInterval: 15 * 60,
          stopOnTerminate: false,
          startOnBoot: true,
        });

        console.log("Background fetch registered successfully.");
      } catch (error) {
        console.error("Failed to register background fetch:", error);
      }
    };

    registerBackgroundFetch();

    return () => {
      BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    };
  }, []);

  const handleUserCheckIn = () => {
    const currentTime = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });
    setLastCheckIn(currentTime);
    setCheckInScheduled(false);
    setCheckInDone(true);
    clearTimeout(timerId);
    console.log("Check-in complete:", currentTime);
  };

  const triggerMissedCheckInAlert = () => {
    if (checkinterminate) {
      sendSMS();
      alert("You missed your check-in! Sending the SOS alert!!!");
      setCheckInDone(true);
      setCheckInScheduled(false);
      setCheckInInterval("");

      scheduleCheckInReminder();
    }
  };

  const scheduleCheckInReminder = async () => {
    setCheckinterminate(true);
    setCheckInScheduled(true);
    setCheckInDone(false);
    console.log("Scheduling notification...");

    try {
      const interval = parseInt(checkInInterval, 10);
      if (isNaN(interval) || interval <= 0) {
        alert("Please enter a valid interval in minutes.");
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Check-in Reminder!",
          body: "You have not checked in yet. Please check in now.",
        },
        trigger: {
          seconds: interval * 60 - 60,
        },
      });

      const id = setTimeout(() => {
        if (!checkInDone) {
          triggerMissedCheckInAlert();
        }
      }, interval * 60 * 1000);
      setTimerId(id);

      console.log("Notification and timer scheduled successfully.");
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  };
  const turnOffCheckIn = () => {
    clearTimeout(timerId);
    Notifications.cancelAllScheduledNotificationsAsync();
    setCheckInScheduled(false);
    setCheckInDone(false);
    setCheckInInterval("");
    setCheckinterminate(false);
    alert("Check-in has been turned off.");
  };

  const startRecording = async () => {
    try {
      // Request microphone permissions
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        alert('Permission to access microphone is required!');
        return;
      }

      // Prepare and start recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingInstance = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recordingInstance.recording);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };
  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI(); // Get the URI of the recorded audio
      setUri(uri);
      console.log('Recording saved at:', uri);

      setRecording(null);
      // Send the audio file to the backend
      await sendAudioToBackend(uri);
    } catch (err) {
      console.error('Failed to stop recording:', err);
    }
  };
  const sendAudioToBackend = async (uri) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: 'recording.m4a', // Specify a file name
        type: 'audio/m4a', // Adjust the MIME type based on the recording options
      });

      const response = await fetch('https://your-backend-url.com/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        console.log('Audio uploaded successfully!');
      } else {
        console.error('Failed to upload audio:', response.statusText);
      }
    } catch (err) {
      console.error('Error uploading audio:', err);
    }
  };

  const playRecording = async () => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri,
        name: 'recording.m4a', // Specify a file name
        type: 'audio/m4a', // Adjust the MIME type based on the recording options
      });

      const response = await fetch('http://192.168.43.221:8000/upload/', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        console.log('Audio uploaded successfully!');
      } else {
        console.error('Failed to upload audio:', response.statusText);
      }
    } catch (err) {
      console.error('Error uploading audio:', err);
    }
  };
  
  const stopPlayback = async () => {
    if (playback) {
      await playback.stopAsync();
      console.log("Playback stopped");
    }
  };
  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission to access location was denied");
          return;
        }

        let { coords } = await Location.getCurrentPositionAsync();
        setLocation(coords);
        console.log(location);
      } catch (err) {
        console.error(err);
        Alert.alert("Failed to get location.");
      }
    };

    getLocation();
  }, []);

  const sendSMS = async () => {
    try {
      if (!location) {
        alert("Location not available", "Please enable location services.");
        return;
      }
      const response = await axios.post("http://192.168.43.221:8000/SMS/", {
        latitude: location.latitude,
        longitude: location.longitude,
      });

      if (response.status === 200) {
        alert("Success", response.data.message);
      } else {
        alert("Error", response.data.error || "An error occurred");
      }
    } catch (error) {
      console.error("Error making request:", error);
      alert("Error", "Could not connect to the server.");
    }
  };

  const Duration = (text) => {
    setCheckInInterval(text);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      <View>
        <TouchableOpacity onPress={sendSMS}>
          <Image source={require("../assets/sos.png")} style={styles.sos} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          backgroundColor: "#fff",
          padding: 10,
          elevation: 5,
          paddingVertical: 20,
        }}
      >
        <Text style={{ fontSize: 16 }}>Last Check-in: {lastCheckIn}</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Check-in Reminder (in minutes)"
          value={checkInInterval.toString()}
          onChangeText={Duration}
        />
        <TouchableOpacity
          onPress={() => {
            handleUserCheckIn();
            scheduleCheckInReminder();
          }}
        >
          <Text
            style={{
              textAlign: "center",
              padding: 15,
              backgroundColor: "#4285F4",
              color: "#fff",
              borderRadius: 50,
              marginLeft: 5,
            }}
          >
            CHECK IN NOW
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={turnOffCheckIn}>
          <Text
            style={{
              textAlign: "center",
              padding: 15,
              backgroundColor: "#4285F4",
              color: "#fff",
              borderRadius: 50,
              marginLeft: 5,
              marginTop: 5,
            }}
          >
            TURN OFF CHECK IN
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          backgroundColor: "#fff",
          elevation: 5,
          paddingVertical: 20,
          marginTop: 5,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            if (recording) {
              stopRecording();
            } else {
              startRecording();
            }
          }}
          style={{
            backgroundColor: recording ? "#FF0000" : "#4285F4",
            padding: 15,
            borderRadius: 50,
            margin: 10,
            width: wp(80),
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>
            {recording ? "Stop Recording" : "Start Recording"}
          </Text>
        </TouchableOpacity>
        <View style={{ flex: 0, flexDirection: "row" }}>
          <TouchableOpacity onPress={playRecording}>
            <Text
              style={{
                textAlign: "center",
                padding: 15,
                backgroundColor: "#4285F4",
                color: "#fff",
                borderRadius: 5,
                marginLeft: 5,
                width: wp(40),
              }}
            >
              PLAY
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={stopPlayback}>
            <Text
              style={{
                textAlign: "center",
                padding: 15,
                backgroundColor: "#4285F4",
                color: "#fff",
                borderRadius: 5,
                marginLeft: 5,
                width: wp(40),
              }}
            >
              STOP
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sos: {
    width: 250,
    height: 250,
    marginBottom: 20,
    borderRadius: 200,
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: wp(80),
  },
});

export default Sos;
