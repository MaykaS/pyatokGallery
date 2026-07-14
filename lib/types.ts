export type Locale = "en" | "ru";

export type ArtworkRow = {
  id: string;
  title: string;
  description: string;
  medium: string;
  year: number;
  image_url: string;
  created_at: string;
  dimensions: string | null;
};

export type ArtworkInsert = {
  title: string;
  description: string;
  medium: string;
  year: number;
  image_url: string;
  dimensions: string | null;
};

export type ArtworkUpdate = ArtworkInsert;

export type Dictionary = {
  admin: string;
  adminHelp: string;
  adminLogin: string;
  addArtwork: string;
  all: string;
  apply: string;
  artistName: string;
  backToGallery: string;
  cancel: string;
  createdMessage: string;
  dashboardSubtitle: string;
  dashboardTitle: string;
  delete: string;
  deleteConfirm: string;
  deleteError: string;
  deletedMessage: string;
  description: string;
  dimensions: string;
  edit: string;
  editArtwork: string;
  enter: string;
  existingArtworks: string;
  galleryTitle: string;
  image: string;
  incorrectPassword: string;
  localeEnglish: string;
  localeRussian: string;
  logout: string;
  medium: string;
  noArtworks: string;
  password: string;
  saveChanges: string;
  saveError: string;
  sortLabel: string;
  sortNewest: string;
  sortOldest: string;
  title: string;
  updatedMessage: string;
  uploadArtwork: string;
  uploadHelp: string;
  year: string;
};
