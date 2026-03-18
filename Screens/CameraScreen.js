import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../src/config';
import ResultModal from './ResultModal';

export default function CameraScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [photo, setPhoto] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  if (!permission) return <View style={styles.container} />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Нет доступа к камере</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Разрешить доступ</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const options = { quality: 0.8, base64: false };
        const takenPhoto = await cameraRef.current.takePictureAsync(options);
        setPhoto(takenPhoto.uri);
      } catch (error) {
        Alert.alert('Ошибка', 'Не удалось сделать фото');
        console.error(error);
      }
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
  };

  const analyzePhoto = async (uri) => {
    setIsUploading(true);
    try {
      const token = await AsyncStorage.getItem('access_token');
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      const response = await fetch(`${API_BASE_URL}/detect/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.detail || 'Ошибка анализа');
      }

      setLastResult(result);
      setResultModalVisible(true);
      setPhoto(null); // очищаем превью после показа результата
    } catch (error) {
      Alert.alert('Ошибка', error.message);
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const usePhoto = () => {
    analyzePhoto(photo);
  };

  return (
    <View style={styles.container}>
      {photo ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />
          <View style={styles.previewButtons}>
            <TouchableOpacity style={styles.previewButton} onPress={retakePhoto} disabled={isUploading}>
              <Ionicons name="refresh" size={32} color="white" />
              <Text style={styles.previewButtonText}>Переснять</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.previewButton} onPress={usePhoto} disabled={isUploading}>
              {isUploading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={32} color="white" />
                  <Text style={styles.previewButtonText}>Анализировать</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
          mode="picture"
        >
          <View style={styles.overlay}>
            <View style={styles.topBar}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={28} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={toggleCameraFacing}
              >
                <Ionicons name="camera-reverse" size={28} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.bottomBar}>
              <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
                <View style={styles.captureInner} />
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      )}
      <ResultModal
        visible={resultModalVisible}
        result={lastResult}
        onClose={() => setResultModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  camera: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'transparent', justifyContent: 'space-between' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: 20 },
  bottomBar: { alignItems: 'center', paddingBottom: 30 },
  iconButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  captureButton: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  captureInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'white' },
  message: { textAlign: 'center', color: 'white', fontSize: 16, marginBottom: 20 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, marginHorizontal: 20 },
  buttonText: { color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  previewContainer: { flex: 1, backgroundColor: 'black' },
  preview: { flex: 1, resizeMode: 'contain' },
  previewButtons: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  previewButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 10,
    minWidth: 100,
  },
  previewButtonText: { color: 'white', marginTop: 5 },
});