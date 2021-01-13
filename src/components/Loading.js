import React, { useEffect } from 'react';
import { StyleSheet, Modal, View, Animated } from 'react-native';

const Loading = () => {

    const spinner = new Animated.Value(0);

    useEffect(() => {
        spin();
    }, [])

    const spin = () => {
        spinner.setValue(0);
        Animated.sequence([
        Animated.timing(
            spinner,
            {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            }
        )
        ]).start(() => spin());
    }

    const spining = spinner.interpolate({
        inputRange: [0,1],
        outputRange: ['0deg','360deg']
    });
    
    return(
        <View>
            <Modal animationType="fade"
            transparent={true}
            visible={true}>
            <View style={styles.modalBackground}>
                <Animated.View style={[styles.circleLoad,{ transform: [{ rotate: spining }]}]}>
                </Animated.View>
            </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    circleLoad: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 14,
        borderTopColor: '#FFF',
        borderRightColor: 'transparent',
        borderBottomColor: '#FFF',
        borderLeftColor: 'transparent',
    },
    modalBackground: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        height: '100%',
        width: '100%', 
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Loading;