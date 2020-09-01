import {StyleSheet} from 'react-native';
import R from 'src/res';
import {isTablet} from 'react-native-device-info';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const getStyles: any = () => {
  const bottomHeight = hp('35%');

  const titleBannerWidth = isTablet() ? wp('60%') : wp('82%');
  const titleBannerConstant = 0.2922;
  const titleHeight = titleBannerWidth * titleBannerConstant;
  const titleFont = titleHeight * 0.15;
  const titleMarginBottomConstant = 0.0;
  const titleMarginBottom = titleHeight * titleMarginBottomConstant;
  const titleMarginSides = titleBannerWidth * 0.05;
  const titleLineHeight = titleHeight * 0.3;
  const titleMarginTop = hp('4%');
  const buttonWidth = isTablet() ? wp('30%') : wp('42%');
  const buttonRatioConstant = 0.3525;
  const buttonHeight = buttonWidth * buttonRatioConstant;

  const playButtonOverlayBottomMargin = hp('2%');
  const yBackButton =
    hp('100%') - (bottomHeight - titleHeight + playButtonOverlayBottomMargin + buttonHeight);
  const y = (yBackButton * 0.5);
  return StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    titleOverlay: {
      position: 'absolute',
      top: 0,
      width: titleBannerWidth,
      marginTop: titleMarginTop,
      height: titleHeight,
    },
    mapTitleContainerImage: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: titleBannerWidth,
    },
    mapTitleText: {
      fontFamily: R.fonts.league,
      fontSize: titleFont,
      color: 'white',
      textAlign: 'center',
      marginLeft: titleMarginSides,
      marginRight: titleMarginSides,
      marginBottom: titleMarginBottom,
      lineHeight: titleLineHeight,
    },
    backButtonContainer: {
      position: 'absolute',
      top: y,
      left: 0,
      backgroundColor: '#000000CC',
      padding: 7,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
    },
    playButtonOverlay: {
      position: 'absolute',
      marginBottom: bottomHeight + playButtonOverlayBottomMargin,
      bottom: 0,
    },
    closeMapButtonOverlay: {
      position: 'absolute',
      marginBottom: hp('5%'),
      bottom: 0,
    },
    backButton: {
      width: hp('7%'),
      height: hp('7%'),
    }
  });
};

export {getStyles};
