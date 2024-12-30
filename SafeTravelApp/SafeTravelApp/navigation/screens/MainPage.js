import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Dimensions,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, Polyline, Circle } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import cities from "./cities";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

const OSRM_API_URL = "http://router.project-osrm.org/route/v1/driving/";

const locationsData = [
  { id: 1, name: "Location 1", latitude: 11.916354, longitude: 79.634334, radius: 500, color: "rgba(255, 0, 0, 0.3)" },
  { id: 2, name: "Location 2", latitude: 11.917074, longitude: 79.630172, radius: 500, color: "rgba(255, 165, 0,0.3)" },
  { id: 3, name: "Location 3", latitude: 11.917032, longitude: 79.639, radius: 500, color: "rgba(255, 255, 0,0.3)" },
];

const safeareaData = [
  { id: 1, name: "Safe Zone 1", latitude: 11.927205, longitude: 79.644562, radius: 500, color: "rgba(0, 255, 0, 0.3)" },
];

const Map = () => {
  const [location, setLocation] = useState(null);
  const [destinationCity, setDestinationCity] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [path, setPath] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [intervalId, setIntervalId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user location on mount
  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission denied", "Location access is required.");
          return;
        }
        let { coords } = await Location.getCurrentPositionAsync();
        setLocation(coords);
      } catch (err) {
        console.error(err);
        Alert.alert("Error", "Failed to fetch location.");
      }
    };

    getLocation();
  }, []);

  const fetchDestinationCoordinates = (city) => cities[city] || null;

  const getRouteData = async (start, end) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${OSRM_API_URL}${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`
      );

      if (response.data.routes.length > 0) {
        const route = response.data.routes[0];
        const pathCoordinates = route.geometry.coordinates.map((coord) => ({
          latitude: coord[1],
          longitude: coord[0],
        }));
        setIsLoading(false);
        return pathCoordinates;
      } else {
        throw new Error("No route found.");
      }
    } catch (error) {
      console.error("Error fetching route data:", error);
      Alert.alert("Error", "Unable to fetch route data.");
      setIsLoading(false);
    }
  };

  const calculatePath = async () => {
    if (location && selectedDestination) {
      try {
        const pathCoordinates = await getRouteData(location, selectedDestination);
        setPath(pathCoordinates);
      } catch (error) {
        console.error("Error calculating path:", error);
        Alert.alert("Error", "Failed to calculate path.");
      }
    } else {
      Alert.alert("Error", "Invalid location or destination.");
    }
  };

  const handleSearchDestination = () => {
    if (!destinationCity.trim()) {
      Alert.alert("Error", "Please enter a destination city.");
      return;
    }
    const coordinates = fetchDestinationCoordinates(destinationCity.trim());
    if (coordinates) {
      setSelectedDestination(coordinates);
      calculatePath();
    } else {
      Alert.alert("Error", "City not found. Please select a valid city.");
    }
  };

  const handleSendLocation = async () => {
    if (!mobileNumber.match(/^\d{10}$/)) {
      Alert.alert("Invalid Input", "Enter a valid 10-digit mobile number.");
      return;
    }
    const id = setInterval(async () => {
      if (location) {
        try {
          await axios.post("http://your-api-endpoint/sos/", {
            latitude: location.latitude,
            longitude: location.longitude,
            mobile: mobileNumber,
          });
          console.log("Location sent");
        } catch (error) {
          console.error("Failed to send location:", error);
          clearInterval(id);
        }
      }
    }, 5000);
    setIntervalId(id);
    setModalVisible(false);
  };

  const handleCancelLocation = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      Alert.alert("Location updates stopped.");
    }
  };

  const renderMarkers = (data, pinColor) => {
    return data.map((loc) => (
      <View key={loc.id}>
        <Circle center={{ latitude: loc.latitude, longitude: loc.longitude }} radius={loc.radius} fillColor={loc.color} strokeColor="transparent" />
      </View>
    ));
  };

  if (!location) {
    return (
      <View style={styles.centered}>
        <Text>Loading location...</Text>
      </View>
    );
  }

  const initialRegion = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ width, height }} initialRegion={initialRegion} showsUserLocation>
        {renderMarkers(locationsData, "red")}
        {renderMarkers(safeareaData, "green")}
        {selectedDestination && <Marker coordinate={selectedDestination} pinColor="red" />}
        {path.length > 0 && <Polyline coordinates={path} strokeColor="blue" strokeWidth={3} />}
      </MapView>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter destination city"
          style={styles.input}
          value={destinationCity}
          onChangeText={setDestinationCity}
          clearButtonMode="while-editing"
        />
        <TouchableOpacity onPress={handleSearchDestination} style={styles.iconButton}>
          <Icon name="search" size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.shareButton}>
          <Text style={styles.shareButtonText}>SHARE</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Enter Mobile Number</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            value={mobileNumber}
            onChangeText={setMobileNumber}
          />
          <TouchableOpacity style={styles.modalButton} onPress={handleSendLocation}>
            <Text style={styles.modalButtonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {intervalId && (
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelLocation}>
          <Text style={styles.cancelButtonText}>Stop Sending Location</Text>
        </TouchableOpacity>
      )}

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4285F4" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  inputContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 3,
    elevation: 2,
  },
  input: { flex: 1, height: 40, padding: 10, borderWidth: 1, borderColor: "#ddd", borderRadius: 5 },
  iconButton: { marginLeft: 10, backgroundColor: "#4285F4", padding: 7, borderRadius: 5 },
  shareButton: { marginLeft: 10, backgroundColor: "#4285F4", padding: 10, borderRadius: 5 },
  shareButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalContainer: { flex: 0, justifyContent: "center", alignItems: "center", backgroundColor: "#4285F4",height:hp(50),top:180,width:wp(90),left:20,borderRadius:10},
  modalTitle: { fontSize: 20, color: "#fff", marginBottom: 10 },
  modalInput: { backgroundColor: "#fff", width: "80%", padding: 15, borderRadius: 5, marginBottom: 20 },
  modalButton: { backgroundColor: "#fff", padding: 10, borderRadius: 5, marginBottom: 5,paddingHorizontal:100 },
  modalButtonText: { color: "#4285F4", fontSize: 16, fontWeight: "bold" },
  cancelButton: { backgroundColor: "#FF5722", padding: 10, borderRadius: 5, position: "absolute", bottom: 100, right: 10 },
  cancelButtonText: { color: "#fff", fontSize: 16 },
  loadingOverlay: { ...StyleSheet.absoluteFill, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.3)" },
});

export default Map;
