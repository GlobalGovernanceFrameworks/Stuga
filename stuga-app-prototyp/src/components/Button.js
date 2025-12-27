import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../theme';

export const PrimaryButton = ({ title, onPress, style, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[
        styles.primaryButton,
        disabled && styles.disabledButton,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={styles.primaryButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export const SecondaryButton = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.secondaryButton, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.secondaryButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.forestGreen,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md + 2, // 18px for 56px total height
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    ...typography.button,
    color: colors.white,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.forestGreen,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md, // Slightly less due to border
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    ...typography.button,
    color: colors.forestGreen,
  },
  disabledButton: {
    backgroundColor: colors.border,
  },
});
