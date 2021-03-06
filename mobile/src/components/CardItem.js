/*
 * @Author: Karim DALAIZE
 * @Date: 2019-03-10 20:15:32
 * @Last Modified by: Karim DALAIZE
 * @Last Modified time: 2019-03-10 21:34:14
 */

//@flow

import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { material, systemWeights } from 'react-native-typography';

import { TribeProject } from '@utils';

type Props = {
    item: TribeProject
};

class CardItem extends Component<Props> {
    render() {
        const { item } = this.props;
        return (
            <View style={styles.container}>
                <Text style={styles.titleStyle}>{item.name}</Text>
                <Text style={styles.descriptionStyle}>{item.description}</Text>
            </View>
        );
    }
}

const styles = {
    container: {
        borderWidth: 1,
        borderColor: '#f0f0f0',
        backgroundColor: 'white',
        borderRadius: 4,
        flexGrow: 1,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
        padding: 15,
        margin: 5
    },
    titleStyle: {
        ...material.titleObject
    },
    descriptionStyle: {
        ...material.subheadingObject
    }
};

export { CardItem };
