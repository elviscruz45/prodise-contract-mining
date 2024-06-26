import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { Icon, SearchBar } from "@rneui/themed";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { saveActualServiceAIT } from "../../../actions/post";
import { styles } from "./PostScreen.styles";
import { useNavigation } from "@react-navigation/native";
import { screen } from "../../../utils";
import * as ImagePicker from "expo-image-picker";
import { savePhotoUri } from "../../../actions/post";
import * as ImageManipulator from "expo-image-manipulator";
import { areaLists } from "../../../utils/areaList";
import { saveActualAITServicesFirebaseGlobalState } from "../../../actions/post";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Image as ImageExpo } from "expo-image";
import Toast from "react-native-toast-message";

function PostScreen(props) {
  const emptyimage = require("../../../../assets/splash.png");
  const navigation = useNavigation();
  const [equipment, setEquipment] = useState(null);
  const [AIT, setAIT] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  //Data about the company belong this event
  function capitalizeFirstLetter(str) {
    return str?.charAt(0).toUpperCase() + str?.slice(1);
  }

  const regex = /@(.+?)\./i;
  const companyName =
    capitalizeFirstLetter(props.email?.match(regex)?.[1]) || "Anonimo";

  //retrieving serviceAIT list data from firebase
  useEffect(() => {
    let servicesList = props.servicesData;
    if (Array.isArray(servicesList)) {
      servicesList.sort((a, b) => {
        return b.createdAt - a.createdAt;
      });

      setPosts(servicesList);
    }
  }, [props.servicesData]);

  //This is used to retrieve the servicies AIT we are looking for

  useEffect(() => {
    if (searchText === "") {
      setSearchResults(posts.slice(0, 50));
    } else {
      const result = posts.filter((item) => {
        const re = new RegExp(searchText, "ig");
        return (
          re.test(item.NumeroAIT) ||
          re.test(item.NombreServicio) ||
          re.test(item.companyName) ||
          re.test(item.EmpresaMinera)
        );
      });
      setSearchResults(result.slice(0, 50));
    }
  }, [searchText, posts]);

  //method to retrieve the picture required in the event post (pick Imagen, take a photo)
  const pickImage = async (AITServiceNumber) => {
    if (!equipment) {
      Toast.show({
        type: "error",
        text1: "Escoge un servicio para continuar",
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });
      return;
    }
    if (!equipment) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (result.canceled) {
      Toast.show({
        type: "error",
        text1: "No se ha seleccionado ninguna imagen",
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });
    } else {
      const resizedPhoto = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }],
        { compress: 0.1, format: "jpeg", base64: true }
      );
      props.savePhotoUri(resizedPhoto.uri);
      navigation.navigate(screen.post.form);

      setEquipment(null);
    }
  };
  // go to another screen to take a photo before put data to the form
  const camera = (AITServiceNumber) => {
    if (!equipment) {
      Toast.show({
        type: "error",
        text1: "Escoge un servicio para continuar",
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });
      return;
    }
    if (!equipment) return;
    navigation.navigate(screen.post.camera);
    setEquipment(null);
    setAIT(null);
  };

  //Addin a new Service asigned called AIT

  const addAIT = () => {
    navigation.navigate(screen.post.aitform);
    setEquipment(null);
    setAIT(null);
  };

  const selectAsset = (AIT) => {
    const area = AIT.AreaServicio;
    const indexareaList = areaLists.findIndex((item) => item.value === area);
    const imageSource = areaLists[indexareaList]?.image;
    const imageUpdated = AIT.photoServiceURL;
    if (imageUpdated) {
      setEquipment({ uri: imageUpdated });
    } else {
      setEquipment(imageSource);
    }
    setAIT(AIT);
    props.saveActualServiceAIT(AIT);
  };

  // if (!AIT) {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         backgroundColor: "white",
  //         justifyContent: "center",
  //         alignItems: "center",
  //       }}
  //     >
  //       <Text
  //         style={{
  //           fontSize: 50,
  //           // fontFamily: "Arial",
  //           color: "#2A3B76",
  //         }}
  //       >
  //         Bienvenido
  //       </Text>
  //     </View>
  //   );
  // }

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: "white" }}
    >
      <SearchBar
        placeholder="Buscar AIT o nombre del servicio"
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
        lightTheme={true}
        inputContainerStyle={{ backgroundColor: "white" }}
      />

      {props.firebase_user_name && (
        <View style={styles.equipments2}>
          {/* <View>
            <ImageExpo
              source={
                { uri: props.user_photo } ??
                require("../../../../assets/splash.png")
              }
              style={styles.roundImage}
              cachePolicy={"memory-disk"}
            />
            <View>
              <Text style={styles.name}>
                {props.firebase_user_name || "Anónimo"}
              </Text>
              <Text style={styles.info}>{props.email}</Text>
            </View>
          </View>
          <View>
            <Icon
              // reverse
              type="material-community"
              name="arrow-right-bold"
              color="#384967"
              size={25}
              containerStyle={styles.btnContainer1}
              // onPress={() => goToEdit(item, index)}
            />
          </View> */}

          <View>
            <ImageExpo
              source={equipment ?? emptyimage}
              style={styles.roundImage}
              cachePolicy={"memory-disk"}
            />

            <View>
              <Text style={styles.name2}>
                {equipment ? AIT?.NombreServicio : "Escoge El Servicio"}
              </Text>
              {/* <Text style={styles.info}>
                {equipment ? `Serv:${AIT?.NumeroAIT}` : "de la lista"}
              </Text> */}
            </View>
          </View>
        </View>
      )}
      {props.firebase_user_name && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "white",
            justifyContent: "space-between",

            // paddingHorizontal: 150,
          }}
        >
          <TouchableOpacity
            style={styles.btnContainer2}
            onPress={() => pickImage(AIT?.TipoServicio)}
          >
            <Image
              source={require("../../../../assets/AddImage.png")}
              style={styles.roundImageUpload}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnContainer3}
            onPress={() => camera(AIT?.TipoServicio)}
          >
            <Image
              source={require("../../../../assets/TakePhoto2.png")}
              style={styles.roundImageUpload}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnContainer4}
            onPress={() => addAIT()}
          >
            <Image
              source={require("../../../../assets/newService7.png")}
              style={styles.roundImageUpload}
            />
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={searchResults}
        scrollEnabled={false}
        renderItem={({ item, index }) => {
          const area = item.AreaServicio;
          const indexareaList = areaLists.findIndex(
            (item) => item.value === area
          );
          const imageSource = areaLists[indexareaList]?.image;

          return (
            <TouchableOpacity
              onPress={() => selectAsset(item)}
              style={{ backgroundColor: "white" }} // Add backgroundColor here
            >
              <View style={styles.equipments}>
                {item.photoServiceURL ? (
                  <ImageExpo
                    source={{ uri: item.photoServiceURL }}
                    style={styles.image}
                    cachePolicy={"memory-disk"}
                  />
                ) : (
                  <ImageExpo
                    source={
                      imageSource || require("../../../../assets/icon1.png")
                    }
                    style={styles.image}
                    cachePolicy={"memory-disk"}
                  />
                )}

                <View>
                  <Text style={styles.name}>{item.NombreServicio}</Text>
                  <Text style={styles.info}>
                    {"Codigo Servicio: "}
                    {item.NumeroAIT}
                  </Text>
                  <Text style={styles.info}>
                    {"Tipo: "}
                    {item.TipoServicio}
                  </Text>
                  <Text style={styles.info}>
                    {"Empresa Minera: "}
                    {item.EmpresaMinera}
                  </Text>
                  {companyName !== item.companyName && (
                    <Text style={styles.info}>
                      {"Empresa: "}
                      {item.companyName}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => `${index}-${item.fechaPostFormato}`} // Provide a unique key for each item
      />
    </KeyboardAwareScrollView>
  );
}

const mapStateToProps = (reducers) => {
  return {
    firebase_user_name: reducers.profile.firebase_user_name,
    user_photo: reducers.profile.user_photo,
    email: reducers.profile.email,
    servicesData: reducers.home.servicesData,
  };
};

export const ConnectedPostScreen = connect(mapStateToProps, {
  saveActualServiceAIT,
  savePhotoUri,
  saveActualAITServicesFirebaseGlobalState,
})(PostScreen);
