import {StyleSheet} from 'react-native';
import {Fonts} from '@res/R';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {isTablet} from 'react-native-device-info';

const getStyles: any = () => {
  const bottomHeight = hp('35%');
  const levelChooserNumberWidth = hp('10%');
  const levelChooserNumberConstant = 0.322420634920635;
  const levelChooserNumberHeight =
    levelChooserNumberWidth * levelChooserNumberConstant;
  const levelChooserFont = hp('1.5%');

  return StyleSheet.create({
    container: {
      flex: 1,
      position: 'absolute',
      bottom: 0,
      width: wp('100%'),
      height: bottomHeight,
      backgroundColor: 'black',
    },
    levelBar: {
      flex: 1,
      // height: levelBarHeight,
      width: wp('100%'),
      backgroundColor: 'black',
    },
    levelBarFlex: {
      flex: 1,
      flexDirection: 'row',
    },
    levelBarArrow: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    levelBarMiddle: {
      flex: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    levelChooserImage: {
      width: levelChooserNumberWidth,
      height: levelChooserNumberHeight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    levelChooserText: {
      textAlign: 'center',
      fontFamily: Fonts.league,
      color: 'white',
      fontSize: levelChooserFont,
    },
    levelDetails: {
      flex: 5,
      flexDirection: 'row',
    },
    levelDetailsImage: {
      flex: 3,
      alignItems: 'center',
      justifyContent: 'center',
    },
    levelDetailsRight: {
      flex: 1,
      flexDirection: 'column',
    },
    levelDetailsRightCell: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
    },
    detailRightCellImage: {
      width: hp('4%'),
      height: hp('4%'),
    },
    detailRightText: {
      color: 'white',
      fontFamily: Fonts.alata,
      marginLeft: hp('0.4%'),
      fontSize: hp('1.6%'),
    },
  });
};

export {getStyles};
