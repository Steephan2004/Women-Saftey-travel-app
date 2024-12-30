import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

const Login = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const handlePhoneNumberChange = (input) => {
    setPhoneNumber(input);
  };

  const handlePasswordChange = (input) => {
    setPassword(input);
  };

  const validateInput = () => {
    if (phoneNumber.length !== 10 || !/^[0-9]{10}$/.test(phoneNumber)) {
      Alert.alert("Invalid Phone Number", "Please enter a valid 10-digit phone number.");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Invalid Password", "Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    if (validateInput()) {
      // You can send the phoneNumber and password to your backend here.
      console.log("Login Success");
      navigation.navigate("MainContainer");
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <TextInput
          style={styles.input}
          onChangeText={handlePhoneNumberChange}
          value={phoneNumber}
          placeholder="Enter Phone Number"
          maxLength={10}
          keyboardType="numeric"
        />
      </View>
      <View>
        <TextInput
          style={styles.input}
          onChangeText={handlePasswordChange}
          value={password}
          placeholder="Enter Password"
          secureTextEntry={true}
        />
        <TouchableOpacity>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress={onSubmit}>
          <Text style={styles.Button}>Login</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.orText}>Or</Text>
      </View>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate("NewAccount")}>
          <Text style={styles.Button}>Create New Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingTop: hp(10), // Adjusted dynamic padding
  },
  input: {
    height: hp(7),
    width: wp(85),
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: "#000",
    fontSize: 17.5,
  },
  Button: {
    fontWeight: "600",
    padding: 15,
    width: wp(85),
    backgroundColor: "#4285F4",
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    borderRadius: 40,
    marginBottom: 10,
    marginTop: 10,
  },
  forgotPassword: {
    marginBottom: 15,
    color: "#4285F4",
    fontSize: 16,
  },
  orText: {
    fontSize: 20,
    color: "grey",
  },
});

export default Login;
