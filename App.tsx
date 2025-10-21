import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
  Animated,
  Easing
} from 'react-native';


type CourseType = 'starters' | 'mains' | 'dessert' | 'pastries';
interface MenuItem {
  id: string;
  dishName: string;
  description: string;
  course: CourseType;
  price: number;
}

export default function RestaurantApp() {
 
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      dishName: 'Croissant',
      description: 'Freshly baked butter croissant',
      course: 'pastries',
      price: 25.00
    },
    {
      id: '2',
      dishName: 'Chocolate Eclair',
      description: 'Cream filled pastry with chocolate glaze',
      course: 'pastries',
      price: 32.50
    },
    {
      id: '3',
      dishName: 'Apple Turnover',
      description: 'Flaky pastry with spiced apple filling',
      course: 'pastries',
      price: 28.00
    },
    {
      id: '4',
      dishName: 'Garlic Bread',
      description: 'Toasted bread with garlic butter',
      course: 'starters',
      price: 35.00
    },
    {
      id: '5',
      dishName: 'Grilled Chicken',
      description: 'Tender chicken with herbs',
      course: 'mains',
      price: 89.00
    },
    {
      id: '6',
      dishName: 'Chocolate Cake',
      description: 'Rich chocolate layer cake',
      course: 'dessert',
      price: 45.00
    }
  ]);
  
  
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState<CourseType>('pastries');
  const [price, setPrice] = useState('');
  
  
  const [fadeAnim] = useState(new Animated.Value(0));

  
  const courses: CourseType[] = ['starters', 'mains', 'dessert', 'pastries'];

  // Function to add new menu item
  const addMenuItem = () => {
    if (!dishName || !description || !price) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const newItem: MenuItem = {
      id: Math.random().toString(),
      dishName,
      description,
      course,
      price: parseFloat(price)
    };

    setMenuItems([...menuItems, newItem]);
    
    // Reset form
    setDishName('');
    setDescription('');
    setPrice('');
    setCourse('pastries');
    
    // Trigger animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.ease,
      useNativeDriver: true
    }).start(() => {
      fadeAnim.setValue(0);
    });
  };

  // Function to render each menu item
  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.itemCard}>
      <Text style={styles.dishName}>{item.dishName}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.itemFooter}>
        <Text style={[
          styles.course,
          item.course === 'pastries' && styles.pastriesCourse,
          item.course === 'starters' && styles.startersCourse,
          item.course === 'mains' && styles.mainsCourse,
          item.course === 'dessert' && styles.dessertCourse
        ]}>
          {item.course}
        </Text>
        <Text style={styles.price}>R{item.price.toFixed(2)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bakery Menu</Text>
        <Text style={styles.itemCount}>
          Total Items: {menuItems.length}
        </Text>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Add New Menu Item</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Dish Name"
          value={dishName}
          onChangeText={setDishName}
        />
        
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        
        <Text style={styles.label}>Select Course:</Text>
        <View style={styles.courseButtons}>
          {courses.map((courseOption) => (
            <TouchableOpacity
              key={courseOption}
              style={[
                styles.courseButton,
                course === courseOption && styles.selectedCourse
              ]}
              onPress={() => setCourse(courseOption)}
            >
              <Text style={styles.courseButtonText}>
                {courseOption}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        
        <TouchableOpacity style={styles.addButton} onPress={addMenuItem}>
          <Animated.Text 
            style={[
              styles.addButtonText,
              { opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.5]
              })}
            ]}
          >
            Add to Menu
          </Animated.Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Our Menu</Text>
        <Text style={styles.subTitle}>Fresh pastries and delicious meals</Text>
        {menuItems.length === 0 ? (
          <Text style={styles.emptyText}>No menu items yet. Add some above!</Text>
        ) : (
          <FlatList
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.id}
            style={styles.menuList}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff8f0',
    padding: 16,
  },
  header: {
    backgroundColor: '#d4a574',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5a3921',
    textAlign: 'center',
  },
  itemCount: {
    fontSize: 16,
    color: '#5a3921',
    textAlign: 'center',
    marginTop: 5,
    fontWeight: '600',
  },
  formSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#5a3921',
  },
  subTitle: {
    fontSize: 14,
    color: '#8b7355',
    marginBottom: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d4a574',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fffcf9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#5a3921',
    fontWeight: '600',
  },
  courseButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  courseButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f5e6d3',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    minWidth: 80,
    marginBottom: 8,
  },
  selectedCourse: {
    backgroundColor: '#d4a574',
  },
  courseButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5a3921',
    textTransform: 'capitalize',
  },
  addButton: {
    backgroundColor: '#8b7355',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuSection: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyText: {
    textAlign: 'center',
    color: '#8b7355',
    fontSize: 16,
    marginTop: 20,
  },
  menuList: {
    flex: 1,
  },
  itemCard: {
    backgroundColor: '#fffcf9',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#d4a574',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5a3921',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#8b7355',
    marginBottom: 10,
    lineHeight: 20,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  course: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'capitalize',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  pastriesCourse: {
    backgroundColor: '#d4a574',
  },
  startersCourse: {
    backgroundColor: '#8b7355',
  },
  mainsCourse: {
    backgroundColor: '#5a3921',
  },
  dessertCourse: {
    backgroundColor: '#c44569',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5a3921',
  },
});