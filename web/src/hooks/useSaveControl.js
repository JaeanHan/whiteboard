import { HttpRequestManager } from "../eventTarget/HttpRequestManager";
import { WindowManager } from "../eventTarget/WindowManager";

export const useSaveControl = () => {
  const httpRequest = HttpRequestManager.getInstance();

  const saveCurrent = (id, store) => {
    const currentWindow = WindowManager.getInstance().getSelectedWindow();
    const replaceWhiteSpace = currentWindow.replace(" ", "_");

    console.log("btoa", replaceWhiteSpace);

    httpRequest
      .post(`http://localhost:8080/api/save/${id}/${replaceWhiteSpace}`, store)
      .then((r) => {
        console.log("success size", r);
      })
      .catch((e) => console.error("error !!!", e));
  };

  const getWindows = (owner, load) => {
    httpRequest
      .get(`http://localhost:8080/api/read/${owner}`)
      .then((res) => load(res))
      .catch((e) => console.log("error !!!", e));
  };

  return { saveCurrent, getWindows };
};
