import React, {Component} from 'react';
import {View, Image, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ViewShot from 'react-native-view-shot';
import {observer, inject} from 'mobx-react';
import Share from 'react-native-share';

const gameConfig = require('@assets/gameConfig');

import {Level} from '@library/models/level';
import {Pack} from '@library/models/pack';

import delayPromise from '@library/utils/delayPromise';

import R, {Colors, Images} from '@res/R';
import {styles} from './game.style';
import {strings} from '@library/services/i18nService';

import NoNotchView from '@library/components/common/noNotchView';
import Navbar from '@library/components/game/navbar';
import PhotoFrame, {PhotoFrameSize} from '@library/components/photo/photoFrame';
import LevelIndexNumber from '@library/components/common/levelIndexNumber';
import PowerUpsBar from '@library/components/game/powerUpsBar';
import LivesIndicator from '@library/components/game/livesIndicator';

// import ConfirmPopup from '@library/components/game/confirmPopup';

import LevelService from '@library/services/levelService';
import {getLevelProgress} from '@library/helpers/levelHelper';
import WordHelper from '@library/helpers/wordHelper';

import LevelProgressStore from '@library/mobx/levelProgressStore';
import UserStore from '@library/mobx/userStore';
import LevelMapStore from '@library/mobx/levelMapStore';

import LettersBar, {
  LettersBarElement,
} from '@library/components/game/lettersBar';
import SolutionBar, {
  SolutionBarElement,
} from '@library/components/game/solutionBar';
import {
  AvailableLetterType,
  AvailableLetterState,
} from '@library/models/availableLetter';
import {
  SolutionLetterType,
  SolutionLetterState,
} from '@library/models/solutionLetter';

type Props = {
  navigation: any;
  route: any;
  levelProgressStore: LevelProgressStore;
  userStore: UserStore;
  levelMapStore: LevelMapStore;
};
type State = {
  confirmPopupShown: boolean;
};

@inject('levelProgressStore')
@inject('userStore')
@inject('levelMapStore')
@observer
export default class Game extends Component<Props, State> {
  mapLayer: any;
  solutionBar: SolutionBarElement | SolutionBar | null;
  lettersBar: LettersBarElement | LettersBar | null;
  livesIndicator: LivesIndicator | null;
  level: Level;
  currentLevel: number;
  totalLevels: number;
  pack: Pack;
  snapshot: any;
  refs: any;
  confirmPopup: any;

  state = {confirmPopupShown: false};

  constructor(props: Props) {
    super(props);
    this.solutionBar = null;
    this.lettersBar = null;
    this.livesIndicator = null;

    this.availableLetterHasTapped = this.availableLetterHasTapped.bind(this);
    this.solutionLetterHasTapped = this.solutionLetterHasTapped.bind(this);
    this.getLevelProgress = this.getLevelProgress.bind(this);

    this.onDestroyLettersPress = this.onDestroyLettersPress.bind(this);
    this.onSolveLetterPress = this.onSolveLetterPress.bind(this);
    this.onAskFriendPress = this.onAskFriendPress.bind(this);

    const {currentLevel, levels, packId} = this.props.route.params;
    this.level = levels[currentLevel];
    this.pack = LevelService.getPackWithId(packId);
    this.currentLevel = currentLevel;
    this.totalLevels = levels.length;
  }

  componentDidMount() {
    this.refs.viewShot.capture().then((uri: string) => {
      this.snapshot = uri;
    });
  }

  async correct(level: Level) {
    this.solutionBar?.animateLetters('flash', 1000);
    await delayPromise(1000);

    this.props.levelProgressStore.setLevelCompleted(level.id, this.pack.id);
    this.props.levelProgressStore.calculateLevelStars(level.id, this.pack.id);

    this.props.navigation.navigate('LevelComplete', {
      level,
      pack: this.pack,
    });
  }

  async incorrect(level: Level) {
    this.solutionBar?.animateLetters('shake', 1000);

    this.props.levelProgressStore.decrementLivesForLevel(
      level.id,
      this.pack.id,
    );
    this.props.levelProgressStore.incrementInvestedLivesForLevel(
      level.id,
      this.pack.id,
    );

    this.livesIndicator?.animate('tada', 1000);
    await delayPromise(500);
    const availableLetterIds = this.solutionBar?.getAllAvailableLetterIds();
    availableLetterIds.forEach((letterId: string) => {
      this.lettersBar?.restoreLetterWithId(letterId);
    });

    this.solutionBar?.removeAllLetters();

    if (
      this.props.levelProgressStore?.getCurrentLives(level.id, this.pack.id) ===
      0
    ) {
      this.props.levelProgressStore.setLevelCooldown(level.id, this.pack.id);
      this.props.navigation.navigate('NoLives', {
        level,
        pack: this.pack,
      });
    }
  }

  async checkResult() {
    const level: Level = this.level;

    if (!this.solutionBar?.allLettersAreFull()) {
      return;
    }

    if (this.solutionBar?.isWordCorrect()) {
      await this.correct(level);
    } else {
      await this.incorrect(level);
    }
  }

  async availableLetterHasTapped(letter: AvailableLetterType) {
    if (this.solutionBar?.allLettersAreFull()) {
      return;
    }

    this.lettersBar?.setLetterState(letter.id, AvailableLetterState.Selected);

    await this.solutionBar?.addLetter(letter.character, letter.id);
    await this.checkResult();
  }

  solutionLetterHasTapped(letter: SolutionLetterType) {
    if (letter.letterState === SolutionLetterState.Filled) {
      this.solutionBar?.removeLetterWithId(letter.id);
      this.lettersBar?.restoreLetterWithId(letter.availableLetterId!);
    }
  }

  getLevelProgress() {
    return getLevelProgress(
      this.props.levelProgressStore.levelsProgress,
      this.level.id,
      this.pack.id,
    ).levelProgress;
  }

  async onSolveLetterPress() {
    if (this.props.userStore.coins < gameConfig.priceSolveLetter) {
      // TODO: Show no coins
      return;
    }

    if (this.solutionBar?.allLettersAreFull()) {
      return;
    }

    this.solutionBar?.removeAllLetters();
    this.lettersBar?.restoreNonBoughtLetters();

    await delayPromise(50);

    const {
      randomLetter,
      availableLetterId,
      position,
    } = WordHelper.getRandomSolveLetter({
      word: this.level.word,
      boughtLetters: this.solutionBar?.getBoughtLetters(),
      getAvailableLetterWithChar: this.lettersBar?.getAvailableLetterWithChar,
    });

    this.solutionBar?.addLetterAtPosition(
      randomLetter,
      availableLetterId,
      position,
      SolutionLetterState.Bought,
    );

    this.lettersBar?.setLetterState(
      availableLetterId,
      AvailableLetterState.Bought,
    );

    this.props.userStore.decrementCoins(gameConfig.priceSolveLetter);
    await this.checkResult();
  }

  async onDestroyLettersPress() {
    if (this.props.userStore.coins < gameConfig.priceDestroyLetters) {
      // TODO: Show no coins
      return;
    }

    if (this.solutionBar?.allLettersAreFull()) {
      return;
    }

    await this.solutionBar?.removeAllLetters();
    await this.lettersBar?.restoreNonBoughtLetters();

    if (!this.lettersBar?.existsWrongLettersNotBought()) {
      return;
    }

    await delayPromise(50);

    this.lettersBar?.powerUpDestroyLetters();

    this.props.userStore.decrementCoins(gameConfig.priceDestroyLetters);
  }

  async onAskFriendPress() {
    if (this.snapshot) {
      Share.open({
        url: this.snapshot,
        message: 'Tegami: Saps quina muntanya és?',
        filename: 'guessMountain',
      });
    }
  }

  render() {
    return (
      <LinearGradient
        colors={[Colors.purpleGradientStart, Colors.purpleGradientEnd]}
        style={styles.background}>
        <NoNotchView>
          <Navbar
            style={styles.navBar}
            onBackPress={this.props.navigation.goBack}
            onCoinsTap={() => {}}
            coins={this.props.userStore.coins}
            lives={
              this.props.levelProgressStore?.getCurrentLives(
                this.getLevelProgress()?.id!,
                this.pack.id,
              )!
            }
            livesIndicatorRef={(ref: any) => {
              this.livesIndicator = ref;
            }}
          />
          <View style={styles.titleBar}>
            <Text
              style={styles.titleText}
              adjustsFontSizeToFit
              numberOfLines={1}>
              {this.pack?.title!}
            </Text>

            <LevelIndexNumber
              totalLevels={this.totalLevels}
              currentLevel={this.currentLevel}
            />
          </View>
          <View style={styles.photoBar}>
            <ViewShot ref="viewShot">
              <PhotoFrame size={PhotoFrameSize.big} level={this.level} />
            </ViewShot>
            <Text style={styles.sourceText}>
              {strings('sourcePhoto') + ': ' + this.level.sourcePhoto}
            </Text>
          </View>
          <View style={styles.solutionBar}>
            <Image
              style={styles.separator}
              resizeMode="contain"
              source={R.img(Images.separator_line_down)}></Image>
            <View style={styles.solutionView}>
              <SolutionBar
                ref={(ref) => {
                  this.solutionBar = ref;
                }}
                onLetterPress={this.solutionLetterHasTapped}
                style={styles.lettersBar}
                word={this.level.word}
                level={this.level}
                pack={this.pack}
              />
            </View>
            <Image
              style={styles.separator}
              resizeMode="contain"
              source={R.img(Images.separator_line_up)}></Image>
          </View>
          <View style={styles.powerUpsBar}>
            <PowerUpsBar
              bombDisabled={false}
              onDestroyLettersPress={this.onDestroyLettersPress}
              onSolveLetterPress={this.onSolveLetterPress}
              onAskFriendPress={this.onAskFriendPress}
            />
          </View>
          <LettersBar
            ref={(ref) => {
              this.lettersBar = ref;
            }}
            style={styles.lettersBar}
            word={this.level.word}
            availableLetterHasTapped={this.availableLetterHasTapped}
            level={this.level}
            pack={this.pack}
          />
        </NoNotchView>
        {/* {this.state.confirmPopupShown ? (
          <ConfirmPopup
            onConfirm={() => {
              this.confirmPopup.animate('fadeOut', 300);
              setTimeout(() => {
                this.setState({confirmPopupShown: false});
              }, 350);
            }}
            onCancel={() => {
              this.confirmPopup.animate('fadeOut', 300);
              setTimeout(() => {
                this.setState({confirmPopupShown: false});
              }, 350);
            }}
            animatedRef={(ref: any) => {
              this.confirmPopup = ref;
            }}
          />
        ) : null} */}
      </LinearGradient>
    );
  }
}
