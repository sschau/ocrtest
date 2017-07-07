'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Platform, Image, TouchableNativeFeedback
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import RNTesseractOcr from 'react-native-tesseract-ocr';

var Button = TouchableNativeFeedback;

export default class Root extends Component {
constructor(props, context) {
    super(props, context);
    this.state = {imgSource: null, ocrResult: 'WAITING'};
}

selectPhoto() {
        const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        var source;

        if (Platform.OS === 'android') {
          source = {uri: response.uri, isStatic: true};
        } else {
          source = {uri: response.uri.replace('file://', ''), isStatic: true};
        }

        //console.log('image src: ', response.uri);
        this.setState({ imgSource: source });
        
        RNTesseractOcr.startOcr(response.path, "LANG_ENGLISH")
          .then((result) => {
            this.setState({ ocrResult: result });
            console.log("OCR Result: ", result);
          })
          .catch((err) => {
            this.setState({ ocrResult: 'exception' });
            console.log("OCR Error: ", err);
          })
          .done();
      }
    });
  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          OCR Test
        </Text>
        <Text style={styles.instructions}>
          To get started, Click the button below
        </Text>
        <Text style={styles.instructions}>
          Wait for the OCR to scan,{'\n'}
          The result will display below.
        </Text>

        <Button onPress={this.selectPhoto.bind(this)} >
          <View style={[styles.img, styles.imgContainer, {marginBottom: 20}]}>
          { this.state.imgSource === null ? <Text>Select a Photo</Text> :
            <Image style={styles.img} source={this.state.imgSource} />
          }
          </View>
        </Button>
        
        <Text style={styles.instructions}>
            OCR Result : {'\n'}
            {this.state.ocrResult}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});


