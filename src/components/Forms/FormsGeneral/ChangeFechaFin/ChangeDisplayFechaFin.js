import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";

export function ChangeDisplayFechaFin(props) {
  const { onClose, formik, setFechafin } = props;

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(true);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    setFechafin(currentDate);
    formik.setFieldValue("NuevaFechaEstimada", currentDate);
    onClose();
  };

  return (
    <SafeAreaView>
      {/* <Button onPress={showDatepicker} title="Show date picker!" /> */}
      {show && (
        <DateTimePicker
          testID="ChangeDisplayFechaFin:dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
          style={{ alignSelf: "center", backgroundColor: "#2A3B76" }}
        />
      )}
    </SafeAreaView>
  );
}
