import { HttpRequestManager } from "../eventTarget/HttpRequestManager";
import { WindowManager } from "../eventTarget/WindowManager";
import { svgTypeEnum } from "../utils/enums";
import { SvgIdAndMutablePropsManager } from "../eventTarget/SvgIdAndMutablePropsManager";

export const useSaveControl = () => {
  const httpRequest = HttpRequestManager.getInstance();

  const saveCurrentWindow = (ownerId, store) => {
    const currentWindow = WindowManager.getInstance().getSelectedWindow();
    const windowNameWhiteSpaceReplaced = currentWindow.replace(" ", "_");
    const SIMP = SvgIdAndMutablePropsManager.getInstance();

    const svgInfoArray = [];
    const deleteSvgIdArray = [];

    console.log("???", store);

    for (const [key, value] of store) {
      if (!SIMP.getUpdateFlagById(key)) {
        continue;
      }

      if (!value.display) {
        deleteSvgIdArray.push(key);
        continue;
      }

      const svgInfo = {
        id: key,
        attachment: JSON.parse(JSON.stringify(value)),
      };

      if (
        key.startsWith(svgTypeEnum.text) ||
        key.startsWith(svgTypeEnum.rect)
      ) {
        svgInfo.attachment.comment = SIMP.getCommentById(key);

        if (
          svgInfo.attachment.comment?.trim()?.length === 0 &&
          key.startsWith(svgTypeEnum.text)
        ) {
          continue;
        }
      } else if (key.startsWith(svgTypeEnum.stars)) {
        svgInfo.attachment.stars = SIMP.getStarsPosById(key);
      }

      if (SIMP.getSrcById(key)) {
        svgInfo.attachment.src = SIMP.getSrcById(key);
      }

      delete svgInfo.attachment.display;

      svgInfoArray.push(svgInfo);
      SIMP.setIdUpdateFlagMapOff(key);
    }

    // console.log("[useSaveControl]", svgInfoArray, deleteSvgIdArray);
    //
    // localStorage.setItem('saved', JSON.stringify(svgInfoArray));

    // if (svgInfoArray.length > 0) {
    //   httpRequest
    //     .post(
    //       `http://localhost:8080/api/save/${ownerId}/${windowNameWhiteSpaceReplaced}`,
    //       svgInfoArray,
    //     )
    //     .then((r) => {
    //       console.log("success add cnt", r);
    //     })
    //     .catch((e) => console.error("error !!!", e));
    // }
    //
    // if (deleteSvgIdArray.length > 0) {
    //   const ids = deleteSvgIdArray.join("+");
    //   console.log("delete ids", ids);
    //
    //   httpRequest
    //     .delete(
    //       `http://localhost:8080/api/save/${ownerId}/${windowNameWhiteSpaceReplaced}?ids=${ids}`,
    //     )
    //     .then((r) => {
    //       console.log("success delete cnt", r);
    //     })
    //     .catch((e) => console.error("error !!!", e));
    // }
  };

  const getWindows = (owner, load) => {
    httpRequest
      .get(`http://localhost:8080/api/read/${owner}`)
      .then((res) => load(res))
      .catch((e) => console.log("error !!!", e));
  };

  return { saveCurrentWindow, getWindows };
};
