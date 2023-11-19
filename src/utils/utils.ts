export default async function pasteContent(): Promise<
  string | Blob | Blob<object> | null
> {
  try {
    const clipboardItems = await navigator.clipboard.read();
    if (clipboardItems.length === 0) {
      return null; // Clipboard is empty
    }

    let id = "id" + Math.random().toString(16).slice(2);
    const latestItem = clipboardItems[0];
    if (latestItem.types.includes("text/plain")) {
      // Clipboard contains text
      const text = (await latestItem.getType("text/plain")).text();
      try {
        const url = new URL(await text);
        return { url: url.href, type: "url", id: id };
      } catch (error) {
        console.error("Error reading clipboard content:", error);
      }
      return { text: text, type: "text", id: id };
    } else if (
      latestItem.types.includes("image/png") ||
      latestItem.types.includes("image/jpeg")
    ) {
      // Clipboard contains an image
      const imageBlob =
        (await latestItem.getType("image/png")) ||
        (await latestItem.getType("image/jpeg"));
      return {
        url: URL.createObjectURL(imageBlob),
        type: "image",
        id: id,
      };
    } else {
      // Unsupported type
      return null;
    }
  } catch (error) {
    console.error("Error reading clipboard content:", error);
    return null;
  }
}
