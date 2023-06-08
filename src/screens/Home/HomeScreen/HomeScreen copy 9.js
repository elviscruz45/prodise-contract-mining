import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Linking,
} from "react-native";
import { connect } from "react-redux";
import { Icon, Avatar } from "@rneui/themed";
import { styles } from "./HomeScreen.styles";
import { equipmentList } from "../../../utils/equipmentList";
import { equipmentEmpty } from "../../../utils/equipmentList";
import {
  collection,
  onSnapshot,
  query,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  where,
} from "firebase/firestore";
import { db } from "../../../utils";
import { saveActualPostFirebase } from "../../../actions/post";
import { LoadingSpinner } from "../../../components/shared/LoadingSpinner/LoadingSpinner";
import { screen } from "../../../utils";
import { useNavigation } from "@react-navigation/native";
import { Image as ImageExpo } from "expo-image";
import { HeaderScreen } from "../../../components/Home";
import { EquipmentListUpper } from "../../../actions/home";

const windowWidth = Dimensions.get("window").width;

function HomeScreen(props) {
  const [posts2, setPosts2] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const [firestoreEquipmentLiked, setFirestoreEquipmentLiked] = useState();

  useEffect(() => {
    async function fetchData() {
      let q;
      if (props.equipmentListHeader.length > 0) {
        q = query(
          collection(db, "posts"),
          where("equipoTag", "in", props.equipmentListHeader)
        );
      } else {
        q = query(collection(db, "posts"));
      }
      onSnapshot(q, (ItemFirebase) => {
        const lista = [];
        ItemFirebase.forEach((doc) => {
          lista.push(doc.data());
        });
        const sortedFirestore = lista.sort(
          (a, b) => new Date(b.fechaPostISO) - new Date(a.fechaPostISO)
        );
        setPosts2(sortedFirestore);
      });
      setIsLoading(false);
    }
    fetchData();
  }, [props.equipmentListHeader]);

  //This function retrieve the image file to render equipments from the header horizontal bar
  function chooseImageEquipment(tags) {
    const result = equipmentList.find((item) => {
      return item.tag == tags;
    });
    return result.image;
  }

  //This is used to get the attached file in the post that contain an attached file
  async function UploadFile(uri) {
    Linking.canOpenURL(uri)
      .then((supported) => {
        if (supported) {
          Linking.openURL(uri);
        } else {
          alert("Unable to open PDF document");
        }
      })
      .catch((error) => alert("Error opening PDF document", error));
  }

  const selectAsset = (item) => {
    navigation.navigate(screen.search.tab, {
      screen: screen.search.item,
      params: { Item: item },
    });
  };

  const likePost = async (item) => {
    const PostRef = doc(db, "posts", item.idDocFirestoreDB);

    if (item.likes.includes(props.email)) {
      await updateDoc(PostRef, {
        likes: arrayRemove(props.email),
      });
    } else {
      await updateDoc(PostRef, {
        likes: arrayUnion(props.email),
      });
    }
  };

  const comentPost = (item) => {
    navigation.navigate(screen.home.tab, {
      screen: screen.home.comment,
      params: { Item: item },
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  } else {
    return (
      <>
        <Text></Text>
        <HeaderScreen />
        <Text></Text>
        <FlatList
          data={posts2}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  margin: 2,
                  borderBottomWidth: 5,
                  borderBottomColor: "white",
                  // backgroundColor: "white",
                }}
              >
                <View style={[styles.row, styles.center]}>
                  <View style={[styles.row, styles.center]}>
                    <TouchableOpacity
                      onPress={() => selectAsset(item.equipoPostDatos)}
                      style={[styles.row, styles.center]}
                    >
                      <ImageExpo
                        source={chooseImageEquipment(item.equipoPostDatos?.tag)}
                        style={styles.roundImage}
                        cachePolicy={"memory-disk"}
                      />
                      <Text>{item.equipoPostDatos?.tag}</Text>
                    </TouchableOpacity>

                    <ImageExpo
                      source={{ uri: item.fotoUsuarioPerfil }}
                      style={styles.roundImage}
                      cachePolicy={"memory-disk"}
                    />
                    <Text>{item.nombrePerfil}</Text>
                  </View>
                </View>
                <View style={[styles.row, styles.center]}>
                  <Text style={{ margin: 5, color: "#5B5B5B" }}>
                    {"Fecha:  "}
                    {item.fechaPostFormato}
                  </Text>
                  {item.pdfPrincipal && (
                    <TouchableOpacity
                      onPress={() => UploadFile(item.pdfPrincipal)}
                    >
                      <Icon type="material-community" name="paperclip" />
                      <Text>Archivo Adjunto</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View style={styles.equipments}>
                  <TouchableOpacity onPress={() => comentPost(item)}>
                    <ImageExpo
                      source={{ uri: item.fotoPrincipal }}
                      style={styles.postPhoto}
                      cachePolicy={"memory-disk"}
                    />
                  </TouchableOpacity>

                  <View>
                    <Text style={styles.textAreaTitle}>{item.titulo}</Text>
                    <Text style={styles.textAreaComment}>
                      {item.comentarios}
                    </Text>
                    <Text style={styles.textAreaTitleplus}>
                      Datos Adicionales:{" "}
                    </Text>
                    <Text style={styles.textAreaCommentplus}>
                      {"Etapa del evento:"}
                      {item.etapa}
                    </Text>
                    <Text style={styles.textAreaCommentplus}>
                      {"Componente:"}
                      {item.nombreComponente}
                    </Text>
                    <Text style={styles.textAreaCommentplus}>
                      {"Datos Clave:"}
                      {item.tipo}
                    </Text>

                    <Text style={styles.textAreaCommentplus}>
                      {"Recursos:"}
                      {item.recursos}
                    </Text>
                  </View>
                </View>
                <View style={styles.rowlikes}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginRight: windowWidth * 0.35,
                    }}
                  >
                    <TouchableOpacity onPress={() => likePost(item)}>
                      <Icon
                        type="material-community"
                        name={
                          item.likes.includes(props.email)
                            ? "thumb-up"
                            : "thumb-up-outline"
                        }
                      />
                    </TouchableOpacity>
                    <Text> {item.likes.length} Me gusta</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TouchableOpacity onPress={() => comentPost(item)}>
                      <Icon
                        type="material-community"
                        name="comment-processing-outline"
                      />
                    </TouchableOpacity>
                    <Text> {item.comentariosUsuarios.length} Comentarios</Text>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </>
    );
  }
}

const mapStateToProps = (reducers) => {
  return {
    ActualPostFirebase: reducers.post.ActualPostFirebase,
    firebase_user_name: reducers.profile.firebase_user_name,
    user_photo: reducers.profile.user_photo,
    email: reducers.profile.email,
    profile: reducers.profile.profile,
    uid: reducers.profile.uid,
    equipmentListHeader: reducers.home.equipmentList,
  };
};

export const ConnectedHomeScreen = connect(mapStateToProps, {
  saveActualPostFirebase,
  EquipmentListUpper,
})(HomeScreen);