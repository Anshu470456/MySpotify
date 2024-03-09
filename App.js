import React, { useEffect, useState } from 'react'
import { FlatList, Image, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import { songsList } from './src/Songs';
import TrackPlayer, { Capability, usePlaybackState, State, useProgress } from 'react-native-track-player';
import SongPlayer from './SongPlayer';

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const playbackState = usePlaybackState();
  const progress = useProgress();
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    setUpPlayer();
  }, [])

  const setUpPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        // Media controls capabilities
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],

        // Capabilities that will show up when the notification is in the compact form on Android
        compactCapabilities: [Capability.Play, Capability.Pause],

        // Icons for the notification on Android (if you don't like the default ones)
      });
      await TrackPlayer.add(songsList);
    }
    catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (State.Playing == playbackState.state) {
      if (progress.position.toFixed(0) == progress.duration.toFixed(0)) {

        if (currentIndex < songsList.length) {
          setCurrentIndex(currentIndex + 1);

        }
      }
    }

  }, [progress])

  return (
    <LinearGradient
      colors={['#a34c0d', '#592804', '#241001', '#000000']}
      style={{ flex: 1 }}>

      <StatusBar translucent backgroundColor={'transparent'} />

      <Image
        source={require('./src/images/left.png')}
        style={{
          width: 24,
          height: 24,
          tintColor: 'white',
          marginTop: 60,
          marginLeft: 20,
        }}
      />

      <View style={{
        width: '95%',
        alignSelf: 'center',
        flexDirection: 'row',
        marginTop: 10
      }}>

        <View style={{
          width: '80%',
          height: 39,
          backgroundColor: '#b06a41',
          alignItems: 'center',
          flexDirection: 'row',
          paddingLeft: 15,
          marginTop: 15,
          borderRadius: 10,
          marginLeft: 15

        }}>
          <Image
            source={require('./src/images/search2.png')}
            style={{ width: 22, height: 22, tintColor: 'white' }}
          />
          <Text style={{ color: 'white', fontSize: 15, marginLeft: 8 }}> Search in Playlist...</Text>

        </View>

        <View style={{
          width: '15%',
          height: 39,
          backgroundColor: '#b06a41',
          paddingLeft: 15,
          marginTop: 15,
          borderRadius: 10,
          marginLeft: 8,
          justifyContent: 'center',

        }}>
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>Sort</Text>
        </View>

      </View>

      <Image
        style={{ width: '80%', height: '35%', marginTop: 20, alignSelf: 'center', borderRadius: 5 }}
        source={{ uri: songsList[currentIndex].artwork }}
      />
      <Text style={{ color: 'white', fontWeight: '800', marginLeft: 15, fontSize: 25, marginTop: 5 }}>{songsList[currentIndex].title}</Text>

      <View style={{ flexDirection: 'row', marginTop: 20, paddingLeft: 20, alignItems: 'center' }}>
        <Image
          style={{ width: 25, height: 25 }}
          source={require('./src/images/spotify.png')} />
        <Text
          style={{ color: 'white', marginLeft: 15 }}
        >English Song</Text>
      </View>

      <View style={{ flexDirection: 'row', marginTop: 20, paddingLeft: 20, alignItems: 'center' }}>

        <Text style={{ color: '#bababa' }}>20,649 saves</Text>
        <Text style={{ color: '#bababa', marginLeft: 10 }}>4h 36m</Text>

      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '90%',
          justifyContent: 'space-between',
          alignSelf: 'center',
          marginTop: 10
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={require('./src/images/plus.png')}
            style={{ width: 20, height: 20, tintColor: '#bababa' }}
          />
          <Image
            source={require('./src/images/arrow-down.png')}
            style={{ width: 20, height: 20, tintColor: '#bababa', marginLeft: 15 }}
          />
          <Image
            source={require('./src/images/option.png')}
            style={{ width: 20, height: 20, tintColor: '#bababa', marginLeft: 15 }}
          />
        </View>

        <View
          style={{ flexDirection: 'row', alignItems: 'center', }}>
          <Image
            source={require('./src/images/suffle.png')}
            style={{ width: 25, height: 25, tintColor: '#bababa', marginLeft: 15 }}
          />
          <TouchableOpacity onPress={async () => {

            if (State.Playing == playbackState.state) {
              console.log("up " + playbackState.state)

              await TrackPlayer.pause();
            }
            else {
              await TrackPlayer.skip(currentIndex);
              await TrackPlayer.play();
              console.log("down " + playbackState.state)

            }

          }}>
            {State.Playing == playbackState.state ? (
              <Image
                source={require('./src/images/pause.png')}
                style={{ width: 37, height: 37, marginLeft: 20, marginRight: 10, tintColor: '#3ad934' }}
              />) : (<Image
                source={require('./src/images/play-button.png')}
                style={{ width: 50, height: 50, marginLeft: 20, marginRight: 10 }}
              />)}
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={songsList}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              style={{
                width: '100%',
                paddingLeft: 20,
                height: 50,
                paddingRight: 20,
                flexDirection: 'row',
                marginTop: 10,
                justifyContent: 'space-between'

              }}

              onPress={async () => {
                await TrackPlayer.pause();
                await TrackPlayer.skip(index);
                await TrackPlayer.play();

                setCurrentIndex(index);

              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: item.artwork }} style={{ width: 50, height: 50, borderRadius: 5 }} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ color: 'white' }}>{item.title}</Text>
                  <Text style={{ color: 'white', fontSize: 10 }}>{item.artist}</Text>
                </View>
                {
                  index == currentIndex && State.Playing == playbackState.state && (
                    <Image
                      source={require('./src/images/playing.png')}
                      style={{ width: 18, height: 18, tintColor: 'white', tintColor: 'white', marginLeft: 8 }}
                    />
                  )
                }
              </View>
              <Image
                style={{ width: 20, height: 20, tintColor: '#bababa' }}
                source={require('./src/images/option.png')}
              />

            </TouchableOpacity>
          )
        }}
      />
      <TouchableOpacity
        activeOpacity={1}
        style={{
          width: '100%',
          height: 70,
          position: 'absolute',
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.9)',
          flexDirection: 'row',
          alignItems: 'center',
          paddingLeft: 20,
          paddingRight: 20,
          justifyContent: 'space-between',
        }} onPress={() => {
          setIsVisible(true)
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: songsList[currentIndex].artwork }}
            style={{ width: 50, height: 50, borderRadius: 5 }}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={{ color: 'white' }}>
              {songsList[currentIndex].title}
            </Text>
            <Text style={{ color: 'white', fontSize: 10 }}>
              {songsList[currentIndex].artist}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={async () => {
            if (State.Playing == playbackState.state) {
              await TrackPlayer.pause();
            } else {
              await TrackPlayer.skip(currentIndex);
              await TrackPlayer.play();
            }
          }}>
          <Image
            source={
              State.Playing == playbackState.state
                ? require('./src/images/pause2.png')
                : require('./src/images/play.png')
            }
            style={{ width: 30, height: 30, tintColor: 'white' }}
          />
        </TouchableOpacity>
      </TouchableOpacity>
      <SongPlayer
        isVisible={isVisible}
        songsList={songsList}
        currentIndex={currentIndex}
        playbackState={playbackState}
        progress={progress}
        onChange={(x) => {
          setCurrentIndex(x)
        }}
        onClose={() => {
          setIsVisible(false)
        }}
      />
    </LinearGradient>
  )
}



export default App;