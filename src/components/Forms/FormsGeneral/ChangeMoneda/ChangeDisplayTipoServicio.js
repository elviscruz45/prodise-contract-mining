import React, { useState } from "react";
import { View } from "react-native";
import { Input, Button } from "@rneui/themed";

import { styles } from "./ChangeDisplayTipoServicio.styles";
import { SelectExample } from "./Selection";

export function ChangeDisplayMoneda(props) {
  const { onClose, formik, setMoneda } = props;
  const [text, setText] = useState("");

  return (
    <View>
      <View style={styles.content}>
        <SelectExample formik={formik} setText={setText} />
        <Button
          title="Aceptar"
          containerStyle={styles.btnContainer}
          buttonStyle={styles.btn}
          onPress={() => {
            setMoneda(text.toString());
            formik.setFieldValue("Moneda", text.toString());

            onClose();
          }}
          loading={formik.isSubmitting}
        />
      </View>
    </View>
  );
}
