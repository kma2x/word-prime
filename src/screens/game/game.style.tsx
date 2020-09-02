import {StyleSheet} from 'react-native';
import R from '@res/R';
import {isTablet} from 'react-native-device-info';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const getStyles: any = () => {
  return StyleSheet.create({
    background: {
      flex: 1,
    },
    backButton: {
      marginLeft: 10,
    },
  });
};

export {getStyles};
