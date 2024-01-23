import axios from "axios";
import { HttpRequestManager } from "../eventTarget/HttpRequestManager";

export const useSaveManager = () => {
  const httpRequest = HttpRequestManager.getInstance();

  const save = (id, store) => {
    httpRequest
      .post(`http://localhost:8080/api/save/${id}`, store)
      .then((r) => {
        console.log("success size", r);
      })
      .catch((e) => console.error("error !!!", e));
  };

  const read = (owner, load) => {
    httpRequest
      .get(`http://localhost:8080/api/read/${owner}`)
      .then((res) => load(res))
      .catch((e) => console.log("error !!!", e));

    // axios
    //   .get(`http://localhost:8080/api/read/${owner}`)
    //   .then((res) => {
    //     // const loadMap = new Map();
    //     //
    //     // for (const [key, value] of Object.entries(res.data)) {
    //     //   const parse = JSON.parse(res.data[key]);
    //     //   loadMap.set(key, parse);
    //     // }
    //
    //     load(res.data);
    //   })
    //   .catch((e) => console.error("error !!!", e));
  };

  return { save, read };
};
