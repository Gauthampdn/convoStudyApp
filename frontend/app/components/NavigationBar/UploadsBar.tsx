import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UploadsBar = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Sets</Text>
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

export default UploadsBar;