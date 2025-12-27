import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Platform,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';
import { PrimaryButton } from '../components/Button';
import { currentUser } from '../data/mockData';

const SendHeartsScreen = ({ route, navigation }) => {
  const { neighbor } = route.params || {};
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [reason, setReason] = useState('');
  const [sent, setSent] = useState(false);

  const quickAmounts = [25, 50, 100];

  const getAmount = () => {
    if (selectedAmount === 'custom') {
      return parseInt(customAmount) || 0;
    }
    return selectedAmount || 0;
  };

  const handleSend = () => {
    setSent(true);
  };

  if (sent) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.successContainer}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>Skickat till {neighbor?.name}!</Text>
          <Text style={styles.successAmount}>💖 {getAmount()} Hearts</Text>
          {reason && <Text style={styles.successReason}>"{reason}"</Text>}
          <Text style={styles.successMessage}>
            Bekräftelse kommer när {neighbor?.name} är online eller inom Bluetooth-räckvidd.
          </Text>
          <PrimaryButton
            title="Klar"
            onPress={() => navigation.navigate('Home')}
            style={styles.doneButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.topSpacer} />
      
      <View style={styles.topBar}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backButton}>← Avbryt</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Skicka Hearts till:</Text>

        {/* Recipient Profile */}
        <View style={styles.recipientSection}>
          <View style={styles.profilePhoto}>
            <Text style={styles.initials}>
              {neighbor?.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <Text style={styles.recipientName}>{neighbor?.name}</Text>
          <Text style={styles.recipientBalance}>💗 Hennes saldo: {neighbor?.heartsBalance} Hearts</Text>
        </View>

        {/* Amount Selection */}
        <Text style={styles.label}>Hur mycket?</Text>
        <View style={styles.amountGrid}>
          {quickAmounts.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={[
                styles.amountButton,
                selectedAmount === amount && styles.amountButtonSelected,
              ]}
              onPress={() => setSelectedAmount(amount)}
            >
              <Text
                style={[
                  styles.amountButtonText,
                  selectedAmount === amount && styles.amountButtonTextSelected,
                ]}
              >
                ⭕️ {amount}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[
              styles.amountButton,
              selectedAmount === 'custom' && styles.amountButtonSelected,
            ]}
            onPress={() => setSelectedAmount('custom')}
          >
            <Text
              style={[
                styles.amountButtonText,
                selectedAmount === 'custom' && styles.amountButtonTextSelected,
              ]}
            >
              ⭕️ Annat:
            </Text>
          </TouchableOpacity>
        </View>

        {selectedAmount === 'custom' && (
          <TextInput
            style={styles.customInput}
            placeholder="Ange belopp..."
            keyboardType="numeric"
            value={customAmount}
            onChangeText={setCustomAmount}
          />
        )}

        {/* Reason */}
        <Text style={styles.label}>Varför? (valfritt)</Text>
        <TextInput
          style={styles.reasonInput}
          placeholder="T.ex. 'Tack för veden!'"
          value={reason}
          onChangeText={setReason}
          multiline
        />

        {/* Balance Info */}
        <View style={styles.balanceInfo}>
          <Text style={styles.balanceText}>
            💗 Ditt saldo: {currentUser.heartsBalance} Hearts
          </Text>
          {getAmount() > 0 && (
            <Text style={styles.balanceText}>
              (blir {currentUser.heartsBalance - getAmount()} efter detta)
            </Text>
          )}
        </View>

        <PrimaryButton
          title={`Skicka ${getAmount()} Hearts`}
          onPress={handleSend}
          disabled={getAmount() === 0 || getAmount() > currentUser.heartsBalance}
          style={styles.sendButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topSpacer: {
    height: Platform.OS === 'ios' ? 0 : spacing.sm,
  },
  topBar: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md + 4,
    backgroundColor: colors.white,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    minHeight: 56,
  },
  backButton: {
    ...typography.body,
    color: colors.forestGreen,
    fontWeight: '600',
    fontSize: 18,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  header: {
    ...typography.h2,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  recipientSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  profilePhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E1F5DD',
    borderWidth: 3,
    borderColor: colors.forestGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  initials: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.forestGreen,
  },
  recipientName: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  recipientBalance: {
    ...typography.bodySmall,
    color: colors.warmOrange,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  amountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  amountButton: {
    width: '48%',
    height: 80,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '4%',
    marginBottom: spacing.sm,
  },
  amountButtonSelected: {
    backgroundColor: colors.forestGreen,
    borderColor: colors.forestGreen,
  },
  amountButtonText: {
    ...typography.body,
    fontWeight: '600',
  },
  amountButtonTextSelected: {
    color: colors.white,
  },
  customInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: 16,
    marginBottom: spacing.md,
  },
  reasonInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: 16,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: spacing.md,
  },
  balanceInfo: {
    backgroundColor: colors.background,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.lg,
  },
  balanceText: {
    ...typography.bodySmall,
    textAlign: 'center',
  },
  sendButton: {
    marginBottom: spacing.lg,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  successIcon: {
    fontSize: 64,
    color: colors.successGreen,
    marginBottom: spacing.lg,
  },
  successTitle: {
    ...typography.h1,
    marginBottom: spacing.md,
  },
  successAmount: {
    ...typography.h2,
    color: colors.warmOrange,
    marginBottom: spacing.sm,
  },
  successReason: {
    ...typography.body,
    fontStyle: 'italic',
    marginBottom: spacing.lg,
  },
  successMessage: {
    ...typography.bodySmall,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  doneButton: {
    width: '100%',
  },
});

export default SendHeartsScreen;
