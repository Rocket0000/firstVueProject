import { ValueType } from "realgrid";

export const fields = [
  {
    fieldName: "Name",
    dataType: ValueType.TEXT,
  },
  {
    fieldName: "Age",
    dataType: ValueType.NUMBER,
  },
  {
    fieldName: "Email",
    dataType: ValueType.TEXT,
  },
  {
    fieldName: "Detail",
    dataType: ValueType.TEXT,
  },
];


export const columns = [
  {
    name: "Name",
    fieldName: "Name",
    width: "80",
    header: {
      text: "Name",
    },
  },
  {
    name: "Age",
    fieldName: "Age",
    width: "130",
    header: {
      text: "Age",
    },
  },
  {
    name: "Email",
    fieldName: "Email",
    width: "300",
    header: {
      text: "Email",
    },
  },
  {
    name: "Detail",
    fieldName: "Detail",
    width: "300",
    header: {
      text: "Detail",
    },      
    editable:false,
    renderer:{
      type:"button",
    }
  },
];

