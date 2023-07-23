import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Timeline from "react-native-timeline-flatlist";

export const ServicesListHistorial = (props) => {
  const [selected, setSelected] = useState(null);
  const { datas, comentPost } = props;

  const data = [
    {
      time: "27 sAgo",
      title: "Archery Training",
      description:
        "The Beginner Archery and Beginner Crossbow course does not require you to bring any equipment, since everything you need will be provided for the course. ",
      lineColor: "#009688",
      icon: require("../../../../assets/empresa.png"),
      imageUrl:
        "https://cloud.githubusercontent.com/assets/21040043/24240340/c0f96b3a-0fe3-11e7-8964-fe66e4d9be7a.jpg",
    },
    {
      time: "10:45",
      title: "Play Badminton",
      description:
        "Badminton is a racquet sport played using racquets to hit a shuttlecock across a net.",
      icon: require("../../../../assets/empresa.png"),
      imageUrl:
        "https://cloud.githubusercontent.com/assets/21040043/24240405/0ba41234-0fe4-11e7-919b-c3f88ced349c.jpg",
    },
    {
      time: "12:00",
      title: "Lunch",
      icon: require("../../../../assets/empresa.png"),
    },
    {
      time: "14:00",
      title: "Watch Soccer",
      description:
        "Team sport played between two teams of eleven players with a spherical ball. ",
      lineColor: "#009688",
      icon: require("../../../../assets/empresa.png"),
      imageUrl:
        "https://cloud.githubusercontent.com/assets/21040043/24240419/1f553dee-0fe4-11e7-8638-6025682232b1.jpg",
    },
    {
      time: "16:30",
      title: "Go to Fitness center",
      description: "Look out for the Best Gym & Fitness Centers around me :)",
      icon: require("../../../../assets/empresa.png"),
      imageUrl:
        "https://cloud.githubusercontent.com/assets/21040043/24240422/20d84f6c-0fe4-11e7-8f1d-9dbc594d0cfa.jpg",
    },
  ];

  useEffect(() => {
    if (selected !== null) {
      comentPost(selected);
    }
  }, [selected]);

  const onEventPress = (data) => {
    setSelected(data);
  };

  const renderDetail = (rowData, sectionID, rowID) => {
    let title = <Text style={[styles.title]}>{rowData.title}</Text>;
    let desc = null;
    if (rowData.description && rowData.imageUrl)
      desc = (
        <>
          <View style={styles.descriptionContainer}>
            <Image
              source={{ uri: rowData.imageUrl }}
              style={styles.image}
              defaultSource={rowData.icon} // Fallback image
            />
            <View>
              <Text style={[styles.textDescription]}>
                {rowData.description}
              </Text>
              <Text style={[styles.textDescription]}>
                {rowData.nombrePerfil}
              </Text>
            </View>
          </View>
        </>
      );

    return (
      <View style={{ flex: 1 }}>
        {title}
        {desc}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Timeline
        // scrollEnabled={false}
        style={styles.list}
        data={datas}
        circleSize={20}
        circleColor="rgba(0,0,0,0)"
        lineColor="rgb(45,156,219)"
        timeContainerStyle={{ minWidth: 52, marginTop: -5, marginRight: 0 }}
        timeStyle={{
          textAlign: "center",
          backgroundColor: "#ff9797",
          color: "white",
          padding: 5,
          borderRadius: 13,
        }}
        descriptionStyle={{ color: "gray" }}
        options={{
          style: { paddingTop: 5 },
        }}
        innerCircle={"icon"}
        onEventPress={onEventPress}
        renderDetail={renderDetail}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 65,
    backgroundColor: "white",
  },
  list: {
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  descriptionContainer: {
    flexDirection: "row",
    paddingRight: 50,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textDescription: {
    marginLeft: 10,
    color: "gray",
  },
});
