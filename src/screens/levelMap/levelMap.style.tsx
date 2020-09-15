import {StyleSheet} from 'react-native';
import {Fonts} from '@res/R';
import {defaultButtonSize} from '@library/components/button/rectButton';
import {
  isTablet,
  isAndroid,
  isIosAndNotch,
} from '@library/services/deviceService';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const titleBannerWidth = isTablet() ? wp('60%') : wp('82%');
const progressBarWidth = titleBannerWidth / 2;
const progressBarConstant = 0.126190476190476;
const progressBarHeight = progressBarWidth * progressBarConstant;

const getStyles: any = () => {
  const bottomHeight = hp('35%');

  const titleBannerConstant = 0.2922;
  const titleHeight = titleBannerWidth * titleBannerConstant;
  const titleFont = titleHeight * 0.14;
  const titleMarginSides = titleBannerWidth * 0.05;
  const titleLineHeight = titleHeight * 0.2;
  const buttonWidth = isTablet() ? wp('30%') : wp('42%');
  const buttonRatioConstant = 0.3525;
  const buttonHeight = buttonWidth * buttonRatioConstant;

  const navbarHeight = isIosAndNotch ? hp('5.90%') : hp('6.5%');
  const navbarMarginTop = isIosAndNotch ? 44 : 0;

  const playButtonOverlayBottomMargin = hp('2%');
  const yBackButton =
    hp('100%') - (bottomHeight - playButtonOverlayBottomMargin + buttonHeight);
  const y = yBackButton * 0.5;

  const levelCompletedContainerWidth = isTablet() ? wp('40%') : wp('60%');
  const levelCompletedContainerConstant = 0.408829174664107;
  const levelCompletedContainerHeight =
    levelCompletedContainerWidth * levelCompletedContainerConstant;

  const levelCompletedTickHeight = levelCompletedContainerHeight / 5;
  const levelCompletedTickConstant = 1.09375;
  const levelCompletedTickWidth =
    levelCompletedTickHeight / levelCompletedTickConstant;
  const stopWatchConstant = 1.276595744680851;

  return StyleSheet.create({
    root: {
      flex: 1,
    },
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    navBar: {
      position: 'absolute',
      top: navbarMarginTop,
      height: navbarHeight,
      width: wp('100%'),
      flex: 1,
      flexDirection: 'row',
    },
    mapTypeButtonContainer: {
      position: 'absolute',
      top: y,
      right: 0,
      backgroundColor: '#000000CC',
      padding: 7,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
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
    mapButton: {
      width: hp('7%'),
      height: hp('7%'),
    },
    titleOverlay: {
      position: 'absolute',
      top: navbarHeight + navbarMarginTop + hp('2%'),
      width: titleBannerWidth,
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
      fontFamily: Fonts.league,
      fontSize: titleFont,
      color: 'white',
      textAlign: 'center',
      marginLeft: titleMarginSides,
      marginRight: titleMarginSides,
      marginTop: hp('2%'),
      lineHeight: titleLineHeight,
    },
    progressBar: {
      width: progressBarWidth,
      height: progressBarHeight,
      marginTop: hp('0.5%'),
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      paddingBottom: progressBarHeight * 0.1,
    },
    progressBarBottomSpace: {
      height: hp('2%'),
    },
    progressBarUnit: {
      marginTop: progressBarHeight * 0.18,
      marginLeft: progressBarWidth * 0.05,
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    progressText: {
      fontFamily: Fonts.league,
      marginTop: progressBarHeight * 0.01,
      fontSize: progressBarHeight * 0.45,
      color: 'white',
      textAlign: 'center',
    },
    levelCompletedBanner: {
      position: 'absolute',
      marginBottom: bottomHeight + playButtonOverlayBottomMargin,
      bottom: 0,
    },
    levelCompletedImage: {
      width: levelCompletedContainerWidth,
      height: levelCompletedContainerHeight,
    },
    levelCompletedContainer: {
      marginTop: levelCompletedContainerHeight * 0.09,
      marginBottom: levelCompletedContainerHeight * 0.09,
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    levelCompletedTop: {
      width: '93%',
      flex: 2,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    levelCompletedMiddle: {
      width: '93%',
      flex: 2,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: hp('1%'),
    },
    levelCompletedTick: {
      marginTop: hp('1.5%'),
      height: levelCompletedTickHeight,
      width: levelCompletedTickWidth,
    },
    levelCompletedBottom: {
      width: '93%',
      flex: 2,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: hp('1%'),
    },
    levelCompletedStar: {
      height: levelCompletedTickHeight,
      width: levelCompletedTickWidth,
      marginRight: wp('0.5%'),
      marginLeft: wp('0.5%'),
    },
    levelCompletedTitle: {
      width: '90%',
      fontFamily: Fonts.league,
      fontSize: titleFont,
      color: 'white',
      textAlign: 'center',
    },
    countdownContainer: {
      height: defaultButtonSize.height * 1.8,
      width: defaultButtonSize.width,
    },
    countdownTop: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    countdownTopContainer: {
      backgroundColor: '#000000bc',
      borderRadius: defaultButtonSize.height * 0.1,
      width: defaultButtonSize.width * 0.5,
      height: defaultButtonSize.height * 0.5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    stopwatchImageContainer: {
      flex: 1.1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stopwatchImage: {
      width: defaultButtonSize.height * 0.3,
      height: defaultButtonSize.height * 0.3 * stopWatchConstant,
    },
    countdownTextContainer: {
      flex: 2,
      marginTop: defaultButtonSize.height * (isAndroid ? 0.01 : 0.08),
      marginLeft: defaultButtonSize.width * 0.05,
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    countdownText: {
      fontFamily: Fonts.league,
      fontSize: defaultButtonSize.height * 0.21,
      textAlign: 'left',
      color: '#ffffff',
    },
    countdownBottom: {
      height: defaultButtonSize.height,
      width: defaultButtonSize.width,
    },
  });
};

const getSizeForProgress = (progress: number) => {
  const maxWidthForProgress = progressBarWidth * 0.905;
  const height = progressBarHeight * 0.5;

  return {
    width: maxWidthForProgress * (progress / 100),
    height,
  };
};

const styles = getStyles();
export {styles, getSizeForProgress};
