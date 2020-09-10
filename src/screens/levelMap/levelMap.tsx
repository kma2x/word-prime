import React, {Component} from 'react';
import {View, ImageBackground, Text, Animated} from 'react-native';

import {styles} from './levelMap.style';
import R, {Images} from '@res/R';

import {strings} from '@library/services/i18nService';
import MapLayer from '@library/components/map/mapLayer';
import MapTitleBanner from '@library/components/map/mapTitleBanner';
import CoinCounter from '@library/components/game/coinCounter';

import {Level} from '@library/models/level';
import {Pack} from '@library/models/pack';

import LevelChooser from '@library/components/map/levelChooser';
import RectButton, {
  RectButtonEnum,
} from '@library/components/button/rectButton';
import CircleButton from '@library/components/button/circleButton';
import MapTypeButton from '@library/components/map/mapTypeButton';

import {observer, inject} from 'mobx-react';
import LevelProgressStore, {
  getFirstIncompleteLevelIdForPack,
  getProgressForPack,
  getLevelProgress,
} from '@library/mobx/levelProgressStore';
import LevelMapStore from '@library/mobx/levelMapStore';
import UserStore from '@library/mobx/userStore';

import LevelService from '@library/services/levelService';
import LevelCompletedBanner from '@library/components/map/levelCompletedBanner';

type State = {
  mapNavigationMode: boolean;
  fadeAnim: Animated.Value;
};

type Props = {
  navigation: any;
  route: any;
  levelProgressStore: LevelProgressStore;
  levelMapStore: LevelMapStore;
  userStore: UserStore;
};

@inject('levelProgressStore')
@inject('levelMapStore')
@inject('userStore')
@observer
export default class LevelMap extends Component<Props, State> {
  mapLayer: any;
  packId: string;
  pack: Pack;
  levels: Array<Level>;
  prevCurrentLevel: number;

  constructor(props: Props) {
    super(props);
    this.onMapPanDrag = this.onMapPanDrag.bind(this);
    this.mapLoaded = this.mapLoaded.bind(this);
    this.getCurrentLevel = this.getCurrentLevel.bind(this);

    const {packId} = this.props.route.params;
    this.packId = packId;
    this.pack = LevelService.getPackWithId(this.packId);
    this.levels = LevelService.getLevelsForPack(packId);

    const {idx} = this.getFirstIncompleteLevel();
    this.props.levelMapStore.setCurrentLevelForPack(idx, this.pack);
    this.prevCurrentLevel = idx;

    this.state = {
      mapNavigationMode: false,
      fadeAnim: new Animated.Value(1),
    };
  }

  mapLoaded() {
    Animated.timing(this.state.fadeAnim, {
      toValue: 0,
      delay: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }

  componentDidUpdate() {
    const actualCurrentLevel = this.props.levelMapStore.currentLevelForPack[
      this.pack.id
    ];
    if (this.prevCurrentLevel !== actualCurrentLevel) {
      this.updateMapLayer();
      this.prevCurrentLevel = actualCurrentLevel;
    }
  }

  updateMapLayer() {
    const actualCurrentLevel = this.props.levelMapStore.currentLevelForPack[
      this.pack.id
    ];
    this.mapLayer.setCurrentLevel(actualCurrentLevel);
    this.mapLayer.resetToLevel();
  }

  onMapPanDrag() {
    if (!this.state.mapNavigationMode) {
      this.setState({
        mapNavigationMode: !this.state.mapNavigationMode,
      });
    }
  }

  getFirstIncompleteLevel() {
    let levelIdx: number = 0;

    const {levelId} = getFirstIncompleteLevelIdForPack(
      this.props.levelProgressStore.levelsProgress,
      this.pack,
    );

    const level = this.levels.find((lvl, lvlIdx) => {
      const found = lvl.id === levelId;

      if (found) {
        levelIdx = lvlIdx;
      }
      return found;
    });

    return {idx: levelIdx, level};
  }

  getCurrentLevel() {
    return this.props.levelMapStore.currentLevelForPack[this.packId];
  }

  render() {
    const currentLevelId = this.levels[
      this.props.levelMapStore.currentLevelForPack[this.packId]
    ].id;
    const {levelProgress} = getLevelProgress(
      this.props.levelProgressStore.levelsProgress,
      currentLevelId,
      this.packId,
    );

    return (
      <View style={styles.root}>
        <View style={styles.container}>
          <MapLayer
            ref={(ref: any) => {
              this.mapLayer = ref;
            }}
            initialLevel={this.getCurrentLevel()}
            levels={this.levels}
            controlsEnabled={this.state.mapNavigationMode}
            onPanDrag={this.onMapPanDrag}
            onMapLoaded={this.mapLoaded}
          />

          {this.state.mapNavigationMode ? null : (
            <View style={styles.navBar}>
              <View style={styles.navBarLeft}>
                <CircleButton
                  style={styles.backButton}
                  image={Images.back_button}
                  onPress={() => {
                    /*this.props.navigation.goBack*/
                  }}></CircleButton>
              </View>
              <View style={styles.navBarMiddle}></View>
              <View style={styles.navBarRight}>
                <CoinCounter
                  totalCoins={this.props.userStore.coins}
                  onPress={() => {}}
                />
              </View>
            </View>
          )}

          <MapTitleBanner
            hide={this.state.mapNavigationMode}
            title={this.pack.title}
            progress={getProgressForPack(
              this.props.levelProgressStore.levelsProgress,
              this.pack,
            )}
          />

          <View style={styles.mapTypeButtonContainer}>
            <MapTypeButton
              mapMode={this.props.userStore.mapTypeMode}
              onPress={() => {
                this.props.userStore.toggleMapTypeMode();
              }}
            />
          </View>

          <RectButton
            hide={this.state.mapNavigationMode || levelProgress?.completed}
            type={RectButtonEnum.Yellow}
            text={strings('play')}
            style={styles.playButtonOverlay}
            onPress={() => {
              this.props.navigation.navigate('Game', {
                packId: this.packId,
                levels: this.levels,
                currentLevel: this.getCurrentLevel(),
              });
            }}
          />

          <LevelCompletedBanner
            style={styles.levelCompletedBanner}
            hide={this.state.mapNavigationMode || !levelProgress?.completed}
            title={this.levels[this.getCurrentLevel()].title}
            stars={levelProgress?.stars!}
          />

          <RectButton
            hide={!this.state.mapNavigationMode}
            type={RectButtonEnum.Blue}
            text={strings('back')}
            style={styles.closeMapButtonOverlay}
            onPress={() => {
              this.setState({
                mapNavigationMode: !this.state.mapNavigationMode,
              });

              setTimeout(() => {
                this.mapLayer.resetToLevel();
              }, 200);
            }}
          />

          <LevelChooser
            currentLevel={this.getCurrentLevel()}
            levels={this.levels}
            packId={this.packId}
            hide={this.state.mapNavigationMode}
            onNextLevel={() => {
              this.props.levelMapStore.nextLevelForPack(this.pack);
            }}
            onPrevLevel={() => {
              this.props.levelMapStore.prevLevelForPack(this.pack);
            }}
          />
        </View>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.overlayLoad,
            {
              opacity: this.state.fadeAnim,
            },
          ]}>
          <ImageBackground
            source={R.img(Images.mountain_bg)}
            style={styles.overlayLoad}></ImageBackground>
        </Animated.View>
      </View>
    );
  }
}
