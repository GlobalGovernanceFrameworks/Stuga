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
import { resourceCategories } from '../data/mockData';

const AddResourceScreen = ({ navigation }) => {
  const [type, setType] = useState('offer'); // 'offer' or 'need'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [description, setDescription] = useState('');

  const handleSave = () => {
    // In real app, save to CivicBase
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Extra wrapper for notched devices */}
      <View style={styles.topSpacer} />
      
      {/* Top Bar - Fixed with better visibility */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backButton}>← Avbryt</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleSave}
          disabled={!selectedCategory || !description}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[
            styles.saveButton, 
            (!selectedCategory || !description) && styles.disabled
          ]}>
            Spara
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Type Toggle */}
        <Text style={styles.label}>Jag...</Text>
        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'offer' && styles.typeButtonActive]}
            onPress={() => setType('offer')}
          >
            <Text style={[styles.typeButtonText, type === 'offer' && styles.typeButtonTextActive]}>
              Erbjuder
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'need' && styles.typeButtonActive]}
            onPress={() => setType('need')}
          >
            <Text style={[styles.typeButtonText, type === 'need' && styles.typeButtonTextActive]}>
              Behöver
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category Selection */}
        <Text style={styles.label}>Kategori</Text>
        <View style={styles.categoryGrid}>
          {resourceCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonSelected,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text
                style={[
                  styles.categoryLabel,
                  selectedCategory === category.id && styles.categoryLabelSelected,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Description */}
        <Text style={styles.label}>Beskrivning</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Beskriv resursen..."
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={200}
        />
        <Text style={styles.characterCount}>{description.length}/200</Text>

        {/* Privacy Options (simplified) */}
        <View style={styles.privacySection}>
          <View style={styles.checkboxRow}>
            <Text style={styles.checkboxIcon}>☐</Text>
            <Text style={styles.checkboxLabel}>Synlig för alla grannar</Text>
          </View>
          <View style={styles.checkboxRow}>
            <Text style={styles.checkboxIcon}>☑</Text>
            <Text style={styles.checkboxLabel}>Synlig för FRG-medlemmar</Text>
          </View>
          <View style={styles.checkboxRow}>
            <Text style={styles.checkboxIcon}>☐</Text>
            <Text style={styles.checkboxLabel}>Endast nära grannar (&lt;100m)</Text>
          </View>
        </View>
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
    height: Platform.OS === 'ios' ? 0 : spacing.sm, // Extra space on Android if needed
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md + 4, // Extra padding for better visibility
    backgroundColor: colors.white,
    borderBottomWidth: 2,
    borderBottomColor: colors.border,
    minHeight: 56, // Ensure minimum touchable height
  },
  backButton: {
    ...typography.body,
    color: colors.forestGreen,
    fontWeight: '600',
    fontSize: 18, // Larger for better visibility
  },
  saveButton: {
    ...typography.body,
    color: colors.forestGreen,
    fontWeight: '700', // Bolder
    fontSize: 18, // Larger for better visibility
  },
  disabled: {
    color: colors.textLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  typeToggle: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  typeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 24,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  typeButtonActive: {
    backgroundColor: colors.forestGreen,
    borderColor: colors.forestGreen,
  },
  typeButtonText: {
    ...typography.body,
  },
  typeButtonTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryButton: {
    width: '48%',
    height: 80,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '4%',
    marginBottom: spacing.sm,
  },
  categoryButtonSelected: {
    backgroundColor: '#E1F5DD',
    borderColor: colors.forestGreen,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  categoryLabel: {
    ...typography.bodySmall,
  },
  categoryLabelSelected: {
    fontWeight: '600',
  },
  descriptionInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: 16,
    height: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    ...typography.bodySmall,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  privacySection: {
    marginTop: spacing.lg,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  checkboxIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
    color: colors.forestGreen,
  },
  checkboxLabel: {
    ...typography.body,
  },
});

export default AddResourceScreen;
