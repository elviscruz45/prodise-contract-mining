import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { styles } from "./GeneralForms.styles";
import { Input } from "@rneui/themed";
import * as DocumentPicker from "expo-document-picker";
import { Modal } from "../../../shared/Modal/Modal";
import { ChangeDisplayEtapa } from "../../FormsGeneral/ChangeEtapa/ChangeDisplayEtapa";
import { ChangeDisplayAvance } from "../../FormsGeneral/ChangeAvance/ChangeDisplayAvance";
import { ChangeDisplayAprobadores } from "../../FormsGeneral/ChangeAprobadores/ChangeDisplayAprobadores";
import { ChangeDisplayMonto } from "../../FormsGeneral/ChangeNumeroMonto/ChangeDisplayMonto";
import { ChangeDisplayFechaFin } from "../../FormsGeneral/ChangeFechaFin/ChangeDisplayFechaFin";
import { ChangeDisplayHH } from "../../FormsGeneral/ChangeNumeroHH/ChangeDisplayHH";
import { ChangeDisplayFileTipo } from "../../FormsGeneral/ChangeFIleTipo/ChangeDisplayFileTipo";
import { ChangeDisplayVisibility } from "../../FormsGeneral/ChangeVisibility/ChangeDisplayVisibility";
import { connect } from "react-redux";
import { userTypeList } from "../../../../utils/userTypeList";
import Toast from "react-native-toast-message";

