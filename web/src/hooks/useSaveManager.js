import axios from "axios";

export const useSaveManager = () => {
  const save = (id, store) => {
    axios
      .post(`http://localhost:8080/api/save/${id}`, store)
      .then((r) => {
        console.log("success size", r);
      })
      .catch((e) => console.error("error !!!", e));
  };

  const read = (owner, load) => {
    axios
      .get(`http://localhost:8080/api/read/${owner}`)
      .then((res) => {
        // const loadMap = new Map();
        //
        // for (const [key, value] of Object.entries(res.data)) {
        //   const parse = JSON.parse(res.data[key]);
        //   loadMap.set(key, parse);
        // }

        load(res.data);
      })
      .catch((e) => console.error("error !!!", e));
  };

  return { save, read };
};
