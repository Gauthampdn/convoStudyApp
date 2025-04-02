import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from 'expo-router';

export default function Onboarding1()
{
    const router = useRouter();

    const goNext = () => {

        router.push('/Onboarding/Onboarding2');

    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tallyrus</Text>


        <Text style={styles.heading}>Smarter Studying Starts Here</Text>
        <Text style={styles.subheading}>Organize your notes, chat with AI, and master any subject effortlessly</Text>

        <TouchableOpacity onPress={goNext}>Next</TouchableOpacity>
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

    heading: {
        fontSize: 22,
        textAlign: 'center',
        marginBottom: 10,
    },

    subheading: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
    }
})
