import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ResultModal({ visible, result, onClose }) {
  if (!result) return null;

  const { is_plastic, confidence, object_type, plastic_info } = result;
  
  const open2GIS = () => {
    // Формируем URL для поиска пунктов приёма пластика в 2ГИС
    const query = encodeURIComponent('пункт приема пластика вторсырье');
    // Можно добавить координаты пользователя позже
    const url = `https://2gis.ru/search/${query}`;
    Linking.openURL(url);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Заголовок с иконкой */}
          <View style={styles.header}>
            <Text style={styles.headerIcon}>
              {is_plastic ? (plastic_info?.icon || '♻️') : '❌'}
            </Text>
            <Text style={styles.headerTitle}>
              {is_plastic ? 'Пластик обнаружен' : 'Пластик не обнаружен'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Основная информация */}
            <View style={styles.infoBlock}>
              <Text style={styles.label}>Тип объекта:</Text>
              <Text style={styles.value}>{object_type}</Text>
              
              <Text style={styles.label}>Уверенность:</Text>
              <Text style={styles.value}>{(confidence * 100).toFixed(1)}%</Text>
            </View>

            {/* Информация о пластике (если обнаружен) */}
            {is_plastic && plastic_info && (
              <>
                <View style={styles.divider} />
                
                <View style={styles.infoBlock}>
                  <Text style={styles.sectionTitle}>О материале</Text>
                  
                  <Text style={styles.label}>Тип пластика:</Text>
                  <Text style={styles.value}>{plastic_info.name}</Text>
                  
                  {plastic_info.marking && (
                    <>
                      <Text style={styles.label}>Маркировка:</Text>
                      <Text style={styles.value}>
                        {plastic_info.marking} в треугольнике
                      </Text>
                    </>
                  )}
                  
                  <Text style={styles.label}>Описание:</Text>
                  <Text style={styles.value}>{plastic_info.description}</Text>
                  
                  <Text style={styles.label}>Срок разложения:</Text>
                  <Text style={[styles.value, styles.highlight]}>
                    {plastic_info.decomposition_years}
                  </Text>
                </View>

                <View style={styles.divider} />

                {/* Переработка */}
                <View style={styles.infoBlock}>
                  <Text style={styles.sectionTitle}>Переработка</Text>
                  
                  <View style={styles.recycleStatus}>
                    <Ionicons 
                      name={plastic_info.can_recycle ? "checkmark-circle" : "close-circle"} 
                      size={24} 
                      color={plastic_info.can_recycle ? "#4CAF50" : "#f44336"} 
                    />
                    <Text style={[
                      styles.recycleText,
                      plastic_info.can_recycle ? styles.recyclable : styles.notRecyclable
                    ]}>
                      {plastic_info.can_recycle ? 'Подлежит переработке' : 'Не перерабатывается'}
                    </Text>
                  </View>
                  
                  <Text style={styles.label}>Советы по подготовке:</Text>
                  <Text style={styles.value}>{plastic_info.recycling_tips}</Text>
                  
                  {plastic_info.recycled_into && (
                    <>
                      <Text style={styles.label}>Что производят:</Text>
                      <Text style={styles.value}>{plastic_info.recycled_into}</Text>
                    </>
                  )}
                </View>

                {/* Кнопка поиска пунктов приёма */}
                <TouchableOpacity style={styles.mapButton} onPress={open2GIS}>
                  <Ionicons name="map-outline" size={20} color="white" />
                  <Text style={styles.mapButtonText}>
                    Найти пункты приёма в 2ГИС
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f8f9fa',
  },
  headerIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  infoBlock: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 8,
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 22,
  },
  highlight: {
    color: '#e67e22',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  recycleStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  recycleText: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  recyclable: {
    color: '#4CAF50',
  },
  notRecyclable: {
    color: '#f44336',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3897f0',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 16,
    marginBottom: 8,
  },
  mapButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});