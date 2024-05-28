import React, { useState } from "react";
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
  selectedOtherProduct: string | null;
  selectedDescription: string | null;
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
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  const languageData: { [key: string]: { [key: string]: string } } = {
    en: {
      filterByProvince: "Filter by Province:",
      filterByStation: "Filter by Station:",
      filterByProduct: "Filter by Product:",
      filterByOtherProduct: "Filter by Other Product:",
      filterByDescription: "Filter by Description:",
      filterByService: "Filter by Service:",
      selectProvince: "Select Province",
      selectTitle: "Select Title",
      selectProduct: "Select Product",
      selectOtherProduct: "Select Other Product",
      selectDescription: "Select Description",
      selectService: "Select Service",
      applyFilters: "Apply Filters",
      close: "Close",
      english: "English",
      khmer: "Khmer",
      thai: "Thai",
    },
    kh: {
      filterByProvince: "ចូលស្វែងរកតាមខេត្ត:",
      filterByStation: "ចូលស្វែងរកតាមស្ថានភាព:",
      filterByProduct: "ចូលស្វែងរកតាមផលិតផល:",
      filterByOtherProduct: "ចូលស្វែងរកតាមផលិតផលផ្សេងៗ:",
      filterByDescription: "ចូលស្វែងរកតាមការពិពណ៌នា:",
      filterByService: "ចូលស្វែងរកតាមសេវាកម្ម:",
      selectProvince: "ជ្រើសរើសខេត្ត",
      selectTitle: "ជ្រើសរើសចំណងជើង",
      selectProduct: "ជ្រើសរើសផលិតផល",
      selectOtherProduct: "ជ្រើសរើសផលិតផលផ្សេងៗ",
      selectDescription: "ជ្រើសរើសការពិពណ៌នា",
      selectService: "ជ្រើសរើសសេវាកម្ម",
      applyFilters: "អនុវត្តចម្បង",
      close: "បិទ",
      english: "អង់គ្លេស",
      khmer: "ខ្មែរ",
      thai: "ថៃ",
    },
    th: {
      filterByProvince: "ค้นหาตามจังหวัด:",
      filterByStation: "ค้นหาตามสถานี:",
      filterByProduct: "ค้นหาตามผลิตภัณฑ์:",
      filterByOtherProduct: "ค้นหาตามผลิตภัณฑ์อื่นๆ:",
      filterByDescription: "ค้นหาตามคำอธิบาย:",
      filterByService: "ค้นหาตามบริการ:",
      selectProvince: "เลือกจังหวัด",
      selectTitle: "เลือกชื่อสถานี",
      selectProduct: "เลือกผลิตภัณฑ์",
      selectOtherProduct: "เลือกผลิตภัณฑ์อื่นๆ",
      selectDescription: "เลือกคำอธิบาย",
      selectService: "เลือกบริการ",
      applyFilters: "นำไปใช้ตัวกรอง",
      close: "ปิด",
      english: "อังกฤษ",
      khmer: "เขมร",
      thai: "ไทย",
    },
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  const getTranslatedText = (textKey: string) => {
    return languageData[selectedLanguage][textKey];
  };

  if (!showFilterForm) {
    return null;
  }

  return (
    <View style={styles.centeredView}>
      <View style={styles.filterContainer}>
        {/* Language Selection Buttons */}
        <View style={styles.languageSelection}>
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => handleLanguageChange("en")}
          >
            <Text style={styles.languageButtonText}>
              {getTranslatedText("english")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => handleLanguageChange("kh")}
          >
            <Text style={styles.languageButtonText}>
              {getTranslatedText("khmer")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => handleLanguageChange("th")}
          >
            <Text style={styles.languageButtonText}>
              {getTranslatedText("thai")}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter elements */}
        <View style={styles.filterGroup}>
          <Text style={styles.filterTitle}>
            {getTranslatedText("filterByProvince")}
          </Text>
          <RNPickerSelect
            placeholder={{
              label: getTranslatedText("selectProvince"),
              value: null,
            }}
            value={selectedProvince}
            onValueChange={(value) => setSelectedProvince(value)}
            items={provinceOptions.map((option) => ({
              label: option,
              value: option,
            }))}
            style={pickerSelectStyles}
          />
        </View>

        {/* Filter by Station */}
        <View style={styles.filterGroup}>
          <Text style={styles.filterTitle}>
            {getTranslatedText("filterByStation")}
          </Text>
          <RNPickerSelect
            placeholder={{
              label: getTranslatedText("selectTitle"),
              value: null,
            }}
            value={selectedTitle}
            onValueChange={(value) => {
              setSelectedTitle(value);
              // Additional logic for title selection if needed
            }}
            items={titleOptions.map((option) => ({
              label: option,
              value: option,
            }))}
            style={pickerSelectStyles}
          />
        </View>

        {/* Filter by Product */}
        <View style={styles.filterGroup}>
          <Text style={styles.filterTitle}>
            {getTranslatedText("filterByProduct")}
          </Text>
          <RNPickerSelect
            placeholder={{
              label: getTranslatedText("selectProduct"),
              value: null,
            }}
            value={selectedProduct}
            onValueChange={(value) => setSelectedProduct(value)}
            items={productOptions.map((option) => ({
              label: option,
              value: option,
            }))}
            style={pickerSelectStyles}
          />
        </View>

        {/* Filter by Other Product */}
        <View style={styles.filterGroup}>
          <Text style={styles.filterTitle}>
            {getTranslatedText("filterByOtherProduct")}
          </Text>
          <RNPickerSelect
            placeholder={{
              label: getTranslatedText("selectOtherProduct"),
              value: null,
            }}
            value={selectedOtherProduct}
            onValueChange={(value) => setSelectedOtherProduct(value)}
            items={otherProductOptions.map((option) => ({
              label: option,
              value: option,
            }))}
            style={pickerSelectStyles}
          />
        </View>

        {/* Filter by Description */}
        <View style={styles.filterGroup}>
          <Text style={styles.filterTitle}>
            {getTranslatedText("filterByDescription")}
          </Text>
          <RNPickerSelect
            placeholder={{
              label: getTranslatedText("selectDescription"),
              value: null,
            }}
            value={selectedDescription}
            onValueChange={(value) => setSelectedDescription(value)}
            items={descriptionOptions.map((option) => ({
              label: option,
              value: option,
            }))}
            style={pickerSelectStyles}
          />
        </View>

        {/* Filter by Service */}
        <View style={styles.filterGroup}>
          <Text style={styles.filterTitle}>
            {getTranslatedText("filterByService")}
          </Text>
          <RNPickerSelect
            placeholder={{
              label: getTranslatedText("selectService"),
              value: null,
            }}
            value={selectedService}
            onValueChange={(value) => setSelectedService(value)}
            items={serviceOptions.map((option) => ({
              label: option,
              value: option,
            }))}
            style={pickerSelectStyles}
          />
        </View>

        {/* Apply Filters and Close buttons */}
        <TouchableOpacity style={styles.filterButton} onPress={applyFilters}>
          <Text style={styles.filterButtonText}>
            {getTranslatedText("applyFilters")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterCloseButton}
          onPress={toggleFilterForm}
        >
          <Text style={styles.filterButtonText}>
            {getTranslatedText("close")}
          </Text>
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
  languageSelection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  languageButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  languageButtonText: {
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
