import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Button, Modal, ScrollView, SafeAreaView } from 'react-native';

// Definer typene for Kategori og Produkt
type Category = {
  id: string;
  title: string;
  color: string; // Nytt felt for bakgrunnsfarge
};

type Item = {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
};

type CartItem = {
  item: Item;
  quantity: number;
};

// Eksempeldata for kategorier og produkter
const categoriesData: Category[] = [
  { id: '1', title: 'Workout Gear', color: '#4CAF50' }, // Grønn
  { id: '2', title: 'Outdoor Gear', color: '#FF9800' }, // Oransje
  { id: '3', title: 'Sunglasses', color: '#2196F3' },   // Blå
];

const itemsData: { [key: string]: Item[] } = {
  '1': [
    { id: '101', title: 'Dumbbell', price: 150, imageUrl: 'https://dummyimage.com/200x200/000/fff&text=Dumbbell' },
    { id: '102', title: 'Yoga Mat', price: 80, imageUrl: 'https://dummyimage.com/200x200/000/fff&text=Yoga+Mat' },
  ],
  '2': [
    { id: '201', title: 'Tent', price: 800, imageUrl: 'https://dummyimage.com/200x200/000/fff&text=Tent' },
    { id: '202', title: 'Backpack', price: 400, imageUrl: 'https://dummyimage.com/200x200/000/fff&text=Backpack' },
  ],
  '3': [
    { id: '301', title: 'Sunglasses A', price: 120, imageUrl: 'https://dummyimage.com/200x200/000/fff&text=Sunglasses+A' },
    { id: '302', title: 'Sunglasses B', price: 170, imageUrl: 'https://dummyimage.com/200x200/000/fff&text=Sunglasses+B' },
  ],
};

