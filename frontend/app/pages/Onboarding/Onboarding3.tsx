import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Onboarding3() 
{
    const router = useRouter();

    const goNext = () => {
        router.push('/pages/Onboarding/Onboarding4');
    };

    return (

    <View style={styles.container}>
        <Text style={styles.title}>Tallyrus</Text>

        <Text style={styles.header}>Turn Notes Into Knowledge</Text>
        <Text style={styles.subtext}>Chat with AI to summarize, quiz yourself, and get tailored study tips.</Text>

        <View style={styles.imagePlaceHolder}>
            <Ionicons name="image-outline" size={50} color="gray" />
        </View>

        <View style={styles.pages}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.currentDotPage} />
            <View style={styles.dot} />
        </View>
        <TouchableOpacity style={styles.button} onPress={goNext}>
            <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
    </View>

    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },

    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },

    subtext: {
        fontSize: 14,
        textAlign: 'center',
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

    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        fontSize: 16,
        alignItems: 'center',
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

    buttonText: {
        fontWeight: 'bold',
        fontSize: 16,
    },



})