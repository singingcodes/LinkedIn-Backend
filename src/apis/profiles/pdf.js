import PdfPrinter from "pdfmake"
import axios from "axios"

const fonts = {
  Roboto: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
}
const printer = new PdfPrinter(fonts)
export const getPDFReadableStream = async (profile) => {
  let imagePart = {}
  if (profile.image) {
    const response = await axios.get(profile.image, {
      responseType: "arraybuffer",
    })
    console.log(response)
    const profileCoverURLParts = profile.image.split("/")
    const fileName = profileCoverURLParts[profileCoverURLParts.length - 1]
    const [id, extension] = fileName.split(".")
    const base64 = response.data.toString("base64")
    const base64Image = `data:image/${extension};base64,${base64}`
    imagePart = { image: base64Image, width: 400, margin: [0, 0, 0, 20] }
  }

  const docDefinition = {
    content: [
      imagePart,
      {
        text: `${profile.name} ${profile.surname}`,
        style: "header",
        lineHeight: 1.5,
      },
      { text: `${profile.title}`, style: "subheader" },
      { text: `${profile.area}`, style: "subheader" },
      { text: `${profile.email}`, style: "subheader" },
      { text: `${profile.bio}`, style: "small" },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 20],
      },
      subheader: {
        fontSize: 15,
        bold: true,
      },
      small: {
        fontSize: 8,
      },
      defaultStyle: {
        font: "Helvetica",
      },
    },
  }

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {})

  pdfReadableStream.end()

  return pdfReadableStream
}
// export const generatePDFAsync = async (post) => {
//   const asyncPipeline = promisify(pipeline) // Promisify is a veeeeery cool function from 'util' core module, which transforms a function that uses callbacks (error-first callbacks) into a function that uses Promises instead (and so Async/Await). Pipeline is a function which works with error-first callbac --> I can promisify a pipeline, obtaining a "Promises-based pipeline"

//   const pdfReadableStream = await getPDFReadableStream(post)

//   const path = getPDFsPath("test.pdf")

//   await asyncPipeline(pdfReadableStream, fs.createWriteStream(path))
//   return path
// }
