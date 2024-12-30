import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import axios from "axios";

const SignupForm = ({ navigation }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validatePhoneNumber = (number) => /^[0-9]{10}$/.test(number);

  const validateFields = () => {
    if (!name.trim() || !username.trim() || !address.trim() || !password.trim()) {
      Alert.alert("Error", "All fields are required.");
      return false;
    }
    if (!validatePhoneNumber(mobileNumber)) {
      Alert.alert("Error", "Invalid mobile number.");
      return false;
    }
    return true;
  };

  const requestOtp = async () => {
    if (validateFields()) {
      try {
        const userData = {
          name: name.trim(),
          username: username.trim(),
          mobilenumber: mobileNumber.trim(),
          address: address.trim(),
          password: password.trim(),
        };
        await axios.post("http://192.168.43.221:5001/register/", userData);
        setOtpSent(true);
        Alert.alert("OTP Sent", "Please enter the OTP sent to your phone.");
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to send OTP. Please try again.");
      }
    }
  };

  const verifyOtpAndSubmit = () => {
    const mockOtp = "1234"; // Replace with actual OTP verification logic in production.
    if (otp === mockOtp) {
      Alert.alert("Success", "Registration complete!");
      navigation.navigate("MainContainer");
    } else {
      Alert.alert("Invalid OTP", "Please enter the correct OTP.");
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "#fff", paddingTop: 20 }}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          value={mobileNumber}
          keyboardType="phone-pad"
          onChangeText={setMobileNumber}
          maxLength={10}
        />
        <TextInput
          style={styles.addressInput}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          multiline={true}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="New Password"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Icon
              name={isPasswordVisible ? "visibility" : "visibility-off"}
              size={24}
            />
          </TouchableOpacity>
        </View>

        {!otpSent && (
          <TouchableOpacity style={styles.otpButton} onPress={requestOtp}>
            <Text style={styles.buttonText}>Verify Mobile Number</Text>
          </TouchableOpacity>
        )}

        {otpSent && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              value={otp}
              keyboardType="number-pad"
              onChangeText={setOtp}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={verifyOtpAndSubmit}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingTop: 50,
  },
  input: {
    height: hp(7),
    width: wp(85),
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    color: "#000",
    fontSize: 17.5,
    borderRadius: 5,
    marginBottom: 20,
  },
  addressInput: {
    height: hp(15),
    width: wp(85),
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    color: "#000",
    fontSize: 17.5,
    borderRadius: 5,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: hp(7),
    width: wp(85),
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  passwordInput: {
    flex: 1,
    fontSize: 17.5,
    color: "#000",
  },
  otpButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 40,
    marginBottom: 10,
    marginTop: 10,
    width: wp(85),
  },
  submitButton: {
    backgroundColor: "#4285F4",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 40,
    width: wp(85),
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
});

export default SignupForm;
