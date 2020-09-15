import React, {Component} from 'react';
import {Text, Image, StyleSheet} from 'react-native';
import {View} from 'react-native-animatable';

import R, {Fonts, Colors, Images} from '@res/R';
import {strings} from '@library/services/i18nService';

import {isAndroid} from '@library/services/deviceService';

import RectButton, {
  RectButtonEnum,
} from '@library/components/button/rectButton';

import {defaultButtonSize} from '@library/components/button/rectButton';

type Props = {
  onPress: Function;
  price: number;
};

export default class RestoreLivesButton extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <RectButton type={RectButtonEnum.Red} onPress={this.props.onPress}>
        <View style={styles.countdownButton}>
          <View style={styles.countdownButtonUpperView}>
            <Text style={styles.countdownButtonUpperText}>
              {strings('restoreLives')}
            </Text>
          </View>
          <View style={styles.countdownButtonLowerView}>
            <Image
              style={styles.countdownButtonLowerCoin}
              source={R.img(Images.coin_small)}
            />
            <Text style={styles.countdownButtonLowerText}>
              {this.props.price}
            </Text>
          </View>
        </View>
      </RectButton>
    );
  }
}

const styles = StyleSheet.create({
  countdownButton: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: defaultButtonSize.height * 0.05,
    marginBottom:
      defaultButtonSize.marginBottom + defaultButtonSize.height * 0.08,
  },
  countdownButtonUpperView: {
    flex: 2.5,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  countdownButtonUpperText: {
    fontFamily: Fonts.league,
    fontSize: defaultButtonSize.height * (isAndroid ? 0.23 : 0.25),
    textAlign: 'center',
    color: Colors.redButtonText,
  },
  countdownButtonLowerView: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    maxHeight: defaultButtonSize.height * 0.4,
    marginTop: -defaultButtonSize.height * 0.06,
  },
  countdownButtonLowerText: {
    fontFamily: Fonts.alata,
    fontSize: defaultButtonSize.height * 0.23,
    textAlign: 'center',
    color: '#ffffff',
    marginLeft: defaultButtonSize.height * 0.03,
  },
  countdownButtonLowerCoin: {
    marginTop: defaultButtonSize.height * (isAndroid ? 0.09 : 0.055),
    width: defaultButtonSize.height * 0.25,
    height: defaultButtonSize.height * 0.25,
  },
});
