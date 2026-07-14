import { cookies } from "next/headers";

import type { Dictionary, Locale } from "@/lib/types";

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "pyatok-locale";

const DICTIONARIES: Record<Locale, Dictionary> = {
  en: {
    admin: "Admin login",
    adminHelp: "Use the shared password to upload, edit, or remove artworks.",
    adminLogin: "Admin Login",
    addArtwork: "Add to gallery",
    all: "All",
    apply: "Apply",
    artistName: "Pyatok",
    backToGallery: "Back to gallery",
    cancel: "Cancel",
    createdMessage: "Artwork added to the gallery.",
    dashboardSubtitle: "Manage the public collection",
    dashboardTitle: "Admin Dashboard",
    delete: "Delete",
    deleteConfirm: "Delete this artwork?",
    deleteError: "Unable to delete the artwork.",
    deletedMessage: "Artwork deleted.",
    description: "Description",
    dimensions: "Dimensions",
    edit: "Edit",
    editArtwork: "Edit artwork",
    enter: "Enter",
    existingArtworks: "Existing artworks",
    galleryTitle: "Pyatok Gallery",
    image: "Image",
    incorrectPassword: "Incorrect password.",
    localeEnglish: "EN",
    localeRussian: "RU",
    logout: "Log out",
    medium: "Medium",
    noArtworks: "No artworks match the selected filter yet.",
    password: "Password",
    saveChanges: "Save changes",
    saveError: "Unable to save the artwork.",
    sortLabel: "Sort",
    sortNewest: "Newest first",
    sortOldest: "Oldest first",
    title: "Title",
    updatedMessage: "Artwork updated.",
    uploadArtwork: "Upload new artwork",
    uploadHelp:
      "Upload an image and fill in the artwork details. The image is stored in Supabase Storage and the metadata is saved in the artworks table.",
    year: "Year",
  },
  ru: {
    admin: "Вход для администратора",
    adminHelp:
      "Введите общий пароль, чтобы загружать, редактировать и удалять работы.",
    adminLogin: "Вход администратора",
    addArtwork: "Добавить в галерею",
    all: "Все",
    apply: "Применить",
    artistName: "Сагалин",
    backToGallery: "Назад в галерею",
    cancel: "Отмена",
    createdMessage: "Работа добавлена в галерею.",
    dashboardSubtitle: "Управление публичной коллекцией",
    dashboardTitle: "Панель администратора",
    delete: "Удалить",
    deleteConfirm: "Удалить эту работу?",
    deleteError: "Не удалось удалить работу.",
    deletedMessage: "Работа удалена.",
    description: "Описание",
    dimensions: "Размеры",
    edit: "Редактировать",
    editArtwork: "Редактировать работу",
    enter: "Войти",
    existingArtworks: "Существующие работы",
    galleryTitle: "Галерея Сагалин",
    image: "Изображение",
    incorrectPassword: "Неверный пароль.",
    localeEnglish: "EN",
    localeRussian: "RU",
    logout: "Выйти",
    medium: "Материал",
    noArtworks: "По выбранному фильтру пока нет работ.",
    password: "Пароль",
    saveChanges: "Сохранить изменения",
    saveError: "Не удалось сохранить работу.",
    sortLabel: "Сортировка",
    sortNewest: "Сначала новые",
    sortOldest: "Сначала старые",
    title: "Название",
    updatedMessage: "Работа обновлена.",
    uploadArtwork: "Загрузить новую работу",
    uploadHelp:
      "Загрузите изображение и заполните данные о работе. Файл сохранится в Supabase Storage, а описание — в таблице artworks.",
    year: "Год",
  },
};

export async function getLocaleFromCookie(): Promise<Locale> {
  const cookieStore = await cookies();
  const locale = cookieStore.get(LOCALE_COOKIE)?.value;

  return isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
}

export function getLocaleDictionary(locale: Locale) {
  // Keeping translations in one small dictionary object makes it easy to learn:
  // each UI string has one source of truth, and the server can pick the right
  // language before rendering the page.
  return DICTIONARIES[locale];
}

export function isSupportedLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "ru";
}
