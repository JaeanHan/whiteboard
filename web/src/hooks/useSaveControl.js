import { HttpRequestManager } from "../eventTarget/HttpRequestManager";

export const useSaveControl = () => {
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
  };

  return { save, read };
};
