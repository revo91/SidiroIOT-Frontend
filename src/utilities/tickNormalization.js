export function displayTickNormalization(t, normalizationText) {
  if (normalizationText == null)
    return t("DevicesSelectionPage.Properties.noNormalizationText");
  switch (normalizationText) {
    case "noNormalization": {
      return t("DevicesSelectionPage.Properties.noNormalizationText");
    }
    case "setTickAsBeginOfInterval": {
      return t("DevicesSelectionPage.Properties.setTickAsBeginOfIntervalText");
    }
    case "setTickAsEndOfInterval": {
      return t("DevicesSelectionPage.Properties.setTickAsEndOfIntervalText");
    }
    case "sendOnlyIfTickFitsSendingInterval": {
      return t(
        "DevicesSelectionPage.Properties.sendOnlyIfTickFitsSendingIntervalText"
      );
    }
    default: {
      return t("DevicesSelectionPage.Properties.noNormalizationText");
    }
  }
}
