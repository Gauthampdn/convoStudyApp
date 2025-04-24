import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InsightsBar = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Home</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 10, 
        fontWeight: 'bold',
    },
});

export default InsightsBar;