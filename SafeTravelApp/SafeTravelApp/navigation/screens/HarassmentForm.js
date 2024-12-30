import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import * as Location from "expo-location";

const HarassmentForm = () => {
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [problem, setProblem] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [location, setLocation] = useState(null);

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
      } catch (err) {
        console.error(err);
        Alert.alert("Failed to get location.");
      }
    };

    getLocation();
  }, []);

  
  const handleReport = async () => {
    if (!name || !mobileNumber || !problem || !vehicleNumber) {
      Alert.alert("All fields are required!");
      return;
    }
  
    // Prepare report data with location
    const reportData = {
      name,
      mobileNumber, // Ensure matching keys with the backend
      vehicleNumber,
      problem,
      latitude:location.latitude,
      longitude:location.longitude,
    };
  
    try {
      const response = await fetch(
        "http://192.168.43.221:8000/harassmentreport/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reportData),
        }
      );
  
      if (response.ok) {
        Alert.alert("Report submitted successfully. Action will be taken soon.");
      } else {
        console.log(reportData);
        const errorData = await response.json(); // Optional: Parse server response for error details
        Alert.alert("Error", `Failed to submit the report. ${errorData.message || "Please try again."}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      Alert.alert("Error", "Network error. Please check your connection.");
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter your name"
      />

      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        value={mobileNumber}
        onChangeText={setMobileNumber}
        placeholder="Enter mobile number"
        keyboardType="phone-pad"
      />
      <Text style={styles.label}>Vehicle Number</Text>
      <TextInput
        style={styles.input}
        value={vehicleNumber}
        onChangeText={setVehicleNumber}
        placeholder="Enter vehicle number"
      />
      <Text style={styles.label}>Problem</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={problem}
        onChangeText={setProblem}
        placeholder="Describe the problem"
        multiline
      />

      <Button
        title="Submit the Report"
        onPress={handleReport}
        color="#4285F4"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
});

export default HarassmentForm;
