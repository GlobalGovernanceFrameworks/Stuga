import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, TextInput, SegmentedButtons } from 'react-native-paper';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

const QUICK_AMOUNTS = [25, 50, 100];

export default function SendHeartsScreen({ route, navigation }: any) {
  const { neighbor } = route.params;
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [reason, setReason] = useState('');
  const [myBalance, setMyBalance] = useState(0);
  const [sending, setSending] = useState(false);
  const [useCustom, setUseCustom] = useState(false);

  useEffect(() => {
    loadMyBalance();
  }, []);

  async function loadMyBalance() {
    try {
      const user = auth.currentUser;
      if (!user) return;
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setMyBalance(userDoc.data().hearts_balance || 0);
      }
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  }

  async function handleSend() {
    const finalAmount = useCustom ? parseInt(customAmount) : amount;
    
    if (!finalAmount || finalAmount <= 0) {
      alert('Ange ett giltigt belopp');
      return;
    }

    if (finalAmount > myBalance) {
      alert('Du har inte tillräckligt många Hearts');
      return;
    }

    setSending(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      await addDoc(collection(db, 'hearts_transactions'), {
        from_user: user.uid,
        to_user: neighbor.user_id,
        amount: finalAmount,
        reason: reason.trim() || 'Tack för hjälpen!',
        related_resource: null,
        confirmed_by_sender: true,
        confirmed_by_receiver: false,
        created_at: Date.now(),
        completed_at: null
      });

      // Show success
      alert(`✅ Skickade ${finalAmount} Hearts till ${neighbor.name}!\n\nBekräftelse kommer när ${neighbor.name.split(' ')[0]} är online.`);
      navigation.goBack();
    } catch (error) {
      console.error('Error sending Hearts:', error);
      alert('Kunde inte skicka Hearts');
    } finally {
      setSending(false);
    }
  }

  const finalAmount = useCustom ? parseInt(customAmount) || 0 : amount;
  const newBalance = myBalance - finalAmount;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Skicka Hearts till:</Text>
          <Text style={styles.name}>{neighbor.name}</Text>
          <Text style={styles.info}>🔥 Deras saldo: {neighbor.hearts_balance} Hearts</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.label}>Hur mycket?</Text>
          
          {!useCustom ? (
            <View style={styles.quickButtons}>
              {QUICK_AMOUNTS.map(amt => (
                <Button
                  key={amt}
                  mode={amount === amt ? 'contained' : 'outlined'}
                  onPress={() => setAmount(amt)}
                  style={styles.quickButton}
                  buttonColor={amount === amt ? '#2D5016' : undefined}
                >
                  {amt} Hearts
                </Button>
              ))}
            </View>
          ) : (
            <TextInput
              value={customAmount}
              onChangeText={setCustomAmount}
              placeholder="Ange antal Hearts"
              keyboardType="numeric"
              mode="outlined"
              style={styles.input}
            />
          )}

          <Button
            mode="text"
            onPress={() => setUseCustom(!useCustom)}
            style={styles.toggleButton}
          >
            {useCustom ? '← Tillbaka till snabbval' : 'Annat belopp →'}
          </Button>

          <Text style={styles.label}>Varför? (valfritt)</Text>
          <TextInput
            value={reason}
            onChangeText={setReason}
            placeholder="T.ex. Tack för veden!"
            mode="outlined"
            multiline
            numberOfLines={3}
            style={styles.input}
            maxLength={200}
          />

          <View style={styles.balanceBox}>
            <Text style={styles.balanceLabel}>🔥 Ditt saldo: {myBalance} Hearts</Text>
            {finalAmount > 0 && (
              <Text style={[styles.balanceLabel, newBalance < 0 && styles.negative]}>
                Efter: {newBalance} Hearts
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleSend}
        loading={sending}
        disabled={sending || finalAmount <= 0 || finalAmount > myBalance}
        style={styles.sendButton}
        buttonColor="#FF6B35"
      >
        Skicka {finalAmount > 0 ? `${finalAmount} Hearts` : 'Hearts'}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3F0',
    padding: 16
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 8
  },
  info: {
    fontSize: 14,
    color: '#666'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2D5016'
  },
  quickButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  quickButton: {
    flex: 1,
    marginHorizontal: 4
  },
  toggleButton: {
    marginVertical: 8
  },
  input: {
    backgroundColor: '#fff',
    marginBottom: 8
  },
  balanceBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFF4E6',
    borderRadius: 8
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 4
  },
  negative: {
    color: '#C1121F'
  },
  sendButton: {
    marginVertical: 16
  }
});
