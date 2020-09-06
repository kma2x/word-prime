import React, {Component} from 'react';
import {
  TouchableWithoutFeedback,
  Text,
  ImageBackground,
  View,
} from 'react-native';

import R, {Images} from '@res/R';
import {styles} from './availableLetter.style';

type Props = {
  id: string;
  onPress: Function;
  character: string;
  letterState: AvailableLetterState;
};

export type AvailableLetterType = {
  id: string;
  letterState: AvailableLetterState;
  character: string;
};

export enum AvailableLetterState {
  Idle,
  Selected,
  Bought,
}

export default class AvailableLetter extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          const letterTapped: AvailableLetterType = {
            id: this.props.id,
            letterState: this.props.letterState,
            character: this.props.character,
          };

          this.props.onPress(letterTapped);
        }}>
        <View>
          <ImageBackground
            style={{
              ...styles.letter,
              opacity:
                this.props.letterState === AvailableLetterState.Idle ? 1 : 0,
            }}
            source={R.img(Images.option_letter)}>
            <View style={styles.characterContainer}>
              <Text style={styles.character}>
                {this.props.character.toUpperCase()}
              </Text>
            </View>
          </ImageBackground>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