function GeneralFormsBare(props) {
  const { formik } = props;
  const [pickedDocument, setPickedDocument] = useState(null);
  const [renderComponent, setRenderComponent] = useState(null);
  const [aprobadores, setAprobadores] = useState(null);
  const [etapa, setEtapa] = useState(null);
  const [avance, setAvance] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fechafin, setFechafin] = useState(null);
  const [monto, setMonto] = useState(null);
  const [horashombre, setHorashombre] = useState(null);
  const [aditional, setAditional] = useState(false);
  const [tipoFile, setTipoFile] = useState(null);
  const [visibilidad, setVisibilidad] = useState(null);
  const [shortNameFileUpdated, setShortNameFileUpdated] = useState("");

  //Data about the company belong this event
  const regex = /@(.+?)\./i;
  const companyName = props.email?.match(regex)?.[1] || "";

  // //configuring the name of the pdf file to make it readable
  // let shortNameFile = "";

  //algorith to pick a pdf File to attach to the event
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        // type: "application/pdf",
        copyToCacheDirectory: false,
      });
      if (result.assets) {
        setShortNameFileUpdated(result?.assets[0]?.name);
        formik.setFieldValue("pdfFile", result?.assets[0]?.uri);
        formik.setFieldValue("FilenameTitle", result?.assets[0]?.name);
      } else {
        setShortNameFileUpdated("");
      }
    } catch (err) {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Error al adjuntar el documento",
      });
    }
  };
  const onCloseOpenModal = () => setShowModal((prevState) => !prevState);

  ///function to date format
  const formatdate = (item) => {
    const date = new Date(item);
    const monthNames = [
      "de enero del",
      "de febrero del",
      "de marzo del",
      "de abril del",
      "de mayo del",
      "de junio del",
      "de julio del",
      "de agosto del",
      "de septiembre del",
      "de octubre del",
      "de noviembre del",
      "de diciembre del",
    ];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const formattedDate = `${day} ${month} ${year} `;
    const fechaPostFormato = formattedDate;
    return fechaPostFormato;
  };

  //function to format money
  const formatNumber = (item) => {
    const amount = item;
    const formattedAmount = new Intl.NumberFormat("en-US").format(amount);
    return formattedAmount;
  };

  const selectComponent = (key) => {
    if (key === "visibilidad") {
      setRenderComponent(
        <ChangeDisplayVisibility
          onClose={onCloseOpenModal}
          formik={formik}
          setVisibilidad={setVisibilidad}
        />
      );
    }
    if (key === "etapa") {
      setRenderComponent(
        <ChangeDisplayEtapa
          onClose={onCloseOpenModal}
          formik={formik}
          setEtapa={setEtapa}
          setAprobadores={setAprobadores}
          etapa={etapa}
        />
      );
    }
    if (key === "tipoFile") {
      setRenderComponent(
        <ChangeDisplayFileTipo
          onClose={onCloseOpenModal}
          formik={formik}
          setTipoFile={setTipoFile}
        />
      );
    }
    if (key === "porcentajeAvance") {
      setRenderComponent(
        <ChangeDisplayAvance
          onClose={onCloseOpenModal}
          formik={formik}
          setAvance={setAvance}
        />
      );
    }
    if (key === "aprobacion") {
      setRenderComponent(
        <ChangeDisplayAprobadores
          onClose={onCloseOpenModal}
          formik={formik}
          setAprobadores={setAprobadores}
          etapa={etapa}
        />
      );
    }
    if (key === "MontoModificado") {
      setRenderComponent(
        <ChangeDisplayMonto
          onClose={onCloseOpenModal}
          formik={formik}
          setMonto={setMonto}
        />
      );
    }
    if (key === "NuevaFechaEstimada") {
      setRenderComponent(
        <ChangeDisplayFechaFin
          onClose={onCloseOpenModal}
          formik={formik}
          setFechafin={setFechafin}
        />
      );
    }
    if (key === "HHModificado") {
      setRenderComponent(
        <ChangeDisplayHH
          onClose={onCloseOpenModal}
          formik={formik}
          setHorashombre={setHorashombre}
        />
      );
    }
    onCloseOpenModal();
  };

  const handlesetAditional = () => {
    if (props.profile?.userType === userTypeList.manager) {
      setAditional(true);
    } else {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Solicitar Autorizacion al Gerente de Proyecto",
      });
    }
  };

  return (
    <View>
      <View style={styles.content}>
        <Input
          value={etapa}
          placeholder="Etapa del Evento"
          editable={false}
          errorMessage={formik.errors.etapa}
          rightIcon={{
            type: "material-community",
            name: "arrow-right-circle-outline",
            onPress: () => selectComponent("etapa"),
          }}
        />
        {(etapa === "Contratista-Avance Ejecucion" ||
          etapa === "Contratista-Solicitud Aprobacion Doc" ||
          etapa === "Usuario-Aprobacion Doc" ||
          etapa === "Contratista-Solicitud Ampliacion Servicio" ||
          etapa === "Usuario-Aprobacion Ampliacion" ||
          etapa === "Stand by" ||
          etapa === "Cancelacion") && (
          <Input
            value={avance ? `${avance} %` : null}
            placeholder="Avance de ejecucion (0 a 100)"
            editable={false}
            errorMessage={formik.errors.porcentajeAvance}
            rightIcon={{
              type: "material-community",
              name: "arrow-right-circle-outline",
              onPress: () => selectComponent("porcentajeAvance"),
            }}
          />
        )}
        {(etapa === "Usuario-Envio Solicitud Servicio" ||
          etapa === "Contratista-Envio Cotizacion" ||
          etapa === "Contratista-Solicitud Aprobacion Doc" ||
          etapa === "Contratista-Solicitud Ampliacion Servicio" ||
          etapa === "Contratista-Envio EDP") && (
          <Input
            value={aprobadores}
            placeholder="Aprobador"
            editable={false}
            multiline={true}
            errorMessage={formik.errors.aprobacion}
            rightIcon={{
              type: "material-community",
              name: "arrow-right-circle-outline",
              onPress: () => selectComponent("aprobacion"),
            }}
          />
        )}

        {/* <Text style={styles.subtitleForm}>Opcional</Text> */}

        {(companyName === "Ingeperu" || companyName === "Maestranzaperu") && (
          <Input
            value={visibilidad}
            placeholder="Visibilidad del evento"
            editable={false}
            // errorMessage={formik.errors.visibilidad}
            rightIcon={{
              type: "material-community",
              name: "arrow-right-circle-outline",
              onPress: () => selectComponent("visibilidad"),
            }}
          />
        )}

        {(formik.values.etapa === "Usuario-Envio Solicitud Servicio" ||
          formik.values.etapa === "Contratista-Solicitud Aprobacion Doc" ||
          formik.values.etapa === "Contratista-Envio Cotizacion") && (
          <Input
            value={shortNameFileUpdated}
            placeholder="Adjuntar PDF"
            multiline={true}
            editable={false}
            rightIcon={{
              type: "material-community",
              name: "arrow-right-circle-outline",
              onPress: () => {
                pickDocument();
              },
            }}
          />
        )}

        {shortNameFileUpdated && (
          <Input
            value={tipoFile}
            placeholder="Tipo de Archivo Adjunto"
            multiline={true}
            editable={false}
            rightIcon={{
              type: "material-community",
              name: "arrow-right-circle-outline",
              onPress: () => selectComponent("tipoFile"),
            }}
          />
        )}
      </View>

      <Modal show={showModal} close={onCloseOpenModal}>
        {renderComponent}
      </Modal>
    </View>
  );
}

const mapStateToProps = (reducers) => {
  return {
    profile: reducers.profile.profile,
    email: reducers.profile.email,
  };
};

export const GeneralForms = connect(mapStateToProps, {})(GeneralFormsBare);
