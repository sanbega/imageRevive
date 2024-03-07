import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function Body() {
  const [showText, setShowText] = useState(true);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const createFormData = (uri) => {
    const fileName = uri.split("/").pop();
    const fileType = fileName.split(".").pop();
    const formData = new FormData();
    formData.append("image", {
      uri,
      name: fileName,
      type: `image/${fileType}`,
    });
    return formData;
  };

  const uploadImage = (formData) => {
    return fetch(
      "https://b6df-2800-484-387b-6600-c06c-4ead-be31-5acd.ngrok-free.app/upload",
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Upload successful:", data);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUploading(true);
      const formData = createFormData(result.assets[0].uri);
      uploadImage(formData);
      setImage(result.assets[0].uri);
      setShowText(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.square}>
        <TouchableOpacity onPress={pickImage}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          ) : (
            showText && <Text style={styles.textSelect}>Select to Image</Text> // Mostrar texto solo si showText es true
          )}
        </TouchableOpacity>
        {uploading && (
          <View style={styles.uploadingContainer}>
            <ActivityIndicator size="large" color="blue" />
            <Text style={styles.uploadingText}>Uploading...</Text>
          </View>
        )}
        {image && (
          <TouchableOpacity style={styles.restoreButton}>
            <Text style={styles.restoreButtonText}>Restore images</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  square: {
    width: 300,
    height: 300,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderWidth: 5,
    borderRadius: 10,
    borderColor: "blue",
  },
  textSelect: {
    fontSize: 20,
  },
  uploadingContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  restoreButton: {
    marginTop: 20,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  restoreButtonText: {
    color: "white",
    fontSize: 16,
  },
});
