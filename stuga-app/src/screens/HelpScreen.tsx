import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Card, List, Divider } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const [expandedId, setExpandedId] = useState<string | null>('symbols');

  const handlePress = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F3F0' }}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        <Card style={styles.headerCard}>
          <Card.Content>
            <Text style={styles.title}>Snabbguide</Text>
            <Text style={styles.subtitle}>
              Vanliga frågor och förklaringar
            </Text>
          </Card.Content>
        </Card>

        {/* Symboler & Indikatorer */}
        <Card style={styles.card}>
          <List.Accordion
            title="Symboler & Indikatorer"
            left={props => <List.Icon {...props} icon="eye" color="#2D5016" />}
            expanded={expandedId === 'symbols'}
            onPress={() => handlePress('symbols')}
            style={styles.accordion}
            titleStyle={styles.accordionTitle}
          >
            <View style={styles.content}>
              <View style={styles.row}>
                <Text style={styles.symbol}>🟢</Text>
                <View style={styles.explanation}>
                  <Text style={styles.label}>Grön prick</Text>
                  <Text style={styles.description}>Granne är tillgänglig</Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.symbol}>🛡️</Text>
                <View style={styles.explanation}>
                  <Text style={styles.label}>Sköld</Text>
                  <Text style={styles.description}>Kvartersvärd - lokal kontaktperson vid kris</Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.symbol}>🔥</Text>
                <View style={styles.explanation}>
                  <Text style={styles.label}>Hearts</Text>
                  <Text style={styles.description}>Tack-valuta för ömsesidig hjälp</Text>
                </View>
              </View>

              <Divider style={styles.divider} />

              <Text style={styles.subheading}>Brådskande-nivåer:</Text>

              <View style={styles.row}>
                <Text style={styles.symbol}>🔴</Text>
                <View style={styles.explanation}>
                  <Text style={styles.label}>Brådskande</Text>
                  <Text style={styles.description}>Behövs inom 24 timmar</Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.symbol}>🟡</Text>
                <View style={styles.explanation}>
                  <Text style={styles.label}>Snart utgången</Text>
                  <Text style={styles.description}>2-7 dagar kvar</Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.symbol}>🟢</Text>
                <View style={styles.explanation}>
                  <Text style={styles.label}>Tillgänglig</Text>
                  <Text style={styles.description}>1+ vecka eller ingen tidsgräns</Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.symbol}>⚪</Text>
                <View style={styles.explanation}>
                  <Text style={styles.label}>Utgången</Text>
                  <Text style={styles.description}>Passerat deadline (visas gråmarkerad)</Text>
                </View>
              </View>

              <Divider style={styles.divider} />

              <Text style={styles.subheading}>Resurstyper:</Text>

              <View style={styles.row}>
                <Text style={styles.symbol}>📤</Text>
                <View style={styles.explanation}>
                  <Text style={styles.label}>Erbjuder</Text>
                  <Text style={styles.description}>Resurs att dela</Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.symbol}>📥</Text>
                <View style={styles.explanation}>
                  <Text style={styles.label}>Behöver</Text>
                  <Text style={styles.description}>Resurs som efterfrågas</Text>
                </View>
              </View>

              <Divider style={styles.divider} />

              <Text style={styles.subheading}>Status-indikatorer:</Text>

              <View style={styles.row}>
                <Text style={styles.symbol}>📡</Text>
                <View style={styles.explanation}>
                  <Text style={styles.label}>Offline</Text>
                  <Text style={styles.description}>Ingen internet, åtgärder köas</Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.symbol}>🔄</Text>
                <View style={styles.explanation}>
                  <Text style={styles.label}>Synkroniserar</Text>
                  <Text style={styles.description}>Skickar köade transaktioner</Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.symbol}>🔶</Text>
                <View style={styles.explanation}>
                  <Text style={styles.label}>Bluetooth aktiv</Text>
                  <Text style={styles.description}>Upptäcker grannar trådlöst (~50m)</Text>
                </View>
              </View>

              <Divider style={styles.divider} />

              <Text style={styles.subheading}>Hearts-transaktioner:</Text>

              <View style={styles.row}>
                <Text style={styles.symbol}>✓</Text>
                <View style={styles.explanation}>
                  <Text style={styles.label}>Bekräftad</Text>
                  <Text style={styles.description}>Mottagare har bekräftat Hearts</Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.symbol}>⏳</Text>
                <View style={styles.explanation}>
                  <Text style={styles.label}>Väntar</Text>
                  <Text style={styles.description}>Väntar på mottagarens bekräftelse</Text>
                </View>
              </View>
            </View>
          </List.Accordion>
        </Card>

        {/* Hearts-systemet */}
        <Card style={styles.card}>
          <List.Accordion
            title="Hearts-systemet"
            left={props => <List.Icon {...props} icon="fire" color="#2D5016" />}
            expanded={expandedId === 'hearts'}
            onPress={() => handlePress('hearts')}
            style={styles.accordion}
            titleStyle={styles.accordionTitle}
          >
            <View style={styles.content}>
              <Text style={styles.description}>
                Hearts (🔥) är Stugas tack-valuta. Du använder dem för att visa uppskattning när grannar hjälper.
              </Text>

              <Divider style={styles.divider} />

              <Text style={styles.subheading}>Startvärde</Text>
              <Text style={styles.description}>
                Alla nya användare får 250 Hearts
              </Text>

              <Divider style={styles.divider} />

              <Text style={styles.subheading}>Vad betyder balansen?</Text>
              
              <View style={styles.row}>
                <Text style={styles.badge}>300+</Text>
                <View style={styles.explanation}>
                  <Text style={styles.description}>Aktiv och hjälpsam granne</Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.badge}>200-300</Text>
                <View style={styles.explanation}>
                  <Text style={styles.description}>Normal balans</Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.badge}>{'<100'}</Text>
                <View style={styles.explanation}>
                  <Text style={styles.description}>Generös - gett mer än tagit!</Text>
                </View>
              </View>

              <Divider style={styles.divider} />

              <Text style={styles.subheading}>Hur använder jag Hearts?</Text>
              <Text style={styles.description}>
                1. Öppna grannens profil{'\n'}
                2. Klicka "Skicka Hearts"{'\n'}
                3. Välj belopp (25, 50, 100){'\n'}
                4. Granne bekräftar mottagning
              </Text>

              <Text style={styles.hint}>
                💡 Hearts är inte pengar - de mäter ömsesidig hjälp
              </Text>
            </View>
          </List.Accordion>
        </Card>

        {/* Kvartersvärd */}
        <Card style={styles.card}>
          <List.Accordion
            title="Kvartersvärd (🛡️)"
            left={props => <List.Icon {...props} icon="shield-account" color="#2D5016" />}
            expanded={expandedId === 'captain'}
            onPress={() => handlePress('captain')}
            style={styles.accordion}
            titleStyle={styles.accordionTitle}
          >
            <View style={styles.content}>
              <Text style={styles.description}>
                Kvartersvärdar är lokala kontaktpersoner mellan grannar och kommun vid kriser.
              </Text>

              <Divider style={styles.divider} />

              <Text style={styles.subheading}>Uppgifter:</Text>
              <Text style={styles.description}>
                • Känna till grannar i området{'\n'}
                • Hålla koll på sårbara personer{'\n'}
                • Samordna resurser vid strömavbrott/storm{'\n'}
                • Rapportera allvarliga behov till kommun
              </Text>

              <Divider style={styles.divider} />

              <Text style={styles.subheading}>Bli kvartersvärd:</Text>
              <Text style={styles.description}>
                Profil → "🛡️ Kvartersvärd" → Aktivera{'\n'}
                Klicka "Visa guide" för fullständig checklista
              </Text>

              <Text style={styles.hint}>
                💡 Baserat på MSB:s riktlinjer och Civilförsvarsförbundet
              </Text>
            </View>
          </List.Accordion>
        </Card>

        {/* Offline-läge */}
        <Card style={styles.card}>
          <List.Accordion
            title="Offline-läge"
            left={props => <List.Icon {...props} icon="wifi-off" color="#2D5016" />}
            expanded={expandedId === 'offline'}
            onPress={() => handlePress('offline')}
            style={styles.accordion}
            titleStyle={styles.accordionTitle}
          >
            <View style={styles.content}>
              <Text style={styles.subheading}>Fungerar offline:</Text>
              <Text style={styles.description}>
                ✅ Se cachade grannar{'\n'}
                ✅ Läsa resurser{'\n'}
                ✅ Lägga till resurser (köas){'\n'}
                ✅ Skicka Hearts (köas)
              </Text>

              <Divider style={styles.divider} />

              <Text style={styles.subheading}>Kräver internet:</Text>
              <Text style={styles.description}>
                ❌ Uppdatera grannlista{'\n'}
                ❌ Se nya resurser{'\n'}
                ❌ Ta emot kontaktförfrågningar
              </Text>

              <Divider style={styles.divider} />

              <Text style={styles.subheading}>Manuell synkning:</Text>
              <Text style={styles.description}>
                När internet är tillbaka visas "Synka (X)" på hemskärmen.{'\n'}
                Klicka för att skicka köade åtgärder.
              </Text>

              <Text style={styles.hint}>
                💡 Alla offline-åtgärder sparas och synkas automatiskt
              </Text>
            </View>
          </List.Accordion>
        </Card>

        {/* Integritet */}
        <Card style={styles.card}>
          <List.Accordion
            title="Integritet & Säkerhet"
            left={props => <List.Icon {...props} icon="shield-lock" color="#2D5016" />}
            expanded={expandedId === 'privacy'}
            onPress={() => handlePress('privacy')}
            style={styles.accordion}
            titleStyle={styles.accordionTitle}
          >
            <View style={styles.content}>
              <Text style={styles.subheading}>Privat (bara du ser):</Text>
              <Text style={styles.description}>
                🔒 Riktigt namn (tills kontakt godkänns){'\n'}
                🔒 Telefonnummer (tills kontakt godkänns){'\n'}
                🔒 Exakt GPS-position (avrundas till ~50m)
              </Text>

              <Divider style={styles.divider} />

              <Text style={styles.subheading}>Publikt (grannar ser):</Text>
              <Text style={styles.description}>
                👁️ Visningsnamn{'\n'}
                👁️ Hearts-saldo{'\n'}
                👁️ Resurser du delar{'\n'}
                👁️ Ungefärligt avstånd
              </Text>

              <Divider style={styles.divider} />

              <Text style={styles.subheading}>Kontaktförfrågningar:</Text>
              <Text style={styles.description}>
                Du måste godkänna kontakt för att dela:
                • Riktigt namn
                • Telefonnummer
                • Exakt avstånd (om du tillåter det)
              </Text>

              <Text style={styles.hint}>
                💡 Blockera olämpliga användare via deras profil
              </Text>
            </View>
          </List.Accordion>
        </Card>

        {/* Vanliga frågor */}
        <Card style={styles.card}>
          <List.Accordion
            title="Vanliga frågor"
            left={props => <List.Icon {...props} icon="frequently-asked-questions" color="#2D5016" />}
            expanded={expandedId === 'faq'}
            onPress={() => handlePress('faq')}
            style={styles.accordion}
            titleStyle={styles.accordionTitle}
          >
            <View style={styles.content}>
              <Text style={styles.question}>Varför ser jag inga grannar?</Text>
              <Text style={styles.answer}>
                Kontrollera att du är i Upplands Väsby kommun och att platsåtkomst är aktiverad. Dra ner för att uppdatera.
              </Text>

              <Divider style={styles.divider} />

              <Text style={styles.question}>Kan jag bli av med Hearts?</Text>
              <Text style={styles.answer}>
                Ja, om du ger bort alla. Men du får tillbaka när du hjälper andra! Negativt saldo är OK.
              </Text>

              <Divider style={styles.divider} />

              <Text style={styles.question}>Hur avinstallerar/raderar jag mitt konto?</Text>
              <Text style={styles.answer}>
                Kontakta bjorn.kenneth.holmstrom@gmail.com för kontoradering.
              </Text>

              <Divider style={styles.divider} />

              <Text style={styles.question}>Fungerar notiser i Expo Go?</Text>
              <Text style={styles.answer}>
                Lokala notiser fungerar. Push-notiser kräver produktionsbygge (kommer i april).
              </Text>
            </View>
          </List.Accordion>
        </Card>

        {/* Fullständig guide */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.infoTitle}>📖 Mer information</Text>
            <Text style={styles.infoText}>
              För fullständig instruktionsbok, se ANVÄNDARGUIDE.md i projektets GitHub-repository.
            </Text>
            <Text style={styles.infoText}>
              {'\n'}Support: bjorn.kenneth.holmstrom@gmail.com
            </Text>
          </Card.Content>
        </Card>
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
    textAlign: 'center'
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#fff'
  },
  accordion: {
    backgroundColor: '#fff'
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5016'
  },
  content: {
    padding: 16,
    paddingTop: 0
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  symbol: {
    fontSize: 28,
    width: 45,
    marginRight: 8
  },
  badge: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#2D5016',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 60,
    textAlign: 'center'
  },
  explanation: {
    flex: 1
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 2
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  },
  subheading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 8,
    marginTop: 4
  },
  divider: {
    marginVertical: 12
  },
  hint: {
    fontSize: 13,
    color: '#FF6B35',
    fontStyle: 'italic',
    marginTop: 12,
    padding: 8,
    backgroundColor: '#FFF4E6',
    borderRadius: 8
  },
  question: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 6
  },
  answer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 4
  },
  infoCard: {
    marginBottom: 16,
    backgroundColor: '#E8F5E9'
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D5016',
    marginBottom: 8
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20
  }
});
