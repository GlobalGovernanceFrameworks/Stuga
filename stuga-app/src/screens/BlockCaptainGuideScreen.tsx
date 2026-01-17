import React from 'react';
import { View, ScrollView, StyleSheet, Linking, Alert } from 'react-native';
import { Text, Card, Button, Divider, List } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BlockCaptainGuideScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  function handleCallCommune() {
    const phoneNumber = '08-590 970 00'; // Upplands Väsby kommun växel
    const url = `tel:${phoneNumber.replace(/[\s-]/g, '')}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Fel', 'Kunde inte öppna telefon-appen');
        }
      })
      .catch((err) => {
        console.error('Phone error:', err);
        Alert.alert('Fel', 'Kunde inte ringa');
      });
  }

  function handleCallSOS() {
    Alert.alert(
      'Ring 112?',
      'Använd endast 112 vid akut fara för liv eller hälsa.',
      [
        { text: 'Avbryt', style: 'cancel' },
        {
          text: 'Ring 112',
          style: 'destructive',
          onPress: () => Linking.openURL('tel:112')
        }
      ]
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F3F0' }}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        <Card style={styles.headerCard}>
          <Card.Content>
            <Text style={styles.badge}>🛡️ KVARTERSVÄRD</Text>
            <Text style={styles.title}>Din roll vid kris</Text>
            <Text style={styles.subtitle}>
              Som kvartersvärd är du en lokal kontaktperson mellan grannar och myndigheter.
            </Text>
          </Card.Content>
        </Card>

        {/* VID VARNINGSSIGNAL */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>🚨 Vid Viktigt Meddelande till Allmänheten (VMA)</Text>
            <Text style={styles.description}>
              När du hör "Viktigt meddelande till allmänheten" i radio/TV:
            </Text>
            
            <List.Section>
              <List.Item
                title="1. Lyssna på meddelandet"
                description="Följ SR P4, SVT eller lokal radio för information"
                left={props => <List.Icon {...props} icon="radio" color="#2D5016" />}
                titleStyle={styles.listTitle}
              />
              <List.Item
                title="2. Kontrollera dina närmaste grannar"
                description="Kolla särskilt på äldre, funktionsvarierade och barn"
                left={props => <List.Icon {...props} icon="account-group" color="#2D5016" />}
                titleStyle={styles.listTitle}
              />
              <List.Item
                title="3. Dela information"
                description="Använd Stuga-appen för att dela viktig info till närområdet"
                left={props => <List.Icon {...props} icon="bullhorn" color="#2D5016" />}
                titleStyle={styles.listTitle}
              />
              <List.Item
                title="4. Samordna resurser"
                description="Se vem som har/behöver mat, värme, transport via appen"
                left={props => <List.Icon {...props} icon="package-variant" color="#2D5016" />}
                titleStyle={styles.listTitle}
              />
            </List.Section>
          </Card.Content>
        </Card>

        {/* FÖRE KRIS */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>📋 Före kris - förberedelser</Text>
            
            <List.Section>
              <List.Item
                title="Lär känna dina grannar"
                description="Använd Stuga-appen för att bygga nätverk redan nu"
                left={props => <List.Icon {...props} icon="handshake" color="#2D5016" />}
                titleStyle={styles.listTitle}
              />
              <List.Item
                title="Identifiera särskilt sårbara"
                description="Ensamma äldre, funktionsvarierade, barnfamiljer"
                left={props => <List.Icon {...props} icon="account-alert" color="#2D5016" />}
                titleStyle={styles.listTitle}
              />
              <List.Item
                title="Kartlägg lokala resurser"
                description="Vem har generator, ved, radio, förstahjälpen-kunskap?"
                left={props => <List.Icon {...props} icon="map-marker-radius" color="#2D5016" />}
                titleStyle={styles.listTitle}
              />
              <List.Item
                title="Ha egen beredskap"
                description="Följ MCF:s (tidigare MSB) checklista: vatten, mat, värme, ljus"
                left={props => <List.Icon {...props} icon="shield-check" color="#2D5016" />}
                titleStyle={styles.listTitle}
              />
            </List.Section>
          </Card.Content>
        </Card>

        {/* UNDER KRIS */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>⚡ Under pågående kris</Text>
            
            <List.Section>
              <List.Item
                title="Håll dig informerad"
                description="Radio, SMS, 113 13 (krisinformation.se)"
                left={props => <List.Icon {...props} icon="information" color="#2D5016" />}
                titleStyle={styles.listTitle}
              />
              <List.Item
                title="Gör en grannrunda"
                description="Fysiskt eller via Stuga-appen om nätet fungerar"
                left={props => <List.Icon {...props} icon="walk" color="#2D5016" />}
                titleStyle={styles.listTitle}
              />
              <List.Item
                title="Samordna resurser"
                description="Hjälp grannar dela mat, värme, transport"
                left={props => <List.Icon {...props} icon="swap-horizontal" color="#2D5016" />}
                titleStyle={styles.listTitle}
              />
              <List.Item
                title="Rapportera till kommunen"
                description="Ring om det finns allvarliga behov (se knapp nedan)"
                left={props => <List.Icon {...props} icon="phone-alert" color="#2D5016" />}
                titleStyle={styles.listTitle}
              />
              <List.Item
                title="Agera inte själv vid fara"
                description="Ring 112 om någon är i direkt fara"
                left={props => <List.Icon {...props} icon="alert-circle" color="#C1121F" />}
                titleStyle={styles.listTitle}
                titleNumberOfLines={2}
              />
            </List.Section>
          </Card.Content>
        </Card>

        {/* EFTER KRIS */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>✅ Efter kris</Text>
            
            <List.Section>
              <List.Item
                title="Fortsätt stötta grannar"
                description="Många behöver hjälp även efter akut fas"
                left={props => <List.Icon {...props} icon="heart" color="#2D5016" />}
                titleStyle={styles.listTitle}
              />
              <List.Item
                title="Dokumentera lärdomar"
                description="Vad fungerade? Vad kan förbättras?"
                left={props => <List.Icon {...props} icon="notebook" color="#2D5016" />}
                titleStyle={styles.listTitle}
              />
              <List.Item
                title="Rapportera till kommunen"
                description="Dela erfarenheter för bättre framtida beredskap"
                left={props => <List.Icon {...props} icon="message-reply-text" color="#2D5016" />}
                titleStyle={styles.listTitle}
              />
            </List.Section>
          </Card.Content>
        </Card>

        {/* VIKTIGA NUMMER */}
        <Card style={styles.emergencyCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>📞 Viktiga nummer</Text>
            
            <View style={styles.phoneRow}>
              <View style={styles.phoneInfo}>
                <Text style={styles.phoneLabel}>Nödnummer</Text>
                <Text style={styles.phoneNumber}>112</Text>
              </View>
              <Button
                mode="contained"
                onPress={handleCallSOS}
                buttonColor="#C1121F"
                textColor="#fff"
                icon="phone"
              >
                Ring
              </Button>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.phoneRow}>
              <View style={styles.phoneInfo}>
                <Text style={styles.phoneLabel}>Upplands Väsby kommun</Text>
                <Text style={styles.phoneNumber}>08-590 970 00</Text>
                <Text style={styles.phoneHint}>Säkerhetsenheten</Text>
              </View>
              <Button
                mode="contained"
                onPress={handleCallCommune}
                buttonColor="#2D5016"
                textColor="#fff"
                icon="phone"
              >
                Ring
              </Button>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.phoneLabel}>Krisinformation</Text>
              <Text style={styles.phoneNumber}>113 13</Text>
              <Text style={styles.phoneHint}>eller krisinformation.se</Text>
            </View>
          </Card.Content>
        </Card>

        {/* RESURSER */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>📚 Mer information</Text>
            
            <Text style={styles.resourceText}>
              • MCF: "Om krisen eller kriget kommer" (broschyr){'\n'}
              • Civilförsvarsförbundet i Väsby{'\n'}
              • dinsakerhet.se - tips om beredskap{'\n'}
              • krisinformation.se - aktuell lägesbild
            </Text>
          </Card.Content>
        </Card>

        <Text style={styles.footerText}>
          Tack för att du tar ansvar som kvartersvärd!
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  headerCard: {
    marginBottom: 16,
    backgroundColor: '#2D5016'
  },
  badge: {
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: '#E0E0E0',
    textAlign: 'center',
    lineHeight: 20
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#fff'
  },
  emergencyCard: {
    marginBottom: 16,
    backgroundColor: '#FFF4E6'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 12
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D5016'
  },
  phoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8
  },
  phoneInfo: {
    flex: 1
  },
  phoneLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 4
  },
  phoneNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 2
  },
  phoneHint: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic'
  },
  divider: {
    marginVertical: 12
  },
  infoRow: {
    paddingVertical: 8
  },
  resourceText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22
  },
  footerText: {
    fontSize: 14,
    color: '#2D5016',
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 16
  }
});
