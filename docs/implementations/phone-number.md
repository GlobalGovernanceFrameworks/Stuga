Om du vill låta användare lägga till sitt eget telefonnummer:

Öppna: src/screens/ProfileScreen.tsx

Lägg till TextInput för telefonnummer:

<Card style={styles.card}>
  <Card.Content>
    <Text style={styles.sectionTitle}>Kontaktinformation</Text>
    <TextInput
      label="Telefonnummer"
      value={phoneNumber}
      onChangeText={setPhoneNumber}
      mode="outlined"
      keyboardType="phone-pad"
      placeholder="+46701234567"
      style={styles.input}
    />
    <Button
      mode="contained"
      onPress={savePhoneNumber}
      style={{ marginTop: 8 }}
      buttonColor="#2D5016"
    >
      Spara nummer
    </Button>
    <Text style={styles.hint}>
      Ditt nummer delas med grannar du interagerar med
    </Text>
  </Card.Content>
</Card>

Men för MVP kan du skippa detta - BankID kommer ha telefonnummer automatiskt!
