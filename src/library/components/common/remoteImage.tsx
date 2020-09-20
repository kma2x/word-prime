import React, {Component} from 'react';
import {ActivityIndicator, View} from 'react-native';
import CachedImage from 'react-native-image-cache-wrapper';

type Props = {
  source: any;
  style: any;
  resizeMode?: any;
  children?: any;
};

export default class RemoteImage extends Component<Props> {
  render() {
    return (
      <View style={this.props.style}>
        <CachedImage
          resizeMode={this.props.resizeMode}
          style={this.props.style}
          source={this.props.source}
          children={this.props.children}
          activityIndicator={
            <ActivityIndicator
              animating={true}
              color="#999999"
              size={'large'}
            />
          }
        />
      </View>
    );
  }
}
