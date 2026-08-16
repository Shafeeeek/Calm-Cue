import React, {useState} from 'react';
import {Pressable, Text, UIManager, View} from 'react-native';
import Video, {type ReactVideoSource} from 'react-native-video';
import {styles} from '../styles/app-styles';

type CalmingVideo = {
  category: string;
  cue: string;
  duration: string;
  id: string;
  source: ReactVideoSource;
  steps: string[];
  title: string;
};

const calmingVideos: CalmingVideo[] = [
  {
    id: 'breathing-circle',
    title: 'Breathing circle',
    category: 'Breathe',
    duration: '1:00',
    cue: 'Follow the circle with a slow inhale, then let the exhale last longer.',
    source: {uri: require('../assets/videos/breathing-circle.mp4')},
    steps: ['Inhale 4', 'Hold 2', 'Exhale 6'],
  },
  {
    id: 'ocean-reset',
    title: 'Ocean reset',
    category: 'Ground',
    duration: '1:20',
    cue: 'Watch the waves move slowly while you name three things in the room.',
    source: {uri: require('../assets/videos/ocean-reset.mp4')},
    steps: ['Look', 'Name', 'Return'],
  },
  {
    id: 'soft-light',
    title: 'Soft light scan',
    category: 'Release',
    duration: '0:45',
    cue: 'Let the light move down the body: face, shoulders, chest, hands.',
    source: {uri: require('../assets/videos/soft-light.mp4')},
    steps: ['Face', 'Chest', 'Hands'],
  },
  {
    id: 'safe-sky',
    title: 'Safe sky visual',
    category: 'Visualize',
    duration: '1:10',
    cue: 'Picture one quiet place and let the details become steady.',
    source: {uri: require('../assets/videos/safe-sky.mp4')},
    steps: ['Color', 'Sound', 'Air'],
  },
];

const isNativeVideoLinked = Boolean(UIManager.getViewManagerConfig('RCTVideo'));

function CalmingVideoCard({
  index,
  video,
}: {
  index: number;
  video: CalmingVideo;
}) {
  const [isPlaying, setIsPlaying] = useState(index === 0);
  const [hasError, setHasError] = useState(false);

  return (
    <View style={styles.videoCard}>
      <View style={styles.videoFrame}>
        {isNativeVideoLinked ? (
          <Video
            muted
            onError={() => setHasError(true)}
            paused={!isPlaying}
            repeat
            resizeMode="cover"
            source={video.source}
            style={styles.videoPlayer}
          />
        ) : (
          <View style={styles.videoMissingNativePanel}>
            <Text selectable style={styles.videoMissingNativeText}>
              Rebuild the app to enable videos.
            </Text>
          </View>
        )}
        <View style={styles.videoFrameShade} />

        <View style={styles.videoFrameTopRow}>
          <View style={styles.videoCategoryPill}>
            <Text selectable style={styles.videoCategoryText}>
              {video.category}
            </Text>
          </View>
          <Text selectable style={styles.videoDurationText}>
            {video.duration}
          </Text>
        </View>

        <View style={styles.videoCenterControl}>
          {(hasError || !isNativeVideoLinked) && (
            <Text selectable style={styles.videoErrorText}>
              {isNativeVideoLinked
                ? 'Video could not load.'
                : 'Native video module is not linked in this running build.'}
            </Text>
          )}
          <Pressable
            accessibilityLabel={`${isPlaying ? 'Pause' : 'Play'} ${
              video.title
            }`}
            accessibilityRole="button"
            onPress={() => setIsPlaying(current => !current)}
            style={styles.videoPlayButton}>
            <Text selectable style={styles.videoPlayButtonText}>
              {isPlaying ? 'II' : '>'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.videoFrameCopy}>
          <Text selectable style={styles.videoTitle}>
            {video.title}
          </Text>
          <Text selectable style={styles.videoCue}>
            {video.cue}
          </Text>
        </View>
      </View>

      <View style={styles.videoStepRow}>
        {video.steps.map(step => (
          <View key={step} style={styles.videoStepPill}>
            <Text selectable style={styles.videoStepText}>
              {step}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function VideosScreen() {
  return (
    <View style={styles.videoScreen}>
      <View style={styles.videoIntroPanel}>
        <Text selectable style={styles.sectionTitle}>
          Anxiety relief videos
        </Text>
        <Text selectable style={styles.subtleText}>
          Scroll through short guided clips and start with the one that feels
          easiest right now.
        </Text>
      </View>

      <View style={styles.videoFeed}>
        {calmingVideos.map((video, index) => (
          <CalmingVideoCard key={video.id} index={index} video={video} />
        ))}
      </View>
    </View>
  );
}