export default function ShoppingApp() {
  // State for aktiv kategori, handlekurv, og modaler
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [infoModalVisible, setInfoModalVisible] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [cartModalVisible, setCartModalVisible] = useState<boolean>(false);

  // Funksjon for å legge til et produkt i handlekurven
  const addItemToCart = (item: Item) => {
    setCartItems((existingItems) => {
      const itemIndex = existingItems.findIndex(ci => ci.item.id === item.id);
      if (itemIndex > -1) {
        // Øk kvantiteten hvis produktet allerede finnes i handlekurven
        const updatedItems = [...existingItems];
        updatedItems[itemIndex].quantity += 1;
        return updatedItems;
      } else {
        // Legg til nytt produkt med kvantitet 1
        return [...existingItems, { item, quantity: 1 }];
      }
    });
  };

  // Funksjon for å fjerne et produkt fra handlekurven
  const removeItemFromCart = (itemId: string) => {
    setCartItems((existingItems) => {
      const itemIndex = existingItems.findIndex(ci => ci.item.id === itemId);
      if (itemIndex > -1) {
        const updatedItems = [...existingItems];
        if (updatedItems[itemIndex].quantity > 1) {
          // Reduser kvantiteten hvis mer enn 1
          updatedItems[itemIndex].quantity -= 1;
        } else {
          // Fjern produktet hvis kvantiteten er 1
          updatedItems.splice(itemIndex, 1);
        }
        return updatedItems;
      }
      return existingItems;
    });
  };

  // Håndterer når et produkt trykkes på for å vise detaljer
  const onItemPress = (item: Item) => {
    setCurrentItem(item);
    setInfoModalVisible(true);
  };

  // Renderer for hver kategori knapp
  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[styles.categoryBtn, { backgroundColor: item.color }]}
      onPress={() => setActiveCategory(item.id)}
    >
      <Text style={styles.categoryLabel}>{item.title}</Text>
    </TouchableOpacity>
  );

  // Renderer for hvert produkt
  const renderProduct = ({ item }: { item: Item }) => (
    <TouchableOpacity style={styles.productContainer} onPress={() => onItemPress(item)}>
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      <Text style={styles.productName}>{item.title}</Text>
      <Text style={styles.productPrice}>{item.price} NOK</Text>
      <Button title="Add to Cart" onPress={() => addItemToCart(item)} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.screenContainer}>
      <View style={styles.mainContent}>
        {activeCategory && (
          // Viser header med tilbakeknapp når en kategori er aktiv
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => setActiveCategory(null)}>
              <Text style={styles.backButtonText}>← Tilbake</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{categoriesData.find(cat => cat.id === activeCategory)?.title}</Text>
          </View>
        )}

        {!activeCategory ? (
          // Viser velkomstskjerm når ingen kategori er valgt
          <View style={styles.placeholder}>
            <Text style={styles.welcomeText}>Velkommen til ShoppingApp!</Text>
            <View style={styles.viewCartButton}>
              <Button title="View Cart" onPress={() => setCartModalVisible(true)} />
            </View>
          </View>
        ) : (
          // Viser liste av produkter i valgt kategori
          <FlatList
            data={itemsData[activeCategory]}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.itemsList}
          />
        )}
      </View>

      {/* Kategoriliste plassert nederst */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categoriesData}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          contentContainerStyle={styles.categoriesList}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Informasjonsmodal for produkter */}
      {currentItem && (
        <Modal
          visible={infoModalVisible}
          transparent={true}
          onRequestClose={() => setInfoModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={{ uri: currentItem.imageUrl }} style={styles.modalImage} />
              <Text style={styles.modalItemName}>{currentItem.title}</Text>
              <Text style={styles.modalItemPrice}>{currentItem.price} NOK</Text>
              <Button title="Close" onPress={() => setInfoModalVisible(false)} />
            </View>
          </View>
        </Modal>
      )}

      {/* Handle cart modal */}
      <Modal
        visible={cartModalVisible}
        transparent={true}
        onRequestClose={() => setCartModalVisible(false)}
      >
        <View style={styles.cartModalContainer}>
          <View style={styles.cartModalContent}>
            <Text style={styles.cartTitle}>Handlekurv</Text>
            {cartItems.length === 0 ? (
              <Text style={styles.emptyCartText}>Handlekurven er tom.</Text>
            ) : (
              <FlatList
                data={cartItems}
                keyExtractor={(ci) => ci.item.id}
                renderItem={({ item }) => (
                  <View style={styles.cartItemContainer}>
                    <Text style={styles.cartItemText}>
                      {item.item.title} x {item.quantity} - {item.item.price * item.quantity} NOK
                    </Text>
                    <View style={styles.cartItemButtons}>
                      <TouchableOpacity onPress={() => removeItemFromCart(item.item.id)} style={styles.removeButton}>
                        <Text style={styles.buttonText}>-</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => addItemToCart(item.item)} style={styles.addButton}>
                        <Text style={styles.buttonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                contentContainerStyle={styles.cartItemsList}
              />
            )}
            <Text style={styles.totalLabel}>
              Total: {cartItems.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0)} NOK
            </Text>
            <Button title="Lukk Handlekurv" onPress={() => setCartModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Vis handlekurven nederst hvis det er varer i den */}
      {cartItems.length > 0 && (
        <View style={styles.cartSectionBottom}>
          <Text style={styles.cartTitle}>Handlekurv</Text>
          {cartItems.map((ci) => (
            <Text key={ci.item.id} style={styles.cartItemText}>
              {ci.item.title} x {ci.quantity} - {ci.item.price * ci.quantity} NOK
            </Text>
          ))}
          <Text style={styles.totalLabel}>
            Total: {cartItems.reduce((sum, ci) => sum + ci.item.price * ci.quantity, 0)} NOK
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#e8e8e8',
    justifyContent: 'space-between',
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  viewCartButton: {
    marginTop: 20,
  },
  activeCategoryContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  categoriesContainer: {
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    backgroundColor: '#f9f9f9',
  },
  categoriesList: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  categoryBtn: {
    width: 120, // Faste bredde
    height: 50, // Faste høyde
    backgroundColor: '#345678', // Standard bakgrunnsfarge (kan overstyres dynamisk)
    paddingVertical: 10, // Juster for vertikal padding
    paddingHorizontal: 5, // Juster for horisontal padding
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center', // Sentrer innholdet vertikalt
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  categoryLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  itemsList: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  productContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  productImage: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  productName: {
    fontSize: 17,
    marginBottom: 6,
    fontWeight: '600',
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 15,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  modalImage: {
    width: 180,
    height: 180,
    marginBottom: 16,
  },
  modalItemName: {
    fontSize: 20,
    color: '#000000',
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalItemPrice: {
    fontSize: 18,
    color: '#555555',
    marginBottom: 20,
    textAlign: 'center',
  },
  cartModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  cartModalContent: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
    alignItems: 'center',
  },
  cartTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#777777',
    marginBottom: 20,
  },
  cartItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  cartItemText: {
    fontSize: 16,
    flex: 1,
  },
  cartItemButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeButton: {
    backgroundColor: '#f44336',
    padding: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 6,
    borderRadius: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItemsList: {
    width: '100%',
    paddingBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 20,
    textAlign: 'center',
  },
  cartSectionBottom: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
    margin: 10,
    width: '95%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: '#2196F3',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
