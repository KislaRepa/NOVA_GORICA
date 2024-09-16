const fs = require("fs");
const createAssistant = async (openai) => {
  const assistantFilePath = "assistant.json";
  if (!fs.existsSync(assistantFilePath)) {
    const file = await openai.files.create({
      file: fs.createReadStream("OPN_MONG.docx"),
      purpose: "assistants",
    });
    let vectorStore = await openai.beta.vectorStores.create({
      name: "NOVA_GORICA_BAZA",
      file_ids: [file.id],
    });
    const assistant = await openai.beta.assistants.create({
      name: "NOVA_GORICA",
      instructions: `Interpretacija in odgovarjanje na vprašanja povezava z odlokom o občinskem prostorskem načrtu Mestne občine Nova Gorica.`,
      tools: [{ type: "file_search" }],
      tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } },
      model: "gpt-4o-mini",
    });
    fs.writeFileSync(assistantFilePath, JSON.stringify(assistant));
    return assistant;
  } else {
    const assistant = JSON.parse(fs.readFileSync(assistantFilePath));
    return assistant;
  }
};
module.exports = { createAssistant };
