import { View, Text } from "react-native";
import { Avatar, Button } from "@rneui/themed";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { styles } from "./InformationScreen.styles";
import { GeneralForms } from "../../../components/Forms/GeneralForms/GeneralForms/GeneralForms";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { screen } from "../../../utils";
import { initialValues, validationSchema } from "./InformationScreen.data";
import { saveActualPostFirebase } from "../../../actions/post";
import { useFormik } from "formik";
import { db } from "../../../utils";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  orderBy,
  arrayUnion,
  query,
} from "firebase/firestore";
import { areaLists } from "../../../utils/areaList";
import { TitleForms } from "../../../components/Forms/GeneralForms/TitleForms/TitleForms";
import { resetPostPerPageHome } from "../../../actions/home";
import { saveTotalUsers } from "../../../actions/post";

function InformationScreen(props) {
  const navigation = useNavigation();

  //fetching data from firebase to retrieve all users
  useEffect(() => {
    let unsubscribe;

    function fetchData() {
      let queryRef = query(collection(db, "users"), orderBy("email", "desc"));

      unsubscribe = onSnapshot(queryRef, (ItemFirebase) => {
        const lista = [];
        ItemFirebase.forEach((doc) => {
          lista.push(doc.data());
        });

        console.log("OnSnapshoFETCH_USERS", lista);
        props.saveTotalUsers(lista);
      });
    }

    fetchData();
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // retrieving data from formik forms ,data from ./InfomartionScreen.data.js
  const formik = useFormik({
    initialValues: initialValues(),
    validationSchema: validationSchema(),
    validateOnChange: false,
    onSubmit: async (formValue) => {
      try {
        const newData = formValue;

        //create the algoritm to have the date format of the post
        const date = new Date();
        const monthNames = [
          "ene.",
          "feb.",
          "mar.",
          "abr.",
          "may.",
          "jun.",
          "jul.",
          "ago.",
          "sep.",
          "oct.",
          "nov.",
          "dic.",
        ];
        const day = date.getDate();
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const formattedDate = `${day} ${month} ${year}  ${hour}:${minute} Hrs`;
        newData.fechaPostFormato = formattedDate;

        // send profile information
        newData.emailPerfil = props.email || "Anonimo";
        newData.nombrePerfil = props.firebase_user_name || "Anonimo";
        newData.fotoUsuarioPerfil = props.user_photo;

        // upload the photo or an pickimage to firebase Storage
        const snapshot = await uploadImage(props.savePhotoUri);
        const imagePath = snapshot.metadata.fullPath;
        const imageUrl = await getDownloadURL(ref(getStorage(), imagePath));

        //manage the file updated to ask for aprovals
        let imageUrlPDF;
        if (newData.pdfFile) {
          console.log("pdf", newData.pdfFile);
          console.log("uploadPdf-------99999999999999999999999999");

          const snapshotPDF = await uploadPdf(newData.pdfFile);
          const imagePathPDF = snapshotPDF.metadata.fullPath;
          console.log("uploadPdf-------aaaaaa");

          imageUrlPDF = await getDownloadURL(ref(getStorage(), imagePathPDF));
          console.log("uploadPdf-------bbbbbbb");
        }
        //--------Uploading docs to a new collection called "aprovals" to manage doc aprovals
        if (
          newData.aprobacion &&
          (newData.etapa === "Contratista-Solicitud Aprobacion Doc" ||
            newData.etapa === "Contratista-Envio Cotizacion" ||
            newData.etapa === "Contratista-Solicitud Ampliacion Servicio" ||
            newData.etapa === "Contratista-Envio EDP")
        ) {
          const regex = /(?<=\()[^)]*(?=\))/g;
          const matches = newData.aprobacion.match(regex);
          const docData = {
            solicitud: newData.etapa,
            solicitudComentario: newData.comentarios,
            etapa: newData.etapa,
            NombreServicio: props.actualServiceAIT.NombreServicio,
            IdAITService: props.actualServiceAIT.idServiciosAIT,
            fileName: newData.pdfFile.replace(/%20/g, "_").split("/").pop(),
            pdfFile: imageUrlPDF ?? "",
            tipoFile: newData.tipoFile,
            ApprovalRequestedBy: props.email,
            ApprovalRequestSentTo: matches,
            ApprovalPerformed: [],
            RejectionPerformed: [],
            date: new Date(),
            AreaServicio: props.actualServiceAIT.AreaServicio,
            photoServiceURL: props.actualServiceAIT.photoServiceURL,
            status: "Pendiente",
            idTimeApproval: date.getTime(),
            companyName: props.actualServiceAIT.companyName,
          };
          const docRef = await addDoc(collection(db, "approvals"), docData);
          docData.idApproval = docRef.id;
          const RefFirebase = doc(db, "approvals", docData.idApproval);
          await updateDoc(RefFirebase, docData);
          console.log("docDataApproval", docData);
        }

        newData.pdfPrincipal = imageUrlPDF || "";

        //preparing data to upload to  firestore Database
        newData.fotoPrincipal = imageUrl;
        newData.createdAt = new Date();
        newData.likes = [];
        newData.comentariosUsuarios = [];

        //-------- a default newData porcentajeAvance-------
        if (
          newData.etapa === "Usuario-Envio Solicitud Servicio" ||
          newData.etapa === "Contratista-Envio Cotizacion" ||
          newData.etapa === "Usuario-Aprobacion Cotizacion" ||
          newData.etapa === "Contratista-Inicio Servicio"
        ) {
          newData.porcentajeAvance = "0";
        }

        if (
          newData.etapa === "Contratista-Envio EDP" ||
          newData.etapa === "Usuario-Aprobacion EDP" ||
          newData.etapa === "Contratista-Registro de Pago" ||
          newData.etapa === "Contratista-Fin servicio"
        ) {
          newData.porcentajeAvance = "100";
        }
        //data of the service AIT information
        newData.AITidServicios = props.actualServiceAIT?.idServiciosAIT;
        newData.AITNombreServicio = props.actualServiceAIT?.NombreServicio;
        newData.AITAreaServicio = props.actualServiceAIT?.AreaServicio;
        newData.AITphotoServiceURL = props.actualServiceAIT?.photoServiceURL;
        newData.AITNumero = props.actualServiceAIT?.NumeroAIT;

        // Posting data to Firebase and adding the ID firestore
        const docRef = await addDoc(collection(db, "events"), newData);
        newData.idDocFirestoreDB = docRef.id;
        const RefFirebase = doc(db, "events", newData.idDocFirestoreDB);
        await updateDoc(RefFirebase, newData);

        //Modifying the Service State ServiciosAIT considering the LasEventPost events
        const RefFirebaseLasEventPostd = doc(
          db,
          "ServiciosAIT",
          props.actualServiceAIT?.idServiciosAIT
        );
        const eventSchema = {
          idDocFirestoreDB: newData.idDocFirestoreDB ?? "",
          fotoPrincipal: newData.fotoPrincipal ?? "",
          fotoUsuarioPerfil: newData.fotoUsuarioPerfil ?? "",
          AITNombreServicio: newData.AITNombreServicio ?? "",
          titulo: newData.titulo ?? "",
          comentarios: newData.comentarios ?? "",
          porcentajeAvance: newData.porcentajeAvance ?? "",
          AITNumero: newData.AITNumero ?? "",
          etapa: newData.etapa ?? "",
          pdfPrincipal: newData?.pdfPrincipal ?? "",
          fechaPostFormato: newData.fechaPostFormato ?? "",
          createdAt: newData.createdAt ?? "",
          emailPerfil: newData.emailPerfil ?? "",
          imageUrl: newData.imageUrl ?? "",
          nombrePerfil: newData.nombrePerfil ?? "",
          pdfFile: newData.pdfFile ?? "",
        };

        const updateDataLasEventPost = {
          LastEventPosted: newData.createdAt,
          AvanceEjecucion: newData.porcentajeAvance,
          AvanceAdministrativoTexto: newData.etapa,
          MontoModificado: newData.MontoModificado ?? "",
          NuevaFechaEstimada: newData.NuevaFechaEstimada ?? null,
          HHModificado: newData.HHModificado ?? "",
          events: arrayUnion(eventSchema),
          fechaFinEjecucion:
            newData.porcentajeAvance === "100" &&
            newData.etapa === "Contratista-Avance Ejecucion"
              ? new Date()
              : null,
        };
        console.log("uploadPdf-------00000000");

        if (newData?.aprobacion !== undefined) {
          updateDataLasEventPost.aprobacion = arrayUnion(newData.aprobacion);
        }

        if (imageUrlPDF !== undefined) {
          updateDataLasEventPost.pdfFile = arrayUnion(imageUrlPDF);
        }

        await updateDoc(RefFirebaseLasEventPostd, updateDataLasEventPost);

        // //Updating global State redux
        // props.saveActualPostFirebase(newData);

        // //reset pagination in HomeScreen to 15 to firebase
        // props.resetPostPerPageHome(5);
        // //once all data is uploaded to firebase , go to homescreen

        navigation.navigate(screen.post.post);
        navigation.navigate(screen.home.tab, {
          screen: screen.home.home,
        });
        alert("El evento se ha subido correctamente");
      } catch (error) {
        alert(error);
      }
    },
  });

  const uploadPdf = async (uri) => {
    console.log("uploadPdf-------");
    const uuid = uuidv4();
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileSize = blob.size;
    console.log("uploadPdf-------1");

    if (fileSize > 25 * 1024 * 1024) {
      console.log("uploadPdf-------2");

      throw new Error("El archivo excede los 25 MB");
    }
    const storage = getStorage();
    console.log("uploadPdf-------3");

    const storageRef = ref(storage, `pdfPost/${uuid}`);
    console.log("uploadPdf-------33");

    return uploadBytes(storageRef, blob);
  };

  const uploadImage = async (uri) => {
    const uuid = uuidv4();

    const response = await fetch(uri);
    const blob = await response.blob();

    const storage = getStorage();
    const storageRef = ref(storage, `mainImageEvents/${uuid}`);
    return uploadBytes(storageRef, blob);
  };

  //algorith to retrieve image source that
  const area = props.actualServiceAIT?.AreaServicio;
  const indexareaList = areaLists.findIndex((item) => item.value === area);
  const imageSource = areaLists[indexareaList]?.image;

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: "white" }} // Add backgroundColor here
    >
      <View style={styles.equipments}>
        {props.actualServiceAIT?.photoServiceURL ? (
          <Avatar
            size="large"
            rounded
            containerStyle={styles.avatar}
            icon={{ type: "material", name: "person" }}
            source={{ uri: props.actualServiceAIT?.photoServiceURL }}
          ></Avatar>
        ) : (
          <Avatar
            size="large"
            rounded
            containerStyle={styles.avatar}
            icon={{ type: "material", name: "person" }}
            source={imageSource}
          ></Avatar>
        )}

        <View>
          <Text></Text>
          <Text style={styles.name}>
            {props.actualServiceAIT?.NombreServicio || "Titulo del Evento"}
          </Text>
          <Text style={styles.info}>
            {"Area: "}
            {props.actualServiceAIT?.AreaServicio}
          </Text>
        </View>
      </View>

      <TitleForms formik={formik} />

      <GeneralForms formik={formik} />
      <Button
        title="Agregar Evento"
        buttonStyle={styles.addInformation}
        onPress={formik.handleSubmit}
        loading={formik.isSubmitting}
      />
    </KeyboardAwareScrollView>
  );
}

const mapStateToProps = (reducers) => {
  return {
    savePhotoUri: reducers.post.savePhotoUri,

    firebase_user_name: reducers.profile.firebase_user_name,
    user_photo: reducers.profile.user_photo,
    email: reducers.profile.email,
    profile: reducers.profile.profile,
    uid: reducers.profile.uid,

    actualServiceAIT: reducers.post.actualServiceAIT,
  };
};

export const ConnectedInformationScreen = connect(mapStateToProps, {
  saveActualPostFirebase,
  resetPostPerPageHome,
  saveTotalUsers,
})(InformationScreen);
