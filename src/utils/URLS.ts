export const URLS = {
  LOGIN: "/login",
  REGISTER: "/register",
  HOME: "/",
  DOCUMENTS: "/documents",
  SINGLE_DOCUMENT: (documentId: string) => `/documents/${documentId}`,
};
