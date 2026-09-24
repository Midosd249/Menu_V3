export type AiCapability =
  | "structured"
  | "typed_decision"
  | "image"
  | "pdf"
  | "ocr_document"
  | "audio_stt";

export type AiInputModality = "text" | "image" | "pdf" | "audio";

export type AiTaskClass =
  | "text_generation"
  | "structured_extraction"
  | "typed_decision"
  | "document_extraction"
  | "speech_transcription";

export type AiRoutingRequirement = {
  capability: AiCapability;
  input: AiInputModality;
  task: AiTaskClass;
  requiresStructuredOutput?: boolean;
  requiresConfidence?: boolean;
};

export function capabilityForInput(mimeType: string): AiCapability {
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/")) return "audio_stt";
  return "structured";
}
