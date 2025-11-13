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
} from 'react-native';

type CourseType = 'starters' | 'mains' | 'dessert' | 'pastries';

interface MenuItem {
  id: string;
  dishName: string;
  description: string;
  course: CourseType;
  price: number;
}

type ScreenType = 'home' | 'addMenu' | 'filter';

export default function RestaurantApp() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
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
  const [filterCourse, setFilterCourse] = useState<CourseType | 'all'>('all');

  const courses: CourseType[] = ['starters', 'mains', 'dessert', 'pastries'];

  
  const isDuplicateDish = (dishName: string, course: CourseType): boolean => {
    
    for (let i = 0; i < menuItems.length; i++) {
      if (menuItems[i].dishName.toLowerCase() === dishName.toLowerCase() && 
          menuItems[i].course === course) {
        return true;
      }
    }
    return false;
  };

  
  const calculateAveragePrices = () => {
    const averages: { course: CourseType; average: number; count: number }[] = [];
    
  
    for (let i = 0; i < courses.length; i++) {
      const currentCourse = courses[i];
      const courseItems = menuItems.filter(item => item.course === currentCourse);
      
      if (courseItems.length > 0) {
        let total = 0;
        
        for (let j = 0; j < courseItems.length; j++) {
          total += courseItems[j].price;
        }
        const average = total / courseItems.length;
        
        averages.push({
          course: currentCourse,
          average,
          count: courseItems.length
        });
      }
    }
    
    return averages;
  };

  
  const addMenuItem = () => {
    
    const trimmedDishName = dishName.trim();
    const trimmedDescription = description.trim();
    const trimmedPrice = price.trim();

  
    if (!trimmedDishName || !trimmedDescription || !trimmedPrice) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

  
    const priceValue = parseFloat(trimmedPrice);
    if (isNaN(priceValue)) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    
    if (priceValue <= 0) {
      Alert.alert('Error', 'Price must be greater than R0.00');
      return;
    }

  
    if (priceValue > 1000) {
      Alert.alert('Error', 'Price seems too high. Please enter a value under R1000.00');
      return;
    }

  
    if (isDuplicateDish(trimmedDishName, course)) {
      Alert.alert(
        'Duplicate Dish', 
        `"${trimmedDishName}" already exists in the ${course} course. Please use a different name.`
      );
      return;
    }

    const newItem: MenuItem = {
      id: Math.random().toString(),
      dishName: trimmedDishName,
      description: trimmedDescription,
      course,
      price: parseFloat(priceValue.toFixed(2)) // Ensure 2 decimal places
    };

    setMenuItems([...menuItems, newItem]);
    
  
    setDishName('');
    setDescription('');
    setPrice('');
    setCourse('pastries');

  
    Alert.alert(
      'Success!', 
      `"${newItem.dishName}" has been added to the ${course} menu successfully!`,
      [{ text: 'OK' }]
    );
  };


  const removeMenuItem = (id: string) => {
    const itemToRemove = menuItems.find(item => item.id === id);
    
    Alert.alert(
      'Remove Menu Item',
      `Are you sure you want to remove "${itemToRemove?.dishName}" from the menu?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setMenuItems(menuItems.filter(item => item.id !== id));
            Alert.alert(
              'Success!', 
              `"${itemToRemove?.dishName}" has been removed from the menu.`,
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };


  const filterByCourse = (selectedCourse: CourseType | 'all') => {
    if (selectedCourse === 'all') return menuItems;
    return menuItems.filter(item => item.course === selectedCourse);
  };

  const filteredItems = filterByCourse(filterCourse);
  const averagePrices = calculateAveragePrices();

  const RestaurantLogo = () => (
    <View style={styles.logoContainer}>
      <View style={styles.logoCircle}>
        <Text style={styles.logoIcon}>🍽️</Text>
      </View>
      <View style={styles.logoTextContainer}>
        <Text style={styles.logoTitle}>Christoteffel</Text>
        <Text style={styles.logoSubtitle}>KITCHEN</Text>
      </View>
    </View>
  );

  const renderAveragePrice = ({ item }: { item: { course: CourseType; average: number; count: number } }) => (
    <View style={styles.averageCard}>
      <Text style={styles.courseTitle}>{item.course.toUpperCase()}</Text>
      <Text style={styles.averageText}>R{item.average.toFixed(2)}</Text>
      <Text style={styles.countText}>{item.count} items</Text>
    </View>
  );

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

  const renderManageMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.dishName}>{item.dishName}</Text>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeMenuItem(item.id)}
        >
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
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

  const HomeScreen = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <RestaurantLogo />
        <Text style={styles.itemCount}>Total Items: {menuItems.length}</Text>
      </View>

      {/* Average Prices Section */}
      <View style={styles.averageSection}>
        <Text style={styles.sectionTitle}>Average Prices by Course</Text>
        {averagePrices.length === 0 ? (
          <Text style={styles.emptyText}>No menu items to calculate averages</Text>
        ) : (
          <FlatList
            data={averagePrices}
            renderItem={renderAveragePrice}
            keyExtractor={(item) => item.course}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.averageList}
          />
        )}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => setCurrentScreen('addMenu')}
        >
          <Text style={styles.navButtonText}>Manage Menu</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => setCurrentScreen('filter')}
        >
          <Text style={styles.navButtonText}>Filter Menu</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Items Section */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Our Complete Menu</Text>
        <Text style={styles.subTitle}>Fresh pastries and delicious meals</Text>
        {menuItems.length === 0 ? (
          <Text style={styles.emptyText}>No menu items yet. Add some in the Manage Menu screen!</Text>
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

  const AddMenuScreen = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <RestaurantLogo />
        <Text style={styles.subTitle}>Add or remove menu items</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentScreen('home')}
        >
          <Text style={styles.backButtonText}>← Back to Menu</Text>
        </TouchableOpacity>
      </View>

      {/* Add Menu Item Form */}
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Add New Menu Item</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Dish Name"
          value={dishName}
          onChangeText={setDishName}
          placeholderTextColor="#8b7355"
        />
        
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          placeholderTextColor="#8b7355"
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
          placeholder="Price (R)"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          placeholderTextColor="#8b7355"
        />
        
        <TouchableOpacity style={styles.addButton} onPress={addMenuItem}>
          <Text style={styles.addButtonText}>Add to Menu</Text>
        </TouchableOpacity>
      </View>

      {/* Current Menu Items List */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>
          Current Menu Items ({menuItems.length})
        </Text>
        {menuItems.length === 0 ? (
          <Text style={styles.emptyText}>
            No menu items yet. Add some using the form above!
          </Text>
        ) : (
          <FlatList
            data={menuItems}
            renderItem={renderManageMenuItem}
            keyExtractor={(item) => item.id}
            style={styles.menuList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );

  const FilterScreen = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <RestaurantLogo />
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentScreen('home')}
        >
          <Text style={styles.backButtonText}>← Back to Menu</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>Filter by Course</Text>
        <View style={styles.courseButtons}>
          {(['all', ...courses] as const).map((courseOption) => (
            <TouchableOpacity
              key={courseOption}
              style={[
                styles.courseButton,
                filterCourse === courseOption && styles.selectedCourse
              ]}
              onPress={() => setFilterCourse(courseOption)}
            >
              <Text style={styles.courseButtonText}>
                {courseOption === 'all' ? 'All Courses' : courseOption}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text style={styles.resultsText}>
          Showing {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
          {filterCourse !== 'all' && ` in ${filterCourse}`}
        </Text>
      </View>

      <View style={styles.menuSection}>
        {filteredItems.length === 0 ? (
          <Text style={styles.emptyText}>
            {filterCourse === 'all' 
              ? 'No menu items available.' 
              : `No ${filterCourse} available.`}
          </Text>
        ) : (
          <FlatList
            data={filteredItems}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.id}
            style={styles.menuList}
          />
        )}
      </View>
    </SafeAreaView>
  );

  return (
    <>
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'addMenu' && <AddMenuScreen />}
      {currentScreen === 'filter' && <FilterScreen />}
    </>
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
  // Logo Styles
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5a3921',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  logoIcon: {
    fontSize: 28,
  },
  logoTextContainer: {
    alignItems: 'center',
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5a3921',
    letterSpacing: 1,
  },
  logoSubtitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#5a3921',
    letterSpacing: 3,
    marginTop: 2,
  },
  itemCount: {
    fontSize: 16,
    color: '#5a3921',
    textAlign: 'center',
    marginTop: 5,
    fontWeight: '600',
  },
  subTitle: {
    fontSize: 16,
    color: '#5a3921',
    textAlign: 'center',
    marginTop: 5,
    fontStyle: 'italic',
  },
  backButton: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#5a3921',
    fontSize: 16,
    fontWeight: 'bold',
  },
  averageSection: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 120,
  },
  averageList: {
    paddingVertical: 5,
  },
  averageCard: {
    backgroundColor: '#f5e6d3',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#5a3921',
    marginBottom: 8,
  },
  averageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8b7355',
    marginBottom: 4,
  },
  countText: {
    fontSize: 12,
    color: '#5a3921',
    fontStyle: 'italic',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#8b7355',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  filterSection: {
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
    marginBottom: 15,
    color: '#5a3921',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d4a574',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fffcf9',
    color: '#5a3921',
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  courseButton: {
    flex: 1,
    minWidth: '48%',
    padding: 12,
    backgroundColor: '#f5e6d3',
    borderRadius: 8,
    margin: 4,
    alignItems: 'center',
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
    textAlign: 'center',
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
    fontStyle: 'italic',
  },
  resultsText: {
    fontSize: 16,
    color: '#8b7355',
    textAlign: 'center',
    fontWeight: '600',
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
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5a3921',
    flex: 1,
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 20,
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