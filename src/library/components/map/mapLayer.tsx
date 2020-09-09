import React, {Component} from 'react';
import MapView, {PROVIDER_GOOGLE, UrlTile, MapTypes} from 'react-native-maps';
const MapSettings = require('@assets/mapSettings');

import {Level} from '@library/models/level';

import {styles} from './mapLayer.style';

import LevelMarker from './levelMarker';
import {MapStyleMode} from '@library/mobx/userStore';

import {observer, inject} from 'mobx-react';
import UserStore from '@library/mobx/userStore';

type Props = {
  controlsEnabled: boolean;
  levels: Array<Level>;
  onPanDrag: Function;
  onMapLoaded: Function;
  initialLevel: number;
  userStore?: UserStore;
};

type State = {
  allIds: Array<string>;
  markers: Array<any>;
  mapReady: boolean;
};

const paddingConstant = 0.99989;

const mapOptionsForMode = {
  sat: {
    type: 'satellite',
    mapStyle: undefined,
  },
  topo: {
    type: 'standard',
    mapStyle: MapSettings.mapStyle,
  },
};

@inject('userStore')
@observer
export default class MapLayer extends Component<Props, State> {
  state = {
    allIds: [],
    markers: [],
    mapReady: false,
  };

  map: any;
  currentLevel: number;

  constructor(props: Props) {
    super(props);
    this.currentLevel = this.props.initialLevel;
  }

  componentDidMount() {}

  async resetToLevel() {
    const camera = await this.map.getCamera();
    camera.zoom = 14;
    camera.center = {
      latitude:
        this.props.levels[this.currentLevel].latlon.latitude * paddingConstant,
      longitude: this.props.levels[this.currentLevel].latlon.longitude,
    };
    this.map.animateCamera(camera, {duration: 1000});
  }

  setCurrentLevel(level: number) {
    this.currentLevel = level;
  }

  getMapView() {
    const that = this;

    return (
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        ref={(ref) => {
          this.map = ref;
        }}
        initialCamera={{
          center: {
            latitude:
              this.props.levels[this.currentLevel].latlon.latitude *
              paddingConstant,
            longitude: this.props.levels[this.currentLevel].latlon.longitude,
          },
          pitch: 0,
          heading: 0,
          altitude: 1000,
          zoom: 14,
        }}
        mapType={
          mapOptionsForMode[this.props.userStore?.mapStyleMode!]
            .type as MapTypes
        }
        customMapStyle={
          mapOptionsForMode[this.props.userStore?.mapStyleMode!].mapStyle
        }
        rotateEnabled={false}
        pitchEnabled={false}
        scrollEnabled={true}
        zoomEnabled={this.props.controlsEnabled}
        moveOnMarkerPress={this.props.controlsEnabled}
        onPress={() => {
          this.props.onPanDrag();
        }}
        onDoublePress={() => {
          this.props.onPanDrag();
        }}
        onPanDrag={() => {
          this.props.onPanDrag();
        }}
        onMapReady={() => {
          const markers: Array<any> = [];
          const allIds: Array<string> = [];
          let i = 1;
          this.props.levels.forEach((level: Level) => {
            markers.push(
              <LevelMarker
                id={level.id.toString()}
                key={level.id.toString()}
                coord={level.latlon}
                mapReady={true}
                idx={i}
              />,
            );
            allIds.push(level.id.toString());
            i += 1;
          });

          setTimeout(() => {
            that.setState({markers, allIds}, () => {
              this.props.onMapLoaded();
            });
          }, 100);
        }}>
        {this.props.userStore?.mapStyleMode === MapStyleMode.Topo ? (
          <UrlTile urlTemplate={MapSettings.urlMapTile} />
        ) : null}
        {this.state.markers}
      </MapView>
    );
  }

  render() {
    return this.getMapView();
  }
}
