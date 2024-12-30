import React from 'react';
import { View, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const Report = ({navigation}) => {
  const handleHarassmentForm=()=>{
    navigation.navigate('HarassmentForm');
  }
  const handleEFirForm=()=>{
    navigation.navigate('E_FIR');
  }
    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleHarassmentForm}>
                    <Text style={styles.buttonText}>Form of Nuisance</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleEFirForm}>
                    <Text style={styles.buttonText}>E-FIR</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 20, 
    },
    button: {
        width: screenWidth * 0.7, 
        paddingVertical: 15,
        backgroundColor: '#4285F4',
        borderRadius: 100,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 19,
        fontWeight: 'bold',
    },
});

export default Report;