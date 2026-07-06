import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
export default {
  async fetch(request, env, ctx) {
    return new Response("Bot is running");
  }
};
