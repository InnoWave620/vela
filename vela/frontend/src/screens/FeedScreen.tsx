import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { Header } from '../components/vela/Header';
import { BirthdayCountdownBanner } from '../components/vela/BirthdayCountdownBanner';
import { CreatePostBar } from '../components/vela/CreatePostBar';
import { PostCard } from '../components/vela/PostCard';
import { CategoryFilterPills } from '../components/vela/CategoryFilterPills';
import { useVela } from '../context/VelaContext';
import { formatBirthday } from '../utils/dateUtils';
import { VelaIcon } from '../components/vela/VelaIcon';

export const FeedScreen: React.FC = () => {
  const {
    posts,
    countdown,
    user,
    feedCategory,
    setFeedCategory,
    feedVisibility,
    setFeedVisibility,
    toggleLikePost,
    addComment,
    requireAuth,
    isLoading,
  } = useVela();

  const handleLike = (id: string) => {
    if (!requireAuth('like birthday memories')) return;
    toggleLikePost(id);
  };

  const handleComment = (id: string, text: string) => {
    if (!requireAuth('comment on birthday memories')) return;
    addComment(id, text);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />

      {/* Life-Stage Category Selector Pills */}
      <CategoryFilterPills
        selectedCategory={feedCategory}
        onSelectCategory={setFeedCategory}
      />

      {/* Scope Selector: Worldwide Memories vs Exact Birthday Twins */}
      <View style={styles.scopeContainer}>
        <TouchableOpacity
          style={[
            styles.scopeTab,
            feedVisibility === 'public_world' && styles.scopeTabActive,
          ]}
          onPress={() => setFeedVisibility('public_world')}
          activeOpacity={0.8}
        >
          <VelaIcon
            name="globe-outline"
            size={14}
            color={feedVisibility === 'public_world' ? Colors.textPrimary : Colors.textSecondary}
            style={styles.scopeIcon}
          />
          <Text
            style={[
              styles.scopeText,
              feedVisibility === 'public_world' && styles.scopeTextActive,
            ]}
          >
            Worldwide Memories
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.scopeTab,
            feedVisibility === 'twins_only' && styles.scopeTabActive,
          ]}
          onPress={() => setFeedVisibility('twins_only')}
          activeOpacity={0.8}
        >
          <VelaIcon
            name="people-outline"
            size={14}
            color={feedVisibility === 'twins_only' ? Colors.textPrimary : Colors.textSecondary}
            style={styles.scopeIcon}
          />
          <Text
            style={[
              styles.scopeText,
              feedVisibility === 'twins_only' && styles.scopeTextActive,
            ]}
          >
            {formatBirthday(user.dateOfBirth)} Twins Only
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} tintColor={Colors.accent} />
        }
      >
        {/* Next Birthday Collective Countdown */}
        <BirthdayCountdownBanner countdown={countdown} />

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {feedVisibility === 'public_world'
              ? 'GLOBAL MEMORY STREAM (WORLDWIDE)'
              : `${formatBirthday(user.dateOfBirth).toUpperCase()} TWIN FEED`}
          </Text>
          <Text style={styles.sectionSub}>
            {feedCategory === 'all'
              ? 'All generations connecting and sharing photo & video memories.'
              : `Curated memories and moments for the ${feedCategory} circle.`}
          </Text>
        </View>

        {/* Pinned Create Post Bar */}
        <CreatePostBar />

        {/* Posts List */}
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <VelaIcon
              name="film-outline"
              size={36}
              color={Colors.textMuted}
              style={styles.emptyIcon}
            />
            <Text style={styles.emptyTitle}>No memories in this category yet</Text>
            <Text style={styles.emptySub}>
              Be the first to share an image or video memory with your birthday twins and the world.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scopeContainer: {
    flexDirection: 'row',
    marginHorizontal: 18,
    marginVertical: 4,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 3,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scopeTab: {
    flex: 1,
    paddingVertical: 7,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 11,
  },
  scopeIcon: {
    marginRight: 6,
  },
  scopeTabActive: {
    backgroundColor: Colors.background,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  scopeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  scopeTextActive: {
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 100, // Space for custom tab bar
  },
  sectionHeader: {
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: Colors.accentDark,
  },
  sectionSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  emptyState: {
    backgroundColor: Colors.surface,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
});
