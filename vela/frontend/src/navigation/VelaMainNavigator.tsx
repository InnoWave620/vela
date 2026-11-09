import React, { useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { Colors } from '../theme/colors';
import { useVela } from '../context/VelaContext';
import { FeedScreen } from '../screens/FeedScreen';
import { TwinsScreen } from '../screens/TwinsScreen';
import { EventsScreen } from '../screens/EventsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { VelaTabBar } from '../components/vela/VelaTabBar';

export const VelaMainNavigator: React.FC = () => {
  const { activeTab, authModalVisible, authPromptReason, closeAuthModal, openAuthModal } = useVela();
  const [showManualAuthModal, setShowManualAuthModal] = useState(false);

  const isModalOpen = authModalVisible || showManualAuthModal;
  const currentReason = authModalVisible ? authPromptReason : undefined;

  const handleDismissModal = () => {
    closeAuthModal();
    setShowManualAuthModal(false);
  };

  return (
    <View style={styles.rootContainer}>
      {/* Active Tab Screen - Free Guest Browsing Always Accessible */}
      <View style={styles.screenContainer}>
        {activeTab === 'feed' && <FeedScreen />}
        {activeTab === 'twins' && <TwinsScreen />}
        {activeTab === 'events' && <EventsScreen />}
        {activeTab === 'profile' && (
          <ProfileScreen onOpenOnboarding={() => openAuthModal('access exclusive member dossier settings')} />
        )}
      </View>

      {/* Floating Luxury Tab Bar */}
      <VelaTabBar />

      {/* Action-Triggered & Manual Authentication Modal */}
      <Modal visible={isModalOpen} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleDismissModal}>
        <OnboardingScreen
          reason={currentReason}
          onDismiss={handleDismissModal}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  screenContainer: {
    flex: 1,
  },
});
