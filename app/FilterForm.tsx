import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import RNPickerSelect from "react-native-picker-select";

interface FilterFormProps {
  showFilterForm: boolean;
  selectedProvince: string;
  selectedTitle: string;
  selectedProduct: string;
  selectedOtherProduct: string;
  selectedDescription: string;
  selectedService: string;
  setSelectedProvince: (value: string) => void;
  setSelectedTitle: (value: string) => void;
  setSelectedProduct: (value: string) => void;
  setSelectedOtherProduct: (value: string) => void;
  setSelectedDescription: (value: string) => void;
  setSelectedService: (value: string) => void;
  provinceOptions: string[];
  titleOptions: string[];
  productOptions: string[];
  otherProductOptions: string[];
  descriptionOptions: string[];
  serviceOptions: string[];
  applyFilters: () => void;
  toggleFilterForm: () => void;
}

const FilterForm: React.FC<FilterFormProps> = ({
  showFilterForm,
  selectedProvince,
  selectedTitle,
  selectedProduct,
  selectedOtherProduct,
  selectedDescription,
  selectedService,
  setSelectedProvince,
  setSelectedTitle,
  setSelectedProduct,
  setSelectedOtherProduct,
  setSelectedDescription,
  setSelectedService,
  provinceOptions,
  titleOptions,
  productOptions,
  otherProductOptions,
  descriptionOptions,
  serviceOptions,
  applyFilters,
  toggleFilterForm,
}) => {
  // Define handleTitleSelection function
  const handleTitleSelection = (value: string) => {
    // Add your logic here for handling title selection
    console.log("Selected title:", value);
  };

  if (!showFilterForm) {
    return null;
  }

  return (
    <View style={styles.centeredView}>
      <View style={styles.filterContainer}>
        <View style={styles.filterGroup}>
          <Text style={styles.filterTitle}>Filter by Province:</Text>
          <RNPickerSelect
            placeholder={{ label: "Select Province", value: null }}
            value={selectedProvince}
            onValueChange={(value) => setSelectedProvince(value)}
            items={provinceOptions.map((option) => ({
              label: option,
              value: option,
            }))}
            style={pickerSelectStyles}
          />
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterTitle}>Filter by Title:</Text>
          <RNPickerSelect
            placeholder={{ label: "Select Title", value: null }}
            value={selectedTitle}
            onValueChange={(value) => {
              setSelectedTitle(value);
              handleTitleSelection(value); // Call the handleTitleSelection function
            }}
            items={titleOptions.map((option) => ({
              label: option,
              value: option,
            }))}
            style={pickerSelectStyles}
          />
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterTitle}>Filter by Product:</Text>
          <RNPickerSelect
            placeholder={{ label: "Select Product", value: null }}
            value={selectedProduct}
            onValueChange={(value) => setSelectedProduct(value)}
            items={productOptions.map((option) => ({
              label: option,
              value: option,
            }))}
            style={pickerSelectStyles}
          />
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterTitle}>Filter by Other Product:</Text>
          <RNPickerSelect
            placeholder={{ label: "Select Other Product", value: null }}
            value={selectedOtherProduct}
            onValueChange={(value) => setSelectedOtherProduct(value)}
            items={otherProductOptions.map((option) => ({
              label: option,
              value: option,
            }))}
            style={pickerSelectStyles}
          />
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterTitle}>Filter by Description:</Text>
          <RNPickerSelect
            placeholder={{ label: "Select Description", value: null }}
            value={selectedDescription}
            onValueChange={(value) => setSelectedDescription(value)}
            items={descriptionOptions.map((option) => ({
              label: option,
              value: option,
            }))}
            style={pickerSelectStyles}
          />
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterTitle}>Filter by Service:</Text>
          <RNPickerSelect
            placeholder={{ label: "Select Service", value: null }}
            value={selectedService}
            onValueChange={(value) => setSelectedService(value)}
            items={serviceOptions.map((option) => ({
              label: option,
              value: option,
            }))}
            style={pickerSelectStyles}
          />
        </View>

        <TouchableOpacity style={styles.filterButton} onPress={applyFilters}>
          <Text style={styles.filterButtonText}>Apply Filters</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterCloseButton}
          onPress={toggleFilterForm}
        >
          <Text style={styles.filterButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    height: '100%', // Ensures full height
    width: '100%',  // Ensures full width
  },
  filterContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "80%", // Adjust width as necessary
  },
  filterGroup: {
    marginBottom: 15,
  },
  filterTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  filterCloseButton: {
    backgroundColor: "#FF3B30",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  filterButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default FilterForm;
