import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Button } from "@rneui/base";
import { styles } from "./DateScreen.styles";
import { connect } from "react-redux";
import { EquipmentListUpper } from "../../../actions/home";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";

function DateScreenNoRedux(props) {
  const [dateStart, setDateStart] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [ios, setIos] = useState(false);
  const [androidDateStart, setAndroidDateStart] = useState(false);
  const [androidDateEnd, setAndroidDateEnd] = useState(false);
  const [androidDate, setAndroidDate] = useState(false);

  const { filterButton, quitFilterButton } = props;

  useEffect(() => {
    if (Platform.OS === "android") {
      setIos(false);
      setAndroidDate(true);
      // for iOS, add a button that closes the picker
    } else if (Platform.OS === "ios") {
      setIos(true);
      setAndroidDate(false);
      setAndroidDateStart(false);
      setAndroidDateEnd(false);
    }
  }, []);

  const filter = () => {
    filterButton(dateStart, dateEnd);
  };

  const QuitFilter = () => {
    quitFilterButton(dateStart, dateEnd);
  };
  const onChangeStart = (event, selectedDate) => {
    const currentDate = selectedDate;
    setAndroidDateStart(false);
    setDateStart(currentDate);
  };
  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate;
    setAndroidDateEnd(false);
    setDateEnd(currentDate);
  };

  const showDatepickerStart = () => {
    setAndroidDateStart(true);
  };

  const showDatepickerEnd = () => {
    setAndroidDateEnd(true);
  };

  return (
    <>
      <View style={[styles.row, styles.center]}>
        <Text></Text>

        <Text>Inicio:</Text>
        {androidDate && (
          <Button
            onPress={showDatepickerStart}
            title={`${dateStart.toLocaleDateString(undefined, {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}`}
          />
        )}
        {ios && (
          <DateTimePicker
            testID="dateTimePickerStart"
            value={dateStart}
            mode={"date"}
            is24Hour={true}
            onChange={onChangeStart}
          />
        )}
        <Text>Fin</Text>

        {androidDate && (
          <Button
            onPress={showDatepickerEnd}
            title={`${dateEnd.toLocaleDateString(undefined, {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}`}
          />
        )}
        {androidDateStart && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dateStart}
            mode={"date"}
            is24Hour={true}
            onChange={onChangeStart}
          />
        )}
        {androidDateEnd && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dateEnd}
            mode={"date"}
            is24Hour={true}
            onChange={onChangeEnd}
          />
        )}

        {ios && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dateEnd}
            mode={"date"}
            is24Hour={true}
            onChange={onChangeEnd}
          />
        )}
        <Button onPress={() => filter()} title={"Filtrar"} />
        <Text></Text>

        <Button onPress={() => QuitFilter()} title={"x"} />
        <Text></Text>

        <Text></Text>
      </View>
      <Text></Text>
    </>
  );
}

const mapStateToProps = (reducers) => {
  return {};
};

export const DateScreen = connect(mapStateToProps, { EquipmentListUpper })(
  DateScreenNoRedux
);
