import { MultipleSelectList } from "react-native-dropdown-select-list";
import React, { useState, useEffect } from "react";

import { connect } from "react-redux";

const MultiSelectExampleBare = (props) => {
  const [selected, setSelected] = React.useState([]);
  const [list, setList] = useState([]);
  const { formik, setText } = props;

  useEffect(() => {
    if (props.saveTotalUsers) {
      async function fetchData() {
        const post_array = [];
        props.saveTotalUsers.forEach((doc) => {
          const object = doc;
          const objectver2 = {
            ...object,
            value: `${object.displayNameform}\n(${object.email})`,
            email: object.email,
          };
          if (
            objectver2.email.includes("ingeperu") ||
            objectver2.email.includes("maestranzaperu")
          ) {
            post_array.push(objectver2);
          }
        });

        setList(post_array);
      }
      fetchData();
    }
  }, [props.saveTotalUsers]);

  function saveProperty(itemValue) {
    setText(itemValue);
  }

  return (
    <>
      <MultipleSelectList
        setSelected={(val) => setSelected(val)}
        data={list}
        save="value"
        onSelect={() => saveProperty(selected)}
        label="Categories"
      />
    </>
  );
};

const mapStateToProps = (reducers) => {
  return {
    saveTotalUsers: reducers.post.saveTotalUsers,
  };
};

export const MultiSelectExample = connect(
  mapStateToProps,
  {}
)(MultiSelectExampleBare);
