import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { BirthdayPicker } from '../components/vela/BirthdayPicker';
import { VelaIcon } from '../components/vela/VelaIcon';
import { useVela } from '../context/VelaContext';
import { getAgeCategoryFromDob } from '../utils/dateUtils';

interface Props {
  onDismiss?: () => void;
  reason?: string;
}

export const OnboardingScreen: React.FC<Props> = ({ onDismiss, reason }) => {
  const { register, login, isLoading } = useVela();
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [name, setName] = useState('Senzo Zulu');
  const [email, setEmail] = useState('senzo@zelvaxis.com');
  const [password, setPassword] = useState('Password123!');
  const [selectedDob, setSelectedDob] = useState('1998-10-27');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const ageCategoryInfo = getAgeCategoryFromDob(selectedDob);

  const handleSubmit = async () => {
    setErrorMessage(null);
    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          setErrorMessage('Please enter your full name.');
          return;
        }
        await register(email.trim(), name.trim(), selectedDob, password);
      } else {
        await login(email.trim(), password);
      }
      if (onDismiss) {
        onDismiss();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
      {/* Top Header Dismiss button if modal */}
      {onDismiss && (
        <View style={styles.topDismissBar}>
          <Pressable onPress={onDismiss} style={styles.dismissBtn} hitSlop={12}>
            <VelaIcon name="close-outline" size={24} color={Colors.textPrimary} />
          </Pressable>
        </View>
      )}

      {/* Action Prompt Banner if prompted from an action */}
      {reason && (
        <View style={styles.actionPromptCard}>
          <View style={styles.actionPromptIconCircle}>
            <VelaIcon name="shield-outline" size={16} color={Colors.goldAccent} />
          </View>
          <View style={styles.actionPromptTextContainer}>
            <Text style={styles.actionPromptTag}>MEMBER ACTION REQUIRED</Text>
            <Text style={styles.actionPromptText}>
              Sign in or request an invitation to {reason}.
            </Text>
          </View>
        </View>
      )}

      {/* Branding Header */}
      <View style={styles.brandHeader}>
        <View style={styles.crestCircle}>
          <VelaIcon name="infinite-outline" size={24} color={Colors.accentDark} />
        </View>
        <Text style={styles.brandTitle}>V E L A</Text>
        <Text style={styles.brandSub}>THE BIRTHDAY TWIN SOCIETY</Text>
        <Text style={styles.brandManifesto}>
          Only one criteria grants entry: finding the rare individuals who arrived on Earth in your exact 24-hour cycle.
        </Text>
      </View>

      {/* Mode Toggle */}
      <View style={styles.toggleRow}>
        <Pressable
          onPress={() => setMode('signup')}
          style={[styles.toggleBtn, mode === 'signup' && styles.toggleBtnActive]}>
          <Text
            style={[styles.toggleText, mode === 'signup' && styles.toggleTextActive]}>
            Request Invitation
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setMode('login')}
          style={[styles.toggleBtn, mode === 'login' && styles.toggleBtnActive]}>
          <Text
            style={[styles.toggleText, mode === 'login' && styles.toggleTextActive]}>
            Member Sign In
          </Text>
        </Pressable>
      </View>

      {errorMessage && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      )}

      {/* The Crucial Date of Birth Picker */}
      {mode === 'signup' && (
        <View style={styles.pickerWrapper}>
          <BirthdayPicker
            initialDate={selectedDob}
            onDateSelected={(dob: string) => setSelectedDob(dob)}
          />
          <View style={styles.detectedCategoryBox}>
            <Text style={styles.detectedCategoryLabel}>ASSIGNED LIFE-STAGE CIRCLE</Text>
            <Text style={styles.detectedCategoryValue}>{ageCategoryInfo.label}</Text>
            {ageCategoryInfo.isParentManaged && (
              <View style={styles.parentNoticeRow}>
                <VelaIcon
                  name="shield-checkmark-outline"
                  size={12}
                  color={Colors.accentDark}
                  style={styles.parentNoticeIcon}
                />
                <Text style={styles.parentNoticeText}>
                  This account will be marked as Parent / Guardian Managed for age-appropriate celebration safety.
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Input Fields */}
      <View style={styles.formContainer}>
        {mode === 'signup' && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>FULL NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Senzo Zulu"
              placeholderTextColor={Colors.textMuted}
              value={name}
              onChangeText={setName}
            />
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
          <TextInput
            style={styles.input}
            placeholder="member@private.club"
            placeholderTextColor={Colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>PRIVATE KEY / PASSWORD</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••••••"
            placeholderTextColor={Colors.textMuted}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Submit Button */}
        <Pressable
          disabled={isLoading}
          onPress={handleSubmit}
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}>
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.background} />
          ) : (
            <View style={styles.submitBtnInner}>
              {mode === 'signup' && (
                <VelaIcon
                  name="arrow-forward-outline"
                  size={14}
                  color={Colors.background}
                  style={styles.submitIcon}
                />
              )}
              <Text style={styles.submitButtonText}>
                {mode === 'signup' ? 'Enter the Birthday Twin Society' : 'Sign In to Vela'}
              </Text>
            </View>
          )}
        </Pressable>

        {/* Continue as Guest Button */}
        {onDismiss && (
          <Pressable onPress={onDismiss} style={styles.browseFreeBtn}>
            <Text style={styles.browseFreeBtnText}>Continue Browsing Free as Guest</Text>
          </Pressable>
        )}

        <Text style={styles.termsNote}>
          By entering, you confirm you are willing to celebrate with your exact calendar twins.
        </Text>
      </View>
    </ScrollView>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 60,
  },
  topDismissBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  dismissBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionPromptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.goldLight,
    borderWidth: 1,
    borderColor: Colors.goldAccent,
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
  },
  actionPromptIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Colors.goldAccent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  actionPromptTextContainer: {
    flex: 1,
  },
  actionPromptTag: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.goldAccent,
    marginBottom: 2,
  },
  actionPromptText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 16,
  },
  browseFreeBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  browseFreeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    textDecorationLine: 'underline',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  crestCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accentLight,
    borderWidth: 1,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  crestText: {
    fontSize: 20,
    color: Colors.accentDark,
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 8,
    color: Colors.textPrimary,
  },
  brandSub: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    color: Colors.goldAccent,
    marginTop: 4,
    marginBottom: 12,
  },
  brandManifesto: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    maxWidth: 320,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  toggleBtnActive: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  toggleTextActive: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  errorBox: {
    backgroundColor: Colors.errorLight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  pickerWrapper: {
    marginBottom: 20,
  },
  detectedCategoryBox: {
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 14,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  detectedCategoryLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  detectedCategoryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.accentDark,
  },
  parentNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  parentNoticeIcon: {
    marginRight: 4,
  },
  parentNoticeText: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 15,
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: Colors.textSecondary,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  submitButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.buttonDisabled,
  },
  submitBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitIcon: {
    marginRight: 6,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: Colors.background,
  },
  termsNote: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 8,
  },
});
