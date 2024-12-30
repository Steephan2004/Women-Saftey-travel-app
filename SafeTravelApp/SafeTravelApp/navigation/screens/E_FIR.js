import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from "react-native";
import React, { useState } from "react";
import { efirdata } from "./mobnodata";
import { Picker } from "@react-native-picker/picker";

const E_Fir = () => {
  const [name, setName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [doorNo, setDoorNo] = useState(""); // Changed from 'address' to 'doorNo'
  const [streetname, setStreetName] = useState("");
  const [pincode, setPincode] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const cityNames = Object.keys(efirdata);

  const handleSubmit = async () => {
    const complaintData = {
      name,
      mobileNo,
      doorNo,
      streetname,
      city: selectedCity,
      pincode,
      subject,
      description,
    };
    console.log("HIi");
    // Send POST request to backend using fetch
    try {
      const response = await fetch(
        "http://192.168.43.221:8000/complaint/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(complaintData),
        }
      );

      if (response.ok) {
        Alert.alert(
          "E-Fir Sent successfully\nAction Will be taken soon"
        );
      } else {
        console.log(reportData);
        const errorData = await response.json(); // Optional: Parse server response for error details
        Alert.alert(
          "Error",
          `Failed to submit the report. ${
            errorData.message || "Please try again."
          }`
        );
      }
    } catch (error) {
      console.error("Network error:", error);
      Alert.alert("Error", "Network error. Please check your connection.");
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={(text) => setName(text)}
          />

          <Text style={styles.label}>Mobile No:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your mobile number"
            keyboardType="phone-pad"
            value={mobileNo}
            onChangeText={(text) => setMobileNo(text)}
          />

          <Text style={styles.label}>Door No:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your door no"
            value={doorNo}
            onChangeText={(text) => setDoorNo(text)}
          />

          <Text style={styles.label}>Street Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your street name"
            value={streetname}
            onChangeText={(text) => setStreetName(text)}
          />

          <Text style={styles.label}>City:</Text>
          <Picker
            selectedValue={selectedCity}
            onValueChange={(itemValue) => setSelectedCity(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a city" value="" />
            {cityNames.map((city, index) => (
              <Picker.Item key={index} label={city} value={city} />
            ))}
          </Picker>

          <Text style={styles.label}>Pincode:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your pincode"
            keyboardType="number-pad"
            value={pincode}
            onChangeText={(text) => setPincode(text)}
          />
        </View>

        <View style={styles.box}>
          <Text style={styles.label}>Subject:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter the subject"
            value={subject}
            onChangeText={(text) => setSubject(text)}
          />

          <Text style={styles.label}>Description:</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Enter the description"
            multiline
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
        </View>

        <View style={styles.submitBox}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
  },
  box: {
    width: "90%",
    padding: "5%",
    backgroundColor: "#4285f4",
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 6.27,
    elevation: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "white",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  picker: {
    width: "100%",
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 100,
    marginBottom: 15,
  },
  submitBox: {
    width: "80%",
    marginVertical: 10,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#4285f4",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 200,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default E_Fir;
