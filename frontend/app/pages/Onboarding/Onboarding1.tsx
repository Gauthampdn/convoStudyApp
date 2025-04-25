import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Onboarding1()
{
    const router = useRouter();

    const goNext = () => {

        router.push('/pages/Onboarding/Onboarding2');

    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tallyrus</Text>


        <View style={styles.imagePlaceHolder}>
            <Ionicons name="image-outline" size={50} color="gray" />
        </View>
        <Text style={styles.heading}>Smarter Studying Starts Here</Text>
        <Text style={styles.subheading}>Organize your notes, chat with AI, and master any subject effortlessly</Text>

         <View style={styles.pages}>
            <View style={styles.currentDotPage} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>

        <TouchableOpacity style={styles.button} onPress={goNext}>
                    <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
    </View>
    );

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },

    title: {
        fontSize: 24,
        padding: 20,
        marginTop: 40, 
        marginBottom: 20,

    },

    imagePlaceHolder: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginBottom: 20,
    },

    heading: {
        fontSize: 22,
        textAlign: 'center',
        marginBottom: 10,
    },

    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        fontSize: 16,
        alignItems: 'center',
    },

    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },

    subheading: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
    },

    pages: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    
    dot: {
        width: 8,
        height: 8,
        backgroundColor: '#ccc',
        borderRadius: 4,
        marginHorizontal: 4,
    },

    currentDotPage: {
        width: 8,
        height: 8,
        backgroundColor: '#000',
        borderRadius: 4,
        marginHorizontal: 4,
    },


})
