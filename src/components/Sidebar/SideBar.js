import {forwardRef, useEffect, useMemo, useState} from "react";
import { eventNameEnum } from "../../utils/enums";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import styles from "./sidebar.module.css"

export const sideBarWidth = 250;

export const SideBar = forwardRef(({ currentEvent, setCurrentEvent, onClickPdf, canvasSize }, canvasRef) => {
  const [mode, setMode] = useState("Default");

  useEffect(() => {
    if (currentEvent === eventNameEnum.windowChange) {
      setMode("Default");
    }
  }, [currentEvent]);

  const Document = () => {
    alert("documentation not available for the moment");
    setMode("Default");
  };

  const Rect = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.addRect);
    setMode("Default");
  };

  const Line = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.addLine);
    setMode("Default");
  };

  const Text = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.addText);
    setMode("Default");
  };

  const ApiPath = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.none);
    setMode("Default");
  };

  const StarSign = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.addStars);
    setMode("Default");
  };

  const ClipboardImage = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.addImage);
    setMode("Default");
  };

  const Save = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.save);
    setMode("Default");
  };

  const SaveAll = (e) => {
    alert("yet implemented");
  };

  const LoadSaved = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.load);
    setMode("Default");
  };

  const Default = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.none);
  };

  const Pencil = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.addPath);
  };

  const Eraser = (e) => {
    e.preventDefault();
    setCurrentEvent(eventNameEnum.erase);
  };

  const PDF = async () => {
    const canvasEle = canvasRef?.current;

    if (!canvasEle) return;

    const animateElements = canvasEle.querySelectorAll('animate');
    animateElements.forEach(animate => {
      const target = animate.parentElement;
      const attributeName = animate.getAttribute('attributeName');
      const to = animate.getAttribute('to');

      if (target && attributeName && to) {
        target.setAttribute(attributeName, to);
      }
    });

    await new Promise(resolve => setTimeout(resolve, 3000));

    const canvas = await html2canvas(canvasEle, {
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true,
      scale: 2,
      x: -sideBarWidth/2 - 50,
      y: - 30,
      width: canvasSize.width,
      height: canvasSize.height,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save("my-note-pdf.pdf");
  };

  const cursor = useMemo(() => [
    { name: "Pointer", handler: Default},
    { name: 'Pencil', handler: Pencil },
    { name: 'Eraser', handler: Eraser },

  ], [mode]);

  const temp = useMemo(
      () => [
        { name: "Document", handler: Document },
        { name: "Save", handler: Save },
        { name: "Save All", handler: SaveAll },
        { name: "Text", handler: Text },
        { name: "Line", handler: Line },
        { name: "Star Sign", handler: StarSign },
        { name: "Clipboard Image", handler: ClipboardImage },
        { name: "Rect", handler: Rect },
        { name: "PDF", handler: PDF },
      ],
      [Document]
  );


  return (
      <div
          style={{
            width: sideBarWidth,
            minWidth: sideBarWidth,
            height: window.innerHeight,
            background: "linear-gradient(200deg, #F6F8FB 60%, #E1E9F2 100%)",
            display: "flex",
            flexDirection: "column",
            zIndex: 99,
          }}
      >
        <br />
        <div style={{
          width: '100%',
          display: 'flex',
          justifyItems: 'start',
          paddingLeft: '40px'
        }}>
          <span>
            Cursor :
          </span>
          <select
              value={mode}
              onChange={(e) => {
                const selectedName = e.target.value;
                const selectedHandler = cursor.find((el) => el.name === selectedName);
                if (selectedHandler) {
                  selectedHandler(e);
                  setMode(selectedName);
                }
              }}
              style={{
                backgroundColor: "whitesmoke",
                border: "none",
                color: "dodgerblue",
                padding: "6px 12px",
                fontSize: "14px",
                borderRadius: "4px",
                cursor: "pointer",
                display: 'inline-block'
              }}
          >
            {cursor.map((el) => (
                <option key={el.name} value={el.name}>
                  {el.name}
                </option>
            ))}
          </select>
        </div>
        <hr />
          <div className={styles.title}>
            Elements :
          </div>
        <ul style={{display: 'grid', paddingLeft: '50px', marginTop: '0'}}>
        {temp.map((t, index) => {
          const {name, handler} = t;
          return (
              <button
                  key={name}
                  className={styles.features}
                  onClick={handler}
              >
                {index < 3 ? "" : "generate"} {name}
              </button>
          );
        })}
        </ul>
      </div>
  );
});
