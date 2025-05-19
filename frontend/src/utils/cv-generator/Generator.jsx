import html2pdf from "html2pdf.js";
import ReactDOMServer from "react-dom/server";
import CVTemplate from "./CVTemplate";

function getHtmlFromData(data) {
  return ReactDOMServer.renderToStaticMarkup(<CVTemplate data={data} />);
}

export function generateCV(data, output = "pdf") {
  const htmlContent = getHtmlFromData(data);

  if (output === "pdf") {
    const element = document.createElement("div");
    element.innerHTML = htmlContent;
    document.body.appendChild(element);

    const options = {
      margin: 0.25,
      filename: "cv.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf()
      .set(options)
      .from(element)
      .save()
      .then(() => {
        document.body.removeChild(element);
      });
  } else if (output === "word") {
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' 
            xmlns:w='urn:schemas-microsoft-com:office:word' 
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset="utf-8"><title>CV</title></head><body>`;
    const footer = `</body></html>`;

    const blob = new Blob([header + htmlContent + footer], {
      type: "application/msword",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cv.doc";
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } else {
    alert("Unsupported output format: " + output);
  }
}
